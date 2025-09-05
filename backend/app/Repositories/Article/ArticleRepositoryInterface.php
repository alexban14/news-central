<?php

namespace App\Repositories\Article;

use App\DTO\ArticleDTO;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ArticleRepositoryInterface
{
    public function upsert(ArticleDTO $dto): void;

    public function getArticles(array $filters): LengthAwarePaginator;

    public function getUniqueAuthors(): array;
}
