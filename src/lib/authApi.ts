// src/lib/authApi.ts
import { RegistrationData, User, LoginCredentials } from '@/types/auth'

const API_MODE = process.env.NEXT_PUBLIC_API_MODE || 'mock'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Интерфейс ответа API
interface AuthResponse {
    user: User
    token: string
}

interface LogoutResponse {
    success: boolean
    message: string
}

interface ErrorResponse {
    error: string
    message?: string
    statusCode?: number
}

class AuthApiClient {
    // Моковые данные
    private mockUsers: User[] = []
    private currentToken: string | null = null

    constructor() {
        this.initializeMockData()
        this.loadTokenFromStorage()
    }

    private initializeMockData() {
        // Создаем несколько тестовых пользователей
        this.mockUsers = [
            {
                id: 1,
                firstName: 'Иван',
                lastName: 'Иванов',
                email: 'test@example.com',
                company: 'ReqRoute',
                position: 'Product Manager',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                firstName: 'Мария',
                lastName: 'Петрова',
                email: 'maria@example.com',
                company: 'Альфа-Банк',
                position: 'Frontend Developer',
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                firstName: 'Алексей',
                lastName: 'Сидоров',
                email: 'alex@example.com',
                company: 'Google',
                position: 'DevOps Engineer',
                createdAt: new Date().toISOString()
            }
        ]
    }

    private loadTokenFromStorage() {
        if (typeof window !== 'undefined') {
            this.currentToken = localStorage.getItem('auth_token')
        }
    }

