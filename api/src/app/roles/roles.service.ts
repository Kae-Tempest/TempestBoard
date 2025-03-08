import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@shared/entities/Role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@shared/entities/User.entity';
import { Project } from '@shared/entities/Project.entity';
import { CreateRoleDto } from '@app/roles/dto/create-role.dto';
import { UpdateRoleDto } from '@app/roles/dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  public async getAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  public async getById(id: number): Promise<Role> {
    const role: Role | null = await this.roleRepository.findOne({
      where: { id },
    });
    if (!role) {
      throw new NotFoundException();
    }

    return role;
  }

  public async create(payload: CreateRoleDto): Promise<Role> {
    const project: Project | null = await this.projectRepository.findOne({
      where: { id: payload.project },
    });

    if (!project) {
      throw new NotFoundException();
    }

    const userList: User[] = [];

    for (const userId of payload.users) {
      const user: User | null = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException();
      }
      userList.push(user);
    }

    const newRole: Role = this.roleRepository.create({
      ...payload,
      project,
      users: userList,
    });
    return await this.roleRepository.save(newRole);
  }

  public async update(id: number, payload: UpdateRoleDto): Promise<Role> {
    const role: Role | null = await this.roleRepository.findOne({
      where: { id },
    });

    if (!Role) {
      throw new NotFoundException();
    }

    const updatedRole: Partial<Role> = {};

    if (payload.project) {
      const project: Project | null = await this.projectRepository.findOne({
        where: { id: payload.project },
      });
      if (!project) {
        throw new NotFoundException();
      }
      updatedRole.project = project;
    }

    if (payload.users) {
      const userList: User[] = [];

      for (const userId of payload.users) {
        const user: User | null = await this.userRepository.findOne({
          where: { id: userId },
        });
        if (!user) {
          throw new NotFoundException();
        }
        userList.push(user);
      }
      updatedRole.users = userList;
    }

    return await this.roleRepository.save({
      ...role,
      ...updatedRole,
    });
  }

  public async delete(id: number): Promise<void> {
    await this.roleRepository.delete(id);
  }
}
