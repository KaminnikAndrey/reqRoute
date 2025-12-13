// src/types/meeting.ts
export type MeetingStatus = 'состоялась' | 'перенесена' | 'отмена'

export interface MeetingPerson {
    id: number
    name: string
    role: string
    isPresent: boolean
    isLate?: boolean
    type: 'organizer' | 'participant'
}

export interface MeetingData {
    title: string
    teamName: string
    date: string
    time: string
    location: string
    link: string
    linkUrl: string
    status: MeetingStatus
    decisions: string
    comments: string
    people: MeetingPerson[]
}