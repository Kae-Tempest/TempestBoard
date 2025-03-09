// src/auth/guards/permissions.guard.ts
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

// Custom decorator to set required permissions for a route
export const RequirePermissions = (
  ...permissions: string[]
): MethodDecorator => {
  return (
    target: object,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    Reflect.defineMetadata('permissions', permissions, descriptor.value);
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
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    // If no permissions are required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    // Make sure user is authenticated
    if (!user) {
      throw new ForbiddenException({
        message: 'Access denied',
        details: 'Authentication required before checking permissions',
        error: 'FORBIDDEN',
      });
    }

    // Get user's roles with permissions
    const userRoles = await this.roleRepository.find({
      where: {
        users: {
          id: user.id,
        },
      },
      relations: ['permissions'],
    });

    // Extract all permission names the user has through their roles
    const userPermissions: string[] = [];

    userRoles.forEach((role) => {
      if (role.permissions) {
        role.permissions.forEach((permission) => {
          if (permission && permission.name) {
            userPermissions.push(permission.name);
          }
        });
      }
    });

    // Check if the user has all required permissions
    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException({
        message: 'Insufficient permissions',
        details: `Required permissions: ${requiredPermissions.join(', ')}`,
        error: 'FORBIDDEN',
      });
    }

    return true;
  }
}
