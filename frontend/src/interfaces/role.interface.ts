import type { Permission } from "./permission.interface";
import type { Project } from "./project.interface";

export interface Role {
	id: number;
	name: string;
	project: Project;
	users: string[];
	permissions: Permission[];
	createdAt: Date;
	updatedAt: Date;
}
