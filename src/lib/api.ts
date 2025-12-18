// src/lib/api.ts
import { API_CONFIG } from '@/config/api'

// Базовый клиент
const apiClient = {
    async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = API_CONFIG.getFullUrl(endpoint)

        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers,
            },
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
            throw new Error(error.detail || `HTTP error! status: ${response.status}`)
        }

        return response.json()
    },

    get<T>(endpoint: string, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET', ...options })
    },

    post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        })
    },

    put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        })
    },

    patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        })
    },

    delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE', ...options })
    },
}

// Клиент с авторизацией
export const authApiClient = {
    ...apiClient,

    async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        // Получаем auth header из localStorage
        const authHeader = localStorage.getItem('auth_header')

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers,
        }

        if (authHeader) {
            headers['Authorization'] = authHeader
        }

        return apiClient.request<T>(endpoint, { ...options, headers })
    }
}

export default apiClient