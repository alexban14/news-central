<?php

namespace App\Providers;

use App\Repositories\ArticleRepository;
use App\Repositories\ArticleRepositoryInterface;
use App\Repositories\UserRepository;
use App\Repositories\UserRepositoryInterface;
use App\Services\Aggregator\NewsAggregator;
use App\Services\Aggregator\NewsAggregatorInterface;
use App\Services\Article\ArticleService;
use App\Services\Article\ArticleServiceInterface;
use App\Services\Auth\AuthService;
use App\Services\Auth\AuthServiceInterface;
use App\Services\Sources\GuardianClient;
use App\Services\Sources\NewsApiClient;
use App\Services\Sources\NytClient;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // services
        $this->app->bind(NewsAggregatorInterface::class, NewsAggregator::class);
        $this->app->bind(ArticleServiceInterface::class, ArticleService::class);
        $this->app->bind(AuthServiceInterface::class, AuthService::class);

        // repositories
        $this->app->bind(ArticleRepositoryInterface::class, ArticleRepository::class);
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);

        $this->app->singleton(GuardianClient::class);
        $this->app->singleton(NewsApiClient::class);
        $this->app->singleton(NytClient::class);

        $this->app->tag([
            GuardianClient::class,
            NewsApiClient::class,
            NytClient::class,
        ], 'news.source.clients');

        $this->app->when(NewsAggregator::class)
            ->needs('$clients')
            ->give(fn($app) => $app->tagged('news.source.clients'));
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
