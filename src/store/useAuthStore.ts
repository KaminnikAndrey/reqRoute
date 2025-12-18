// src/store/useAuthStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthState, User, RegistrationData } from '@/types/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface AuthStore extends AuthState {
    // Действия
    register: (data: RegistrationData) => Promise<void>
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    checkAuth: () => Promise<boolean>
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    setUser: (user: User | null) => void
    clearError: () => void
    initialize: () => Promise<void>

    // Новые методы для удобства
    getAuthHeader: () => string | null
    fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>

    // Геттеры
    getUserFullName: () => string
    isLoggedIn: () => boolean
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            ...initialState,

            // Инициализация при загрузке
            initialize: async () => {
                if (!get().loading) {
                    set({ loading: true })
                    try {
                        await get().checkAuth()
                    } finally {
                        set({ loading: false })
                    }
                }
            },

            // Вход пользователя - РАБОЧАЯ ВЕРСИЯ
            login: async (email, password) => {
                set({ loading: true, error: null })

                try {
                    console.log('🔄 Попытка входа:', { email })

                    // Используем Basic Auth
                    const authHeader = 'Basic ' + btoa(`${email}:${password}`)

                    // Правильный URL - БЕЗ API_CONFIG
                    const url = `${API_BASE_URL}/users/`
                    console.log('Login URL:', url)

                    const response = await fetch(url, {
                        headers: {
                            'Authorization': authHeader,
                            'Accept': 'application/json',
                        },
                    })

                    console.log('Response status:', response.status)

                    if (!response.ok) {
                        const errorText = await response.text()
                        console.error('Ошибка аутентификации:', response.status, errorText)
                        throw new Error('Неверный email или пароль')
                    }

                    const data = await response.json()
                    console.log('Получен список пользователей:', data)

                    // Находим пользователя по email
                    const foundUser = data.items?.find((u: any) =>
                        u.email.toLowerCase() === email.toLowerCase()
                    )

                    if (!foundUser) {
                        throw new Error('Пользователь не найден')
                    }

                    // Преобразуем данные
                    const user: User = {
                        id: foundUser.id,
                        firstName: foundUser.full_name?.split(' ')[0] || 'Пользователь',
                        lastName: foundUser.full_name?.split(' ').slice(1).join(' ') || '',
                        email: foundUser.email,
                        company: '',
                        position: '',
                        createdAt: new Date().toISOString()
                    }

                    // Сохраняем
                    localStorage.setItem('auth_email', email)
                    localStorage.setItem('auth_password', password)
                    localStorage.setItem('auth_header', authHeader)
                    localStorage.setItem('user_data', JSON.stringify(user))

                    set({
                        user,
                        isAuthenticated: true,
                        loading: false,
                        error: null
                    })

                    console.log('✅ Вход успешен:', user)

                } catch (error) {
                    console.error('❌ Ошибка входа:', error)
                    const message = error instanceof Error ? error.message : 'Ошибка входа'
                    set({
                        error: message,
                        loading: false,
                        isAuthenticated: false,
                        user: null
                    })
                    throw error
                }
            },

            // Регистрация пользователя
            register: async (data) => {
                set({ loading: true, error: null })

                try {
                    // Создаем пользователя
                    const registrationData = {
                        full_name: `${data.firstName} ${data.lastName}`.trim(),
                        email: data.email,
                        password: data.password,
                    }

                    const response = await fetch(`${API_BASE_URL}/api/v1/users/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(registrationData),
                    })

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}))
                        throw new Error(errorData.detail || 'Ошибка регистрации')
                    }

                    // После успешной регистрации логинимся
                    await get().login(data.email, data.password)

                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Ошибка регистрации'
                    set({
                        error: message,
                        loading: false
                    })
                    throw error
                }
            },

            // Выход
            logout: async () => {
                try {
                    localStorage.removeItem('auth_email')
                    localStorage.removeItem('auth_password')
                    localStorage.removeItem('auth_header')
                    localStorage.removeItem('user_data')
                } finally {
                    set(initialState)
                }
            },

            // Проверка авторизации
            checkAuth: async () => {
                const email = localStorage.getItem('auth_email')
                const password = localStorage.getItem('auth_password')

                if (!email || !password) {
                    return false
                }

                try {
                    const authHeader = 'Basic ' + btoa(`${email}:${password}`)
                    const url = `${API_BASE_URL}/api/v1/users/`

                    const response = await fetch(url, {
                        headers: {
                            'Authorization': authHeader,
                            'Accept': 'application/json',
                        }
                    })

                    if (response.ok) {
                        const data = await response.json()
                        const foundUser = data.items?.find((u: any) =>
                            u.email.toLowerCase() === email.toLowerCase()
                        )

                        if (!foundUser) return false

                        const user: User = {
                            id: foundUser.id,
                            firstName: foundUser.full_name?.split(' ')[0] || 'Пользователь',
                            lastName: foundUser.full_name?.split(' ').slice(1).join(' ') || '',
                            email: foundUser.email,
                            company: '',
                            position: '',
                            createdAt: new Date().toISOString()
                        }

                        localStorage.setItem('user_data', JSON.stringify(user))

                        set({
                            user,
                            isAuthenticated: true,
                            error: null
                        })

                        return true
                    }
                    return false
                } catch (error) {
                    console.warn('Auth check failed:', error)
                    return false
                }
            },

            // Получение заголовка авторизации
            getAuthHeader: () => {
                const email = localStorage.getItem('auth_email')
                const password = localStorage.getItem('auth_password')
                if (!email || !password) return null
                return 'Basic ' + btoa(`${email}:${password}`)
            },

            // Запрос с авторизацией
            fetchWithAuth: async (url: string, options: RequestInit = {}) => {
                const authHeader = get().getAuthHeader()
                if (!authHeader) {
                    throw new Error('Not authenticated')
                }

                return fetch(url, {
                    ...options,
                    headers: {
                        ...options.headers,
                        'Authorization': authHeader,
                        'Accept': 'application/json',
                        'Content-Type': options.headers?.['Content-Type'] || 'application/json'
                    }
                })
            },

            // Остальные методы
            setLoading: (loading) => set({ loading }),
            setError: (error) => set({ error }),
            clearError: () => set({ error: null }),
            setUser: (user) => set({ user, isAuthenticated: !!user }),

            getUserFullName: () => {
                const { user } = get()
                if (!user) return ''
                return `${user.firstName} ${user.lastName}`.trim() || user.email
            },

            isLoggedIn: () => get().isAuthenticated
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }),
            version: 2
        }
    )
)

// Вспомогательная функция для создания заголовка авторизации
export const createAuthHeader = (email: string, password: string): string => {
    return 'Basic ' + btoa(`${email}:${password}`)
}

// Вспомогательная функция для проверки доступности эндпоинта
export const testAuthEndpoint = async (email: string, password: string): Promise<boolean> => {
    try {
        const authHeader = createAuthHeader(email, password)
        const response = await fetch(`${API_BASE_URL}/api/v1/users/`, {
            headers: {
                'Authorization': authHeader,
                'Accept': 'application/json',
            }
        })
        return response.ok
    } catch {
        return false
    }
}