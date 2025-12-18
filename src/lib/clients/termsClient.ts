// src/lib/clients/termsClient.ts
import { apiClient } from '../apiClient'
import type {
    TermRead,
    TermCreate,
    TermUpdate,
    PaginatedResponse
} from '../apiTypes'

export class TermsClient {
    /**
     * Получить список семестров
     */
    async list(params?: { page?: number; page_size?: number }): Promise<PaginatedResponse<TermRead>> {
        return apiClient.get<PaginatedResponse<TermRead>>('/terms/', { params })
    }

    /**
     * Получить семестр по ID
     */
    async getById(termId: number): Promise<TermRead> {
        return apiClient.get<TermRead>(`/terms/${termId}`)
    }

    /**
     * Создать новый семестр
     */
    async create(data: TermCreate): Promise<TermRead> {
        return apiClient.post<TermRead>('/terms/', data)
    }

    /**
     * Обновить семестр
     */
    async update(termId: number, data: TermUpdate): Promise<TermRead> {
        return apiClient.patch<TermRead>(`/terms/${termId}`, data)
    }

    /**
     * Удалить семестр
     */
    async delete(termId: number): Promise<void> {
        return apiClient.delete<void>(`/terms/${termId}`)
    }
}

export const termsClient = new TermsClient()










