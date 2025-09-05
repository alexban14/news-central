<?php

namespace App\Services\Article;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ArticleServiceInterface
{
    public function getArticles(array $filters, ?User $user, bool $applyPreferences): LengthAwarePaginator;
    public function getUniqueAuthors(): array;
}
