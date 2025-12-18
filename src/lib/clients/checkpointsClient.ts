// src/lib/clients/checkpointsClient.ts
import { apiClient } from '../apiClient'
import type {
    CheckpointRead,
    CheckpointCreate,
    CheckpointUpdate,
    PaginatedResponse
} from '../apiTypes'

export class CheckpointsClient {
    /**
     * Получить список контрольных точек
     */
    async list(params?: { page?: number; page_size?: number }): Promise<PaginatedResponse<CheckpointRead>> {
        return apiClient.get<PaginatedResponse<CheckpointRead>>('/checkpoints/', { params })
    }

    /**
     * Получить контрольную точку по ID
     */
    async getById(checkpointId: number): Promise<CheckpointRead> {
        return apiClient.get<CheckpointRead>(`/checkpoints/${checkpointId}`)
    }

    /**
     * Создать новую контрольную точку
     */
    async create(data: CheckpointCreate): Promise<CheckpointRead> {
        return apiClient.post<CheckpointRead>('/checkpoints/', data)
    }

    /**
     * Обновить контрольную точку
     */
    async update(checkpointId: number, data: CheckpointUpdate): Promise<CheckpointRead> {
        return apiClient.patch<CheckpointRead>(`/checkpoints/${checkpointId}`, data)
    }

    /**
     * Удалить контрольную точку
     */
    async delete(checkpointId: number): Promise<void> {
        return apiClient.delete<void>(`/checkpoints/${checkpointId}`)
    }
}

export const checkpointsClient = new CheckpointsClient()










