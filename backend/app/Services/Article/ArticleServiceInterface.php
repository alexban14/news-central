<?php

namespace App\Services\Article;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ArticleServiceInterface
{
    public function getArticles(array $filters): LengthAwarePaginator;
}
