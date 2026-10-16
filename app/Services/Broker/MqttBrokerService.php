<?php

namespace App\Services\Broker;

use Exception;
use PhpMqtt\Client\ConnectionSettings;
use PhpMqtt\Client\MqttClient;

class MqttBrokerService implements MessageBrokerInterface
{
    public function __construct(
        protected array $config = []
    ) {
        $this->config = array_merge(config('broker.connections.mqtt', []), $config);
    }

    public function getDriverName(): string
    {
        return 'mqtt';
    }

    public function publish(string $routingKey, string $payload, array $options = []): BrokerResult
    {
        $startTime = microtime(true);
        $clientId = ($this->config['client_id'] ?? 'laravel_iot') . '_' . substr(md5(uniqid()), 0, 6);

        try {
            $mqtt = new MqttClient(
                $this->config['host'] ?? '127.0.0.1',
                $this->config['port'] ?? 1883,
                $clientId
            );

            $settings = (new ConnectionSettings)
                ->setKeepAliveInterval(10)
                ->setConnectTimeout(3);

            $mqtt->connect($settings, true);

            $qos = (int) ($options['qos'] ?? ($this->config['qos'] ?? 0));
            $mqtt->publish($routingKey, $payload, $qos);

            $mqtt->disconnect();

            $durationMs = (int) round((microtime(true) - $startTime) * 1000);

            return BrokerResult::success(
                message: "Message published to MQTT broker topic '{$routingKey}' (QoS {$qos})",
                durationMs: $durationMs,
                driver: 'mqtt'
            );
        } catch (Exception $e) {
            $durationMs = (int) round((microtime(true) - $startTime) * 1000);

            return BrokerResult::failed(
                message: "MQTT publish error: " . $e->getMessage(),
                durationMs: $durationMs,
                driver: 'mqtt'
            );
        }
    }
}
