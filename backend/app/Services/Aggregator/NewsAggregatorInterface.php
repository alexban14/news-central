<?php

namespace App\Services\Aggregator;

use DateTimeInterface;

interface NewsAggregatorInterface
{
    public function ingest(DateTimeInterface $since): int;
}
