<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'nb_user',
        'thumbnail',
        'status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function role(): HasMany
    {
        return $this->hasMany(Role::class);
    }

    public function ticket(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }

    public function getCreatedAtAttribute($date)
    {
        return Carbon::parse($date)->format('d M Y');
    }

    public function getUpdatedAtAttribute($date)
    {
        return Carbon::parse($date)->format('d M Y');
    }
}
