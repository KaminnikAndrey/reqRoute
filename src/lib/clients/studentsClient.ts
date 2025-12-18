// src/lib/clients/studentsClient.ts
import { apiClient } from '../apiClient'
import type {
    StudentRead,
    StudentCreate,
    StudentUpdate,
    PaginatedResponse
} from '../apiTypes'

export class StudentsClient {
    /**
     * Получить список студентов
     */
    async list(params?: { page?: number; page_size?: number }): Promise<PaginatedResponse<StudentRead>> {
        return apiClient.get<PaginatedResponse<StudentRead>>('/students/', { params })
    }

    /**
     * Получить студента по ID
     */
    async getById(studentId: number): Promise<StudentRead> {
        return apiClient.get<StudentRead>(`/students/${studentId}`)
    }

    /**
     * Создать нового студента
     */
    async create(data: StudentCreate): Promise<StudentRead> {
        return apiClient.post<StudentRead>('/students/', data)
    }

    /**
     * Обновить студента
     */
    async update(studentId: number, data: StudentUpdate): Promise<StudentRead> {
        return apiClient.patch<StudentRead>(`/students/${studentId}`, data)
    }

    /**
     * Удалить студента
     */
    async delete(studentId: number): Promise<void> {
        return apiClient.delete<void>(`/students/${studentId}`)
    }
}

export const studentsClient = new StudentsClient()










