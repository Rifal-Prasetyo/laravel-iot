<?php

namespace App\Http\Controllers;

use App\Models\Device;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DeviceController extends Controller
{
    public function index(Request $request): Response
    {
        $devices = Device::withCount(['topics', 'executionLogs'])
            ->with(['topics' => function ($query) {
                $query->latest()->limit(5);
            }])
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('devices/index', [
            'devices' => $devices,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'location' => 'nullable|string|max:255',
        ]);

        $device = Device::create([
            'user_id' => $request->user()?->id,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'location' => $validated['location'] ?? null,
            'status' => 'online',
        ]);

        return redirect()->route('devices.show', $device->id)
            ->with('success', "Device '{$device->name}' created successfully.");
    }

    public function show(Device $device): Response
    {
        $device->load([
            'topics' => function ($query) {
                $query->latest();
            },
            'executionLogs' => function ($query) {
                $query->latest('id')->limit(20);
            },
        ]);

        return Inertia::render('devices/show', [
            'device' => $device,
        ]);
    }

    public function update(Request $request, Device $device): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'location' => 'nullable|string|max:255',
            'status' => 'required|string|in:online,offline,maintenance',
        ]);

        $device->update($validated);

        return back()->with('success', 'Device updated successfully.');
    }

    public function destroy(Device $device): RedirectResponse
    {
        $name = $device->name;
        $device->delete();

        return redirect()->route('devices.index')
            ->with('success', "Device '{$name}' deleted.");
    }
}
