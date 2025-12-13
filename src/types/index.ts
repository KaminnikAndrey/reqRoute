// src/types/index.ts
export interface CaseFromApi {
    id: number
    term_id: number
    user_id: number
    title: string
    description: string | null
    status: 'draft' | 'active' | 'voting in progress' | 'done'
    likes_count?: number
    dislikes_count?: number
    created_at?: string
    updated_at?: string
}

export interface Comment {
    id: number
    author: string
    text: string
    timestamp: string
}

export interface CaseForUI {
    id: number
    caseName: string
    track: string
    author: string
    status: string
    description: string
    currentRating: number
    passingThreshold: number
    likes: number
    dislikes: number
    stage: string
    comments: Comment[]
    userVote?: 'like' | 'dislike' | null
}

export interface PaginatedResponse<T> {
    total: number
    page: number
    page_size: number
    items: T[]
}

export interface VoteRequest {
    vote: 'like' | 'dislike'
}

export interface CommentRequest {
    text: string
}

export interface CommentFromApi {
    id: number
    case_id: number
    user_id: number
    text: string
    author_name?: string
    created_at: string
}

export interface VoteResponse {
    case_id: number
    total_likes: number
    total_dislikes: number
    user_vote: 'like' | 'dislike' | null
}