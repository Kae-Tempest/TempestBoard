import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@shared/entities/User.entity';
import { Issue } from '@shared/entities/Issue.entity';
import { CreateCommentDto } from '@app/comments/dto/create-comment.dto';
import { UpdateCommentDto } from '@app/comments/dto/update-comment.dto';
import { Comment } from '@shared/entities/Comment.entity';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name);

  constructor(
    @InjectRepository(Issue)
    private readonly IssueRepository: Repository<Issue>,
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
    @InjectRepository(Comment)
    private readonly CommentRepository: Repository<Comment>,
  ) {}

  async getAllComments(): Promise<Comment[]> {
    this.logger.log('Getting all comments');
    try {
      const comments = await this.CommentRepository.find();
      this.logger.debug(`Retrieved ${comments.length} comments`);
      return comments;
    } catch (error) {
      this.logger.error(
        `Failed to get all comments: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  async getComment(id: number): Promise<Comment> {
    this.logger.log(`Getting comment with id: ${id}`);
    try {
      const comment = await this.CommentRepository.findOneBy({ id });
      if (!comment) {
        this.logger.warn(`Comment with id ${id} not found`);
        throw new NotFoundException('Comment Not Found');
      }
      this.logger.debug(`Retrieved comment with id: ${id}`);
      return comment;
    } catch (error) {
      this.logger.error(
        `Failed to get comment with id ${id}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  async getIssueComment(issueId: number): Promise<Comment[]> {
    this.logger.log(`Getting comments for issue id: ${issueId}`);
    try {
      const comments = await this.CommentRepository.findBy({
        issue: { id: issueId },
      });
      this.logger.debug(
        `Retrieved ${comments.length} comments for issue id: ${issueId}`,
      );
      return comments;
    } catch (error) {
      this.logger.error(
        `Failed to get comments for issue id ${issueId}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  async create(payload: CreateCommentDto): Promise<Comment> {
    this.logger.log(`Creating new comment for issue id: ${payload.issue}`);
    try {
      const issue = await this.IssueRepository.findOne({
        where: { id: payload.issue },
      });

      if (!issue) {
        this.logger.warn(`Issue with id ${payload.issue} not found`);
        throw new NotFoundException('Issue Not Found');
      }

      const creator = await this.UserRepository.findOne({
        where: { id: payload.creator },
      });

      if (!creator) {
        this.logger.warn(`Creator with id ${payload.creator} not found`);
        throw new NotFoundException('Creator Not Found');
      }

      let comment_parent: Comment | null = null;
      if (payload.comment_parent) {
        this.logger.debug(
          `Finding parent comment with id: ${payload.comment_parent}`,
        );
        comment_parent = await this.CommentRepository.findOne({
          where: { id: payload.comment_parent },
        });

        if (!comment_parent) {
          this.logger.warn(
            `Parent comment with id ${payload.comment_parent} not found`,
          );
        }
      }

      const comment: Partial<Comment> = {
        ...payload,
        issue,
        creator,
        comment_parent,
      };

      const newComment: Comment = this.CommentRepository.create(comment);
      const savedComment: Comment =
        await this.CommentRepository.save(newComment);
      this.logger.log(
        `Comment created successfully with id: ${savedComment.id}`,
      );
      return savedComment;
    } catch (error) {
      this.logger.error(
        `Failed to create comment: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  async update(id: number, payload: UpdateCommentDto): Promise<Comment> {
    this.logger.log(`Updating comment with id: ${id}`);
    try {
      const comment: Comment | null = await this.CommentRepository.findOne({
        where: { id },
      });

      if (!comment) {
        this.logger.warn(`Comment with id ${id} not found`);
        throw new NotFoundException('Comment Not Found');
      }

      const updatedComment: Partial<Comment> = {};

      if (payload.comment_parent) {
        this.logger.debug(
          `Finding parent comment with id: ${payload.comment_parent}`,
        );
        updatedComment.comment_parent = await this.CommentRepository.findOne({
          where: { id: payload.comment_parent },
        });

        if (!updatedComment.comment_parent) {
          this.logger.warn(
            `Parent comment with id ${payload.comment_parent} not found`,
          );
        }
      }

      if (payload.is_answer !== undefined) {
        this.logger.debug(`Updating is_answer flag to: ${payload.is_answer}`);
        updatedComment.is_answer = payload.is_answer;
      }

      if (payload.is_resolved !== undefined) {
        this.logger.debug(
          `Updating is_resolved flag to: ${payload.is_resolved}`,
        );
        updatedComment.is_resolved = payload.is_resolved;
      }

      if (payload.is_thread !== undefined) {
        this.logger.debug(`Updating is_thread flag to: ${payload.is_thread}`);
        updatedComment.is_thread = payload.is_thread;
      }

      if (payload.content) {
        this.logger.debug('Updating comment content');
        updatedComment.content = payload.content;
      }

      const result: Comment = await this.CommentRepository.save({
        ...comment,
        ...updatedComment,
      });

      this.logger.log(`Comment with id ${id} updated successfully`);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to update comment with id ${id}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Deleting comment with id: ${id}`);
    try {
      const result = await this.CommentRepository.delete(id);
      if (result.affected === 0) {
        this.logger.warn(`No comment found with id ${id} to delete`);
      } else {
        this.logger.log(`Comment with id ${id} deleted successfully`);
      }
    } catch (error) {
      this.logger.error(
        `Failed to delete comment with id ${id}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
