<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeviceExecutionLog extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'device_id',
        'device_topic_id',
        'routing_key',
        'payload_sent',
        'triggered_by',
        'status',
        'response_message',
        'execution_time_ms',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'execution_time_ms' => 'integer',
    ];

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }

    public function topic(): BelongsTo
    {
        return $this->belongsTo(DeviceTopic::class, 'device_topic_id');
    }
}
