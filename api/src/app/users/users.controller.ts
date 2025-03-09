import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@core/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@shared/entities/User.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  PermissionsGuard,
  RequirePermissions,
} from '@core/auth/guards/permissions.guard';
import { ProjectAccessGuard } from '@core/auth/guards/project.guard';
import { Permission } from '@shared/enums/permissions.enum';

@ApiTags('Users')
@UseGuards(JwtAuthGuard, PermissionsGuard, ProjectAccessGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @RequirePermissions(Permission.ADMIN_ACCESS)
  async getAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get('/:id')
  @RequirePermissions(Permission.VIEW_USERS)
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.usersService.findOneById(id);
  }

  @Patch('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, payload);
  }

  @Delete('/:id')
  async deleteOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.usersService.delete(id);
  }

  @Post(':id/avatar')
  @RequirePermissions(Permission.UPLOAD_ATTACHMENT)
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    return this.usersService.updateThumbnail(id, file);
  }

  @Delete(':id/avatar')
  @RequirePermissions(Permission.DELETE_ATTACHMENT)
  async deleteAvatar(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.deleteThumbnail(id);
  }
}