    private saveTokenToStorage(token: string) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token)
        }
    }

    private removeTokenFromStorage() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token')
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    private async mockRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        console.log(`📡 MOCK auth запрос: ${options.method || 'GET'} ${endpoint}`)

        // Имитация сетевой задержки
        await this.delay(300)

        const method = options.method || 'GET'
        const body = options.body ? JSON.parse(options.body as string) : null

        // Обработка различных эндпоинтов
        switch (true) {
            // Регистрация
            case endpoint === '/api/v1/auth/register' && method === 'POST':
                return this.handleMockRegister(body) as T

            // Вход
            case endpoint === '/api/v1/auth/login' && method === 'POST':
                return this.handleMockLogin(body) as T

            // Выход
            case endpoint === '/api/v1/auth/logout' && method === 'POST':
                return this.handleMockLogout() as T

            // Получение информации о пользователе
            case endpoint === '/api/v1/auth/me' && method === 'GET':
                return this.handleMockGetMe() as T

            // Обновление профиля
            case endpoint === '/api/v1/auth/profile' && method === 'PUT':
                return this.handleMockUpdateProfile(body) as T

            // Сброс пароля
            case endpoint === '/api/v1/auth/reset-password' && method === 'POST':
                return this.handleMockResetPassword(body) as T

            default:
                throw new Error(`Mock endpoint not found: ${endpoint}`)
        }
    }

    private async realRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`
        console.log(`🌐 REAL auth запрос: ${url}`)

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...options.headers,
        }

        // Добавляем токен аутентификации если есть
        if (this.currentToken && !endpoint.includes('/auth/')) {
            headers['Authorization'] = `Bearer ${this.currentToken}`
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            })

            // Обработка ошибок
            if (!response.ok) {
                const errorData: ErrorResponse = await response.json().catch(() => ({
                    error: 'Unknown error',
                    statusCode: response.status
                }))

                // Если 401 Unauthorized - очищаем токен
                if (response.status === 401) {
                    this.currentToken = null
                    this.removeTokenFromStorage()
                }

                throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`)
            }

            // Если ответ пустой (например, для logout)
            if (response.status === 204) {
                return {} as T
            }

            const data = await response.json()

            // Сохраняем токен если он в ответе
            if (data.token) {
                this.currentToken = data.token
                this.saveTokenToStorage(data.token)
            }

            return data

        } catch (error) {
            console.error('❌ API request failed:', error)
            throw error
        }
    }

    // Обработчики мок-запросов
    private handleMockRegister(data: RegistrationData): AuthResponse {
        // Валидация
        this.validateRegistrationData(data)

        // Проверка существующего email
        if (this.mockUsers.some(user => user.email === data.email)) {
            throw new Error('Пользователь с таким email уже существует')
        }

        // Создаем нового пользователя
        const newUser: User = {
            id: Date.now(),
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            company: data.company,
            position: data.position,
            createdAt: new Date().toISOString()
        }

        this.mockUsers.push(newUser)

        // Генерируем токен
        const token = this.generateMockToken(newUser.id)
        this.currentToken = token
        this.saveTokenToStorage(token)

        return {
            user: newUser,
            token
        }
    }

    private handleMockLogin(data: LoginCredentials): AuthResponse {
        // Валидация
        if (!data.email || !data.password) {
            throw new Error('Email и пароль обязательны')
        }

        // Поиск пользователя
        const user = this.mockUsers.find(u => u.email === data.email)

        if (!user) {
            throw new Error('Пользователь не найден')
        }

        // В мок-режиме проверяем пароль 'password123' или 'test'
        const validPasswords = ['password123', 'test', '12345678']
        if (!validPasswords.includes(data.password)) {
            throw new Error('Неверный пароль')
        }

        // Генерируем токен
        const token = this.generateMockToken(user.id)
        this.currentToken = token
        this.saveTokenToStorage(token)

        return {
            user,
            token
        }
    }

    private handleMockLogout(): LogoutResponse {
        this.currentToken = null
        this.removeTokenFromStorage()

        return {
            success: true,
            message: 'Успешный выход из системы'
        }
    }

    private handleMockGetMe(): User {
        if (!this.currentToken) {
            throw new Error('Требуется авторизация')
        }

        // Извлекаем ID из токена
        const userId = this.extractUserIdFromToken(this.currentToken)
        const user = this.mockUsers.find(u => u.id === userId)

        if (!user) {
            throw new Error('Пользователь не найден')
        }

        return user
    }

    private handleMockUpdateProfile(data: Partial<User>): User {
        if (!this.currentToken) {
            throw new Error('Требуется авторизация')
        }

        const userId = this.extractUserIdFromToken(this.currentToken)
        const userIndex = this.mockUsers.findIndex(u => u.id === userId)

        if (userIndex === -1) {
            throw new Error('Пользователь не найден')
        }

        // Обновляем пользователя
        this.mockUsers[userIndex] = {
            ...this.mockUsers[userIndex],
            ...data,
            id: userId // Не позволяем менять ID
        }

        return this.mockUsers[userIndex]
    }

    private handleMockResetPassword(data: { email: string }): { success: boolean, message: string } {
        if (!data.email) {
            throw new Error('Email обязателен')
        }

        const user = this.mockUsers.find(u => u.email === data.email)

        if (!user) {
            throw new Error('Пользователь с таким email не найден')
        }

        return {
            success: true,
            message: 'Инструкции по сбросу пароля отправлены на email'
        }
    }

    // Вспомогательные методы
    private validateRegistrationData(data: RegistrationData): void {
        const errors: string[] = []

        if (!data.firstName?.trim()) errors.push('Имя обязательно')
        if (!data.lastName?.trim()) errors.push('Фамилия обязательна')
        if (!data.company?.trim()) errors.push('Компания обязательна')
        if (!data.email?.trim()) errors.push('Email обязателен')
        if (!data.password) errors.push('Пароль обязателен')
        if (!data.confirmPassword) errors.push('Подтверждение пароля обязательно')

        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.push('Введите корректный email')
        }

        if (data.password && data.password.length < 8) {
            errors.push('Пароль должен содержать не менее 8 символов')
        }

        if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
            errors.push('Пароли не совпадают')
        }

        if (!data.agreement) {
            errors.push('Необходимо согласиться с правилами')
        }

        if (errors.length > 0) {
            throw new Error(errors.join('. '))
        }
    }

    private generateMockToken(userId: number): string {
        // Генерируем простой мок-токен
        const payload = {
            userId,
            email: this.mockUsers.find(u => u.id === userId)?.email || '',
            exp: Date.now() + 24 * 60 * 60 * 1000 // 24 часа
        }

        return `mock-token-${btoa(JSON.stringify(payload))}`
    }

    private extractUserIdFromToken(token: string): number {
        try {
            const payload = token.split('.')[1]
            const decoded = JSON.parse(atob(payload))
            return decoded.userId
        } catch {
            throw new Error('Невалидный токен')
        }
    }

    // ============ PUBLIC API METHODS ============

    async register(data: RegistrationData): Promise<AuthResponse> {
        if (API_MODE === 'mock') {
            return this.mockRequest<AuthResponse>('/api/v1/auth/register', {
                method: 'POST',
                body: JSON.stringify(data),
            })
        }

        return this.realRequest<AuthResponse>('/api/v1/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    }

    async login(email: string, password: string): Promise<AuthResponse> {
        if (API_MODE === 'mock') {
            return this.mockRequest<AuthResponse>('/api/v1/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            })
        }

        return this.realRequest<AuthResponse>('/api/v1/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        })
    }

    async logout(): Promise<LogoutResponse> {
        if (API_MODE === 'mock') {
            return this.mockRequest<LogoutResponse>('/api/v1/auth/logout', {
                method: 'POST',
            })
        }

        const result = await this.realRequest<LogoutResponse>('/api/v1/auth/logout', {
            method: 'POST',
        })

        // Всегда очищаем токен после выхода
        this.currentToken = null
        this.removeTokenFromStorage()

        return result
    }

    async getCurrentUser(): Promise<User> {
        if (API_MODE === 'mock') {
            return this.mockRequest<User>('/api/v1/auth/me', {
                method: 'GET',
            })
        }

        return this.realRequest<User>('/api/v1/auth/me', {
            method: 'GET',
        })
    }

    async updateProfile(data: Partial<User>): Promise<User> {
        if (API_MODE === 'mock') {
            return this.mockRequest<User>('/api/v1/auth/profile', {
                method: 'PUT',
                body: JSON.stringify(data),
            })
        }

        return this.realRequest<User>('/api/v1/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        })
    }

    async resetPassword(email: string): Promise<{ success: boolean, message: string }> {
        if (API_MODE === 'mock') {
            return this.mockRequest<{ success: boolean, message: string }>('/api/v1/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({ email }),
            })
        }

        return this.realRequest<{ success: boolean, message: string }>('/api/v1/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        })
    }

    // Методы для работы с токеном
    getToken(): string | null {
        return this.currentToken
    }

    setToken(token: string): void {
        this.currentToken = token
        this.saveTokenToStorage(token)
    }

    isAuthenticated(): boolean {
        return !!this.currentToken
    }

    clearAuth(): void {
        this.currentToken = null
        this.removeTokenFromStorage()
    }

    // Проверка валидности токена
    validateToken(): boolean {
        if (!this.currentToken) return false

        try {
            const payload = this.currentToken.split('.')[1]
            const decoded = JSON.parse(atob(payload))
            return decoded.exp > Date.now()
        } catch {
            return false
        }
    }
}

export const authApiClient = new AuthApiClient()