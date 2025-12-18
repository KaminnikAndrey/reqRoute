// src/app/create-test-user/page.tsx
'use client'

import { useState } from 'react'

export default function CreateTestUser() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<string>('')

    // Самый простой URL
    const API_URL = 'http://localhost:8000/api/v1/users/'

    const simplestCreate = async () => {
        setLoading(true)
        setResult('')

        try {
            // 1. Простейшие данные
            const testData = {
                full_name: "Простой Тест",
                email: "simples@test.com",
                password: "simples123"
            }

            console.log('1. Отправляем:', testData)

            // 2. Минимальный fetch
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testData)
            })

            console.log('2. Статус:', response.status)

            // 3. Получаем ответ как текст
            const text = await response.text()
            console.log('3. Ответ текст:', text)

            // 4. Парсим если можно
            let data
            try {
                data = JSON.parse(text)
            } catch {
                data = { raw: text }
            }

            console.log('4. Ответ JSON:', data)

            if (response.ok) {
                setResult(`✅ УСПЕХ! Создан пользователь ID: ${data.id}`)
                alert(`✅ Успех! ID: ${data.id}, Email: ${data.email}`)
            } else {
                setResult(`❌ ОШИБКА ${response.status}: ${text}`)
                alert(`❌ Ошибка ${response.status}: ${text.substring(0, 100)}`)
            }

        } catch (error) {
            console.error('5. Исключение:', error)
            const errorMsg = error instanceof Error ? error.message : String(error)
            setResult(`💥 ИСКЛЮЧЕНИЕ: ${errorMsg}`)
            alert(`💥 Исключение: ${errorMsg}`)
        } finally {
            setLoading(false)
        }
    }

    const testGetUsers = async () => {
        setLoading(true)
        try {
            const response = await fetch(API_URL)
            const text = await response.text()
            console.log('GET ответ:', text)
            setResult(`GET: ${response.status} - ${text.substring(0, 100)}`)
        } catch (error) {
            setResult(`GET ошибка: ${error}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>СУПЕР ПРОСТОЙ ТЕСТ</h1>

            <div style={{ marginBottom: '20px', padding: '10px', background: '#f0f0f0' }}>
                <p><strong>URL:</strong> {API_URL}</p>
                <p><strong>Статус:</strong> {loading ? '⏳ Загрузка...' : '✅ Готов'}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={simplestCreate}
                    disabled={loading}
                    style={{
                        padding: '15px 30px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '16px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        marginRight: '10px'
                    }}
                >
                    {loading ? 'Отправляю...' : 'Создать простого пользователя'}
                </button>

                <button
                    onClick={testGetUsers}
                    disabled={loading}
                    style={{
                        padding: '15px 30px',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '16px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    Проверить GET запрос
                </button>
            </div>

            <div style={{
                padding: '15px',
                background: '#e8f4f8',
                borderRadius: '5px',
                border: '1px solid #bee5eb'
            }}>
                <h3>Что отправится:</h3>
                <pre style={{
                    background: '#f8f9fa',
                    padding: '10px',
                    borderRadius: '3px',
                    overflow: 'auto'
                }}>
{`{
  "full_name": "Простой Тест",
    email: "simples@test.com",
    password: "simples123"
}`}
                </pre>
            </div>

            {result && (
                <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    background: result.includes('✅') ? '#d4edda' :
                        result.includes('❌') ? '#f8d7da' :
                            '#fff3cd',
                    borderRadius: '5px',
                    border: result.includes('✅') ? '1px solid #c3e6cb' :
                        result.includes('❌') ? '1px solid #f5c6cb' :
                            '1px solid #ffeaa7'
                }}>
                    <h3>Результат:</h3>
                    <pre style={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                    }}>
                        {result}
                    </pre>
                </div>
            )}

            <div style={{
                marginTop: '30px',
                padding: '15px',
                background: '#fff3cd',
                borderRadius: '5px'
            }}>
                <h3>Что делать если не работает:</h3>
                <ol>
                    <li>Откройте <strong>DevTools → Network</strong></li>
                    <li>Нажмите кнопку выше</li>
                    <li>Найдите запрос <code>POST /api/v1/users/</code></li>
                    <li>Скопируйте и покажите мне:
                        <ul>
                            <li>Request Headers</li>
                            <li>Request Payload</li>
                            <li>Response Headers</li>
                            <li>Response Body</li>
                        </ul>
                    </li>
                </ol>
            </div>
        </div>
    )
}