<?php

namespace App\Services\Sources;

use App\DTO\ArticleDTO;
use Carbon\CarbonImmutable;
use DateTimeInterface;
use Illuminate\Support\Facades\Http;

class NewsApiClient implements SourceClientInterface
{
    public function sourceSlug(): string { return 'newsapi'; }

    public function fetchSince(DateTimeInterface $since, int $pageSize = 50): \Generator
    {
        $cfg = config('news.newsapi');
        $page = 1;

        do {
            try {
                $resp = Http::retry(3, 300)
                    ->withHeaders(['X-Api-Key' => $cfg['api_key']])
                    ->get($cfg['endpoint'], [
                        'country' => $cfg['country'],
                        'page'    => $page,
                        'pageSize'=> $pageSize,
                    ]);

                if ($resp->failed()) { break; }

                $articles = $resp->json('articles') ?? [];
                foreach ($articles as $a) {
                    $published = new CarbonImmutable($a['publishedAt'] ?? 'now');
                    yield new ArticleDTO(
                        sourceSlug: $this->sourceSlug(),
                        externalId: hash('sha1', ($a['url'] ?? uniqid()).($a['title'] ?? '')),
                        title: $a['title'] ?? 'Untitled',
                        url: $a['url'] ?? '',
                        summary: $a['description'] ?? null,
                        content: $a['content'] ?? null,
                        imageUrl: $a['urlToImage'] ?? null,
                        author: $a['author'] ?? null,
                        publishedAt: $published,
                        raw: $a
                    );
                }

                $hasMore = count($articles) === $pageSize;
                $page++;
            } catch (\Throwable $e) {
                report($e);
                break;
            }
        } while ($hasMore && $page <= 10);
    }
}
