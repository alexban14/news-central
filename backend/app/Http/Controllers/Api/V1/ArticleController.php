<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\ArticleDetailResource;
use App\Http\Resources\V1\ArticleResource;
use App\Models\Article;
use App\Services\Article\ArticleServiceInterface;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function __construct(private readonly ArticleServiceInterface $articleService)
    {
    }

    public function index(Request $request)
    {
        $articles = $this->articleService->getArticles($request->all());

        return ArticleResource::collection($articles);
    }

    public function show(Article $article)
    {
        return new ArticleDetailResource($article->load('source'));
    }
}
