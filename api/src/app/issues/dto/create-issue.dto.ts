export class CreateIssueDto {
  creator: number;
  assigned: number;
  project: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  tags?: string[];
}
