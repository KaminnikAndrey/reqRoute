// src/lib/clients/meetingsClient.ts
import { apiClient } from '../apiClient'
import type {
    MeetingRead,
    MeetingCreate,
    MeetingUpdate,
    MeetingUserCreate,
    MeetingUserRead,
    MeetingScheduleRead,
    MeetingScheduleCreate,
    MeetingScheduleUpdate,
    PaginatedResponse
} from '../apiTypes'

export class MeetingsClient {
    /**
     * Получить список встреч
     */
    async list(params?: { page?: number; page_size?: number }): Promise<PaginatedResponse<MeetingRead>> {
        return apiClient.get<PaginatedResponse<MeetingRead>>('/meetings/', { params })
    }

    /**
     * Получить встречу по ID
     */
    async getById(meetingId: number): Promise<MeetingRead> {
        return apiClient.get<MeetingRead>(`/meetings/${meetingId}`)
    }

    /**
     * Создать новую встречу
     */
    async create(data: MeetingCreate): Promise<MeetingRead> {
        return apiClient.post<MeetingRead>('/meetings/', data)
    }

    /**
     * Обновить встречу
     */
    async update(meetingId: number, data: MeetingUpdate): Promise<MeetingRead> {
        return apiClient.patch<MeetingRead>(`/meetings/${meetingId}`, data)
    }

    /**
     * Удалить встречу
     */
    async delete(meetingId: number): Promise<void> {
        return apiClient.delete<void>(`/meetings/${meetingId}`)
    }

    /**
     * Получить предыдущие встречи (по meeting_id)
     */
    async getPrevious(meetingId: number): Promise<MeetingRead[]> {
        return apiClient.get<MeetingRead[]>(`/meetings/previous/${meetingId}`)
    }

    /**
     * Добавить связь пользователя с встречей
     */
    async addUserLink(data: MeetingUserCreate): Promise<MeetingUserRead> {
        return apiClient.post<MeetingUserRead>('/meetings/user-link/', data)
    }

    /**
     * Получить расписание для команды
     */
    async getSchedule(teamId: number): Promise<MeetingScheduleRead> {
        return apiClient.get<MeetingScheduleRead>(`/meetings/schedule/team/${teamId}`)
    }

    /**
     * Создать расписание
     */
    async createSchedule(data: MeetingScheduleCreate): Promise<MeetingScheduleRead> {
        return apiClient.post<MeetingScheduleRead>('/meetings/schedule/', data)
    }

    /**
     * Обновить расписание
     */
    async updateSchedule(scheduleId: number, data: MeetingScheduleUpdate): Promise<MeetingScheduleRead> {
        return apiClient.patch<MeetingScheduleRead>(`/meetings/schedule/${scheduleId}`, data)
    }
}

export const meetingsClient = new MeetingsClient()










