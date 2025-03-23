import type { Role } from "./role.interface";

export interface User {
	id: number;
	username: string;
	email: string;
	firstName?: string;
	lastName?: string;
	avatar?: string;
	roles: Role[];
	createdAt?: Date;
	updatedAt?: Date;
	admin: boolean;
}
