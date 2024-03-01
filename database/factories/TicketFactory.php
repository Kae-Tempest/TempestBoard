<?php

namespace Database\Factories;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Ticket>
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
            'project_id' => User::factory()->create()->id,
            'ticket_id' => $this->faker->randomNumber(2),
            'title' => $this->faker->name,
            'description' => $this->faker->text,
            'status' => $this->faker->randomElement(['open', 'in_progress', 'completed', 'canceled']),
            'priority' => $this->faker->randomElement(['LOW', 'NEUTRAL', 'HIGH', 'MINOR', 'URGENT']),
        ];
    }
}
