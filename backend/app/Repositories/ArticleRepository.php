<?php

namespace App\Repositories;

use App\DTO\ArticleDTO;
use App\Models\Article;
use App\Models\Source;
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
}
