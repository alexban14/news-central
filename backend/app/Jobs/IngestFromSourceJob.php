<?php

namespace App\Jobs;

use App\Repositories\Article\ArticleRepositoryInterface;
use App\Services\Sources\SourceClientInterface;
use DateTimeInterface;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class IngestFromSourceJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $clientClass,
        public DateTimeInterface $since
    ) {
    }

    /**
     * Execute the job.
     */
    public function handle(ArticleRepositoryInterface $repo): void
    {
        /** @var SourceClientInterface $client */
        $client = app($this->clientClass);
        $source = $client->sourceSlug();

        Log::info("Ingesting from source: {$source}");

        try {
            $count = 0;
            foreach ($client->fetchSince($this->since, (int) config('news.page_size')) as $dto) {
                $repo->upsert($dto);
                $count++;
            }
            Log::info("Ingested {$count} articles from {$source}.");
        } catch (\Throwable $e) {
            Log::error("Failed to ingest from {$source}: {$e->getMessage()}");
            report($e);
            $this->fail($e);
        }
    }
}
