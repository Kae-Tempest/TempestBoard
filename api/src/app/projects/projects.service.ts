import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '@shared/entities/Project.entity';
import { Repository } from 'typeorm';
import { Milestone } from '@shared/entities/Milestone.entity';
import { User } from '@shared/entities/User.entity';
import { State } from '@shared/entities/State.entity';
import { Issue } from '@shared/entities/Issue.entity';
import { CreateProjectDto } from '@app/projects/dto/create-project.dto';
import { UpdateProjectDto } from '@app/projects/dto/update-project.dto';
import process from 'node:process';
import * as path from 'node:path';
import { promisify } from 'util';
import * as fs from 'node:fs';
import { Role } from '@shared/entities/Role.entity';
import { Tag } from '@shared/entities/Tag.entity';

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Milestone)
    private readonly MilestoneRepository: Repository<Milestone>,
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
    @InjectRepository(State)
    private readonly StateRepository: Repository<State>,
    @InjectRepository(Issue)
    private readonly IssueRepository: Repository<Issue>,
    @InjectRepository(Role)
    private readonly RoleRepository: Repository<Role>,
    @InjectRepository(Tag)
    private readonly TagRepository: Repository<Tag>,
  ) {}

  public async getAll(): Promise<Project[]> {
    this.logger.log('Retrieving all projects');
    try {
      const projects = await this.projectRepository.find();
      this.logger.log(`Successfully retrieved ${projects.length} projects`);
      return projects;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve projects: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new NotFoundException(error, 'Projects not found');
    }
  }

  public async getOneById(id: number): Promise<Project> {
    this.logger.log(`Retrieving project with ID: ${id}`);
    const project: Project | null = await this.projectRepository.findOne({
      where: { id },
    });
    if (!project) {
      this.logger.warn(`Project with ID: ${id} not found`);
      throw new NotFoundException('Project not found');
    }
    this.logger.log(`Successfully retrieved project with ID: ${id}`);
    return project;
  }

  public async create(payload: CreateProjectDto): Promise<Project> {
    this.logger.log(`Creating new project: ${payload.name}`);
    try {
      const creator = await this.UserRepository.findOne({
        where: { id: payload.creator },
      });
      if (!creator) {
        this.logger.warn(`User with ID: ${payload.creator} not found`);
        throw new NotFoundException(
          `User with id ${payload.creator} not found`,
        );
      }

      const project: Partial<Project> = { ...payload, creator };

      const createdProject = this.projectRepository.create(project);
      this.logger.log(
        `Successfully created project: ${createdProject.id} - ${createdProject.name}`,
      );

      return await this.projectRepository.save(createdProject);
    } catch (err) {
      this.logger.error(
        `Failed to create project: ${(err as Error).message}`,
        (err as Error).stack,
      );
      throw new BadRequestException('Failed to create user');
    }
  }

  public async update(id: number, payload: UpdateProjectDto): Promise<Project> {
    this.logger.log(`Updating project with ID: ${id}`);
    try {
      const project: Project | null = await this.projectRepository.findOne({
        where: { id },
      });

      if (!project) {
        this.logger.warn(`Project with ID: ${id} not found`);
        throw new NotFoundException(`Project with ID ${id} not found`);
      }

      Object.assign(project, payload);

      const updatedProject = await this.projectRepository.save(project);
      this.logger.log(`Successfully updated project with ID: ${id}`);
      return updatedProject;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      this.logger.error(
        `Failed to update project with ID: ${id}: ${(err as Error).message}`,
        (err as Error).stack,
      );
      throw new BadRequestException('Failed to update project');
    }
  }

  public async delete(id: number): Promise<void> {
    this.logger.log(`Deleting project with ID: ${id}`);
    try {
      const result = await this.projectRepository.delete(id);

      if (result.affected === 0) {
        this.logger.warn(`Project with ID: ${id} not found`);
        throw new NotFoundException(`Project with ID ${id} not found`);
      }
      this.logger.log(`Successfully deleted project with ID: ${id}`);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      this.logger.error(
        `Failed to delete project with ID: ${id}: ${(err as Error).message}`,
        (err as Error).stack,
      );
      throw new BadRequestException('Failed to delete project');
    }
  }

  public async updateThumbnail(
    id: number,
    file: Express.Multer.File,
  ): Promise<Project> {
    this.logger.log(`Updating thumbnail for project with ID: ${id}`);
    if (!file) {
      this.logger.warn('No file uploaded for thumbnail update');
      throw new BadRequestException('No file uploaded');
    }

    const allowedMimeTypes: string[] = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      this.logger.warn(`Invalid file type uploaded: ${file.mimetype}`);
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, and GIF are allowed.',
      );
    }

    const project: Project | null = await this.projectRepository.findOne({
      where: { id },
    });

    if (!project) {
      this.logger.warn(`Project with ID: ${id} not found`);
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    try {
      const uploadsDir = path.join(process.cwd(), 'uploads', 'projects');
      await mkdir(uploadsDir, { recursive: true });

      const fileExt = path.extname(file.originalname);
      const fileName = `${id}-${Date.now()}${fileExt}`;
      const filePath = path.join(uploadsDir, fileName);

      await writeFile(filePath, file.buffer);
      this.logger.log(`Thumbnail file saved at: ${filePath}`);

      project.thumbnail = `/uploads/projects/`;

      const savedProject = await this.projectRepository.save(project);
      this.logger.log(
        `Successfully updated thumbnail for project with ID: ${id}`,
      );
      return savedProject;
    } catch (err) {
      this.logger.error(
        `Failed to update thumbnail for project with ID: ${id}: ${(err as Error).message}`,
        (err as Error).stack,
      );
      throw new BadRequestException('Failed to update project thumbnail');
    }
  }

  public async deleteThumbnail(id: number): Promise<Project> {
    this.logger.log(`Deleting thumbnail for project with ID: ${id}`);
    const project: Project | null = await this.projectRepository.findOne({
      where: { id },
    });

    if (!project) {
      this.logger.warn(`Project with ID: ${id} not found`);
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    if (project.thumbnail) {
      try {
        const avatarPath = path.join(
          process.cwd(),
          project.thumbnail.replace(/^\//, ''),
        );

        if (fs.existsSync(avatarPath)) {
          fs.unlinkSync(avatarPath);
          this.logger.log(`Deleted thumbnail file at: ${avatarPath}`);
        } else {
          this.logger.warn(`Thumbnail file not found at: ${avatarPath}`);
        }

        project.thumbnail = '';
        const savedProject = await this.projectRepository.save(project);
        this.logger.log(
          `Successfully removed thumbnail reference for project with ID: ${id}`,
        );
        return savedProject;
      } catch (err) {
        this.logger.error(
          `Failed to delete thumbnail for project with ID: ${id}: ${(err as Error).message}`,
          (err as Error).stack,
        );
        throw new BadRequestException('Failed to delete project thumbnail');
      }
    }
    this.logger.log(`No thumbnail found for project with ID: ${id}`);
    return project;
  }

  public async getStateOfProject(id: number): Promise<State[]> {
    this.logger.log(`Retrieving states for project with ID: ${id}`);
    const project: Project | null = await this.projectRepository.findOne({
      where: { id },
    });
    if (!project) {
      this.logger.warn(`Project with ID: ${id} not found`);
      throw new NotFoundException('Project not found');
    }

    try {
      const states = await this.StateRepository.findBy({ project: project });
      if (!states || states.length === 0) {
        this.logger.warn(`No states found for project with ID: ${id}`);
        throw new NotFoundException('States not found');
      }

      this.logger.log(
        `Successfully retrieved ${states.length} states for project with ID: ${id}`,
      );
      return states;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      this.logger.error(
        `Failed to retrieve states for project with ID: ${id}: ${(err as Error).message}`,
        (err as Error).stack,
      );
      throw new BadRequestException('Failed to retrieve project states');
    }
  }

  public async getActiveIssueOfProject(id: number): Promise<Issue[]> {
    this.logger.log(`Retrieving active issues for project with ID: ${id}`);
    const project: Project | null = await this.projectRepository.findOne({
      where: { id },
    });
    if (!project) {
      this.logger.warn(`Project with ID: ${id} not found`);
      throw new NotFoundException('Project not found');
    }

    try {
      const issues: Issue[] = await this.IssueRepository.find({
        relations: ['states'],
        where: {
          project,
          status: { is_active: true },
        },
      });

      if (!issues || issues.length === 0) {
        this.logger.warn(`No active issues found for project with ID: ${id}`);
        throw new NotFoundException('Issues not found');
      }

      this.logger.log(
        `Successfully retrieved ${issues.length} active issues for project with ID: ${id}`,
      );
      return issues;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      this.logger.error(
        `Failed to retrieve active issues for project with ID: ${id}: ${(err as Error).message}`,
        (err as Error).stack,
      );
      throw new BadRequestException('Failed to retrieve project active issues');
    }
  }

  public async getBacklogIssueOfProject(id: number): Promise<Issue[]> {
    this.logger.log(`Retrieving backlog issues for project with ID: ${id}`);
    const project: Project | null = await this.projectRepository.findOne({
      where: { id },
    });
    if (!project) {
      this.logger.warn(`Project with ID: ${id} not found`);
      throw new NotFoundException('Project not found');
    }

    try {
      const issues: Issue[] = await this.IssueRepository.find({
        relations: ['states'],
        where: {
          project,
          status: { is_backlog: true },
        },
      });

      if (!issues || issues.length === 0) {
        this.logger.warn(`No backlog issues found for project with ID: ${id}`);
        throw new NotFoundException('Issues not found');
      }

      this.logger.log(
        `Successfully retrieved ${issues.length} backlog issues for project with ID: ${id}`,
      );
      return issues;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      this.logger.error(
        `Failed to retrieve backlog issues for project with ID: ${id}: ${(err as Error).message}`,
        (err as Error).stack,
      );
      throw new BadRequestException(
        'Failed to retrieve project backlog issues',
      );
    }
  }

  public async getMilestoneOfProject(id: number): Promise<Milestone[]> {
    this.logger.log(`Retrieving milestones for project with ID: ${id}`);
    const project: Project | null = await this.projectRepository.findOne({
      where: { id },
    });
    if (!project) {
      this.logger.warn(`Project with ID: ${id} not found`);
      throw new NotFoundException('Project not found');
    }

    try {
      const milestones: Milestone[] = await this.MilestoneRepository.find({
        where: { project },
      });

      if (!milestones || milestones.length === 0) {
        this.logger.warn(`No milestones found for project with ID: ${id}`);
        throw new NotFoundException('Milestones not found');
      }

      this.logger.log(
        `Successfully retrieved ${milestones.length} milestones for project with ID: ${id}`,
      );
      return milestones;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      this.logger.error(
        `Failed to retrieve milestones for project with ID: ${id}: ${(err as Error).message}`,
        (err as Error).stack,
      );
      throw new BadRequestException('Failed to retrieve project milestones');
    }
  }

  public async getMilestoneAdvancementOfProject(id: number): Promise<{
    active: number;
    backlog: number;
    completed: number;
    canceled: number;
  }> {
    this.logger.log(
      `Retrieving milestone advancement statistics for project with ID: ${id}`,
    );
    const project: Project | null = await this.projectRepository.findOne({
      where: { id },
    });

    if (!project) {
      this.logger.warn(`Project with ID: ${id} not found`);
      throw new NotFoundException('Project not found');
    }

    try {
      const activeIssues: Issue[] = await this.IssueRepository.find({
        relations: ['states'],
        where: {
          project,
          status: { is_active: true },
        },
      });

      const backlogIssues: Issue[] = await this.IssueRepository.find({
        relations: ['states'],
        where: {
          project,
          status: { is_backlog: true },
        },
      });

      const completedIssues: Issue[] = await this.IssueRepository.find({
        relations: ['states'],
        where: {
          project,
          status: { is_active: false, is_backlog: false, is_canceled: false },
        },
      });

      const canceledIssues: Issue[] = await this.IssueRepository.find({
        relations: ['states'],
        where: {
          project,
          status: { is_canceled: true },
        },
      });

      const result = {
        active: activeIssues.length,
        backlog: backlogIssues.length,
        completed: completedIssues.length,
        canceled: canceledIssues.length,
      };

      this.logger.log(
        `Successfully retrieved milestone advancement statistics for project with ID: ${id}`,
        result,
      );
      return result;
    } catch (err) {
      this.logger.error(
        `Failed to retrieve milestone advancement statistics for project with ID: ${id}: ${(err as Error).message}`,
        (err as Error).stack,
      );
      throw new BadRequestException(
        'Failed to retrieve project milestone advancement statistics',
      );
    }
  }

  public async getRolesOfProject(id: number): Promise<Role[]> {
    return await this.RoleRepository.findBy({ project: { id } });
  }

  public async getTagsOfProject(id: number): Promise<Tag[]> {
    return await this.TagRepository.findBy({ project: { id } });
  }
}
