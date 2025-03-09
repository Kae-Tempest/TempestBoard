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

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.usersService.findOneById(id);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, payload);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.usersService.delete(id);
  }

  @Post(':id/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    return this.usersService.updateThumbnail(id, file);
  }

  @Delete(':id/avatar')
  @UseGuards(JwtAuthGuard)
  async deleteAvatar(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.deleteThumbnail(id);
  }
}
