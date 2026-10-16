<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Message Broker Connection
    |--------------------------------------------------------------------------
    | Options: 'rabbitmq', 'mqtt', 'simulated'
    */
    'default' => env('BROKER_CONNECTION', 'rabbitmq'),

    /*
    |--------------------------------------------------------------------------
    | Auto Fallback to Simulation
    |--------------------------------------------------------------------------
    | If true, when RabbitMQ or MQTT broker is unreachable, simulate publish
    | and log the event instead of crashing or blocking the UI.
    */
    'auto_fallback_to_simulation' => env('BROKER_AUTO_FALLBACK', true),

    'connections' => [
        'rabbitmq' => [
            'host' => env('RABBITMQ_HOST', '127.0.0.1'),
            'port' => (int) env('RABBITMQ_PORT', 5672),
            'user' => env('RABBITMQ_USER', 'guest'),
            'password' => env('RABBITMQ_PASSWORD', 'guest'),
            'vhost' => env('RABBITMQ_VHOST', '/'),
            'default_exchange' => env('RABBITMQ_EXCHANGE', 'amq.topic'),
            'connection_timeout' => (float) env('RABBITMQ_TIMEOUT', 3.0),
            'read_write_timeout' => (float) env('RABBITMQ_RW_TIMEOUT', 3.0),
        ],

        'mqtt' => [
            'host' => env('MQTT_HOST', '127.0.0.1'),
            'port' => (int) env('MQTT_PORT', 1883),
            'client_id' => env('MQTT_CLIENT_ID', 'laravel_iot_publisher'),
            'clean_session' => true,
            'qos' => 0,
        ],
    ],
];
