import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@shared/entities/Role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '@shared/entities/Project.entity';
import { Permission } from '@shared/entities/Permission.entity';
import { CreateRoleDto } from '@app/roles/dto/create-role.dto';
import { UpdateRoleDto } from '@app/roles/dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  public async getAll(): Promise<Role[]> {
    return this.roleRepository.find({
      relations: ['permissions', 'project'],
    });
  }

  public async getById(id: number): Promise<Role> {
    const role: Role | null = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions', 'project'],
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  public async create(payload: CreateRoleDto): Promise<Role> {
    const project: Project | null = await this.projectRepository.findOne({
      where: { id: payload.project },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const permissionList: Permission[] = [];

    if (payload.permissions && payload.permissions.length > 0) {
      for (const permissionId of payload.permissions) {
        const permission: Permission | null =
          await this.permissionRepository.findOne({
            where: { id: permissionId },
          });
        if (!permission) {
          throw new NotFoundException(
            `Permission with id ${permissionId} not found`,
          );
        }
        permissionList.push(permission);
      }
    }

    const newRole: Role = this.roleRepository.create({
      name: payload.name,
      project,
      permissions: permissionList,
    });
    return await this.roleRepository.save(newRole);
  }

  public async update(id: number, payload: UpdateRoleDto): Promise<Role> {
    const role: Role | null = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (payload.name) {
      role.name = payload.name;
    }

    if (payload.project) {
      const project: Project | null = await this.projectRepository.findOne({
        where: { id: payload.project },
      });
      if (!project) {
        throw new NotFoundException('Project not found');
      }
      role.project = project;
    }

    if (payload.permissions) {
      const permissionList: Permission[] = [];

      for (const permissionId of payload.permissions) {
        const permission: Permission | null =
          await this.permissionRepository.findOne({
            where: { id: permissionId },
          });
        if (!permission) {
          throw new NotFoundException(
            `Permission with id ${permissionId} not found`,
          );
        }
        permissionList.push(permission);
      }
      role.permissions = permissionList;
    }

    return await this.roleRepository.save(role);
  }

  public async delete(id: number): Promise<void> {
    const role = await this.getById(id);
    await this.roleRepository.remove(role);
  }
}
