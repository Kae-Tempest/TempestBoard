import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
  async getOne(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOneById(parseInt(id));
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(parseInt(id), payload);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteOne(@Param('id') id: string): Promise<User> {
    return await this.usersService.delete(parseInt(id));
  }

  @Post(':userId/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    return this.usersService.updateThumbnail(parseInt(userId), file);
  }

  @Delete(':userId/avatar')
  @UseGuards(JwtAuthGuard)
  async deleteAvatar(@Param('userId') userId: string): Promise<User> {
    return this.usersService.deleteThumbnail(parseInt(userId));
  }
}
