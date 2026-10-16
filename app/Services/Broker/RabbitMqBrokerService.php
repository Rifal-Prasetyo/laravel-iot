<?php

namespace App\Services\Broker;

use Exception;
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

class RabbitMqBrokerService implements MessageBrokerInterface
{
    public function __construct(
        protected array $config = []
    ) {
        $this->config = array_merge(config('broker.connections.rabbitmq', []), $config);
    }

    public function getDriverName(): string
    {
        return 'rabbitmq';
    }

    public function publish(string $routingKey, string $payload, array $options = []): BrokerResult
    {
        $startTime = microtime(true);
        $exchange = $options['exchange'] ?? ($this->config['default_exchange'] ?? 'amq.topic');

        try {
            $connection = new AMQPStreamConnection(
                $this->config['host'] ?? '127.0.0.1',
                $this->config['port'] ?? 5672,
                $this->config['user'] ?? 'guest',
                $this->config['password'] ?? 'guest',
                $this->config['vhost'] ?? '/',
                false,
                'AMQPLAIN',
                null,
                'en_US',
                $this->config['connection_timeout'] ?? 3.0,
                $this->config['read_write_timeout'] ?? 3.0
            );

            $channel = $connection->channel();

            // Declare topic exchange if needed
            $channel->exchange_declare($exchange, 'topic', false, true, false);

            $msg = new AMQPMessage($payload, [
                'content_type' => 'text/plain',
                'delivery_mode' => AMQPMessage::DELIVERY_MODE_PERSISTENT,
                'timestamp' => time(),
            ]);

            $channel->basic_publish($msg, $exchange, $routingKey);

            $channel->close();
            $connection->close();

            $durationMs = (int) round((microtime(true) - $startTime) * 1000);

            return BrokerResult::success(
                message: "Message published to RabbitMQ exchange '{$exchange}' with routing key '{$routingKey}'",
                durationMs: $durationMs,
                driver: 'rabbitmq'
            );
        } catch (Exception $e) {
            $durationMs = (int) round((microtime(true) - $startTime) * 1000);

            return BrokerResult::failed(
                message: "RabbitMQ publish error: " . $e->getMessage(),
                durationMs: $durationMs,
                driver: 'rabbitmq'
            );
        }
    }
}
