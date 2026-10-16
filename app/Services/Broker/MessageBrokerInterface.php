<?php

namespace App\Services\Broker;

interface MessageBrokerInterface
{
    /**
     * Publish a message to a broker topic / routing key.
     *
     * @param string $routingKey Topic / routing key (e.g., home.relay1)
     * @param string $payload Payload body string (text, '0', '1', json)
     * @param array<string, mixed> $options Additional options like exchange name, qos, headers
     */
    public function publish(string $routingKey, string $payload, array $options = []): BrokerResult;

    /**
     * Get the identifier name of this driver.
     */
    public function getDriverName(): string;
}
