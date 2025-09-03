<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $casts = [
        'raw' => 'array',
        'published_at' => 'datetime',
    ];

    protected $fillable = [
        'source_id','external_id','title','slug','url','summary','content',
        'image_url','author','published_at','raw',
    ];
}
