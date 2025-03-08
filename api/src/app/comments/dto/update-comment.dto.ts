import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from '@app/comments/dto/create-comment.dto';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  id: number;
  is_answer: boolean;
  is_thread: boolean;
  is_resolved: boolean;
}
