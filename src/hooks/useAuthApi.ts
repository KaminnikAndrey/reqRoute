import { useState, useCallback } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { User } from '@/types/auth'
import {authApiClient} from "@/lib/authApi";

export function useAuthApi() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { setUser, setLoading, setError: setStoreError, logout: storeLogout } = useAuthStore()

    const login = useCallback(async (email: string, password: string) => {
        setIsLoading(true)
        setError(null)
        setStoreError(null)
        setLoading(true)

        try {
            // 1. Логинимся через API
            const response = await authApiClient.login(email, password)
            console.log('Login response:', response)

            // 2. Получаем данные пользователя
            const userData = await authApiClient.getCurrentUser()

            // 3. Преобразуем данные в наш формат
            const user: User = {
                id: userData.id,
                firstName: userData.full_name.split(' ')[0] || '',
                lastName: userData.full_name.split(' ').slice(1).join(' ') || '',
                email: userData.email,
                company: userData.company || '',
                position: userData.position || '',
                createdAt: new Date().toISOString()
            }

            // 4. Сохраняем в store
            setUser(user)
            setLoading(false)
            setIsLoading(false)

            return user
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Ошибка авторизации'
            setError(message)
            setStoreError(message)
            setLoading(false)
            setIsLoading(false)
            throw err
        }
    }, [setUser, setLoading, setStoreError])

    const logout = useCallback(async () => {
        try {
            await authApiClient.logout()
        } finally {
            storeLogout()
        }
    }, [storeLogout])

    const checkAuth = useCallback(async () => {
        try {
            const isAuthenticated = await authApiClient.checkAuth()
            if (isAuthenticated) {
                const userData = await authApiClient.getCurrentUser()
                const user: User = {
                    id: userData.id,
                    firstName: userData.full_name.split(' ')[0] || '',
                    lastName: userData.full_name.split(' ').slice(1).join(' ') || '',
                    email: userData.email,
                    company: userData.company || '',
                    position: userData.position || '',
                    createdAt: new Date().toISOString()
                }
                setUser(user)
            }
            return isAuthenticated
        } catch {
            return false
        }
    }, [setUser])

    return {
        login,
        logout,
        checkAuth,
        isLoading,
        error,
    }
}