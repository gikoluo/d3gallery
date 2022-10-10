<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Orchid\Screen\AsSource;


class D3Model extends Model
{
    use HasFactory;
    use HasUuids;
    use AsSource;

    /**
     * @var array
     */
    protected $fillable = [
        'name',
        'url',
        'description',
    ];

}
