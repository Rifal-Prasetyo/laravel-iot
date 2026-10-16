<?php

namespace App\Console\Commands;

use App\Services\Scheduler\TopicSchedulerService;
use Illuminate\Console\Command;

class DispatchIotSchedulesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'iot:dispatch-schedules';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Evaluate and execute scheduled IoT device message broker topics';

    /**
     * Execute the console command.
     */
    public function handle(TopicSchedulerService $scheduler): int
    {
        $this->info('[' . now()->toDateTimeString() . '] Checking IoT topic schedules...');

        $result = $scheduler->dispatchDueTopics();

        if ($result['dispatched'] > 0) {
            $this->info("Successfully dispatched {$result['dispatched']} topic(s):");
            foreach ($result['topics'] as $topicSummary) {
                $this->line(" - {$topicSummary}");
            }
        } else {
            $this->comment('No topics are currently due for execution.');
        }

        return Command::SUCCESS;
    }
}
