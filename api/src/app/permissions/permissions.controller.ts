import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { Permission } from '@shared/entities/Permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { JwtAuthGuard } from '@core/auth/guards/jwt.guard';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getAll(): Promise<Permission[]> {
    return this.permissionsService.getAll();
  }

  @Get(':id')
  public async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Permission> {
    return this.permissionsService.getById(id);
  }

  @Post()
  public async create(
    @Body() payload: CreatePermissionDto,
  ): Promise<Permission> {
    return this.permissionsService.create(payload);
  }

  @Put(':id')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdatePermissionDto,
  ): Promise<Permission> {
    return this.permissionsService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(204)
  public async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.permissionsService.delete(id);
  }
}
