<?php

namespace App\Services\Broker;

use App\Models\DeviceExecutionLog;
use App\Models\DeviceTopic;

class BrokerManager
{
    protected array $drivers = [];

    public function driver(?string $name = null): MessageBrokerInterface
    {
        $name = $name ?: config('broker.default', 'rabbitmq');

        if (isset($this->drivers[$name])) {
            return $this->drivers[$name];
        }

        return $this->drivers[$name] = match ($name) {
            'rabbitmq', 'amqp' => new RabbitMqBrokerService(),
            'mqtt' => new MqttBrokerService(),
            default => new SimulatedBrokerService(),
        };
    }

    /**
     * Dispatch a specific device topic with payload computation, execution log, and fallback.
     */
    public function dispatchTopic(DeviceTopic $topic, string $triggeredBy = 'manual', ?bool $forcedSwitchState = null): BrokerResult
    {
        // 1. Determine payload
        $payload = $topic->computePayload($forcedSwitchState);

        // 2. Determine driver based on topic protocol
        $driverName = $topic->protocol === 'mqtt' ? 'mqtt' : 'rabbitmq';
        $driver = $this->driver($driverName);

        // 3. Publish
        $options = [
            'exchange' => $topic->exchange ?: 'amq.topic',
            'protocol' => $topic->protocol,
        ];

        $result = $driver->publish($topic->routing_key, $payload, $options);

        // 4. Auto-fallback to simulation if connection failed and fallback enabled
        if (! $result->success && config('broker.auto_fallback_to_simulation', true)) {
            $simulated = (new SimulatedBrokerService())->publish($topic->routing_key, $payload, $options);
            $result = BrokerResult::simulated(
                message: "Broker offline (" . $result->message . "). Fallen back to Simulation: Dispatched to '{$topic->routing_key}' with payload '{$payload}'.",
                durationMs: $result->executionTimeMs
            );
        }

        // 5. Update topic states
        if ($forcedSwitchState !== null && $topic->payload_type === 'switch') {
            $topic->switch_state = $forcedSwitchState;
        }

        $topic->last_dispatched_at = now();
        $topic->last_payload_sent = $payload;
        $topic->last_status = $result->status;
        $topic->last_error_message = $result->success ? null : $result->message;
        $topic->save();

        // 6. Record log
        DeviceExecutionLog::create([
            'device_id' => $topic->device_id,
            'device_topic_id' => $topic->id,
            'routing_key' => $topic->routing_key,
            'payload_sent' => $payload,
            'triggered_by' => $triggeredBy,
            'status' => $result->status,
            'response_message' => $result->message,
            'execution_time_ms' => $result->executionTimeMs,
            'created_at' => now(),
        ]);

        return $result;
    }
}
