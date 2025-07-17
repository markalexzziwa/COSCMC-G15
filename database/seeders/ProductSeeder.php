<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Product::insert([
            [
                'name' => 'Cooking Oil',
                'price' => 123400,
                'image' => '/cooking oil.jpg',
                'description' => 'High-quality cooking oil, perfect for all your culinary needs.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Shampoo',
                'price' => 2453,
                'image' => '/shampoo.jpg',
                'description' => 'Invigorating shampoo that leaves your hair fresh and clean.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Soft Margarine',
                'price' => 6000,
                'image' => '/soft magarine.jpg',
                'description' => 'Smooth and creamy margarine, a perfect spread.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
