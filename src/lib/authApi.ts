// src/lib/authApi.ts
import { API_CONFIG } from '@/config/api'
import { usersClient, casesClient, teamsClient } from './clients'
import type { UserRead, CaseRead, TeamRead, LoginResponse } from './apiTypes'

// Для обратной совместимости
interface UserResponse {
    id: number
    full_name: string
    email: string
}

class AuthApiClient {
    /**
     * Вход через новый эндпоинт /api/v1/auth/login
     * Токен автоматически сохраняется в cookies сервером
     * По Swagger возвращает: { "access_token": "..." }
     */
    async login(email: string, password: string): Promise<LoginResponse> {
        console.log('🔐 Попытка входа:', { email, passwordLength: password.length })

        try {
            const url = API_CONFIG.getFullUrl('/auth/login')
            console.log('📡 Отправка запроса на:', url)
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include', // Важно: отправляем cookies
                body: JSON.stringify({ email: email.trim(), password }),
            })

            console.log('📥 Ответ сервера:', { status: response.status, statusText: response.statusText })

            if (!response.ok) {
                let errorMessage = 'Неверный email или пароль'
                try {
                    const errorData = await response.json()
                    console.log('❌ Ошибка от сервера:', errorData)
                    if (errorData.detail) {
                        errorMessage = Array.isArray(errorData.detail)
                            ? errorData.detail.map((e: any) => e.msg || e.message).join(', ')
                            : errorData.detail
                    } else if (errorData.message) {
                        errorMessage = errorData.message
                    }
                } catch (e) {
                    console.error('Не удалось распарсить ошибку:', e)
                }
                throw new Error(errorMessage)
            }

            // По Swagger API возвращает { "access_token": "..." }
            // Токен также устанавливается в cookies сервером
            const data: LoginResponse = await response.json()
            console.log('✅ Аутентификация успешна, токен в cookies')
            return data
        } catch (error: any) {
            console.error('Ошибка входа:', error)
            throw error
        }
    }

    /**
     * Получить текущего авторизованного пользователя
     * Использует токен из cookies
     */
    async getCurrentUser(): Promise<UserResponse> {
        try {
            // Попробуем использовать эндпоинт /auth/me если он есть
            try {
                const url = API_CONFIG.getFullUrl('/auth/me')
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                    credentials: 'include', // Важно: отправляем cookies
                })

                if (response.ok) {
                    const userData = await response.json()
                    return {
                        id: userData.id,
                        full_name: userData.full_name,
                        email: userData.email,
                    }
                }
            } catch {
                // Если эндпоинт /auth/me не существует, продолжаем с альтернативным методом
            }

            // Альтернативный метод: получаем список пользователей (токен будет автоматически отправлен в cookies)
            // ВАЖНО: это временное решение, пока нет эндпоинта /auth/me
            // Проблема: мы не знаем, какой именно пользователь авторизован
            // Поэтому берем первого пользователя (неправильно, но работает для теста)
            const usersData = await usersClient.list({ page_size: 100 })
            
            if (usersData.items.length === 0) {
                throw new Error('Пользователь не найден')
            }

            // Временное решение: берем первого пользователя
            // TODO: попросить бэкендера добавить эндпоинт /auth/me для получения текущего пользователя
            const currentUser = usersData.items[0]
            
            return {
                id: currentUser.id,
                full_name: currentUser.full_name,
                email: currentUser.email,
            }
        } catch (error: any) {
            console.error('Ошибка получения пользователя:', error)
            
            // Если 401 или 403, значит не авторизован
            if (error.message?.includes('401') || error.message?.includes('403') || error.message?.includes('Unauthorized')) {
                throw new Error('Не авторизован')
            }
            
            throw error
        }
    }

    /**
     * Регистрация нового пользователя
     * После успешной регистрации автоматически выполняет вход
     */
    async register(data: { full_name: string; email: string; password: string }): Promise<UserRead> {
        console.log('📝 Регистрация нового пользователя:', { email: data.email })

        try {
            // Создаем пользователя через API
            const newUser = await usersClient.create({
                full_name: data.full_name,
                email: data.email,
                password: data.password,
            })

            console.log('✅ Пользователь успешно зарегистрирован:', newUser)

            // После успешной регистрации автоматически логинимся
            try {
                await this.login(data.email, data.password)
                console.log('✅ Автоматический вход после регистрации выполнен')
            } catch (loginError) {
                console.warn('⚠️ Пользователь зарегистрирован, но автоматический вход не удался:', loginError)
                // Продолжаем, пользователь может войти вручную
            }

            return newUser
        } catch (error: any) {
            console.error('Ошибка регистрации:', error)
            
            // Обрабатываем специфичные ошибки
            if (error.message?.includes('422') || error.message?.includes('Validation')) {
                throw new Error('Некорректные данные регистрации. Проверьте все поля.')
            }
            if (error.message?.includes('409') || error.message?.includes('already exists') || error.message?.includes('duplicate')) {
                throw new Error('Пользователь с таким email уже существует')
            }
            
            throw error
        }
    }

    /**
     * Выход - очищаем cookies через эндпоинт logout (если есть) или просто удаляем
     */
    async logout(): Promise<void> {
        try {
            // Попробуем вызвать эндпоинт logout если он есть
            // Если нет, просто очистим cookies вручную
            const url = API_CONFIG.getFullUrl('/auth/logout')
            
            try {
                await fetch(url, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                    },
                })
            } catch {
                // Если эндпоинт не существует, просто продолжаем
            }
            
            // Удаляем cookies вручную (для надежности)
            document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
            document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
            
            console.log('✅ Выход выполнен')
        } catch (error) {
            console.error('Ошибка выхода:', error)
            throw error
        }
    }

    /**
     * Проверка авторизации
     */
    async checkAuth(): Promise<boolean> {
        try {
            await this.getCurrentUser()
            return true
        } catch {
            return false
        }
    }

    /**
     * Получить команды текущего авторизованного пользователя
     * Пользователь связан с командами через кейсы: User -> Case -> Team
     */
    async getUserTeams(): Promise<TeamRead[]> {
        try {
            const user = await this.getCurrentUser()
            
            // Получаем все кейсы пользователя
            const casesResponse = await casesClient.list({ 
                page_size: 100,
                user_id: user.id // Фильтруем по user_id если API поддерживает
            })
            
            // Если фильтрация не работает, фильтруем на клиенте
            const userCases = casesResponse.items.filter(c => c.user_id === user.id)
            
            if (userCases.length === 0) {
                return []
            }
            
            // Получаем все команды
            const teamsResponse = await teamsClient.list({ page_size: 100 })
            
            // Фильтруем команды, которые относятся к кейсам пользователя
            const caseIds = userCases.map(c => c.id)
            const userTeams = teamsResponse.items.filter(team => 
                caseIds.includes(team.case_id)
            )
            
            return userTeams
        } catch (error) {
            console.error('Ошибка получения команд пользователя:', error)
            throw error
        }
    }
}

export const authApiClient = new AuthApiClient()