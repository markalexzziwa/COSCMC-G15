<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class CustomerUserSeeder extends Seeder
{
    
    public function run()
    {
        try {
            User::updateOrCreate(
                ['email' => 'customer@example.com'],
                [
                    'name' => 'Test Customer',
                    'email' => 'customer@example.com',
                    'password' => Hash::make('password123'),
                    'role' => 'customer',
                    'email_verified_at' => now(),
                ]
            );

            $this->command->info('Customer user created successfully!');
        } catch (\Exception $e) {
            $this->command->error('Error creating customer user: ' . $e->getMessage());
        }
    }
}