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
    creator: number;
    assigned: number;
    project: number;
    ticket_id: number;
    title: string;
    description: string;
    priority: string;
    status: string;
    tags: [];
    created_at: Date;
    updated_at: Date;
}