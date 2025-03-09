import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '@shared/entities/Role.entity';

// Custom decorator to set required roles for a route
export const RequireRoles = (...roles: string[]): MethodDecorator => {
  return (
    target: object,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Reflect.defineMetadata('roles', roles, descriptor.value);
    return descriptor;
  };
};

interface RequestUser {
  id: number;

  [key: string]: any;
}

interface Request {
  user?: RequestUser;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    // Make sure user is authenticated
    if (!user) {
      throw new ForbiddenException({
        message: 'Access denied',
        details: 'Authentication required before checking roles',
        error: 'FORBIDDEN',
      });
    }

    // Get user's roles (using the many-to-many relationship)
    const userRoles = await this.roleRepository.find({
      where: {
        users: {
          id: user.id,
        },
      },
      relations: ['permissions'],
    });

    // Check if the user has any of the required roles
    const hasRole = userRoles.some((role) => requiredRoles.includes(role.name));

    if (!hasRole) {
      throw new ForbiddenException({
        message: 'Insufficient permissions',
        details: `Required roles: ${requiredRoles.join(', ')}`,
        error: 'FORBIDDEN',
      });
    }

    return true;
  }
}
