<?php

namespace App\Services\Sources;

use DateTimeInterface;
use Generator;

interface SourceClientInterface
{
    /**
     * @return Generator<\App\DTO\ArticleDTO>
     */
    public function fetchSince(DateTimeInterface $since, int $pageSize = 50): Generator;

    public function sourceSlug(): string;
}
