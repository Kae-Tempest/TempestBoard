import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '@shared/entities/Project.entity';

interface RequestUser {
  id: number;

  [key: string]: any;
}

interface Request {
  user?: RequestUser;
  params: Record<string, string>;
  body: Record<string, any>;
}

@Injectable()
export class ProjectAccessGuard implements CanActivate {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    // Extract project ID from various possible locations
    const projectIdStr =
      request.params.projectId ||
      (request.body.projectId ? String(request.body.projectId) : null) ||
      (request.body.project ? String(request.body.project) : null);

    // If no project ID is specified, skip this check
    if (!projectIdStr) {
      return true;
    }

    const projectId = parseInt(projectIdStr, 10);

    // Check if projectId is a valid number
    if (isNaN(projectId)) {
      throw new ForbiddenException({
        message: 'Invalid project ID',
        details: 'Project ID must be a valid number',
        error: 'FORBIDDEN',
      });
    }

    // Make sure user is authenticated
    if (!user) {
      throw new ForbiddenException({
        message: 'Access denied',
        details: 'Authentication required for project access',
        error: 'FORBIDDEN',
      });
    }

    // Check if the project exists
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['users', 'creator'],
    });

    if (!project) {
      throw new NotFoundException({
        message: 'Project not found',
        details: `Project with ID ${projectId} does not exist`,
        error: 'NOT_FOUND',
      });
    }

    // Check if user is the creator of the project
    if (project.creator && project.creator.id === user.id) {
      return true;
    }

    // Check if user is a member of the project
    const isMember = project.users?.some(
      (projectUser) => projectUser.id === user.id,
    );

    if (!isMember) {
      throw new ForbiddenException({
        message: 'Project access denied',
        details: 'You do not have access to this project',
        error: 'FORBIDDEN',
      });
    }

    return true;
  }
}
