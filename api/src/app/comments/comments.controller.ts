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
import { CommentsService } from '@app/comments/comments.service';
import { JwtAuthGuard } from '@core/auth/guards/jwt.guard';
import { Comment } from '@shared/entities/Comment.entity';
import { CreateCommentDto } from '@app/comments/dto/create-comment.dto';
import { UpdateCommentDto } from '@app/comments/dto/update-comment.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  PermissionsGuard,
  RequirePermissions,
} from '@core/auth/guards/permissions.guard';
import { ProjectAccessGuard } from '@core/auth/guards/project.guard';
import { Permission } from '@shared/enums/permissions.enum';

@ApiTags('Comments')
@Controller('comments')
@UseGuards(JwtAuthGuard, PermissionsGuard, ProjectAccessGuard)
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get('/')
  @RequirePermissions(Permission.ADMIN_ACCESS)
  async findAll(): Promise<Comment[]> {
    return await this.commentsService.getAllComments();
  }

  @Get('/:id')
  @RequirePermissions(Permission.VIEW_COMMENT)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Comment> {
    return await this.commentsService.getComment(id);
  }

  @Get('/issues/:issueId')
  @RequirePermissions(Permission.VIEW_COMMENT)
  async findByIssue(
    @Param('issueId', ParseIntPipe) issueId: number,
  ): Promise<Comment[]> {
    return await this.commentsService.getIssueComment(issueId);
  }

  @Post('/')
  @RequirePermissions(Permission.CREATE_COMMENT)
  async create(@Body() payload: CreateCommentDto): Promise<Comment> {
    return await this.commentsService.create(payload);
  }

  @Patch('/:id')
  @RequirePermissions(Permission.EDIT_COMMENT)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateCommentDto,
  ): Promise<Comment> {
    return await this.commentsService.update(id, payload);
  }

  @Delete('/:id')
  @RequirePermissions(Permission.DELETE_COMMENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.commentsService.delete(id);
  }
}
