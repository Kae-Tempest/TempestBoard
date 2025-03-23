export interface Permission {
  id: number;
  name: string;
  description: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}
