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
import { TagsService } from '@app/tags/tags.service';
import { JwtAuthGuard } from '@core/auth/guards/jwt.guard';
import { Tag } from '@shared/entities/Tag.entity';
import { CreateTagDto } from '@app/tags/dto/create-tag.dto';
import { UpdateTagDto } from '@app/tags/dto/update-tag.dto';
import {
  PermissionsGuard,
  RequirePermissions,
} from '@core/auth/guards/permissions.guard';
import { ProjectAccessGuard } from '@core/auth/guards/project.guard';
import { Permission } from '@shared/enums/permissions.enum';

@Controller('tags')
@UseGuards(JwtAuthGuard, PermissionsGuard, ProjectAccessGuard)
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Get('/')
  @RequirePermissions(Permission.ADMIN_ACCESS)
  public async getTags(): Promise<Tag[]> {
    return this.tagService.getAll();
  }

  @Get('/:id')
  @RequirePermissions(Permission.ADMIN_ACCESS)
  public async getTag(@Param('id', ParseIntPipe) id: number): Promise<Tag> {
    return this.tagService.getOne(id);
  }

  @Post('/')
  @RequirePermissions(Permission.CREATE_TAG)
  public async create(@Body() payload: CreateTagDto): Promise<Tag> {
    return this.tagService.create(payload);
  }

  @Patch('/:id')
  @RequirePermissions(Permission.EDIT_TAG)
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateTagDto,
  ): Promise<Tag> {
    return this.tagService.update(id, payload);
  }

  @Delete('/:id')
  @RequirePermissions(Permission.DELETE_TAG)
  public async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.tagService.delete(id);
  }
}
