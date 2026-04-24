<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveBalance extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total_leaves',
        'used_leaves',
    ];

    protected $casts = [
        'total_leaves' => 'integer',
        'used_leaves' => 'integer',
    ];

    protected $appends = [
        'remaining_leaves',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getRemainingLeavesAttribute(): int
    {
        return max(0, (int) $this->total_leaves - (int) $this->used_leaves);
    }
}
