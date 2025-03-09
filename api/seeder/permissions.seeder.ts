import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission as PermissionEnum } from '@shared/enums/permissions.enum';
import { Permission } from '@shared/entities/Permission.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async seed() {
    await this.seedPermissions();
  }

  private async seedPermissions() {
    // Check if permissions already exist
    const count = await this.permissionRepository.count();
    if (count > 0) {
      return;
    }

    // Create all permissions from enum
    const permissions = Object.values(PermissionEnum).map((name: string) => {
      const permission = new Permission();
      permission.name = name;
      permission.description = this.formatPermissionDescription(name);
      return permission;
    });

    await this.permissionRepository.save(permissions);
  }

  private formatPermissionDescription(permissionName: string): string {
    // Convert snake_case to human-readable text
    return permissionName
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
