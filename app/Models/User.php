<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'first_name',
        'last_name',
        'email',
        'password',
        'thumbnail',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function project(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function role(): HasMany
    {
        return $this->hasMany(Role::class);
    }

    public function CreateTicket(): HasMany
    {
        return $this->hasMany(Ticket::class, 'creator_id');
    }

    public function AssignedTicket(): HasMany
    {
        return $this->hasMany(Ticket::class, 'assigned_id');
    }

    public function getCreatedAtAttribute($date)
    {
        return Carbon::parse($date)->format('d M');
    }
}
