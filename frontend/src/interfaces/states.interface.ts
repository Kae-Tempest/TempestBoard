import type { Issue } from "./issue.interface";

export interface States {
	id: number;
	project: string;
	name: string;
	issues: Issue;
	default: boolean;
	active: boolean;
	backlog: boolean;
	canceled: boolean;
	createdAt: Date;
	updatedAt: Date;
}
