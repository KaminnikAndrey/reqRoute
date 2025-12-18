// src/lib/clients/membershipsClient.ts
import { apiClient } from '../apiClient'
import type {
    TeamMembershipRead,
    TeamMembershipCreate,
    TeamMembershipUpdate,
    PaginatedResponse
} from '../apiTypes'

export class MembershipsClient {
    /**
     * Получить список членств в командах
     */
    async list(params?: { page?: number; page_size?: number }): Promise<PaginatedResponse<TeamMembershipRead>> {
        return apiClient.get<PaginatedResponse<TeamMembershipRead>>('/memberships/', { params })
    }

    /**
     * Получить членство по ID
     */
    async getById(membershipId: number): Promise<TeamMembershipRead> {
        return apiClient.get<TeamMembershipRead>(`/memberships/${membershipId}`)
    }

    /**
     * Создать новое членство
     */
    async create(data: TeamMembershipCreate): Promise<TeamMembershipRead> {
        return apiClient.post<TeamMembershipRead>('/memberships/', data)
    }

    /**
     * Обновить членство
     */
    async update(membershipId: number, data: TeamMembershipUpdate): Promise<TeamMembershipRead> {
        return apiClient.patch<TeamMembershipRead>(`/memberships/${membershipId}`, data)
    }

    /**
     * Удалить членство
     */
    async delete(membershipId: number): Promise<void> {
        return apiClient.delete<void>(`/memberships/${membershipId}`)
    }
}

export const membershipsClient = new MembershipsClient()










