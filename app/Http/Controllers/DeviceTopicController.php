<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\DeviceTopic;
use App\Services\Broker\BrokerManager;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DeviceTopicController extends Controller
{
    public function __construct(
        protected BrokerManager $brokerManager
    ) {}

    public function store(Request $request, Device $device): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'protocol' => 'required|string|in:amqp,mqtt',
            'exchange' => 'nullable|string|max:255',
            'routing_key' => 'required|string|max:255',
            'payload_type' => 'required|string|in:switch,string,json',
            'is_inverted' => 'boolean',
            'string_payload' => 'nullable|string',
            'active_payload' => 'nullable|string|max:255',
            'inactive_payload' => 'nullable|string|max:255',
            'schedule_type' => 'required|string|in:none,interval,cron,daily,once',
            'schedule_value' => 'nullable|string|max:255',
            'schedule_days' => 'nullable|array',
            'is_enabled' => 'boolean',
        ]);

        $device->topics()->create([
            'name' => $validated['name'],
            'protocol' => $validated['protocol'],
            'exchange' => $validated['exchange'] ?: 'amq.topic',
            'routing_key' => $validated['routing_key'],
            'payload_type' => $validated['payload_type'],
            'is_inverted' => $request->boolean('is_inverted'),
            'string_payload' => $validated['string_payload'] ?? null,
            'active_payload' => $validated['active_payload'] ?? '1',
            'inactive_payload' => $validated['inactive_payload'] ?? '0',
            'schedule_type' => $validated['schedule_type'],
            'schedule_value' => $validated['schedule_value'] ?? null,
            'schedule_days' => $validated['schedule_days'] ?? null,
            'is_enabled' => $request->boolean('is_enabled', true),
        ]);

        return back()->with('success', 'Topic added successfully to ' . $device->name);
    }

    public function update(Request $request, DeviceTopic $topic): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'protocol' => 'required|string|in:amqp,mqtt',
            'exchange' => 'nullable|string|max:255',
            'routing_key' => 'required|string|max:255',
            'payload_type' => 'required|string|in:switch,string,json',
            'is_inverted' => 'boolean',
            'string_payload' => 'nullable|string',
            'active_payload' => 'nullable|string|max:255',
            'inactive_payload' => 'nullable|string|max:255',
            'schedule_type' => 'required|string|in:none,interval,cron,daily,once',
            'schedule_value' => 'nullable|string|max:255',
            'schedule_days' => 'nullable|array',
            'is_enabled' => 'boolean',
        ]);

        $topic->update([
            'name' => $validated['name'],
            'protocol' => $validated['protocol'],
            'exchange' => $validated['exchange'] ?: 'amq.topic',
            'routing_key' => $validated['routing_key'],
            'payload_type' => $validated['payload_type'],
            'is_inverted' => $request->boolean('is_inverted'),
            'string_payload' => $validated['string_payload'] ?? null,
            'active_payload' => $validated['active_payload'] ?? '1',
            'inactive_payload' => $validated['inactive_payload'] ?? '0',
            'schedule_type' => $validated['schedule_type'],
            'schedule_value' => $validated['schedule_value'] ?? null,
            'schedule_days' => $validated['schedule_days'] ?? null,
            'is_enabled' => $request->boolean('is_enabled', true),
        ]);

        return back()->with('success', 'Topic updated successfully.');
    }

    public function destroy(DeviceTopic $topic): RedirectResponse
    {
        $name = $topic->name;
        $topic->delete();

        return back()->with('success', "Topic '{$name}' deleted.");
    }

    /**
     * Manually trigger/publish this topic now.
     */
    public function trigger(Request $request, DeviceTopic $topic): RedirectResponse
    {
        $result = $this->brokerManager->dispatchTopic($topic, triggeredBy: 'manual');

        if ($result->success) {
            return back()->with('success', $result->message);
        }

        return back()->with('error', $result->message);
    }

    /**
     * Toggle the switch state (ON/OFF) and publish payload to the broker.
     */
    public function toggleSwitch(Request $request, DeviceTopic $topic): RedirectResponse
    {
        $newState = $request->has('state')
            ? $request->boolean('state')
            : ! $topic->switch_state;

        $result = $this->brokerManager->dispatchTopic(
            topic: $topic,
            triggeredBy: 'switch',
            forcedSwitchState: $newState
        );

        $stateText = $newState ? 'ON' : 'OFF';
        return back()->with('success', "Switch {$topic->name} turned {$stateText}. ({$result->message})");
    }
}
