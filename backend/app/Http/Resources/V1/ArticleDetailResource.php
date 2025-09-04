<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'url' => $this->url,
            'summary' => $this->summary,
            'content' => $this->content,
            'imageUrl' => $this->image_url,
            'author' => $this->author,
            'publishedAt' => $this->published_at,
            'source' => new SourceResource($this->whenLoaded('source')),
        ];
    }
}
