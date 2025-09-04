<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\SourceResource;
use App\Models\Source;

class SourceController extends Controller
{
    public function index()
    {
        return SourceResource::collection(Source::all());
    }
}
