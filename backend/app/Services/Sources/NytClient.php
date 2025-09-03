<?php

namespace App\Services\Sources;

use App\DTO\ArticleDTO;
use Carbon\CarbonImmutable;
use DateTimeInterface;
use Illuminate\Support\Facades\Http;

class NytClient implements SourceClientInterface
{
    public function sourceSlug(): string { return 'nytimes'; }

    public function fetchSince(DateTimeInterface $since, int $pageSize = 50): \Generator
    {
        $cfg = config('news.nyt');
        $page = 0;
        do {
            try {
                $resp = Http::retry(3, 300)
                    ->get($cfg['endpoint'], [
                        'api-key' => $cfg['api_key'],
                        'q' => '*',
                        'page' => $page,
                        'sort' => 'newest',
                        'begin_date' => date('Ymd', $since->getTimestamp()),
                    ]);

                if ($resp->failed()) { break; }

                $docs = $resp->json('response.docs') ?? [];
                foreach ($docs as $doc) {
                    $published = new CarbonImmutable($doc['pub_date'] ?? 'now');
                    yield new ArticleDTO(
                        sourceSlug: $this->sourceSlug(),
                        externalId: (string)($doc['_id'] ?? md5($doc['web_url'] ?? uniqid())),
                        title: $doc['headline']['main'] ?? 'Untitled',
                        url: $doc['web_url'] ?? '',
                        summary: $doc['abstract'] ?? null,
                        content: $doc['lead_paragraph'] ?? null,
                        imageUrl: $this->nyImage($doc),
                        author: $doc['byline']['original'] ?? null,
                        publishedAt: $published,
                        raw: $doc
                    );
                }

                $page++;
                $hasMore = !empty($docs);
            } catch (\Throwable $e) {
                // per-method handling as you prefer
                report($e);
                break;
            }
        } while ($hasMore && $page < 10);
    }

    private function nyImage(array $doc): ?string
    {
        $mult = $doc['multimedia'] ?? [];
        foreach ($mult as $m) {
            if (!empty($m['url'])) {
                return str_starts_with($m['url'], 'http') ? $m['url'] : 'https://www.nytimes.com/'.$m['url'];
            }
        }
        return null;
    }
}
