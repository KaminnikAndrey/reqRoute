'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import styles from "../../main/styles.module.css"
import Link from "next/link";
import Header from "@/components/header/Header";
import { teamsClient, membershipsClient, studentsClient } from '@/lib/clients'
import type { TeamRead, TeamMembershipRead, StudentRead } from '@/lib/apiTypes'
import { useUpcomingMeetings } from '@/hooks/useMeetingApi'
import { formatMeetingDate, formatMeetingTime } from '@/utils/dateFormatters'
import MeetingLi from '@/components/MeetingLi/MeetingLi'
import { Select, Input, Button } from 'antd'

interface TeamWithMembers extends TeamRead {
    members: Array<{
        student: StudentRead
        membership: TeamMembershipRead
    }>
}

export default function TeamDetail() {
    const params = useParams()
    const teamId = params?.teamId ? parseInt(params.teamId as string, 10) : null
    
    const [team, setTeam] = useState<TeamWithMembers | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [allStudents, setAllStudents] = useState<StudentRead[]>([])
    const [isAddingMember, setIsAddingMember] = useState(false)
    
    // Форма добавления участника
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)
    const [newMemberRole, setNewMemberRole] = useState<string>('')
    const [newMemberGroup, setNewMemberGroup] = useState<string>('')
    
    // Получаем встречи команды
    const { upcomingMeetings } = useUpcomingMeetings()
    const teamMeetings = teamId ? upcomingMeetings.filter(m => m.team_id === teamId) : []
    
    // Получаем список всех студентов для выбора
    useEffect(() => {
        async function fetchStudents() {
            try {
                const response = await studentsClient.list({ page_size: 100 })
                setAllStudents(response.items)
            } catch (err) {
                console.error('Ошибка загрузки студентов:', err)
            }
        }
        fetchStudents()
    }, [])

    useEffect(() => {
        async function fetchTeam() {
            if (!teamId) {
                setError(new Error('ID команды не указан'))
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                setError(null)

                // Получаем команду
                const teamData = await teamsClient.getById(teamId)
                
                // Получаем memberships для команды
                const membershipsResponse = await membershipsClient.list({ page_size: 100 })
                const teamMemberships = membershipsResponse.items.filter(m => m.team_id === teamId)
                
                // Получаем всех студентов
                const studentsResponse = await studentsClient.list({ page_size: 100 })
                const studentsMap = new Map(studentsResponse.items.map(s => [s.id, s]))
                
                // Собираем участников
                const members = teamMemberships
                    .map(membership => {
                        const student = studentsMap.get(membership.student_id)
                        if (!student) return null
                        return {
                            student,
                            membership
                        }
                    })
                    .filter((m): m is { student: StudentRead; membership: TeamMembershipRead } => m !== null)

                setTeam({
                    ...teamData,
                    members
                })
            } catch (err) {
                console.error('Ошибка загрузки команды:', err)
                setError(err instanceof Error ? err : new Error('Неизвестная ошибка'))
            } finally {
                setIsLoading(false)
            }
        }

        fetchTeam()
    }, [teamId])

    const refreshTeam = async () => {
        if (!teamId) return

        try {
            // Получаем команду
            const teamData = await teamsClient.getById(teamId)
            
            // Получаем memberships для команды
            const membershipsResponse = await membershipsClient.list({ page_size: 100 })
            const teamMemberships = membershipsResponse.items.filter(m => m.team_id === teamId)
            
            // Получаем всех студентов
            const studentsResponse = await studentsClient.list({ page_size: 100 })
            const studentsMap = new Map(studentsResponse.items.map(s => [s.id, s]))
            
            // Собираем участников
            const members = teamMemberships
                .map(membership => {
                    const student = studentsMap.get(membership.student_id)
                    if (!student) return null
                    return {
                        student,
                        membership
                    }
                })
                .filter((m): m is { student: StudentRead; membership: TeamMembershipRead } => m !== null)

            setTeam({
                ...teamData,
                members
            })
        } catch (err) {
            console.error('Ошибка обновления команды:', err)
        }
    }

    const handleAddMember = async () => {
        if (!teamId || !selectedStudentId || !newMemberGroup.trim()) {
            alert('Заполните все обязательные поля')
            return
        }

        // Проверяем, не добавлен ли уже этот студент
        if (team?.members.some(m => m.student.id === selectedStudentId)) {
            alert('Этот студент уже в команде')
            return
        }

        setIsAddingMember(true)

        try {
            await membershipsClient.create({
                student_id: selectedStudentId,
                team_id: teamId,
                role: newMemberRole.trim() || null,
                group: newMemberGroup.trim()
            })

            // Очищаем форму
            setSelectedStudentId(null)
            setNewMemberRole('')
            setNewMemberGroup('')

            // Обновляем данные команды
            await refreshTeam()
        } catch (err) {
            console.error('Ошибка добавления участника:', err)
            alert('Не удалось добавить участника')
        } finally {
            setIsAddingMember(false)
        }
    }

    const handleRemoveMember = async (membershipId: number) => {
        if (!confirm('Вы уверены, что хотите удалить этого участника из команды?')) {
            return
        }

        try {
            await membershipsClient.delete(membershipId)
            // Обновляем данные команды
            await refreshTeam()
        } catch (err) {
            console.error('Ошибка удаления участника:', err)
            alert('Не удалось удалить участника')
        }
    }

    if (isLoading) {
        return (
            <div className={styles.center}>
                <div className={styles.wrapper}>
                    <Header />
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#666'
                    }}>
                        Загрузка команды...
                    </div>
                </div>
            </div>
        );
    }

    if (error || !team) {
        return (
            <div className={styles.center}>
                <div className={styles.wrapper}>
                    <Header />
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#dc3545'
                    }}>
                        <h3>Ошибка при загрузке команды</h3>
                        <p>{error?.message || 'Команда не найдена'}</p>
                        <Link href="/teams" className={styles.link} style={{ marginTop: '20px', display: 'inline-block' }}>
                            Вернуться к списку команд
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.center}>
            <div className={styles.wrapper}>
                <Header/>
                
                <Link href="/teams" className={styles.link} style={{ marginBottom: '10px', display: 'inline-block' }}>
                    ← Назад к списку команд
                </Link>

                <p className={styles.titleFrom} style={{marginTop: 10, marginBottom: 10}}>
                    {team.title}
                </p>

                {team.workspace_link && (
                    <div style={{ marginBottom: '20px' }}>
                        <p className={styles.text} style={{ marginBottom: '5px' }}>Рабочее пространство:</p>
                        <a 
                            href={team.workspace_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={styles.link}
                        >
                            {team.workspace_link}
                        </a>
                    </div>
                )}

                {team.final_mark !== null && (
                    <div style={{ marginBottom: '20px' }}>
                        <p className={styles.text} style={{ marginBottom: '5px' }}>Итоговая оценка:</p>
                        <p style={{ fontSize: '18px', fontWeight: 600, color: '#EF3124' }}>
                            {team.final_mark}
                        </p>
                    </div>
                )}

                <p className={styles.titleFrom} style={{marginTop: 20, marginBottom: 10}}>
                    Участники команды ({team.members.length})
                </p>

                {/* Форма добавления участника */}
                <div style={{
                    background: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    marginBottom: '15px'
                }}>
                    <p style={{ fontWeight: 600, marginBottom: '10px', fontSize: '14px' }}>Добавить участника</p>
                    
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#495057' }}>
                            Студент *
                        </label>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Выберите студента"
                            value={selectedStudentId}
                            onChange={(value) => setSelectedStudentId(value)}
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={allStudents
                                .filter(s => !team.members.some(m => m.student.id === s.id))
                                .map(s => ({
                                    value: s.id,
                                    label: s.full_name
                                }))}
                        />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#495057' }}>
                            Роль
                        </label>
                        <Input
                            placeholder="Например: Разработчик, Дизайнер"
                            value={newMemberRole}
                            onChange={(e) => setNewMemberRole(e.target.value)}
                        />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#495057' }}>
                            Группа *
                        </label>
                        <Input
                            placeholder="Например: ИВТ-21-1"
                            value={newMemberGroup}
                            onChange={(e) => setNewMemberGroup(e.target.value)}
                            required
                        />
                    </div>

                    <Button
                        type="primary"
                        onClick={handleAddMember}
                        loading={isAddingMember}
                        disabled={!selectedStudentId || !newMemberGroup.trim()}
                        style={{ width: '100%', backgroundColor: '#EF3124', borderColor: '#EF3124' }}
                    >
                        Добавить участника
                    </Button>
                </div>

                {/* Список участников */}
                {team.members.length > 0 ? (
                    <ul style={{ 
                        listStyle: 'none', 
                        padding: 0, 
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}>
                        {team.members.map(({ student, membership }) => (
                            <li
                                key={membership.id}
                                style={{
                                    background: '#f8f9fa',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start'
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '5px' }}>
                                        {student.full_name}
                                    </div>
                                    {membership.role && (
                                        <div style={{ 
                                            fontSize: '13px', 
                                            color: '#6c757d',
                                            marginBottom: '3px'
                                        }}>
                                            Роль: {membership.role}
                                        </div>
                                    )}
                                    <div style={{ 
                                        fontSize: '13px', 
                                        color: '#868e96'
                                    }}>
                                        Группа: {membership.group}
                                    </div>
                                </div>
                                <Button
                                    type="text"
                                    danger
                                    onClick={() => handleRemoveMember(membership.id)}
                                    style={{ marginLeft: '10px' }}
                                >
                                    Удалить
                                </Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '20px',
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        margin: '10px 0',
                        border: '1px dashed #dee2e6'
                    }}>
                        <p style={{ color: '#6c757d', margin: 0 }}>
                            Нет участников в команде
                        </p>
                    </div>
                )}

                {teamMeetings.length > 0 && (
                    <>
                        <p className={styles.titleFrom} style={{marginTop: 20, marginBottom: 10}}>
                            Встречи команды ({teamMeetings.length})
                        </p>
                        {teamMeetings.map(meeting => (
                            <MeetingLi 
                                key={meeting.id}
                                date={formatMeetingDate(meeting.date_time)} 
                                time={formatMeetingTime(meeting.date_time)} 
                                title={meeting.summary || `Встреча команды #${meeting.team_id}`} 
                                platform={meeting.recording_link ? 'Google Meet' : 'Очная встреча'}
                                detailsLink={`/minutesOfMeeting?meetingId=${meeting.id}`}
                            />
                        ))}
                    </>
                )}

                <div className={styles.wrap} style={{marginTop: '20px'}}>
                    <p className={styles.text}>© ReqRoute · 2025</p>
                </div>
            </div>
        </div>
    )
}

