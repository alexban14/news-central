<?php

namespace App\Console\Commands;

use App\Services\Aggregator\NewsAggregatorInterface;
use DateTimeImmutable;
use Illuminate\Console\Command;

class IngestNews extends Command
{
    protected $signature = 'news:ingest {--since=}';
    protected $description = 'Dispatches jobs to fetch and store news from configured sources.';

    public function handle(NewsAggregatorInterface $agg): int
    {
        $sinceOpt = $this->option('since');
        $sinceStr = $sinceOpt ?: config('news.default_since');
        $since = new DateTimeImmutable($sinceStr);

        $this->info("Dispatching jobs to ingest news since {$since->format(DATE_ATOM)}...");
        $count = $agg->ingest($since);
        $this->info("Done. Dispatched {$count} jobs.");

        return self::SUCCESS;
    }
}
