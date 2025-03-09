import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { Permission } from '@shared/entities/Permission.entity';
import { Permission as Perm } from '@shared/enums/permissions.enum';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { JwtAuthGuard } from '@core/auth/guards/jwt.guard';
import {
  PermissionsGuard,
  RequirePermissions,
} from '@core/auth/guards/permissions.guard';
import { ProjectAccessGuard } from '@core/auth/guards/project.guard';

@Controller('permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard, ProjectAccessGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @RequirePermissions(Perm.MANAGE_PERMISSIONS)
  public async getAll(): Promise<Permission[]> {
    return this.permissionsService.getAll();
  }

  @Get(':id')
  @RequirePermissions(Perm.MANAGE_PERMISSIONS)
  public async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Permission> {
    return this.permissionsService.getById(id);
  }

  @Post()
  @RequirePermissions(Perm.ADMIN_ACCESS)
  public async create(
    @Body() payload: CreatePermissionDto,
  ): Promise<Permission> {
    return this.permissionsService.create(payload);
  }

  @Put(':id')
  @RequirePermissions(Perm.ADMIN_ACCESS)
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdatePermissionDto,
  ): Promise<Permission> {
    return this.permissionsService.update(id, payload);
  }

  @Delete(':id')
  @RequirePermissions(Perm.ADMIN_ACCESS)
  public async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.permissionsService.delete(id);
  }
}
