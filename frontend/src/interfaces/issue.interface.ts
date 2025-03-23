import type { Milestone } from "./milestone.interface";
import type { Tag } from "./tag.interface";

export interface Issue {
	id: number;
	creator: string;
	assignee: string;
	project: string;
	projectTag: string;
	ticketId: number;
	title: string;
	description?: string;
	priority: string;
	state: string;
	tags: Tag[];
	milestone?: Milestone;
	attachment?: string;
	createdAt: Date;
	updatedAt: Date;
}
