<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ticket>
 */
class TicketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'creator_id' => User::factory()->create()->id,
            'assigned_id' => User::factory()->create()->id,
            'title' => $this->faker->name,
            'description' => $this->faker->text,
            'status' => $this->faker->randomElement(['open', 'in_progress', 'completed', 'abandoned']),
            'priority' => $this->faker->randomElement(['low', 'medium', 'high']),
        ];
    }
}
