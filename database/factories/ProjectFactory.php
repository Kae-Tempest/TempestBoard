<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->create()->id,
            'name' => $this->faker->name,
            'description' => $this->faker->text,
            'nb_user' => $this->faker->numberBetween(1, 10),
            'thumbnail' => $this->faker->imageUrl(),
            'status' => $this->faker->randomElement(['in_progress', 'completed', 'abandoned']),
        ];
    }
}
