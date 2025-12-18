// src/lib/clients/assignmentsClient.ts
import { apiClient } from '../apiClient'
import type {
    AssignmentRead,
    AssignmentCreate,
    AssignmentUpdate,
    PaginatedResponse
} from '../apiTypes'

export class AssignmentsClient {
    /**
     * Получить список поручений
     */
    async list(params?: { page?: number; page_size?: number }): Promise<PaginatedResponse<AssignmentRead>> {
        return apiClient.get<PaginatedResponse<AssignmentRead>>('/assignments/', { params })
    }

    /**
     * Получить поручение по ID
     */
    async getById(assignmentId: number): Promise<AssignmentRead> {
        return apiClient.get<AssignmentRead>(`/assignments/${assignmentId}`)
    }

    /**
     * Создать новое поручение
     */
    async create(data: AssignmentCreate): Promise<AssignmentRead> {
        return apiClient.post<AssignmentRead>('/assignments/', data)
    }

    /**
     * Обновить поручение
     */
    async update(assignmentId: number, data: AssignmentUpdate): Promise<AssignmentRead> {
        return apiClient.patch<AssignmentRead>(`/assignments/${assignmentId}`, data)
    }

    /**
     * Удалить поручение
     */
    async delete(assignmentId: number): Promise<void> {
        return apiClient.delete<void>(`/assignments/${assignmentId}`)
    }
}

export const assignmentsClient = new AssignmentsClient()










