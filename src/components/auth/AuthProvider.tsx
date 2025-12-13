// src/components/auth/AuthProvider.tsx
'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useAuthApi } from '@/hooks/useAuthApi'

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setLoading, setUser } = useAuthStore()
    const { checkAuth } = useAuthApi()

    useEffect(() => {
        const initializeAuth = async () => {
            setLoading(true)

            try {
                const { isAuthenticated, user } = await checkAuth()

                if (isAuthenticated && user) {
                    setUser(user)
                }
            } catch (error) {
                console.error('Ошибка инициализации авторизации:', error)
            } finally {
                setLoading(false)
            }
        }

        initializeAuth()
    }, [setLoading, setUser, checkAuth])

    return <>{children}</>
}