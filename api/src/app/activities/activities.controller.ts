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
import { ProjectAccessGuard } from '@core/auth/guards/project.guard';

@ApiTags('Activities')
@Controller('activities')
@UseGuards(JwtAuthGuard, ProjectAccessGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get('/')
  async findAll(): Promise<Activity[]> {
    return this.activitiesService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Activity> {
    return this.activitiesService.findOne(id);
  }

  @Post('/')
  async create(@Body() payload: CreateActivityDto): Promise<Activity> {
    return this.activitiesService.create(payload);
  }

  @Patch('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateActivityDto,
  ): Promise<Activity> {
    return this.activitiesService.update(id, payload);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.activitiesService.delete(id);
  }
}
