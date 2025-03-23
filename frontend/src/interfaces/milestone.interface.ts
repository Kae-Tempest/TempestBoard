export interface Milestone {
  id: number;
  name: string;
  project: string;
  issues: string[];
  description: string;
  startDate: Date;
  deliveryDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
