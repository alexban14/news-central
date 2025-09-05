<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\Article\ArticleServiceInterface;
use Illuminate\Http\Request;

class AuthorController extends Controller
{
    public function __construct(private readonly ArticleServiceInterface $articleService)
    {
    }

    public function index()
    {
        $authors = $this->articleService->getUniqueAuthors();
        return response()->json($authors);
    }
}
