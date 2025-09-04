<?php

namespace App\Services\Article;

use App\Repositories\ArticleRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ArticleService implements ArticleServiceInterface
{
    public function __construct(private readonly ArticleRepositoryInterface $articleRepository)
    {
    }

    public function getArticles(array $filters): LengthAwarePaginator
    {
        return $this->articleRepository->getArticles($filters);
    }
}
