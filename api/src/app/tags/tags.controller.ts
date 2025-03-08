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
import { TagsService } from '@app/tags/tags.service';
import { JwtAuthGuard } from '@core/auth/guards/jwt.guard';
import { Tag } from '@shared/entities/Tag.entity';
import { CreateTagDto } from '@app/tags/dto/create-tag.dto';
import { UpdateTagDto } from '@app/tags/dto/update-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  public async getTags(): Promise<Tag[]> {
    return this.tagService.getAll();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  public async getTag(@Param('id') id: string): Promise<Tag> {
    return this.tagService.getOne(parseInt(id));
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  public async create(@Body() payload: CreateTagDto): Promise<Tag> {
    return this.tagService.create(payload);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  public async update(
    @Param('id') id: string,
    @Body() payload: UpdateTagDto,
  ): Promise<Tag> {
    return this.tagService.update(parseInt(id), payload);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  public async delete(@Param('id') id: string): Promise<void> {
    await this.tagService.delete(parseInt(id));
  }
}
