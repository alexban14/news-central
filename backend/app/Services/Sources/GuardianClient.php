<?php

namespace App\Services\Sources;

use App\DTO\ArticleDTO;
use Carbon\CarbonImmutable;
use DateTimeInterface;
use Illuminate\Support\Facades\Http;

class GuardianClient implements SourceClientInterface
{
    public function sourceSlug(): string { return 'guardian'; }

    public function fetchSince(DateTimeInterface $since, int $pageSize = 50): \Generator
    {
        $cfg = config('news.guardian');
        $page = 1;

        do {
            try {
                $resp = Http::retry(3, 300)
                    ->get($cfg['endpoint'], [
                        'api-key' => $cfg['api_key'],
                        'from-date' => (new \DateTimeImmutable('@'.$since->getTimestamp()))->format('Y-m-d'),
                        'page' => $page,
                        'page-size' => $pageSize,
                        'show-fields' => 'trailText,bodyText,thumbnail,byline',
                        'order-by' => 'newest',
                    ]);

                if ($resp->failed()) { break; }

                $results = $resp->json('response.results') ?? [];
                foreach ($results as $item) {
                    $fields = $item['fields'] ?? [];
                    $published = new CarbonImmutable($item['webPublicationDate'] ?? 'now');
                    yield new ArticleDTO(
                        sourceSlug: $this->sourceSlug(),
                        externalId: (string)$item['id'],
                        title: $item['webTitle'] ?? 'Untitled',
                        url: $item['webUrl'] ?? '',
                        summary: $fields['trailText'] ?? null,
                        content: $fields['bodyText'] ?? null,
                        imageUrl: $fields['thumbnail'] ?? null,
                        author: $fields['byline'] ?? null,
                        publishedAt: $published,
                        raw: $item
                    );
                }

                $current = (int)($resp->json('response.currentPage') ?? $page);
                $total   = (int)($resp->json('response.pages') ?? $current);
                $page++;
                $hasMore = $current < $total;
            } catch (\Throwable $e) {
                report($e);
                break;
            }
        } while ($hasMore && $page <= 10);
    }
}
