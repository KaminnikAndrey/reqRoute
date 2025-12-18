'use client'

import { useState } from 'react'
import { 
    usersClient, 
    termsClient, 
    casesClient, 
    teamsClient, 
    studentsClient, 
    membershipsClient,
    meetingsClient,
    assignmentsClient,
    checkpointsClient
} from '@/lib/clients'
import { authApiClient } from '@/lib/authApi'

interface SeedResult {
    success: boolean
    message: string
    data?: any
}

export default function SeedDataPage() {
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<SeedResult[]>([])
    const [progress, setProgress] = useState(0)

    const addResult = (result: SeedResult) => {
        setResults(prev => [...prev, result])
    }

    const seedData = async () => {
        setLoading(true)
        setResults([])
        setProgress(0)

        try {
            const createdIds: { [key: string]: number[] } = {
                users: [],
                terms: [],
                cases: [],
                teams: [],
                students: [],
                memberships: [],
                meetings: [],
                assignments: [],
                checkpoints: []
            }

            // 1. Создание пользователей
            addResult({ success: true, message: 'Создание пользователей...' })
            const users = [
                { full_name: 'Алиса Куратор', email: 'alice@example.com', password: 'pass' },
                { full_name: 'Боб Наставник', email: 'bob@example.com', password: 'pass' },
                { full_name: 'Чарли Ментор', email: 'charlie@example.com', password: 'pass' },
            ]

            for (const user of users) {
                try {
                    const created = await usersClient.create(user)
                    createdIds.users.push(created.id)
                    addResult({ success: true, message: `✓ Создан пользователь: ${created.full_name}`, data: created })
                } catch (error: any) {
                    addResult({ success: false, message: `✗ Ошибка создания пользователя ${user.email}: ${error.message}` })
                }
            }
            setProgress(10)

            // 2. Создание семестров
            addResult({ success: true, message: 'Создание семестров...' })
            const terms = [
                { year: 2025, season: 'autumn' as const, start_date: '2025-09-01', end_date: '2025-12-31' },
                { year: 2026, season: 'spring' as const, start_date: '2026-02-01', end_date: '2026-05-31' },
            ]

            for (const term of terms) {
                try {
                    const created = await termsClient.create(term)
                    createdIds.terms.push(created.id)
                    addResult({ success: true, message: `✓ Создан семестр: ${created.year} ${created.season}`, data: created })
                } catch (error: any) {
                    addResult({ success: false, message: `✗ Ошибка создания семестра: ${error.message}` })
                }
            }
            setProgress(20)

            // 3. Создание кейсов
            addResult({ success: true, message: 'Создание кейсов...' })
            const cases = [
                { term_id: createdIds.terms[0], user_id: createdIds.users[0], title: 'AI Research Project', description: 'Проект по NLP' },
                { term_id: createdIds.terms[0], user_id: createdIds.users[1], title: 'Data Warehouse Revamp', description: 'Проект по ETL' },
                { term_id: createdIds.terms[1], user_id: createdIds.users[2], title: 'Mobile App Launch', description: 'React Native проект' },
            ]

            for (const caseData of cases) {
                try {
                    const created = await casesClient.create(caseData)
                    createdIds.cases.push(created.id)
                    addResult({ success: true, message: `✓ Создан кейс: ${created.title}`, data: created })
                } catch (error: any) {
                    addResult({ success: false, message: `✗ Ошибка создания кейса: ${error.message}` })
                }
            }
            setProgress(30)

            // 4. Создание команд
            addResult({ success: true, message: 'Создание команд...' })
            const teams = [
                { title: 'Команда Альфа', case_id: createdIds.cases[0], workspace_link: 'https://example.com/ws/alpha' },
                { title: 'Команда Бета', case_id: createdIds.cases[0], workspace_link: 'https://example.com/ws/beta' },
                { title: 'Команда Гамма', case_id: createdIds.cases[1], workspace_link: 'https://example.com/ws/gamma' },
                { title: 'Команда Дельта', case_id: createdIds.cases[2], workspace_link: 'https://example.com/ws/delta' },
            ]

            for (const team of teams) {
                try {
                    const created = await teamsClient.create(team)
                    createdIds.teams.push(created.id)
                    addResult({ success: true, message: `✓ Создана команда: ${created.title}`, data: created })
                } catch (error: any) {
                    addResult({ success: false, message: `✗ Ошибка создания команды: ${error.message}` })
                }
            }
            setProgress(40)

            // 5. Создание студентов
            addResult({ success: true, message: 'Создание студентов...' })
            const students = [
                { full_name: 'Иван Петров' },
                { full_name: 'Мария Сидорова' },
                { full_name: 'Алексей Иванов' },
                { full_name: 'Ольга Смирнова' },
                { full_name: 'Дмитрий Козлов' },
            ]

            for (const student of students) {
                try {
                    const created = await studentsClient.create(student)
                    createdIds.students.push(created.id)
                    addResult({ success: true, message: `✓ Создан студент: ${created.full_name}`, data: created })
                } catch (error: any) {
                    addResult({ success: false, message: `✗ Ошибка создания студента: ${error.message}` })
                }
            }
            setProgress(50)

            // 6. Создание членств в командах
            addResult({ success: true, message: 'Создание членств в командах...' })
            const memberships = [
                { student_id: createdIds.students[0], team_id: createdIds.teams[0], role: 'Тимлид', group: 'А-1' },
                { student_id: createdIds.students[1], team_id: createdIds.teams[0], role: 'Аналитик', group: 'А-1' },
                { student_id: createdIds.students[2], team_id: createdIds.teams[1], role: 'Разработчик', group: 'Б-2' },
                { student_id: createdIds.students[3], team_id: createdIds.teams[2], role: 'PM', group: 'В-3' },
                { student_id: createdIds.students[4], team_id: createdIds.teams[3], role: 'QA', group: 'Г-4' },
            ]

            for (const membership of memberships) {
                try {
                    const created = await membershipsClient.create(membership)
                    createdIds.memberships.push(created.id)
                    addResult({ success: true, message: `✓ Создано членство в команде`, data: created })
                } catch (error: any) {
                    addResult({ success: false, message: `✗ Ошибка создания членства: ${error.message}` })
                }
            }
            setProgress(60)

            // 7. Создание встреч
            addResult({ success: true, message: 'Создание встреч...' })
            const now = new Date()
            const meetings = []
            
            for (let i = 0; i < createdIds.teams.length; i++) {
                const teamId = createdIds.teams[i]
                const date1 = new Date(now.getTime() + i * 24 * 60 * 60 * 1000)
                const date2 = new Date(date1.getTime() + 7 * 24 * 60 * 60 * 1000)
                const date3 = new Date(date2.getTime() + 7 * 24 * 60 * 60 * 1000)

                meetings.push(
                    { team_id: teamId, date_time: date1.toISOString(), summary: `Встреча команды ${i + 1} - Старт проекта` },
                    { team_id: teamId, date_time: date2.toISOString(), summary: `Встреча команды ${i + 1} - Промежуточный чекпоинт` },
                    { team_id: teamId, date_time: date3.toISOString(), summary: `Встреча команды ${i + 1} - Итоговая встреча` },
                )
            }

            for (const meeting of meetings) {
                try {
                    const created = await meetingsClient.create(meeting)
                    createdIds.meetings.push(created.id)
                    addResult({ success: true, message: `✓ Создана встреча: ${created.summary}`, data: created })
                } catch (error: any) {
                    addResult({ success: false, message: `✗ Ошибка создания встречи: ${error.message}` })
                }
            }
            setProgress(80)

            // 8. Создание поручений
            addResult({ success: true, message: 'Создание поручений...' })
            for (const meetingId of createdIds.meetings.slice(0, 3)) {
                try {
                    const assignment = await assignmentsClient.create({
                        meeting_id: meetingId,
                        text: 'Подготовить презентацию',
                        completed: false
                    })
                    createdIds.assignments.push(assignment.id)
                    addResult({ success: true, message: `✓ Создано поручение`, data: assignment })
                } catch (error: any) {
                    addResult({ success: false, message: `✗ Ошибка создания поручения: ${error.message}` })
                }
            }
            setProgress(90)

            // 9. Создание контрольных точек
            addResult({ success: true, message: 'Создание контрольных точек...' })
            for (let i = 0; i < createdIds.teams.length; i++) {
                try {
                    const checkpoint = await checkpointsClient.create({
                        team_id: createdIds.teams[i],
                        number: 1,
                        date: '2025-10-15',
                        project_state: 'В работе',
                        mark: 4,
                    })
                    createdIds.checkpoints.push(checkpoint.id)
                    addResult({ success: true, message: `✓ Создана контрольная точка`, data: checkpoint })
                } catch (error: any) {
                    addResult({ success: false, message: `✗ Ошибка создания контрольной точки: ${error.message}` })
                }
            }

            setProgress(100)
            addResult({ 
                success: true, 
                message: `✅ Заполнение базы данных завершено! Создано: ${createdIds.users.length} пользователей, ${createdIds.terms.length} семестров, ${createdIds.cases.length} кейсов, ${createdIds.teams.length} команд, ${createdIds.students.length} студентов, ${createdIds.meetings.length} встреч` 
            })

        } catch (error: any) {
            addResult({ success: false, message: `Критическая ошибка: ${error.message}` })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            padding: '40px',
            maxWidth: '1200px',
            margin: '0 auto'
        }}>
            <h1 style={{ marginBottom: '30px' }}>Заполнение базы данных тестовыми данными</h1>

            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={seedData}
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
                    {loading ? 'Заполнение...' : 'Заполнить базу данных'}
                </button>

                {loading && (
                    <div style={{
                        marginTop: '20px',
                        width: '100%',
                        height: '20px',
                        background: '#e9ecef',
                        borderRadius: '10px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: '#28a745',
                            transition: 'width 0.3s ease'
                        }}></div>
                    </div>
                )}
            </div>

            <div style={{
                background: '#f8f9fa',
                borderRadius: '8px',
                padding: '20px',
                maxHeight: '600px',
                overflowY: 'auto'
            }}>
                <h2 style={{ marginTop: 0, marginBottom: '15px' }}>Результаты:</h2>
                {results.length === 0 ? (
                    <p style={{ color: '#6c757d' }}>Нажмите кнопку выше, чтобы начать заполнение базы данных</p>
                ) : (
                    <div style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                        {results.map((result, index) => (
                            <div
                                key={index}
                                style={{
                                    padding: '8px',
                                    marginBottom: '4px',
                                    background: result.success ? '#d4edda' : '#f8d7da',
                                    border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
                                    borderRadius: '4px',
                                    color: result.success ? '#155724' : '#721c24'
                                }}
                            >
                                {result.message}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}









