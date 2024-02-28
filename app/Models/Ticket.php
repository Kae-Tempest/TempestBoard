<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'creator_id',
        'assigned_id',
        'project_id',
        'ticket_id',
        'title',
        'description',
        'status',
        'priority',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'creator_id');
    }

    public function assigned(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'assigned_id');
    }

    public function getCreatedAtAttribute($date)
    {
        return Carbon::parse($date)->format('d M');
    }

}
