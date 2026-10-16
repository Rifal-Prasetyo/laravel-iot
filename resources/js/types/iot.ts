export interface Device {
    id: number;
    user_id?: number | null;
    name: string;
    device_code: string;
    description?: string | null;
    status: 'online' | 'offline' | 'maintenance' | string;
    location?: string | null;
    last_seen_at?: string | null;
    topics_count?: number;
    execution_logs_count?: number;
    topics?: DeviceTopic[];
    execution_logs?: DeviceExecutionLog[];
    created_at: string;
    updated_at: string;
}

export interface DeviceTopic {
    id: number;
    device_id: number;
    name: string;
    protocol: 'amqp' | 'mqtt';
    exchange: string;
    routing_key: string;
    payload_type: 'switch' | 'string' | 'json';
    switch_state: boolean;
    is_inverted: boolean;
    string_payload?: string | null;
    active_payload?: string | null;
    inactive_payload?: string | null;
    schedule_type: 'none' | 'interval' | 'cron' | 'daily' | 'once';
    schedule_value?: string | null;
    schedule_days?: string[] | number[] | null;
    is_enabled: boolean;
    last_dispatched_at?: string | null;
    last_payload_sent?: string | null;
    last_status?: 'success' | 'failed' | 'simulated' | string | null;
    last_error_message?: string | null;
    device?: Device;
    created_at: string;
    updated_at: string;
}

export interface DeviceExecutionLog {
    id: number;
    device_id: number;
    device_topic_id?: number | null;
    routing_key: string;
    payload_sent: string;
    triggered_by: 'manual' | 'schedule' | 'switch' | string;
    status: 'success' | 'failed' | 'simulated';
    response_message?: string | null;
    execution_time_ms?: number | null;
    created_at: string;
    device?: Device;
    topic?: DeviceTopic;
}

export interface DashboardStats {
    devices_count: number;
    online_devices_count: number;
    topics_count: number;
    active_topics_count: number;
    executions_today: number;
}

export interface BrokerInfo {
    default: string;
    auto_fallback: boolean;
    rabbitmq: {
        host: string;
        port: number;
        exchange: string;
    };
    mqtt: {
        host: string;
        port: number;
    };
}
