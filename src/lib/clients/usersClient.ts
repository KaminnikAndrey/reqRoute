// src/lib/clients/usersClient.ts
import { apiClient } from '../apiClient'
import type {
    UserRead,
    UserCreate,
    UserUpdate,
    PaginatedResponse
} from '../apiTypes'

export class UsersClient {
    /**
     * Получить список пользователей
     */
    async list(params?: { page?: number; page_size?: number }): Promise<PaginatedResponse<UserRead>> {
        return apiClient.get<PaginatedResponse<UserRead>>('/users/', { params })
    }

    /**
     * Получить пользователя по ID
     */
    async getById(userId: number): Promise<UserRead> {
        return apiClient.get<UserRead>(`/users/${userId}`)
    }

    /**
     * Создать нового пользователя
     */
    async create(data: UserCreate): Promise<UserRead> {
        return apiClient.post<UserRead>('/users/', data)
    }

    /**
     * Обновить пользователя
     */
    async update(userId: number, data: UserUpdate): Promise<UserRead> {
        return apiClient.patch<UserRead>(`/users/${userId}`, data)
    }

    /**
     * Удалить пользователя
     */
    async delete(userId: number): Promise<void> {
        return apiClient.delete<void>(`/users/${userId}`)
    }
}

export const usersClient = new UsersClient()










