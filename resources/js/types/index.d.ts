import { SortableEvent } from "react-sortablejs";

export interface Issue {
    id: number;
    creator_id: number;
    assigned_id: number;
    project_id: number;
    ticket_id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    created_at: string;
    updated_at: string;
}

export interface Project {
    id: number;
    user_id: number;
    name: string;
    description: string;
    nb_user: number;
    thumbnail: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface Role {
    id: number;
    name: string;
    project_id: number;
    user_id: number;
}

export interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    thumbnail: string;
    created_at: string;
    updated_at: string;
}

interface IssueListDetailsProps {
    issueArray: Issue[];
    Projects: Project[];
}

interface IssueListDraggableProps {
    issueArray: Issue[];
    Projects: Project[];
    status: string;
    handleOnAdd: (e: SortableEvent, status: string) => void;
    setData: (key: string, value: string) => void;
}

interface IssueDetailsTemplateProps {
    issue: Issue;
    projects: Project[];
}

export type MyIssuesProps = {
    CreateIssues: Issue[];
    AssignedIssues: Issue[];
    Projects: Project[];
    User: User;
};

export type NavBarProps = {
    projects: Project[];
    user: User;
};

export type IssueModalProps = {
    projects: Project[];
    showModal: boolean;
    setShowModal: (showModal: boolean) => void;
    state?: string;
};

export type ProjectProps = {
    projects: Project[];
    user: User;
};
