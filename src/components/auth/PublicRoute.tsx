// src/components/auth/PublicRoute.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'

export default function PublicRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.push('/main') // Редирект на главную если уже авторизован
        }
    }, [isAuthenticated, loading, router])

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <p>Загрузка...</p>
            </div>
        )
    }

    if (isAuthenticated) {
        return null // или loading, пока происходит редирект
    }

    return <>{children}</>
}