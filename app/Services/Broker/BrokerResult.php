<?php

namespace App\Services\Broker;

class BrokerResult
{
    public function __construct(
        public bool $success,
        public string $status, // 'success', 'failed', 'simulated'
        public string $message,
        public int $executionTimeMs = 0,
        public ?string $driver = null
    ) {}

    public static function success(string $message, int $durationMs = 0, ?string $driver = null): self
    {
        return new self(
            success: true,
            status: 'success',
            message: $message,
            executionTimeMs: $durationMs,
            driver: $driver
        );
    }

    public static function simulated(string $message, int $durationMs = 0): self
    {
        return new self(
            success: true,
            status: 'simulated',
            message: $message,
            executionTimeMs: $durationMs,
            driver: 'simulated'
        );
    }

    public static function failed(string $message, int $durationMs = 0, ?string $driver = null): self
    {
        return new self(
            success: false,
            status: 'failed',
            message: $message,
            executionTimeMs: $durationMs,
            driver: $driver
        );
    }
}
