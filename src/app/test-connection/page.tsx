// src/app/test-connection/page.tsx
'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'

export default function TestConnection() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [result, setResult] = useState('')
    const { login, checkAuth, user, isAuthenticated, loading } = useAuthStore()

    const testLogin = async () => {
        try {
            setResult('Пытаюсь войти...')
            await login(email, password)
            setResult(`Успешно! Пользователь: ${user?.email}`)
        } catch (error) {
            setResult(`Ошибка: ${error}`)
        }
    }

    const testCheckAuth = async () => {
        try {
            setResult('Проверяю авторизацию...')
            const isAuth = await checkAuth()
            setResult(`Авторизация: ${isAuth}, User: ${JSON.stringify(user)}`)
        } catch (error) {
            setResult(`Ошибка: ${error}`)
        }
    }

    const testApiDirect = async () => {
        try {
            setResult('Тестирую прямой запрос к API...')

            // Пробуем разные эндпоинты
            const endpoints = [
                '/api/v1/users/me',
                '/api/v1/users/',
                '/api/v1/cases/',
            ]

            for (const endpoint of endpoints) {
                const response = await fetch(`http://localhost:8000${endpoint}`, {
                    headers: {
                        'Authorization': 'Basic ' + btoa(`${email}:${password}`),
                    },
                })

                if (response.ok) {
                    const data = await response.json()
                    setResult(`✅ ${endpoint}: доступен\n${JSON.stringify(data, null, 2)}`)
                    break
                } else {
                    setResult(`❌ ${endpoint}: ${response.status} ${response.statusText}`)
                }
            }
        } catch (error) {
            setResult(`Ошибка запроса: ${error}`)
        }
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace' }}>
            <h1>Тест подключения к API</h1>

            <div style={{ marginBottom: '20px' }}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ marginRight: '10px', padding: '5px' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ marginRight: '10px', padding: '5px' }}
                />
                <button onClick={testLogin} disabled={loading}>
                    {loading ? 'Загрузка...' : 'Войти'}
                </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <button onClick={testCheckAuth} style={{ marginRight: '10px' }}>
                    Проверить авторизацию
                </button>
                <button onClick={testApiDirect}>
                    Тест прямого API запроса
                </button>
            </div>

            <div>
                <p>Статус: {isAuthenticated ? '✅ Авторизован' : '❌ Не авторизован'}</p>
                <p>Пользователь: {user ? `${user.firstName} ${user.lastName} (${user.email})` : 'Нет'}</p>
            </div>

            <pre style={{
                background: '#f5f5f5',
                padding: '10px',
                borderRadius: '5px',
                marginTop: '20px',
                maxHeight: '400px',
                overflow: 'auto'
            }}>
                {result}
            </pre>
        </div>
    )
}