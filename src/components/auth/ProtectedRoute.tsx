// src/components/auth/ProtectedRoute.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useAuthApi } from '@/hooks/useAuthApi'

interface ProtectedRouteProps {
    children: React.ReactNode
    requireAuth?: boolean // true - требует авторизации, false - требует отсутствия авторизации
    redirectTo?: string
}

export default function ProtectedRoute({
                                           children,
                                           requireAuth = true,
                                           redirectTo = '/login'
                                       }: ProtectedRouteProps) {
    const router = useRouter()
    const [isChecking, setIsChecking] = useState(true)

    // Получаем состояние из store
    const isAuthenticated = useAuthStore(state => state.isAuthenticated)
    const loading = useAuthStore(state => state.loading)

    // Получаем метод проверки авторизации
    const { checkAuth } = useAuthApi()

    useEffect(() => {
        const verifyAuth = async () => {
            setIsChecking(true)

            // Проверяем авторизацию
            const { isAuthenticated: isValid } = await checkAuth()

            // Если требуется авторизация, но пользователь не авторизован
            if (requireAuth && !isValid) {
                router.push(redirectTo)
                return
            }

            // Если требуется отсутствие авторизации, но пользователь авторизован
            if (!requireAuth && isValid) {
                router.push('/dashboard')
                return
            }

            setIsChecking(false)
        }

        verifyAuth()
    }, [requireAuth, redirectTo, router, checkAuth])

    // Показываем загрузку
    if (isChecking || loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: '#f5f5f5'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #EF3124',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }} />
                    <p style={{ color: '#666' }}>Проверка авторизации...</p>
                </div>
                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        )
    }

    // Рендерим детей только если проверка прошла успешно
    if ((requireAuth && !isAuthenticated) || (!requireAuth && isAuthenticated)) {
        return null
    }

    return <>{children}</>
}