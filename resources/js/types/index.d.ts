export interface Issue {
    id: number;
    creator_id: number;
    assigned_id: number;
    project_id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
}

export interface Project {
    id: number;
    user_id: number;
    name: string;
    description: string;
    nb_user: number;
    thumbnail: string;
    status: string;
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
