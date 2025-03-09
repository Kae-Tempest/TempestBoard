import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from '@app/roles/roles.service';
import { JwtAuthGuard } from '@core/auth/guards/jwt.guard';
import { Role } from '@shared/entities/Role.entity';
import { CreateRoleDto } from '@app/roles/dto/create-role.dto';
import { UpdateRoleDto } from '@app/roles/dto/update-role.dto';
import {
  PermissionsGuard,
  RequirePermissions,
} from '@core/auth/guards/permissions.guard';
import { ProjectAccessGuard } from '@core/auth/guards/project.guard';
import { Permission } from '@shared/enums/permissions.enum';

@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard, ProjectAccessGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('/')
  @RequirePermissions(Permission.ADMIN_ACCESS)
  async getAll(): Promise<Role[]> {
    return this.rolesService.getAll();
  }

  @Get('/:id')
  @RequirePermissions(Permission.MANAGE_PERMISSIONS)
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return this.rolesService.getById(id);
  }

  @Post('/')
  @RequirePermissions(Permission.CREATE_ROLE)
  async create(@Body() payload: CreateRoleDto): Promise<Role> {
    return this.rolesService.create(payload);
  }

  @Patch('/:id')
  @RequirePermissions(Permission.EDIT_ROLE)
  @RequirePermissions(Permission.MANAGE_PERMISSIONS)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.update(id, payload);
  }

  @Delete('/:id')
  @RequirePermissions(Permission.DELETE_ROLE)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.rolesService.delete(id);
  }
}
