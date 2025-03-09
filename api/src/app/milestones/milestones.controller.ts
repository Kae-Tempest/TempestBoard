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
import {
  PermissionsGuard,
  RequirePermissions,
} from '@core/auth/guards/permissions.guard';
import { ProjectAccessGuard } from '@core/auth/guards/project.guard';
import { Permission } from '@shared/enums/permissions.enum';

@ApiTags('Milestones')
@Controller('milestones')
@UseGuards(JwtAuthGuard, PermissionsGuard, ProjectAccessGuard)
export class MilestonesController {
  constructor(private readonly milestoneService: MilestonesService) {}

  @Get('/')
  @RequirePermissions(Permission.ADMIN_ACCESS)
  async findAll(): Promise<Milestone[]> {
    return this.milestoneService.findAll();
  }

  @Get('/:id')
  @RequirePermissions(Permission.VIEW_MILESTONE)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Milestone> {
    return this.milestoneService.findById(id);
  }

  @Post('/')
  @RequirePermissions(Permission.CREATE_MILESTONE)
  async create(
    @Body() createMilestoneDto: CreateMilestoneDto,
  ): Promise<Milestone> {
    return this.milestoneService.create(createMilestoneDto);
  }

  @Patch('/:id')
  @RequirePermissions(Permission.EDIT_MILESTONE)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMilestoneDto: UpdateMilestoneDto,
  ): Promise<Milestone> {
    return this.milestoneService.update(id, updateMilestoneDto);
  }

  @Delete('/:id')
  @RequirePermissions(Permission.DELETE_MILESTONE)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.milestoneService.delete(id);
  }
}
