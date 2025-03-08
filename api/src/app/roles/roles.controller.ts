import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from '@app/roles/roles.service';
import { JwtAuthGuard } from '@core/auth/guards/jwt.guard';
import { Role } from '@shared/entities/Role.entity';
import { CreateRoleDto } from '@app/roles/dto/create-role.dto';
import { UpdateRoleDto } from '@app/roles/dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getAll(): Promise<Role[]> {
    return this.rolesService.getAll();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getById(@Param('id') id: string): Promise<Role> {
    return this.rolesService.getById(parseInt(id));
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(@Body() payload: CreateRoleDto): Promise<Role> {
    return this.rolesService.create(payload);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.update(parseInt(id), payload);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string): Promise<void> {
    await this.rolesService.delete(parseInt(id));
  }
}
