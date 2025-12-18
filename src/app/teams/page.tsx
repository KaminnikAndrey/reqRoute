'use client'

import { useState, useEffect } from 'react'
import styles from "../main/styles.module.css"
import Link from "next/link";
import Header from "@/components/header/Header";
import { teamsClient, membershipsClient, studentsClient } from '@/lib/clients'
import type { TeamRead, TeamMembershipRead, StudentRead } from '@/lib/apiTypes'

interface TeamWithMembers extends TeamRead {
    members: Array<{
        student: StudentRead
        membership: TeamMembershipRead
    }>
}

export default function Teams() {
    const [teams, setTeams] = useState<TeamWithMembers[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        async function fetchTeams() {
            try {
                setIsLoading(true)
                setError(null)

                // Получаем все команды
                const teamsResponse = await teamsClient.list({ page_size: 100 })
                
                // Получаем все memberships
                const membershipsResponse = await membershipsClient.list({ page_size: 100 })
                
                // Получаем всех студентов
                const studentsResponse = await studentsClient.list({ page_size: 100 })
                const studentsMap = new Map(studentsResponse.items.map(s => [s.id, s]))
                
                // Группируем memberships по team_id
                const membershipsByTeam = new Map<number, TeamMembershipRead[]>()
                membershipsResponse.items.forEach(membership => {
                    if (!membershipsByTeam.has(membership.team_id)) {
                        membershipsByTeam.set(membership.team_id, [])
                    }
                    membershipsByTeam.get(membership.team_id)!.push(membership)
                })
                
                // Собираем команды с участниками
                const teamsWithMembers: TeamWithMembers[] = teamsResponse.items.map(team => {
                    const teamMemberships = membershipsByTeam.get(team.id) || []
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

                    return {
                        ...team,
                        members
                    }
                })

                setTeams(teamsWithMembers)
            } catch (err) {
                console.error('Ошибка загрузки команд:', err)
                setError(err instanceof Error ? err : new Error('Неизвестная ошибка'))
            } finally {
                setIsLoading(false)
            }
        }

        fetchTeams()
    }, [])

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
                        Загрузка команд...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.center}>
                <div className={styles.wrapper}>
                    <Header />
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#dc3545'
                    }}>
                        <h3>Ошибка при загрузке команд</h3>
                        <p>{error.message || 'Неизвестная ошибка'}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.center}>
            <div className={styles.wrapper}>
                <Header/>
                
                <p className={styles.titleFrom} style={{marginTop: 10, marginBottom: 10}}>
                    Все команды ({teams.length})
                </p>

                {teams.length > 0 ? (
                    teams.map(team => (
                        <div
                            key={team.id}
                            style={{
                                background: '#f8f9fa',
                                borderRadius: '8px',
                                padding: '15px',
                                marginBottom: '15px',
                                border: '1px solid #e9ecef'
                            }}
                        >
                            <Link 
                                href={`/teams/${team.id}`}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <h3 style={{ 
                                    margin: '0 0 10px 0', 
                                    fontSize: '16px', 
                                    fontWeight: 600,
                                    color: '#EF3124',
                                    cursor: 'pointer'
                                }}>
                                    {team.title}
                                </h3>
                            </Link>
                            
                            {team.members.length > 0 ? (
                                <div>
                                    <p style={{ 
                                        margin: '10px 0 5px 0', 
                                        fontSize: '14px', 
                                        fontWeight: 500,
                                        color: '#495057'
                                    }}>
                                        Участники ({team.members.length}):
                                    </p>
                                    <ul style={{ 
                                        listStyle: 'none', 
                                        padding: 0, 
                                        margin: 0,
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '10px'
                                    }}>
                                        {team.members.map(({ student, membership }) => (
                                            <li
                                                key={membership.id}
                                                style={{
                                                    background: 'white',
                                                    padding: '8px 12px',
                                                    borderRadius: '6px',
                                                    border: '1px solid #dee2e6',
                                                    fontSize: '13px'
                                                }}
                                            >
                                                <div style={{ fontWeight: 500 }}>
                                                    {student.full_name}
                                                </div>
                                                {membership.role && (
                                                    <div style={{ 
                                                        fontSize: '11px', 
                                                        color: '#6c757d',
                                                        marginTop: '2px'
                                                    }}>
                                                        {membership.role}
                                                    </div>
                                                )}
                                                <div style={{ 
                                                    fontSize: '11px', 
                                                    color: '#868e96',
                                                    marginTop: '2px'
                                                }}>
                                                    Группа: {membership.group}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p style={{ 
                                    margin: '10px 0 0 0', 
                                    fontSize: '13px', 
                                    color: '#6c757d',
                                    fontStyle: 'italic'
                                }}>
                                    Нет участников в команде
                                </p>
                            )}
                        </div>
                    ))
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
                            Команды не найдены
                        </p>
                    </div>
                )}

                <div className={styles.wrap} style={{marginTop: '20px'}}>
                    <p className={styles.text}>© ReqRoute · 2025</p>
                </div>
            </div>
        </div>
    )
}

