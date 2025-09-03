<?php

namespace App\DTO;

use Carbon\CarbonImmutable;

class ArticleDTO
{
    public function __construct(
        public readonly string $sourceSlug,
        public readonly string $externalId,
        public readonly string $title,
        public readonly string $url,
        public readonly ?string $summary,
        public readonly ?string $content,
        public readonly ?string $imageUrl,
        public readonly ?string $author,
        public readonly CarbonImmutable $publishedAt,
        public readonly array $raw
    ) {}
}
