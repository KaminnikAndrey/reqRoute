// src/lib/apiClient.ts
// Базовый API клиент с поддержкой авторизации
import { API_CONFIG } from '@/config/api'

interface RequestOptions extends RequestInit {
    params?: Record<string, any>
}

class ApiClient {
    private buildUrl(endpoint: string, params?: Record<string, any>): string {
        const url = API_CONFIG.getFullUrl(endpoint)
        
        if (params) {
            const searchParams = new URLSearchParams()
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    searchParams.append(key, String(value))
                }
            })
            const queryString = searchParams.toString()
            return queryString ? `${url}?${queryString}` : url
        }
        
        return url
    }

    private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { params, ...fetchOptions } = options
        const url = this.buildUrl(endpoint, params)

        const headers: HeadersInit = {
            'Accept': 'application/json',
            ...fetchOptions.headers,
        }

        // Добавляем Content-Type только для методов с телом
        if (fetchOptions.body && !(fetchOptions.headers && 'Content-Type' in fetchOptions.headers)) {
            headers['Content-Type'] = 'application/json'
        }

        // Важно: используем credentials: 'include' для отправки cookies с токеном
        // Если credentials уже указан в options, используем его, иначе добавляем 'include'
        const credentials = fetchOptions.credentials || 'include'

        const response = await fetch(url, {
            ...fetchOptions,
            headers,
            credentials, // Отправляем cookies автоматически
        })

        // Обработка 204 No Content (для DELETE)
        if (response.status === 204) {
            return undefined as T
        }

        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`
            try {
                const errorData = await response.json()
                if (errorData.detail) {
                    errorMessage = Array.isArray(errorData.detail)
                        ? errorData.detail.map((e: any) => e.msg || e.message).join(', ')
                        : errorData.detail
                } else if (errorData.message) {
                    errorMessage = errorData.message
                }
            } catch {
                // Если не удалось распарсить JSON, используем текст ответа
                try {
                    const text = await response.text()
                    if (text) errorMessage = text
                } catch {
                    // Игнорируем ошибки парсинга
                }
            }
            throw new Error(errorMessage)
        }

        // Для пустых ответов возвращаем undefined
        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
            return undefined as T
        }

        return response.json()
    }

    async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'GET' })
    }

    async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        })
    }

    async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        })
    }

    async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        })
    }

    async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' })
    }
}

export const apiClient = new ApiClient()








