<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_returns_token_and_role(): void
    {
        $user = User::create([
            'name' => 'Manish Bhaktisagar',
            'email' => 'manish@example.com',
            'password' => Hash::make('password'),
            'role' => 'employee',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'manish@example.com',
            'password' => 'password',
        ]);

        $response->assertOk()
            ->assertJsonPath('user.email', $user->email)
            ->assertJsonPath('user.role', 'employee')
            ->assertJsonStructure([
                'token',
                'user' => ['id', 'name', 'email', 'role'],
            ]);
    }
}
