<?php

namespace App\Repositories;

use App\DTO\ArticleDTO;

interface ArticleRepositoryInterface
{
    public function upsert(ArticleDTO $dto): void;
}
