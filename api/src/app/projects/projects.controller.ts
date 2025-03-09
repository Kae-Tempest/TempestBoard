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

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return await this.projectsService.create(createProjectDto);
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Project[]> {
    return await this.projectsService.getAll();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Project> {
    return await this.projectsService.getOneById(id);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateProjectDto,
  ): Promise<Project> {
    return await this.projectsService.update(id, payload);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.projectsService.delete(id);
  }

  @Patch('/:id/thumbnail')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  async updateThumbnail(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Project> {
    return await this.projectsService.updateThumbnail(id, file);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteThumbnail(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Project> {
    return await this.projectsService.deleteThumbnail(id);
  }

  @Get(':id/states')
  @UseGuards(JwtAuthGuard)
  async getStates(@Param('id', ParseIntPipe) id: number): Promise<State[]> {
    return await this.projectsService.getStateOfProject(id);
  }

  @Get(':id/active-issues')
  @UseGuards(JwtAuthGuard)
  async getActiveIssues(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Issue[]> {
    return await this.projectsService.getActiveIssueOfProject(id);
  }

  @Get(':id/backlog-issues')
  @UseGuards(JwtAuthGuard)
  async getBacklogIssues(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Issue[]> {
    return await this.projectsService.getBacklogIssueOfProject(id);
  }

  @Get(':id/milestone')
  @UseGuards(JwtAuthGuard)
  async getMilestones(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Milestone[]> {
    return await this.projectsService.getMilestoneOfProject(id);
  }

  @Get(':id/milestone/advancement')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async getRoles(@Param('id', ParseIntPipe) id: number): Promise<Role[]> {
    return this.projectsService.getRolesOfProject(id);
  }

  @Get('/:id/roles')
  @UseGuards(JwtAuthGuard)
  async getTags(@Param('id', ParseIntPipe) id: number): Promise<Tag[]> {
    return this.projectsService.getTagsOfProject(id);
  }
}
