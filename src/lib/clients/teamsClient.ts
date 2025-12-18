// src/lib/clients/teamsClient.ts
import { apiClient } from '../apiClient'
import type {
    TeamRead,
    TeamCreate,
    TeamUpdate,
    PaginatedResponse
} from '../apiTypes'

export class TeamsClient {
    /**
     * Получить список команд
     */
    async list(params?: { page?: number; page_size?: number }): Promise<PaginatedResponse<TeamRead>> {
        return apiClient.get<PaginatedResponse<TeamRead>>('/teams/', { params })
    }

    /**
     * Получить команду по ID
     */
    async getById(teamId: number): Promise<TeamRead> {
        return apiClient.get<TeamRead>(`/teams/${teamId}`)
    }

    /**
     * Создать новую команду
     */
    async create(data: TeamCreate): Promise<TeamRead> {
        return apiClient.post<TeamRead>('/teams/', data)
    }

    /**
     * Обновить команду
     */
    async update(teamId: number, data: TeamUpdate): Promise<TeamRead> {
        return apiClient.patch<TeamRead>(`/teams/${teamId}`, data)
    }

    /**
     * Удалить команду
     */
    async delete(teamId: number): Promise<void> {
        return apiClient.delete<void>(`/teams/${teamId}`)
    }
}

export const teamsClient = new TeamsClient()










