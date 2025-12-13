// src/lib/meetingApi.ts
import { MeetingData, MeetingStatus } from '@/types/meeting'

const API_MODE = process.env.NEXT_PUBLIC_API_MODE || 'mock'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class MeetingApiClient {
    // Моковые данные
    private mockMeetings: Map<number, MeetingData> = new Map()

    constructor() {
        this.initializeMockData()
    }

    private initializeMockData() {
        // Создаем мок-данные для встречи с ID 1
        this.mockMeetings.set(1, {
            title: 'Протокол встречи',
            teamName: 'Команда ReqRoute',
            date: 'Сегодня',
            time: '18:00–18:45',
            location: '(Екб)',
            link: 'Контур.Толк',
            linkUrl: 'kontur.ru/room/',
            status: 'состоялась',
            decisions: '',
            comments: '',
            people: [
                { id: 1, name: 'Иван Петров', role: 'Руководитель проекта', isPresent: true, type: 'organizer' },
                { id: 2, name: 'Иван Иван', role: 'Дизайнер', isPresent: true, type: 'organizer' },
                { id: 3, name: 'Мария Сидорова', role: 'Frontend разработчик', isPresent: true, isLate: true, type: 'participant' },
                { id: 4, name: 'Алексей Иванов', role: 'Backend разработчик', isPresent: true, isLate: false, type: 'participant' },
                { id: 5, name: 'Ольга Смирнова', role: 'Дизайнер', isPresent: false, isLate: false, type: 'participant' },
            ]
        })
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        // Мок-режим
        if (API_MODE === 'mock') {
            console.log(`📡 MOCK запрос встречи: ${options.method || 'GET'} ${endpoint}`)
            await this.delay(300)
            return this.handleMockRequest(endpoint, options) as T
        }

        // Реальный запрос
        const url = `${API_BASE_URL}${endpoint}`
        console.log(`🌐 REAL запрос встречи: ${url}`)

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            if (response.status === 204) {
                return null as T
            }

            return await response.json()
        } catch (error) {
            console.error('❌ API request failed:', error)
            throw error
        }
    }

    private handleMockRequest(endpoint: string, options: RequestInit): any {
        const method = options.method || 'GET'

        // GET /api/v1/meetings/{id}
        if (endpoint.match(/\/api\/v1\/meetings\/\d+$/) && method === 'GET') {
            const match = endpoint.match(/\/api\/v1\/meetings\/(\d+)$/)
            if (match) {
                const meetingId = parseInt(match[1])
                return this.mockMeetings.get(meetingId) || null
            }
        }

        // PUT /api/v1/meetings/{id}/status
        if (endpoint.match(/\/api\/v1\/meetings\/\d+\/status$/) && method === 'PUT') {
            const match = endpoint.match(/\/api\/v1\/meetings\/(\d+)\/status$/)
            if (match) {
                const meetingId = parseInt(match[1])
                const body = JSON.parse(options.body as string)
                const status = body.status as MeetingStatus

                const meeting = this.mockMeetings.get(meetingId)
                if (meeting) {
                    meeting.status = status
                    this.mockMeetings.set(meetingId, meeting)
                }

                return { success: true, status }
            }
        }

        // POST /api/v1/meetings/{id}/save
        if (endpoint.match(/\/api\/v1\/meetings\/\d+\/save$/) && method === 'POST') {
            const match = endpoint.match(/\/api\/v1\/meetings\/(\d+)\/save$/)
            if (match) {
                const meetingId = parseInt(match[1])
                const body = JSON.parse(options.body as string)
                const meetingData = body as MeetingData

                this.mockMeetings.set(meetingId, meetingData)
                return { success: true, meetingId }
            }
        }

        return { message: 'Mock response for meeting endpoint', endpoint }
    }

    // ============ PUBLIC API METHODS ============

    async getMeeting(meetingId: number): Promise<MeetingData> {
        return this.request<MeetingData>(`/api/v1/meetings/${meetingId}`)
    }

    async updateMeetingStatus(meetingId: number, status: MeetingStatus): Promise<{ success: boolean, status: MeetingStatus }> {
        return this.request<{ success: boolean, status: MeetingStatus }>(`/api/v1/meetings/${meetingId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        })
    }

    async saveMeeting(meetingId: number, meetingData: MeetingData): Promise<{ success: boolean, meetingId: number }> {
        return this.request<{ success: boolean, meetingId: number }>(`/api/v1/meetings/${meetingId}/save`, {
            method: 'POST',
            body: JSON.stringify(meetingData),
        })
    }
}

export const meetingApiClient = new MeetingApiClient()