<?php

namespace App\Services\Article;

use App\Models\User;
use App\Repositories\Article\ArticleRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;

class ArticleService implements ArticleServiceInterface
{
    public function __construct(private readonly ArticleRepositoryInterface $articleRepository)
    {
    }

    public function getArticles(array $filters, ?User $user, bool $applyPreferences): LengthAwarePaginator
    {
        if ($user && $applyPreferences) {
            $user->loadMissing('preferredSources', 'preferredAuthors');

            $filters['preferred_sources'] = $user->preferredSources->pluck('id')->toArray();
            $filters['preferred_authors'] = $user->preferredAuthors->pluck('author_name')->toArray();

        }

        return $this->articleRepository->getArticles($filters);
    }

    public function getUniqueAuthors(): array
    {
        return $this->articleRepository->getUniqueAuthors();
    }
}
