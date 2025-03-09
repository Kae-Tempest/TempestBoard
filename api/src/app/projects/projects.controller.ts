import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectsService } from '@app/projects/projects.service';
import { JwtAuthGuard } from '@core/auth/guards/jwt.guard';
import { Project } from '@shared/entities/Project.entity';
import { CreateProjectDto } from '@app/projects/dto/create-project.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { State } from '@shared/entities/State.entity';
import { Issue } from '@shared/entities/Issue.entity';
import { Milestone } from '@shared/entities/Milestone.entity';
import { UpdateProjectDto } from '@app/projects/dto/update-project.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@shared/entities/Role.entity';
import { Tag } from '@shared/entities/Tag.entity';
import {
  PermissionsGuard,
  RequirePermissions,
} from '@core/auth/guards/permissions.guard';
import { ProjectAccessGuard } from '@core/auth/guards/project.guard';
import { Permission } from '@shared/enums/permissions.enum';

@ApiTags('Projects')
@Controller('projects')
@UseGuards(JwtAuthGuard, PermissionsGuard, ProjectAccessGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('/')
  @RequirePermissions(Permission.CREATE_PROJECT)
  async create(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return await this.projectsService.create(createProjectDto);
  }

  @Get('/')
  @RequirePermissions(Permission.ADMIN_ACCESS)
  async findAll(): Promise<Project[]> {
    return await this.projectsService.getAll();
  }

  @Get('/:id')
  @RequirePermissions(Permission.VIEW_PROJECT)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Project> {
    return await this.projectsService.getOneById(id);
  }

  @Patch('/:id')
  @RequirePermissions(Permission.EDIT_PROJECT)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateProjectDto,
  ): Promise<Project> {
    return await this.projectsService.update(id, payload);
  }

  @Delete('/:id')
  @RequirePermissions(Permission.DELETE_PROJECT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.projectsService.delete(id);
  }

  @Patch('/:id/thumbnail')
  @RequirePermissions(Permission.EDIT_PROJECT)
  @RequirePermissions(Permission.UPLOAD_ATTACHMENT)
  @UseInterceptors(FileInterceptor('thumbnail'))
  async updateThumbnail(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Project> {
    return await this.projectsService.updateThumbnail(id, file);
  }

  @Delete('/:id')
  @RequirePermissions(Permission.EDIT_PROJECT)
  @RequirePermissions(Permission.DELETE_ATTACHMENT)
  async deleteThumbnail(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Project> {
    return await this.projectsService.deleteThumbnail(id);
  }

  @Get(':id/states')
  @RequirePermissions(Permission.VIEW_PROJECT)
  async getStates(@Param('id', ParseIntPipe) id: number): Promise<State[]> {
    return await this.projectsService.getStateOfProject(id);
  }

  @Get(':id/active-issues')
  @RequirePermissions(Permission.VIEW_ISSUE)
  async getActiveIssues(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Issue[]> {
    return await this.projectsService.getActiveIssueOfProject(id);
  }

  @Get(':id/backlog-issues')
  @RequirePermissions(Permission.VIEW_ISSUE)
  async getBacklogIssues(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Issue[]> {
    return await this.projectsService.getBacklogIssueOfProject(id);
  }

  @Get(':id/milestone')
  @RequirePermissions(Permission.VIEW_MILESTONE)
  async getMilestones(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Milestone[]> {
    return await this.projectsService.getMilestoneOfProject(id);
  }

  @Get(':id/milestone/advancement')
  @RequirePermissions(Permission.VIEW_MILESTONE)
  async getMilestoneAdvancement(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{
    active: number;
    backlog: number;
    completed: number;
    canceled: number;
  }> {
    return await this.projectsService.getMilestoneAdvancementOfProject(id);
  }

  @Get('/:id/roles')
  @RequirePermissions(Permission.VIEW_ROLE)
  async getRoles(@Param('id', ParseIntPipe) id: number): Promise<Role[]> {
    return this.projectsService.getRolesOfProject(id);
  }

  @Get('/:id/tags')
  @RequirePermissions(Permission.VIEW_TAG)
  async getTags(@Param('id', ParseIntPipe) id: number): Promise<Tag[]> {
    return this.projectsService.getTagsOfProject(id);
  }
}
