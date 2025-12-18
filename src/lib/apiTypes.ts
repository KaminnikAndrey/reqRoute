// src/lib/apiTypes.ts
// Типы на основе Swagger спецификации API

// ==================== Common Types ====================
export interface PaginatedResponse<T> {
    total: number
    page: number
    page_size: number
    items: T[]
}

export interface ValidationError {
    loc: (string | number)[]
    msg: string
    type: string
}

export interface HTTPValidationError {
    detail: ValidationError[]
}

// ==================== Enums ====================
export type CaseStatus = 'draft' | 'active' | 'voting in progress' | 'done'
export type SeasonEnum = 'autumn' | 'spring'

// ==================== User Types ====================
export interface UserRead {
    id: number
    full_name: string
    email: string
}

export interface UserCreate {
    full_name: string
    email: string
    password: string
}

export interface UserUpdate {
    full_name?: string | null
    email?: string | null
}

// Для авторизации
export interface UserLogin {
    email: string
    password: string
}

export interface LoginResponse {
    access_token: string
}

// ==================== Term Types ====================
export interface TermRead {
    id: number
    start_date: string | null
    end_date: string | null
    year: number
    season: SeasonEnum
}

export interface TermCreate {
    start_date?: string | null
    end_date?: string | null
    year: number
    season: SeasonEnum
}

export interface TermUpdate {
    start_date?: string | null
    end_date?: string | null
    year?: number | null
    season?: SeasonEnum | null
}

// ==================== Case Types ====================
export interface CaseRead {
    id: number
    term_id: number
    user_id: number
    title: string
    description: string | null
    status: CaseStatus
}

export interface CaseCreate {
    term_id: number
    user_id: number
    title: string
    description?: string | null
    status?: CaseStatus
}

export interface CaseUpdate {
    title?: string | null
    description?: string | null
    status?: CaseStatus | null
}

// ==================== Team Types ====================
export interface TeamRead {
    id: number
    title: string
    case_id: number
    workspace_link: string | null
    final_mark: number | null
}

export interface TeamCreate {
    title: string
    case_id: number
    workspace_link?: string | null
    final_mark?: number | null
}

export interface TeamUpdate {
    title?: string | null
    case_id?: number | null
    workspace_link?: string | null
    final_mark?: number | null
}

// ==================== Student Types ====================
export interface StudentRead {
    id: number
    full_name: string
}

export interface StudentCreate {
    full_name: string
}

export interface StudentUpdate {
    full_name: string
}

// ==================== Team Membership Types ====================
export interface TeamMembershipRead {
    id: number
    student_id: number
    team_id: number
    role: string | null
    group: string
}

export interface TeamMembershipCreate {
    student_id: number
    team_id: number
    role: string | null  // Обязательное поле, но может быть null
    group: string
}

export interface TeamMembershipUpdate {
    student_id?: number | null
    team_id?: number | null
    role?: string | null
    group?: string | null
}

// ==================== Meeting Types ====================
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

export interface MeetingUpdate {
    summary?: string | null
    recording_link?: string | null
    date_time?: string | null
}

// ==================== Meeting User Link Types ====================
export interface MeetingUserCreate {
    meeting_id: number
    user_id: number
}

export interface MeetingUserRead {
    id: number
    meeting_id: number
    user_id: number
}

// ==================== Meeting Schedule Types ====================
export interface MeetingScheduleRead {
    id: number
    team_id: number
    start_date: string
    day_of_week: number // 0=Monday, 6=Sunday
    time: string
    interval_weeks: number // 1 or 2 weeks
    active: boolean
}

export interface MeetingScheduleCreate {
    team_id: number
    start_date: string
    day_of_week: number // 0=Monday, 6=Sunday
    time: string
    interval_weeks: number // 1 or 2 weeks
    active?: boolean
}

export interface MeetingScheduleUpdate {
    start_date?: string | null
    day_of_week?: number | null
    time?: string | null
    interval_weeks?: number | null
    active?: boolean | null
}

// ==================== Assignment Types ====================
export interface AssignmentRead {
    id: number
    meeting_id: number
    text: string
    completed: boolean | null
}

export interface AssignmentCreate {
    meeting_id: number
    text: string
    completed?: boolean | null
}

export interface AssignmentUpdate {
    text?: string | null
    completed?: boolean | null
}

// ==================== Checkpoint Types ====================
export interface CheckpointRead {
    id: number
    team_id: number
    number: number // 1-3
    date: string | null
    project_state: string | null
    mark: number
    video_link: string | null
    presentation_link: string | null
    university_mark: number | null
    university_comment: string | null
}

export interface CheckpointCreate {
    team_id: number
    number: number // 1-3
    date?: string | null
    project_state?: string | null
    mark: number
    video_link?: string | null
    presentation_link?: string | null
    university_mark?: number | null
    university_comment?: string | null
}

export interface CheckpointUpdate {
    date?: string | null
    project_state?: string | null
    mark?: number | null
    video_link?: string | null
    presentation_link?: string | null
    university_mark?: number | null
    university_comment?: string | null
}








