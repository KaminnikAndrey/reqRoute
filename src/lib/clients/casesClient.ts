// src/lib/clients/casesClient.ts
import { apiClient } from '../apiClient'
import type {
    CaseRead,
    CaseCreate,
    CaseUpdate,
    PaginatedResponse
} from '../apiTypes'

export class CasesClient {
    /**
     * Получить список кейсов
     */
    async list(params?: { page?: number; page_size?: number }): Promise<PaginatedResponse<CaseRead>> {
        return apiClient.get<PaginatedResponse<CaseRead>>('/cases/', { params })
    }

    /**
     * Получить кейс по ID
     */
    async getById(caseId: number): Promise<CaseRead> {
        return apiClient.get<CaseRead>(`/cases/${caseId}`)
    }

    /**
     * Создать новый кейс
     */
    async create(data: CaseCreate): Promise<CaseRead> {
        return apiClient.post<CaseRead>('/cases/', data)
    }

    /**
     * Обновить кейс
     */
    async update(caseId: number, data: CaseUpdate): Promise<CaseRead> {
        return apiClient.patch<CaseRead>(`/cases/${caseId}`, data)
    }

    /**
     * Удалить кейс
     */
    async delete(caseId: number): Promise<void> {
        return apiClient.delete<void>(`/cases/${caseId}`)
    }
}

export const casesClient = new CasesClient()










