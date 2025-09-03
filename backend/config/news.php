<?php

return [
    'nyt' => [
        'api_key' => env('NY_TIMES_API_KEY'),
        // e.g. Top stories or Search API
        'endpoint' => 'https://api.nytimes.com/svc/search/v2/articlesearch.json',
    ],
    'guardian' => [
        'api_key' => env('THE_GUARDIAN_API_KEY'),
        'endpoint' => 'https://content.guardianapis.com/search',
    ],
    'newsapi' => [
        'api_key' => env('NEWS_API_KEY'),
        'endpoint' => 'https://newsapi.org/v2/top-headlines',
        'country'  => 'us',
    ],
    'page_size' => (int) env('NEWS_INGEST_PAGE_SIZE', 50),
    'default_since' => env('NEWS_INGEST_SINCE', '-24 hours'),
];
