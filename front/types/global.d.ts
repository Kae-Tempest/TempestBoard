export type User = {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    thumbnail: string;
    created_at: Date;
    updated_at: Date;
}

export type Project = {
    id: number;
    creator: number;
    name: string;
    description: string;
    thumbnail: string;
    status: string;
    users: number[]
    created_at: Date;
    updated_at: Date;
}

export type Issue = {
    id: number;
    creator: User;
    assigned: User;
    project: number;
    project_tag: string;
    ticket_id: number;
    title: string;
    description: string;
    priority: string;
    status: string;
    tags: [];
    milestones: string;
    attachment: string;
    created_at: Date;
    updated_at: Date;
}

export type States = {
    id: number;
    name: string;
    project: number;
    is_default: Boolean;
    created_at: Date;
    updated_at: Date;
}

export type Tags = {
    id: number;
    name: string;
    project: number;
}

export type Activity = {
    id: number;
    type: string;
    issue: number;
    user: number;
    content: string;
    created_at: Date;
    updated_at: Date;
}

export type Comment = {
    id: number;
    issue: number;
    user: number;
    content: string;
    is_answer: boolean;
    comment_parent?: number;
    is_thread: boolean;
    is_resolved: boolean;
    attachment: string;
    created_at: Date;
    updated_at: Date | string;
}

export enum ActivityContent {
    CREATE_ISSUE = "create_issue",
    EDIT_TITLE = "edit_title",
    EDIT_DESCRIPTION = "edit_description",
    EDIT_STATUS = "edit_status",
    EDIT_PRIORITY = "edit_priority",
    EDIT_TAG = "edit_tag",
    EDIT_MILESTONE = "edit_milestone",
    EDIT_LABEL = "edit_label", // TODO : ADD LABELS TO ISSUE AND CREATE LABEL CRUD (P2)
    ASSIGNED_TO = "assigned_to", // TODO: REVIEW ISSUE MODEL FOR THIS (P2)

}