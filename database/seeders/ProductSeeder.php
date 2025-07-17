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
                'price' => 32400,
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
            [
                'name' => 'Dorina',
                'price' => 18750,
                'image' => '/dorina.jpg',
                'description' => 'Dorina - premium quality for your kitchen.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Flora',
                'price' => 22100,
                'image' => '/flora magarine.jpg',
                'description' => 'Flora - healthy and delicious choice.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Ngopa',
                'price' => 14200,
                'image' => '/ngopa.jpg',
                'description' => 'Ngopa - trusted by families.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Palmolive',
                'price' => 19800,
                'image' => '/palmolive.jpg',
                'description' => 'Palolive - gentle and effective.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Tatakiid',
                'price' => 10500,
                'image' => '/tatakiid.jpg',
                'description' => 'Tatakiid - for everyday use.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Zenlov',
                'price' => 22900,
                'image' => '/zenlov.jpg',
                'description' => 'Zenlov - love your home.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
