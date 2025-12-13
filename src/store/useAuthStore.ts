// src/store/useAuthStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthState, User, RegistrationData } from '@/types/auth'

interface AuthStore extends AuthState {
    // Действия
    register: (data: RegistrationData) => Promise<void>
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    setUser: (user: User | null) => void

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

            // Регистрация пользователя
            register: async (data) => {
                set({ loading: true, error: null })

                try {
                    // Здесь будет вызов API
                    // Пока имитируем успешную регистрацию
                    await new Promise(resolve => setTimeout(resolve, 500))

                    const newUser: User = {
                        id: Date.now(),
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        company: data.company,
                        position: data.position,
                        createdAt: new Date().toISOString()
                    }

                    set({
                        user: newUser,
                        isAuthenticated: true,
                        loading: false,
                        error: null
                    })

                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Ошибка регистрации',
                        loading: false
                    })
                    throw error
                }
            },

            // Вход пользователя
            login: async (email, password) => {
                set({ loading: true, error: null })

                try {
                    // Здесь будет вызов API
                    // Пока имитируем успешный вход
                    await new Promise(resolve => setTimeout(resolve, 500))

                    // Для демо создаем фейкового пользователя
                    const mockUser: User = {
                        id: 1,
                        firstName: 'Иван',
                        lastName: 'Иванов',
                        email: email,
                        company: 'ReqRoute',
                        position: 'Product Manager',
                        createdAt: new Date().toISOString()
                    }

                    set({
                        user: mockUser,
                        isAuthenticated: true,
                        loading: false,
                        error: null
                    })

                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Ошибка входа',
                        loading: false
                    })
                    throw error
                }
            },

            // Выход пользователя
            logout: () => {
                set(initialState)
            },

            // Установка загрузки
            setLoading: (loading) => set({ loading }),

            // Установка ошибки
            setError: (error) => set({ error }),

            // Установка пользователя
            setUser: (user) => set({ user, isAuthenticated: !!user }),

            // Полное имя пользователя
            getUserFullName: () => {
                const { user } = get()
                if (!user) return ''
                return `${user.firstName} ${user.lastName}`
            },

            // Проверка авторизации
            isLoggedIn: () => get().isAuthenticated
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
)