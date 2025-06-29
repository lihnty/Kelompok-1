<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FeeGroup>
 */
class FeeGroupFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'group' => $this->faker->numberBetween( int1: 1, int2: 10),

            'amount' => $this->faker->numberBetween( int1: 1000000, int2: 6000000),
        ];
    }
}
