<?php

namespace App\Repositories\Article;

use App\DTO\ArticleDTO;
use App\Models\Article;
use App\Models\Source;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class ArticleRepository implements ArticleRepositoryInterface
{
    public function upsert(ArticleDTO $dto): void
    {
        $source = Source::firstWhere('slug', $dto->sourceSlug);
        if (!$source) {
            $source = Source::create(['name' => Str::title($dto->sourceSlug), 'slug' => $dto->sourceSlug]);
        }

        Article::updateOrCreate(
            ['source_id' => $source->id, 'external_id' => $dto->externalId],
            [
                'title'        => $dto->title,
                'slug'         => Str::slug(Str::limit($dto->title, 120, '')),
                'url'          => $dto->url,
                'summary'      => $dto->summary,
                'content'      => $dto->content,
                'image_url'    => $dto->imageUrl,
                'author'       => $dto->author,
                'published_at' => $dto->publishedAt,
                'raw'          => $dto->raw,
            ]
        );
    }

    public function getArticles(array $filters): LengthAwarePaginator
    {
        $query = Article::query()
            ->with('source');

        if (!empty($filters['preferred_sources']) || !empty($filters['preferred_authors'])) {
            $query->where(function ($q) use ($filters) {
                if (!empty($filters['preferred_sources'])) {
                    $q->whereIn('source_id', $filters['preferred_sources']);
                }
                if (!empty($filters['preferred_authors'])) {
                    $q->orWhereIn('author', $filters['preferred_authors']);
                }
            });
        }

        $query->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('summary', 'like', "%{$search}%")
                        ->orWhere('content', 'like', "%{$search}%");
                });
            })
            ->when($filters['date_from'] ?? null, function ($query, $date_from) {
                $query->where('published_at', '>=', $date_from);
            })
            ->when($filters['date_to'] ?? null, function ($query, $date_to) {
                $query->where('published_at', '<=', $date_to);
            })
            ->when($filters['source'] ?? null, function ($query, $source) {
                $query->whereHas('source', function ($query) use ($source) {
                    $query->where('slug', $source);
                });
            });

        return $query->latest('published_at')
            ->paginate(20)
            ->withQueryString();
    }

    public function getUniqueAuthors(): array
    {
        return Article::distinct()->whereNotNull('author')->pluck('author')->toArray();
    }
}
