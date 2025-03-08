export class CreateMilestoneDto {
  name: string;
  project: number;
  description?: string;
  start_date: Date;
  delivery_date?: Date;
}
