<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DeviceTopic extends Model
{
    use HasFactory;

    protected $fillable = [
        'device_id',
        'name',
        'protocol',
        'exchange',
        'routing_key',
        'payload_type',
        'switch_state',
        'is_inverted',
        'string_payload',
        'active_payload',
        'inactive_payload',
        'schedule_type',
        'schedule_value',
        'schedule_days',
        'is_enabled',
        'last_dispatched_at',
        'last_payload_sent',
        'last_status',
        'last_error_message',
    ];

    protected $casts = [
        'switch_state' => 'boolean',
        'is_inverted' => 'boolean',
        'is_enabled' => 'boolean',
        'schedule_days' => 'array',
        'last_dispatched_at' => 'datetime',
    ];

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }

    public function logs(): HasMany
    {
        return $this->hasMany(DeviceExecutionLog::class);
    }

    /**
     * Compute the final payload string considering switch state & inversion.
     */
    public function computePayload(?bool $overrideState = null): string
    {
        if ($this->payload_type === 'string' || $this->payload_type === 'json') {
            return (string) ($this->string_payload ?? '');
        }

        $effectiveState = $overrideState !== null ? $overrideState : $this->switch_state;

        $activeVal = $this->active_payload !== null && $this->active_payload !== '' ? $this->active_payload : '1';
        $inactiveVal = $this->inactive_payload !== null && $this->inactive_payload !== '' ? $this->inactive_payload : '0';

        if ($this->is_inverted) {
            // Inverted logic: Switch ON outputs LOW/inactive, Switch OFF outputs HIGH/active
            return $effectiveState ? $inactiveVal : $activeVal;
        }

        // Normal logic: Switch ON outputs active, Switch OFF outputs inactive
        return $effectiveState ? $activeVal : $inactiveVal;
    }
}
