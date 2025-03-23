import type { User } from "./user.interface";

export interface Project {
	id: number;
	name: string;
	owner: User;
	users: User[];
	description?: string;
	thumbnail?: string;
	createdAt?: Date;
	updatedAt?: Date;
}
