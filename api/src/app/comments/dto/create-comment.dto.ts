export class CreateCommentDto {
  issue: number;
  creator: number;
  content: string;
  comment_parent?: number;
}
