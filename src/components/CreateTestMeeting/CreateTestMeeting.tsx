// src/components/CreateTestMeeting.tsx
'use client'

import { useState } from 'react';
import { authApiClient } from '@/lib/api';

export default function CreateTestMeeting() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string>('');

    const createTestMeeting = async () => {
        try {
            setLoading(true);
            setMessage('');

            // Создаем тестовую встречу
            const meetingData = {
                team_id: 1, // Нужен существующий team_id
                date_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Завтра
                summary: 'Тестовая встреча',
                recording_link: 'https://meet.google.com/abc-defg-hij',
            };

            console.log('Creating meeting:', meetingData);

            // Пробуем создать встречу
            const response = await fetch('http://localhost:8000/api/v1/meetings/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': localStorage.getItem('auth_header') || '',
                },
                body: JSON.stringify(meetingData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to create meeting: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('Meeting created:', data);
            setMessage(`✅ Встреча создана! ID: ${data.id}`);

        } catch (error) {
            console.error('Error creating meeting:', error);
            setMessage(`❌ Ошибка: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const testAuth = async () => {
        try {
            setLoading(true);

            const authHeader = localStorage.getItem('auth_header');
            const response = await fetch('http://localhost:8000/api/v1/meetings/', {
                headers: {
                    'Authorization': authHeader || '',
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Auth test failed: ${response.status}`);
            }

            const data = await response.json();
            console.log('Auth test response:', data);
            setMessage(`✅ Аутентификация работает! Всего встреч: ${data.total}`);

        } catch (error) {
            setMessage(`❌ Auth test failed: ${error instanceof Error ? error.message : 'Unknown'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '8px',
            margin: '20px 0',
            border: '1px solid #e9ecef'
        }}>
            <h3 style={{ marginTop: 0 }}>Тестирование API встреч</h3>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <button
                    onClick={testAuth}
                    disabled={loading}
                    style={{
                        padding: '8px 16px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                >
                    {loading ? 'Загрузка...' : 'Проверить авторизацию'}
                </button>

                <button
                    onClick={createTestMeeting}
                    disabled={loading}
                    style={{
                        padding: '8px 16px',
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                >
                    Создать тестовую встречу
                </button>
            </div>

            {message && (
                <div style={{
                    padding: '10px',
                    background: message.includes('✅') ? '#d4edda' : '#f8d7da',
                    border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
                    borderRadius: '4px',
                    color: message.includes('✅') ? '#155724' : '#721c24'
                }}>
                    {message}
                </div>
            )}
        </div>
    );
}