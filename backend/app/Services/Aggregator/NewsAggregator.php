<?php

namespace App\Services\Aggregator;

use App\Jobs\IngestFromSourceJob;
use App\Services\Sources\SourceClientInterface;
use DateTimeInterface;

class NewsAggregator implements NewsAggregatorInterface
{
    /**
     * @param iterable<SourceClientInterface> $clients
     */
    public function __construct(
        private readonly iterable $clients, // tagged services
    ) {}

    public function ingest(DateTimeInterface $since): int
    {
        $count = 0;
        foreach ($this->clients as $client) {
            IngestFromSourceJob::dispatch(get_class($client), $since);
            $count++;
        }
        return $count;
    }
}
