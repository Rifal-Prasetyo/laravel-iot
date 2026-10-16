<?php

namespace App\Services\Scheduler;

use App\Models\DeviceTopic;
use App\Services\Broker\BrokerManager;
use Carbon\Carbon;
use Cron\CronExpression;
use Exception;
use Illuminate\Support\Facades\Log;

class TopicSchedulerService
{
    public function __construct(
        protected BrokerManager $brokerManager
    ) {}

    /**
     * Determine if a given topic is due to run at current time.
     */
    public function isDue(DeviceTopic $topic, ?Carbon $now = null): bool
    {
        if (! $topic->is_enabled || $topic->schedule_type === 'none' || empty($topic->schedule_value)) {
            return false;
        }

        $now = $now ?: Carbon::now();

        switch ($topic->schedule_type) {
            case 'interval':
                $intervalMinutes = max(1, (int) $topic->schedule_value);
                if (! $topic->last_dispatched_at) {
                    return true;
                }
                return $topic->last_dispatched_at->clone()->addMinutes($intervalMinutes)->lessThanOrEqualTo($now);

            case 'daily':
                // schedule_value is format "HH:MM" e.g. "08:30"
                $targetTime = trim($topic->schedule_value);
                $currentTime = $now->format('H:i');

                // Check days of week if specified (0 = Sunday, 1 = Monday ... 6 = Saturday, or 1 = Mon .. 7 = Sun)
                if (! empty($topic->schedule_days) && is_array($topic->schedule_days)) {
                    $dayOfWeek = (string) $now->dayOfWeek; // 0 (Sun) - 6 (Sat)
                    $isoDayOfWeek = (string) $now->isoWeekday(); // 1 (Mon) - 7 (Sun)
                    if (! in_array($dayOfWeek, $topic->schedule_days) && ! in_array($isoDayOfWeek, $topic->schedule_days)) {
                        return false;
                    }
                }

                if ($currentTime === $targetTime) {
                    // Check if already dispatched in this minute
                    if ($topic->last_dispatched_at && $topic->last_dispatched_at->isSameMinute($now)) {
                        return false;
                    }
                    return true;
                }
                return false;

            case 'cron':
                try {
                    $cron = new CronExpression($topic->schedule_value);
                    if ($cron->isDue($now->toDateTimeString())) {
                        if ($topic->last_dispatched_at && $topic->last_dispatched_at->isSameMinute($now)) {
                            return false;
                        }
                        return true;
                    }
                } catch (Exception $e) {
                    Log::warning("Invalid cron expression for Topic {$topic->id}: {$topic->schedule_value}");
                }
                return false;

            case 'once':
                try {
                    $targetDate = Carbon::parse($topic->schedule_value);
                    return $now->greaterThanOrEqualTo($targetDate);
                } catch (Exception) {
                    return false;
                }

            default:
                return false;
        }
    }

    /**
     * Evaluate and dispatch all due topics.
     *
     * @return array{dispatched: int, topics: array<int, string>}
     */
    public function dispatchDueTopics(): array
    {
        $dueTopics = DeviceTopic::where('is_enabled', true)
            ->where('schedule_type', '!=', 'none')
            ->whereNotNull('schedule_value')
            ->get();

        $dispatchedCount = 0;
        $summary = [];

        foreach ($dueTopics as $topic) {
            if ($this->isDue($topic)) {
                $result = $this->brokerManager->dispatchTopic($topic, triggeredBy: 'schedule');
                $dispatchedCount++;
                $summary[] = "Topic #{$topic->id} '{$topic->name}' -> {$result->status}";

                // If schedule_type is 'once', disable schedule to avoid recurring
                if ($topic->schedule_type === 'once') {
                    $topic->schedule_type = 'none';
                    $topic->save();
                }
            }
        }

        return [
            'dispatched' => $dispatchedCount,
            'topics' => $summary,
        ];
    }
}
