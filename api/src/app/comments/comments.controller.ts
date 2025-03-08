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
import { CommentsService } from '@app/comments/comments.service';
import { JwtAuthGuard } from '@core/auth/guards/jwt.guard';
import { Comment } from '@shared/entities/Comment.entity';
import { CreateCommentDto } from '@app/comments/dto/create-comment.dto';
import { UpdateCommentDto } from '@app/comments/dto/update-comment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Comment[]> {
    return await this.commentsService.getAllComments();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<Comment> {
    return await this.commentsService.getComment(parseInt(id));
  }

  @Get('/issues/:issueId')
  @UseGuards(JwtAuthGuard)
  async findByIssue(@Param('issueId') issueId: string): Promise<Comment[]> {
    return await this.commentsService.getIssueComment(parseInt(issueId));
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(@Body() payload: CreateCommentDto): Promise<Comment> {
    return await this.commentsService.create(payload);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateCommentDto,
  ): Promise<Comment> {
    return await this.commentsService.update(parseInt(id), payload);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string): Promise<void> {
    return await this.commentsService.delete(parseInt(id));
  }
}
