// src/app/test-real-api/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function TestRealApiPage() {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const testApi = async () => {
            try {
                setLoading(true);

                // Пробуем получить данные из реального API
                const response = await fetch('http://localhost:8000/api/v1/cases/?page_size=3');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                setData(result);
                setError('');

            } catch (err: any) {
                setError(err.message || 'Ошибка подключения');
                console.error('Ошибка:', err);
            } finally {
                setLoading(false);
            }
        };

        testApi();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Тест подключения к реальному API</h1>

            <div style={{ marginBottom: '20px' }}>
                <p><strong>API URL:</strong> http://localhost:8000</p>
                <p><strong>Endpoint:</strong> /api/v1/cases/</p>
                <p><strong>Статус:</strong> {loading ? '⏳ Загружаем...' : error ? '❌ Ошибка' : '✅ Успешно'}</p>
            </div>

            {error && (
                <div style={{
                    padding: '15px',
                    backgroundColor: '#ffebee',
                    color: '#c62828',
                    borderRadius: '5px',
                    marginBottom: '20px'
                }}>
                    <h3>Ошибка:</h3>
                    <p>{error}</p>
                    <p>Проверьте:</p>
                    <ul>
                        <li>Бэкенд запущен? <a href="http://localhost:8000/docs" target="_blank">Swagger</a></li>
                        <li>Есть ли данные в БД?</li>
                    </ul>
                </div>
            )}

            {data && (
                <div>
                    <h3>Данные получены:</h3>
                    <p>Всего кейсов: {data.total || 0}</p>

                    {data.items && data.items.length > 0 ? (
                        <div style={{ marginTop: '20px' }}>
                            <h4>Пример кейсов (первые 3):</h4>
                            <ul>
                                {data.items.map((item: any) => (
                                    <li key={item.id} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd' }}>
                                        <strong>ID:</strong> {item.id}<br />
                                        <strong>Название:</strong> {item.title}<br />
                                        <strong>Статус:</strong> {item.status}<br />
                                        <strong>Автор:</strong> {item.user_id}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>Кейсов нет. Возможно, база данных пустая.</p>
                    )}

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
                <h3>Ссылки для проверки:</h3>
                <ul>
                    <li><a href="http://localhost:8000/docs" target="_blank">Swagger документация</a></li>
                    <li><a href="http://localhost:8000/api/v1/cases/" target="_blank">Кейсы (API)</a></li>
                    <li><a href="http://localhost:8000/api/v1/users/" target="_blank">Пользователи (API)</a></li>
                    <li><a href="http://localhost:8000/api/v1/meetings/" target="_blank">Встречи (API)</a></li>
                </ul>
            </div>
        </div>
    );
}