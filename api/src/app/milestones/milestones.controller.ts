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
import { MilestonesService } from '@app/milestones/milestones.service';
import { JwtAuthGuard } from '@core/auth/guards/jwt.guard';
import { Milestone } from '@shared/entities/Milestone.entity';
import { CreateMilestoneDto } from '@app/milestones/dto/create-milestone.dto';
import { UpdateMilestoneDto } from '@app/milestones/dto/update-milestone.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Milestones')
@Controller('milestones')
export class MilestonesController {
  constructor(private readonly milestoneService: MilestonesService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Milestone[]> {
    return this.milestoneService.findAll();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Milestone> {
    return this.milestoneService.findById(id);
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createMilestoneDto: CreateMilestoneDto,
  ): Promise<Milestone> {
    return this.milestoneService.create(createMilestoneDto);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMilestoneDto: UpdateMilestoneDto,
  ): Promise<Milestone> {
    return this.milestoneService.update(id, updateMilestoneDto);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.milestoneService.delete(id);
  }
}
