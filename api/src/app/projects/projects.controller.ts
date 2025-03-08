import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
  async findOne(@Param('id') id: string): Promise<Project> {
    return await this.projectsService.getOneById(parseInt(id));
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateProjectDto,
  ): Promise<Project> {
    return await this.projectsService.update(parseInt(id), payload);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string): Promise<void> {
    return await this.projectsService.delete(parseInt(id));
  }

  @Patch('/:id/thumbnail')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  async updateThumbnail(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Project> {
    return await this.projectsService.updateThumbnail(parseInt(id), file);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteThumbnail(@Param('id') id: string): Promise<Project> {
    return await this.projectsService.deleteThumbnail(parseInt(id));
  }

  @Get(':id/states')
  @UseGuards(JwtAuthGuard)
  async getStates(@Param('id') id: string): Promise<State[]> {
    return await this.projectsService.getStateOfProject(parseInt(id));
  }

  @Get(':id/active-issues')
  @UseGuards(JwtAuthGuard)
  async getActiveIssues(@Param('id') id: string): Promise<Issue[]> {
    return await this.projectsService.getActiveIssueOfProject(parseInt(id));
  }

  @Get(':id/backlog-issues')
  @UseGuards(JwtAuthGuard)
  async getBacklogIssues(@Param('id') id: string): Promise<Issue[]> {
    return await this.projectsService.getBacklogIssueOfProject(parseInt(id));
  }

  @Get(':id/milestone')
  @UseGuards(JwtAuthGuard)
  async getMilestones(@Param('id') id: string): Promise<Milestone[]> {
    return await this.projectsService.getMilestoneOfProject(parseInt(id));
  }

  @Get(':id/milestone/advancement')
  @UseGuards(JwtAuthGuard)
  async getMilestoneAdvancement(@Param('id') id: string): Promise<{
    active: number;
    backlog: number;
    completed: number;
    canceled: number;
  }> {
    return await this.projectsService.getMilestoneAdvancementOfProject(
      parseInt(id),
    );
  }

  @Get('/:id/roles')
  @UseGuards(JwtAuthGuard)
  async getRoles(@Param('id') id: string): Promise<Role[]> {
    return this.projectsService.getRolesOfProject(parseInt(id));
  }

  @Get('/:id/roles')
  @UseGuards(JwtAuthGuard)
  async getTags(@Param('id') id: string): Promise<Tag[]> {
    return this.projectsService.getTagsOfProject(parseInt(id));
  }
}
