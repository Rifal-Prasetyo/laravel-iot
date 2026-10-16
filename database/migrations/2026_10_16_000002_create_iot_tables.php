<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('device_code')->unique();
            $table->text('description')->nullable();
            $table->string('status')->default('offline');
            $table->string('location')->nullable();
            $table->timestamp('last_seen_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        Schema::create('device_topics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained('devices')->cascadeOnDelete();
            $table->string('name');
            $table->string('protocol')->default('amqp'); // amqp, mqtt
            $table->string('exchange')->default('amq.topic');
            $table->string('routing_key');
            $table->string('payload_type')->default('switch'); // switch, string, json
            $table->boolean('switch_state')->default(false);
            $table->boolean('is_inverted')->default(false);
            $table->text('string_payload')->nullable();
            $table->string('active_payload')->nullable()->default('1');
            $table->string('inactive_payload')->nullable()->default('0');
            $table->string('schedule_type')->default('none'); // none, interval, cron, daily, once
            $table->string('schedule_value')->nullable();
            $table->json('schedule_days')->nullable();
            $table->boolean('is_enabled')->default(true);
            $table->timestamp('last_dispatched_at')->nullable();
            $table->text('last_payload_sent')->nullable();
            $table->string('last_status')->nullable(); // success, failed, simulated
            $table->text('last_error_message')->nullable();
            $table->timestamps();
        });

        Schema::create('device_execution_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained('devices')->cascadeOnDelete();
            $table->foreignId('device_topic_id')->nullable()->constrained('device_topics')->cascadeOnDelete();
            $table->string('routing_key');
            $table->text('payload_sent');
            $table->string('triggered_by')->default('manual'); // manual, schedule, switch
            $table->string('status')->default('success'); // success, failed, simulated
            $table->text('response_message')->nullable();
            $table->integer('execution_time_ms')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('device_execution_logs');
        Schema::dropIfExists('device_topics');
        Schema::dropIfExists('devices');
    }
};
