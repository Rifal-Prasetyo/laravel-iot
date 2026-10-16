<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\DeviceExecutionLog;
use App\Models\DeviceTopic;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $devicesCount = Device::count();
        $onlineDevicesCount = Device::where('status', 'online')->count();
        $topicsCount = DeviceTopic::count();
        $activeTopicsCount = DeviceTopic::where('is_enabled', true)->count();
        
        $executionsToday = DeviceExecutionLog::whereDate('created_at', today())->count();

        $quickSwitches = DeviceTopic::with('device')
            ->where('payload_type', 'switch')
            ->where('is_enabled', true)
            ->latest()
            ->limit(8)
            ->get();

        $recentLogs = DeviceExecutionLog::with(['device', 'topic'])
            ->latest('id')
            ->limit(10)
            ->get();

        $recentDevices = Device::withCount('topics')
            ->latest()
            ->limit(5)
            ->get();

        $brokerInfo = [
            'default' => config('broker.default', 'rabbitmq'),
            'auto_fallback' => config('broker.auto_fallback_to_simulation', true),
            'rabbitmq' => [
                'host' => config('broker.connections.rabbitmq.host'),
                'port' => config('broker.connections.rabbitmq.port'),
                'exchange' => config('broker.connections.rabbitmq.default_exchange'),
            ],
            'mqtt' => [
                'host' => config('broker.connections.mqtt.host'),
                'port' => config('broker.connections.mqtt.port'),
            ],
        ];

        return Inertia::render('dashboard', [
            'stats' => [
                'devices_count' => $devicesCount,
                'online_devices_count' => $onlineDevicesCount,
                'topics_count' => $topicsCount,
                'active_topics_count' => $activeTopicsCount,
                'executions_today' => $executionsToday,
            ],
            'quick_switches' => $quickSwitches,
            'recent_logs' => $recentLogs,
            'recent_devices' => $recentDevices,
            'broker_info' => $brokerInfo,
        ]);
    }
}
