import { PartialType } from '@nestjs/mapped-types';
import { CreateIssueDto } from '@app/issues/dto/create-issue.dto';

export class UpdateIssueDto extends PartialType(CreateIssueDto) {
  id: number;
  project_tag: string;
  milestones: number;
}
