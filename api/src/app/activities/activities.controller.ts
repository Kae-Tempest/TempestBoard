import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ActivitiesService } from '@app/activities/activities.service';
import { JwtAuthGuard } from '@core/auth/guards/jwt.guard';
import { Activity } from '@shared/entities/Activity';
import { CreateActivityDto } from '@app/activities/dto/create-activity.dto';
import { UpdateActivityDto } from '@app/activities/dto/update-activity.dto';

@ApiTags('Activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Activity[]> {
    return this.activitiesService.findAll();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Activity> {
    return this.activitiesService.findOne(id);
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(@Body() payload: CreateActivityDto): Promise<Activity> {
    return this.activitiesService.create(payload);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateActivityDto,
  ): Promise<Activity> {
    return this.activitiesService.update(id, payload);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.activitiesService.delete(id);
  }
}
