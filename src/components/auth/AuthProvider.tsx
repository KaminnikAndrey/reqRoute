// src/providers/AuthProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authApiClient } from '@/lib/authApi'

// Публичные пути (не требуют авторизации)
const PUBLIC_PATHS = [
    '/login',
    '/registration',
    '/',
    '/test-connection',
    '/test-api',
    '/create-test-user'
]

interface AuthContextType {
    isAuthenticated: boolean
    isLoading: boolean
    user: any | null
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    checkAuth: () => Promise<void>
    error: string | null
    clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
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
            router.push('/main')
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
            router.push('/login')
        }
    }

    // Первоначальная проверка при загрузке приложения
    useEffect(() => {
        checkAuth()
    }, [])

    // Защита маршрутов
    useEffect(() => {
        if (isLoading) return

        console.log('🔐 Проверка доступа:', {
            pathname,
            isAuthenticated,
            isLoading,
            isPublicPath: PUBLIC_PATHS.includes(pathname)
        })

        const isPublicPath = PUBLIC_PATHS.includes(pathname)
        const isAuthPage = pathname === '/login' || pathname === '/registration'

        // Если не авторизован и пытается зайти на защищенную страницу
        if (!isAuthenticated && !isPublicPath) {
            console.log('🛑 Перенаправление на login (неавторизован)')
            router.push('/login')
            return
        }

        // Если авторизован и пытается зайти на страницу логина/регистрации
        if (isAuthenticated && isAuthPage) {
            console.log('🛑 Перенаправление на main (уже авторизован)')
            router.push('/main')
        }
    }, [isAuthenticated, isLoading, pathname, router])

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div>Загрузка...</div>
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
        clearError
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}