<?php

namespace App\Services\Broker;

use Illuminate\Support\Facades\Log;

class SimulatedBrokerService implements MessageBrokerInterface
{
    public function getDriverName(): string
    {
        return 'simulated';
    }

    public function publish(string $routingKey, string $payload, array $options = []): BrokerResult
    {
        $startTime = microtime(true);
        $protocol = $options['protocol'] ?? 'amqp';
        $exchange = $options['exchange'] ?? 'amq.topic';

        Log::info("[SimulatedBroker] Dispatched message", [
            'protocol' => $protocol,
            'exchange' => $exchange,
            'routing_key' => $routingKey,
            'payload' => $payload,
            'options' => $options,
            'timestamp' => now()->toIso8601String(),
        ]);

        $durationMs = (int) round((microtime(true) - $startTime) * 1000);

        return BrokerResult::simulated(
            message: "Simulated [{$protocol}] publish to '{$routingKey}' (Payload: '{$payload}') logged successfully.",
            durationMs: $durationMs
        );
    }
}
