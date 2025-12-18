// src/providers/AuthProviderNoRedirect.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authApiClient } from '@/lib/authApi'

interface AuthContextType {
    isAuthenticated: boolean
    isLoading: boolean
    user: any | null
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    checkAuth: () => Promise<void>
    error: string | null
    clearError: () => void
    // Дополнительные методы для удобства
    getAuthStatus: () => { isAuthenticated: boolean; user: any }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProviderNoRedirect({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const pathname = usePathname()

    // Очистка ошибки
    const clearError = () => setError(null)

    // Проверка авторизации
    const checkAuth = async () => {
        setIsLoading(true)
        clearError()

        try {
            console.log('🔍 Проверка авторизации...')
            const userData = await authApiClient.getCurrentUser()
            console.log('✅ Пользователь авторизован:', userData)
            setUser(userData)
            setIsAuthenticated(true)
        } catch (error) {
            console.log('❌ Пользователь не авторизован')
            setUser(null)
            setIsAuthenticated(false)
        } finally {
            setIsLoading(false)
        }
    }

    // Вход
    const login = async (email: string, password: string) => {
        setIsLoading(true)
        clearError()

        try {
            console.log('🔄 Вход...')
            await authApiClient.login(email, password)
            await checkAuth() // Проверяем и получаем данные пользователя

            console.log('✅ Вход успешен. Текущая страница:', pathname)
            // НЕ делаем автоматический redirect - пользователь остается на текущей странице
            // router.push('/main')

        } catch (error: any) {
            console.error('Ошибка входа:', error)
            setError(error.message || 'Ошибка входа')
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    // Выход
    const logout = async () => {
        try {
            await authApiClient.logout()
        } finally {
            setIsAuthenticated(false)
            setUser(null)
            console.log('✅ Выход выполнен. Текущая страница:', pathname)
            // НЕ делаем автоматический redirect
            // router.push('/login')
        }
    }

    // Получить текущий статус авторизации
    const getAuthStatus = () => ({
        isAuthenticated,
        user
    })

    // Первоначальная проверка при загрузке приложения
    useEffect(() => {
        checkAuth()
    }, [])

    // НЕТ защиты маршрутов - можно ходить куда угодно
    // Логируем переходы для отладки
    useEffect(() => {
        console.log('📍 Навигация (без защиты):', {
            pathname,
            isAuthenticated,
            userEmail: user?.email
        })
    }, [pathname, isAuthenticated, user])

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div style={{
                    padding: '20px',
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <p>Загрузка авторизации...</p>
                    <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                        Проверка подключения к API
                    </p>
                </div>
            </div>
        )
    }

    const value = {
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        checkAuth,
        error,
        clearError,
        getAuthStatus
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProviderNoRedirect')
    }
    return context
}