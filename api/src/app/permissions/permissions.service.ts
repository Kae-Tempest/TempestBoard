import { Injectable, NotFoundException } from '@nestjs/common';
import { Permission } from '@shared/entities/Permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  public async getAll(): Promise<Permission[]> {
    return this.permissionRepository.find({
      relations: ['roles'],
    });
  }

  public async getById(id: number): Promise<Permission> {
    const permission: Permission | null =
      await this.permissionRepository.findOne({
        where: { id },
        relations: ['roles'],
      });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return permission;
  }

  public async create(payload: CreatePermissionDto): Promise<Permission> {
    const newPermission: Permission = this.permissionRepository.create({
      name: payload.name,
      description: payload.description,
    });
    return await this.permissionRepository.save(newPermission);
  }

  public async update(
    id: number,
    payload: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission: Permission | null =
      await this.permissionRepository.findOne({
        where: { id },
      });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    if (payload.name) {
      permission.name = payload.name;
    }

    if (payload.description) {
      permission.description = payload.description;
    }

    return await this.permissionRepository.save(permission);
  }

  public async delete(id: number): Promise<void> {
    const permission = await this.getById(id);
    await this.permissionRepository.remove(permission);
  }
}
