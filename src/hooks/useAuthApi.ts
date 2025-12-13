// src/hooks/useAuthApi.ts
import { useCallback } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { RegistrationData } from '@/types/auth'
import { authApiClient } from '@/lib/authApi'

export function useAuthApi() {
    const { setLoading, setError, setUser } = useAuthStore()

    const register = useCallback(async (data: RegistrationData) => {
        setLoading(true)
        setError(null)

        try {
            // Валидация пароля
            if (data.password.length < 8) {
                throw new Error('Пароль должен содержать не менее 8 символов')
            }

            if (data.password !== data.confirmPassword) {
                throw new Error('Пароли не совпадают')
            }

            if (!data.agreement) {
                throw new Error('Необходимо согласиться с правилами')
            }

            // В мок-режиме используем локальную логику
            if (process.env.NEXT_PUBLIC_API_MODE === 'mock') {
                // Имитация запроса
                await new Promise(resolve => setTimeout(resolve, 500))

                // Создаем пользователя
                const user = await authApiClient.register(data)
                setUser(user)
                return user
            }

            // В реальном режиме - запрос к API
            const user = await authApiClient.register(data)
            setUser(user)
            return user

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ошибка регистрации'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }, [setLoading, setError, setUser])

    const login = useCallback(async (email: string, password: string) => {
        setLoading(true)
        setError(null)

        try {
            // В мок-режиме
            if (process.env.NEXT_PUBLIC_API_MODE === 'mock') {
                await new Promise(resolve => setTimeout(resolve, 500))

                const user = await authApiClient.login(email, password)
                setUser(user)
                return user
            }

            // В реальном режиме
            const user = await authApiClient.login(email, password)
            setUser(user)
            return user

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ошибка входа'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }, [setLoading, setError, setUser])

    const logout = useCallback(async () => {
        try {
            // В мок-режиме
            if (process.env.NEXT_PUBLIC_API_MODE === 'mock') {
                await authApiClient.logout()
                return
            }

            // В реальном режиме
            await authApiClient.logout()

        } catch (err) {
            console.error('Ошибка выхода:', err)
        }
    }, [])

    return {
        register,
        login,
        logout
    }
}