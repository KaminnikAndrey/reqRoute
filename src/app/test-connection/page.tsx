'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api.ts';

export default function TestConnectionPage() {
    const [status, setStatus] = useState('Нажимайте кнопку для теста');
    const [data, setData] = useState<any>(null);

    const testConnection = async () => {
        try {
            setStatus('Проверяем подключение...');

            // Пробуем получить пользователей
            const users = await api.get('/api/v1/users/?page_size=5');
            setData(users);
            setStatus(`✅ Успешно! Найдено пользователей: ${users.total || 0}`);

        } catch (error: any) {
            setStatus(`❌ Ошибка: ${error.message}`);
            console.error('Тест не прошел:', error);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Тест подключения к API</h1>

            <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
                <p><strong>Статус:</strong> {status}</p>
                <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}</p>

                <button
                    onClick={testConnection}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}
                >
                    Проверить подключение
                </button>
            </div>

            {data && (
                <div>
                    <h3>Данные с сервера:</h3>
                    <pre style={{
                        backgroundColor: '#f5f5f5',
                        padding: '15px',
                        borderRadius: '5px',
                        overflow: 'auto',
                        maxHeight: '400px'
                    }}>
            {JSON.stringify(data, null, 2)}
          </pre>
                </div>
            )}

            <div style={{ marginTop: '30px' }}>
                <h3>Проверьте вручную:</h3>
                <ul>
                    <li><a href="http://localhost:8000/api/v1/users/" target="_blank">Пользователи</a></li>
                    <li><a href="http://localhost:8000/api/v1/cases/" target="_blank">Кейсы</a></li>
                    <li><a href="http://localhost:8000/api/v1/meetings/" target="_blank">Встречи</a></li>
                    <li><a href="http://localhost:8000/docs" target="_blank">Swagger</a></li>
                </ul>
            </div>
        </div>
    );
}