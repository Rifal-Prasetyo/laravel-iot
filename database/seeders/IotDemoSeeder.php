<?php

namespace Database\Seeders;

use App\Models\Device;
use App\Models\DeviceTopic;
use App\Models\User;
use Illuminate\Database\Seeder;

class IotDemoSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('username', 'admin')->first();

        // 1. ESP32 Living Room Controller
        $device1 = Device::firstOrCreate(
            ['device_code' => 'DEV-ESP32-01'],
            [
                'user_id' => $admin?->id,
                'name' => 'ESP32 Ruang Tamu',
                'description' => 'Kontrol 4-Channel Relay Lampu Utama dan Sensor Suhu DHT22',
                'location' => 'Lantai 1 - Ruang Tamu',
                'status' => 'online',
            ]
        );

        // Topic 1: Relay Lampu Utama (Normal Switch)
        DeviceTopic::firstOrCreate(
            ['device_id' => $device1->id, 'routing_key' => 'home.livingroom.relay1'],
            [
                'name' => 'Relay Lampu Utama',
                'protocol' => 'amqp',
                'exchange' => 'amq.topic',
                'payload_type' => 'switch',
                'switch_state' => true,
                'is_inverted' => false,
                'active_payload' => '1',
                'inactive_payload' => '0',
                'schedule_type' => 'daily',
                'schedule_value' => '18:00',
                'is_enabled' => true,
            ]
        );

        // Topic 2: Pompa Air Mini (Inverted Logic - Board Active LOW)
        DeviceTopic::firstOrCreate(
            ['device_id' => $device1->id, 'routing_key' => 'home.livingroom.relay2_inverted'],
            [
                'name' => 'Relay Active-LOW (Inverted Logic)',
                'protocol' => 'amqp',
                'exchange' => 'amq.topic',
                'payload_type' => 'switch',
                'switch_state' => false,
                'is_inverted' => true, // Inverted! When ON sends 0, when OFF sends 1
                'active_payload' => '1',
                'inactive_payload' => '0',
                'schedule_type' => 'interval',
                'schedule_value' => '30', // every 30 minutes
                'is_enabled' => true,
            ]
        );

        // Topic 3: Sensor Ping Telemetry (Custom String/JSON)
        DeviceTopic::firstOrCreate(
            ['device_id' => $device1->id, 'routing_key' => 'home.livingroom.sensor.ping'],
            [
                'name' => 'Telemetry Ping Telemetry',
                'protocol' => 'mqtt',
                'exchange' => 'amq.topic',
                'payload_type' => 'json',
                'string_payload' => '{"cmd": "READ_SENSORS", "target": "DHT22"}',
                'schedule_type' => 'cron',
                'schedule_value' => '*/5 * * * *', // every 5 minutes
                'is_enabled' => true,
            ]
        );

        // 2. Greenhouse Node
        $device2 = Device::firstOrCreate(
            ['device_code' => 'DEV-GREEN-02'],
            [
                'user_id' => $admin?->id,
                'name' => 'Greenhouse ESP8266 Node',
                'description' => 'Monitoring kelembaban tanah dan sistem irigasi otomatis',
                'location' => 'Taman Belakang',
                'status' => 'online',
            ]
        );

        DeviceTopic::firstOrCreate(
            ['device_id' => $device2->id, 'routing_key' => 'greenhouse.solenoid.valve1'],
            [
                'name' => 'Solenoid Valve Irigasi',
                'protocol' => 'amqp',
                'exchange' => 'amq.topic',
                'payload_type' => 'switch',
                'switch_state' => false,
                'is_inverted' => false,
                'schedule_type' => 'daily',
                'schedule_value' => '06:00',
                'is_enabled' => true,
            ]
        );
    }
}
