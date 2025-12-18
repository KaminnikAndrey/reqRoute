'use client'

import { useState } from 'react'
import { 
    casesClient,
    termsClient,
    teamsClient,
    studentsClient,
    membershipsClient,
    usersClient,
    meetingsClient,
    assignmentsClient,
    checkpointsClient
} from '@/lib/clients'
import type {
    CaseRead,
    TermRead,
    TeamRead,
    StudentRead,
    TeamMembershipRead,
    UserRead,
    MeetingRead,
    AssignmentRead,
    CheckpointRead,
    PaginatedResponse
} from '@/lib/apiTypes'

interface TestResult {
    endpoint: string
    success: boolean
    data?: any
    error?: string
    timestamp: string
}

export default function TestApiGetPage() {
    const [results, setResults] = useState<TestResult[]>([])
    const [loading, setLoading] = useState(false)
    const [expandedResult, setExpandedResult] = useState<string | null>(null)
    const [selectedResource, setSelectedResource] = useState<string>('')
    const [resourceId, setResourceId] = useState<string>('')

    const addResult = (result: TestResult) => {
        setResults(prev => [result, ...prev])
    }

    const testAllEndpoints = async () => {
        setLoading(true)
        setResults([])

        try {
            // 1. Users
            try {
                const data = await usersClient.list()
                addResult({
                    endpoint: 'GET /api/v1/users/',
                    success: true,
                    data: { total: data.total, itemsCount: data.items.length },
                    timestamp: new Date().toISOString()
                })
            } catch (error: any) {
                addResult({
                    endpoint: 'GET /api/v1/users/',
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString()
                })
            }

            // 2. Terms
            try {
                const data = await termsClient.list()
                addResult({
                    endpoint: 'GET /api/v1/terms/',
                    success: true,
                    data: { total: data.total, itemsCount: data.items.length },
                    timestamp: new Date().toISOString()
                })
            } catch (error: any) {
                addResult({
                    endpoint: 'GET /api/v1/terms/',
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString()
                })
            }

            // 3. Cases
            try {
                const data = await casesClient.list()
                addResult({
                    endpoint: 'GET /api/v1/cases/',
                    success: true,
                    data: { total: data.total, itemsCount: data.items.length },
                    timestamp: new Date().toISOString()
                })
            } catch (error: any) {
                addResult({
                    endpoint: 'GET /api/v1/cases/',
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString()
                })
            }

            // 4. Teams
            try {
                const data = await teamsClient.list()
                addResult({
                    endpoint: 'GET /api/v1/teams/',
                    success: true,
                    data: { total: data.total, itemsCount: data.items.length },
                    timestamp: new Date().toISOString()
                })
            } catch (error: any) {
                addResult({
                    endpoint: 'GET /api/v1/teams/',
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString()
                })
            }

            // 5. Students
            try {
                const data = await studentsClient.list()
                addResult({
                    endpoint: 'GET /api/v1/students/',
                    success: true,
                    data: { total: data.total, itemsCount: data.items.length },
                    timestamp: new Date().toISOString()
                })
            } catch (error: any) {
                addResult({
                    endpoint: 'GET /api/v1/students/',
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString()
                })
            }

            // 6. Memberships
            try {
                const data = await membershipsClient.list()
                addResult({
                    endpoint: 'GET /api/v1/memberships/',
                    success: true,
                    data: { total: data.total, itemsCount: data.items.length },
                    timestamp: new Date().toISOString()
                })
            } catch (error: any) {
                addResult({
                    endpoint: 'GET /api/v1/memberships/',
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString()
                })
            }

            // 7. Meetings
            try {
                const data = await meetingsClient.list()
                addResult({
                    endpoint: 'GET /api/v1/meetings/',
                    success: true,
                    data: { total: data.total, itemsCount: data.items.length },
                    timestamp: new Date().toISOString()
                })
                
                // Если есть встречи, тестируем дополнительные эндпоинты
                // Ищем встречу, у которой есть previous_meeting_id (не первая в цепочке)
                if (data.items.length > 0) {
                    const meetingWithPrevious = data.items.find(m => m.previous_meeting_id !== null)
                    
                    if (meetingWithPrevious) {
                        // getPrevious - тестируем для встречи, у которой есть предыдущая
                        try {
                            const previousData = await meetingsClient.getPrevious(meetingWithPrevious.id)
                            addResult({
                                endpoint: `GET /api/v1/meetings/previous/${meetingWithPrevious.id}`,
                                success: true,
                                data: { count: previousData?.length || 0, meetings: previousData },
                                timestamp: new Date().toISOString()
                            })
                        } catch (error: any) {
                            addResult({
                                endpoint: `GET /api/v1/meetings/previous/${meetingWithPrevious.id}`,
                                success: false,
                                error: error.message,
                                timestamp: new Date().toISOString()
                            })
                        }
                    } else {
                        // Если нет встреч с previous_meeting_id, просто отмечаем что тестировать нечего
                        addResult({
                            endpoint: `GET /api/v1/meetings/previous/{id}`,
                            success: true,
                            data: { note: 'Нет встреч с previous_meeting_id для тестирования' },
                            timestamp: new Date().toISOString()
                        })
                    }
                }
            } catch (error: any) {
                addResult({
                    endpoint: 'GET /api/v1/meetings/',
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString()
                })
            }
            
            // 7b. Meeting Schedule (нужна команда)
            // Пробуем найти команду с расписанием
            try {
                const teamsData = await teamsClient.list()
                if (teamsData.items.length > 0) {
                    // Пробуем первую команду
                    const firstTeam = teamsData.items[0]
                    try {
                        const scheduleData = await meetingsClient.getSchedule(firstTeam.id)
                        addResult({
                            endpoint: `GET /api/v1/meetings/schedule/team/${firstTeam.id}`,
                            success: true,
                            data: scheduleData,
                            timestamp: new Date().toISOString()
                        })
                    } catch (scheduleError: any) {
                        // 404 - это нормально, значит у команды нет активного расписания
                        if (scheduleError.message?.includes('404') || scheduleError.message?.includes('Not Found')) {
                            addResult({
                                endpoint: `GET /api/v1/meetings/schedule/team/${firstTeam.id}`,
                                success: true,
                                data: { note: 'У команды нет активного расписания (это нормально)' },
                                timestamp: new Date().toISOString()
                            })
                        } else {
                            addResult({
                                endpoint: `GET /api/v1/meetings/schedule/team/${firstTeam.id}`,
                                success: false,
                                error: scheduleError.message,
                                timestamp: new Date().toISOString()
                            })
                        }
                    }
                }
            } catch (error: any) {
                addResult({
                    endpoint: 'GET /api/v1/meetings/schedule/team/{team_id}',
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString()
                })
            }

            // 8. Assignments
            try {
                const data = await assignmentsClient.list()
                addResult({
                    endpoint: 'GET /api/v1/assignments/',
                    success: true,
                    data: { total: data.total, itemsCount: data.items.length },
                    timestamp: new Date().toISOString()
                })
            } catch (error: any) {
                addResult({
                    endpoint: 'GET /api/v1/assignments/',
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString()
                })
            }

            // 9. Checkpoints
            try {
                const data = await checkpointsClient.list()
                addResult({
                    endpoint: 'GET /api/v1/checkpoints/',
                    success: true,
                    data: { total: data.total, itemsCount: data.items.length },
                    timestamp: new Date().toISOString()
                })
            } catch (error: any) {
                addResult({
                    endpoint: 'GET /api/v1/checkpoints/',
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString()
                })
            }

        } finally {
            setLoading(false)
        }
    }

    const testSingleEndpoint = async (endpoint: string, id?: number) => {
        setLoading(true)
        
        try {
            let data: any
            let endpointName = endpoint

            switch (endpoint) {
                case 'users':
                    data = id ? await usersClient.getById(id) : await usersClient.list()
                    endpointName = id ? `GET /api/v1/users/${id}` : 'GET /api/v1/users/'
                    break
                case 'terms':
                    data = id ? await termsClient.getById(id) : await termsClient.list()
                    endpointName = id ? `GET /api/v1/terms/${id}` : 'GET /api/v1/terms/'
                    break
                case 'cases':
                    data = id ? await casesClient.getById(id) : await casesClient.list()
                    endpointName = id ? `GET /api/v1/cases/${id}` : 'GET /api/v1/cases/'
                    break
                case 'teams':
                    data = id ? await teamsClient.getById(id) : await teamsClient.list()
                    endpointName = id ? `GET /api/v1/teams/${id}` : 'GET /api/v1/teams/'
                    break
                case 'students':
                    data = id ? await studentsClient.getById(id) : await studentsClient.list()
                    endpointName = id ? `GET /api/v1/students/${id}` : 'GET /api/v1/students/'
                    break
                case 'memberships':
                    data = id ? await membershipsClient.getById(id) : await membershipsClient.list()
                    endpointName = id ? `GET /api/v1/memberships/${id}` : 'GET /api/v1/memberships/'
                    break
                case 'meetings':
                    data = id ? await meetingsClient.getById(id) : await meetingsClient.list()
                    endpointName = id ? `GET /api/v1/meetings/${id}` : 'GET /api/v1/meetings/'
                    break
                case 'assignments':
                    data = id ? await assignmentsClient.getById(id) : await assignmentsClient.list()
                    endpointName = id ? `GET /api/v1/assignments/${id}` : 'GET /api/v1/assignments/'
                    break
                case 'checkpoints':
                    data = id ? await checkpointsClient.getById(id) : await checkpointsClient.list()
                    endpointName = id ? `GET /api/v1/checkpoints/${id}` : 'GET /api/v1/checkpoints/'
                    break
            }

            addResult({
                endpoint: endpointName,
                success: true,
                data: id ? data : { total: data.total, itemsCount: data.items.length, firstItem: data.items[0] },
                timestamp: new Date().toISOString()
            })
        } catch (error: any) {
            addResult({
                endpoint: endpoint,
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            })
        } finally {
            setLoading(false)
        }
    }

    const clearResults = () => {
        setResults([])
    }

    const successCount = results.filter(r => r.success).length
    const errorCount = results.filter(r => !r.success).length

    return (
        <div style={{
            padding: '40px',
            maxWidth: '1400px',
            margin: '0 auto',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <h1 style={{ marginBottom: '10px' }}>Тестирование GET запросов API</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>
                Эта страница позволяет протестировать все GET эндпоинты API
            </p>

            {/* Статистика */}
            {results.length > 0 && (
                <div style={{
                    display: 'flex',
                    gap: '20px',
                    marginBottom: '30px',
                    padding: '15px',
                    background: '#f8f9fa',
                    borderRadius: '8px'
                }}>
                    <div>
                        <strong>Всего запросов:</strong> {results.length}
                    </div>
                    <div style={{ color: '#28a745' }}>
                        <strong>Успешных:</strong> {successCount}
                    </div>
                    <div style={{ color: '#dc3545' }}>
                        <strong>Ошибок:</strong> {errorCount}
                    </div>
                </div>
            )}

            {/* Кнопки действий */}
            <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '30px',
                flexWrap: 'wrap'
            }}>
                <button
                    onClick={testAllEndpoints}
                    disabled={loading}
                    style={{
                        padding: '12px 24px',
                        fontSize: '16px',
                        background: loading ? '#6c757d' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: 600
                    }}
                >
                    {loading ? 'Загрузка...' : 'Протестировать все GET запросы'}
                </button>

                <button
                    onClick={clearResults}
                    disabled={loading || results.length === 0}
                    style={{
                        padding: '12px 24px',
                        fontSize: '16px',
                        background: results.length === 0 ? '#6c757d' : '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: results.length === 0 ? 'not-allowed' : 'pointer'
                    }}
                >
                    Очистить результаты
                </button>
            </div>

            {/* Быстрые кнопки для отдельных эндпоинтов */}
            <div style={{
                marginBottom: '30px',
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '8px'
            }}>
                <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Отдельные эндпоинты:</h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '10px',
                    marginBottom: '15px'
                }}>
                    {['users', 'terms', 'cases', 'teams', 'students', 'memberships', 'meetings', 'assignments', 'checkpoints'].map(endpoint => (
                        <div key={endpoint} style={{ display: 'flex', gap: '5px' }}>
                            <button
                                onClick={() => testSingleEndpoint(endpoint)}
                                disabled={loading}
                                style={{
                                    padding: '10px 16px',
                                    background: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    textTransform: 'capitalize',
                                    fontSize: '14px',
                                    flex: 1
                                }}
                            >
                                GET /{endpoint}/
                            </button>
                        </div>
                    ))}
                </div>
                
                {/* Тест по ID */}
                <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    background: 'white',
                    borderRadius: '6px',
                    border: '1px solid #dee2e6'
                }}>
                    <h4 style={{ marginTop: 0, marginBottom: '10px' }}>Тест по ID:</h4>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <select
                            onChange={(e) => setSelectedResource(e.target.value)}
                            value={selectedResource}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '4px',
                                border: '1px solid #ced4da',
                                fontSize: '14px'
                            }}
                        >
                            <option value="">Выберите ресурс</option>
                            {['users', 'terms', 'cases', 'teams', 'students', 'memberships', 'meetings', 'assignments', 'checkpoints'].map(ep => (
                                <option key={ep} value={ep}>{ep}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="ID"
                            value={resourceId}
                            onChange={(e) => setResourceId(e.target.value)}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '4px',
                                border: '1px solid #ced4da',
                                fontSize: '14px',
                                width: '100px'
                            }}
                        />
                        <button
                            onClick={() => {
                                if (selectedResource && resourceId) {
                                    const id = parseInt(resourceId)
                                    if (!isNaN(id)) {
                                        testSingleEndpoint(selectedResource, id)
                                    }
                                }
                            }}
                            disabled={loading || !selectedResource || !resourceId}
                            style={{
                                padding: '8px 16px',
                                background: selectedResource && resourceId ? '#007bff' : '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: loading || !selectedResource || !resourceId ? 'not-allowed' : 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            Тестировать по ID
                        </button>
                    </div>
                </div>
            </div>

            {/* Результаты */}
            <div>
                <h2 style={{ marginBottom: '15px' }}>Результаты запросов:</h2>
                
                {results.length === 0 ? (
                    <div style={{
                        padding: '40px',
                        textAlign: 'center',
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        color: '#666'
                    }}>
                        Нажмите кнопку выше, чтобы начать тестирование
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {results.map((result, index) => (
                            <div
                                key={index}
                                style={{
                                    padding: '15px',
                                    background: result.success ? '#d4edda' : '#f8d7da',
                                    border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.1s'
                                }}
                                onClick={() => setExpandedResult(expandedResult === result.endpoint ? null : result.endpoint)}
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: result.endpoint === expandedResult ? '10px' : '0'
                                }}>
                                    <div style={{
                                        fontWeight: 600,
                                        color: result.success ? '#155724' : '#721c24',
                                        fontSize: '15px'
                                    }}>
                                        {result.success ? '✅' : '❌'} {result.endpoint}
                                    </div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: result.success ? '#155724' : '#721c24',
                                        opacity: 0.7
                                    }}>
                                        {new Date(result.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>

                                {result.endpoint === expandedResult && (
                                    <div style={{
                                        marginTop: '10px',
                                        padding: '10px',
                                        background: 'white',
                                        borderRadius: '4px',
                                        border: '1px solid #dee2e6'
                                    }}>
                                        {result.success ? (
                                            <pre style={{
                                                margin: 0,
                                                fontSize: '12px',
                                                overflow: 'auto',
                                                maxHeight: '400px',
                                                whiteSpace: 'pre-wrap',
                                                wordBreak: 'break-word'
                                            }}>
                                                {JSON.stringify(result.data, null, 2)}
                                            </pre>
                                        ) : (
                                            <div style={{ color: '#721c24', fontSize: '14px' }}>
                                                <strong>Ошибка:</strong> {result.error}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {!expandedResult && result.success && result.data && (
                                    <div style={{
                                        marginTop: '8px',
                                        fontSize: '13px',
                                        color: result.success ? '#155724' : '#721c24',
                                        opacity: 0.8
                                    }}>
                                        {result.data.total !== undefined 
                                            ? `Всего: ${result.data.total}, Показано: ${result.data.itemsCount || 0}`
                                            : 'Данные загружены'
                                        }
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

