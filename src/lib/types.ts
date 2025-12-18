// lib/types.ts
// Типы на основе Swagger схемы
export interface UserRead {
    id: number
    full_name: string
    email: string
}

export interface CaseRead {
    id: number
    term_id: number
    user_id: number
    title: string
    description: string | null
    status: 'draft' | 'active' | 'voting in progress' | 'done'
}

export interface CaseCreate {
    term_id: number
    user_id: number
    title: string
    description?: string | null
    status?: 'draft' | 'active' | 'voting in progress' | 'done'
}

export interface CaseUpdate {
    title?: string | null
    description?: string | null
    status?: 'draft' | 'active' | 'voting in progress' | 'done' | null
}

export interface MeetingRead {
    id: number
    team_id: number
    previous_meeting_id: number | null
    recording_link: string | null
    date_time: string
    summary: string | null
}

export interface MeetingCreate {
    team_id: number
    previous_meeting_id?: number | null
    recording_link?: string | null
    date_time: string
    summary?: string | null
}

export interface PaginatedResponse<T> {
    total: number
    page: number
    page_size: number
    items: T[]
}

export interface AssignmentRead {
    id: number
    meeting_id: number
    text: string
    completed: boolean | null
}

export interface CheckpointRead {
    id: number
    team_id: number
    number: number
    date: string | null
    project_state: string | null
    mark: number
    video_link: string | null
    presentation_link: string | null
    university_mark: number | null
    university_comment: string | null
}

// Добавим типы для новых сущностей
export interface Meeting {
    id: number;
    team_id: number;
    previous_meeting_id: number | null;
    recording_link: string | null;
    date_time: string;
    summary: string | null;
}

export interface Team {
    id: number;
    title: string;
    case_id: number;
    workspace_link: string | null;
    final_mark: number | null;
}

export interface Student {
    id: number;
    full_name: string;
}

export interface TeamMembership {
    id: number;
    student_id: number;
    team_id: number;
    role: string | null;
    group: string;
}

export interface Case {
    id: number;
    term_id: number;
    user_id: number;
    title: string;
    description: string | null;
    status: 'draft' | 'active' | 'voting in progress' | 'done';
}
// ... добавьте другие типы по необходимости