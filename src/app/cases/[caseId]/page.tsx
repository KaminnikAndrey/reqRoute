'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import styles from "../../main/styles.module.css"
import Link from "next/link";
import Header from "@/components/header/Header";
import { casesClient, teamsClient } from '@/lib/clients'
import type { CaseRead, TeamRead } from '@/lib/apiTypes'

export default function CaseDetail() {
    const params = useParams()
    const caseId = params?.caseId ? parseInt(params.caseId as string, 10) : null
    
    const [caseItem, setCaseItem] = useState<CaseRead | null>(null)
    const [teams, setTeams] = useState<TeamRead[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        if (caseId) {
            fetchCaseAndTeams()
        }
    }, [caseId])

    const fetchCaseAndTeams = async () => {
        if (!caseId) return

        try {
            setIsLoading(true)
            setError(null)

            // Получаем кейс
            const caseData = await casesClient.getById(caseId)
            setCaseItem(caseData)

            // Получаем все команды и фильтруем по case_id
            const teamsResponse = await teamsClient.list({ page_size: 100 })
            const caseTeams = teamsResponse.items.filter(team => team.case_id === caseId)
            setTeams(caseTeams)
        } catch (err) {
            console.error('Ошибка загрузки данных:', err)
            setError(err instanceof Error ? err : new Error('Неизвестная ошибка'))
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusText = (status: string): string => {
        const statusMap: Record<string, string> = {
            'draft': 'Черновик',
            'active': 'В разработке',
            'voting in progress': 'На голосовании',
            'done': 'Отобран'
        }
        return statusMap[status] || status
    }

    const getStatusColor = (status: string): string => {
        const colorMap: Record<string, string> = {
            'draft': '#6c757d',
            'active': '#007bff',
            'voting in progress': '#ffc107',
            'done': '#28a745'
        }
        return colorMap[status] || '#6c757d'
    }

    if (!caseId) {
        return (
            <div className={styles.center}>
                <div className={styles.wrapper}>
                    <Header />
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#dc3545'
                    }}>
                        <h3>Кейс не найден</h3>
                        <p>Неверный ID кейса</p>
                        <Link href="/cases" style={{ color: '#EF3124', textDecoration: 'none' }}>
                            ← Вернуться к списку кейсов
                        </Link>
                    </div>
                </div>
            </div>
        )
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
                        Загрузка данных...
                    </div>
                </div>
            </div>
        );
    }

    if (error && !caseItem) {
        return (
            <div className={styles.center}>
                <div className={styles.wrapper}>
                    <Header />
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#dc3545'
                    }}>
                        <h3>Ошибка при загрузке данных</h3>
                        <p>{error.message || 'Неизвестная ошибка'}</p>
                        <button 
                            onClick={fetchCaseAndTeams} 
                            style={{ 
                                marginTop: '20px',
                                padding: '10px 20px',
                                backgroundColor: '#EF3124',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            Повторить попытку
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!caseItem) {
        return null
    }

    return (
        <div className={styles.center}>
            <div className={styles.wrapper}>
                <Header/>
                
                {/* Кнопка назад */}
                <Link 
                    href="/cases" 
                    style={{ 
                        color: '#EF3124', 
                        textDecoration: 'none',
                        fontSize: '14px',
                        display: 'inline-block',
                        marginBottom: '15px'
                    }}
                >
                    ← Вернуться к списку кейсов
                </Link>

                {/* Информация о кейсе */}
                <div style={{
                    background: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    marginBottom: '20px'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '15px'
                    }}>
                        <h1 style={{ 
                            margin: 0, 
                            fontSize: '24px', 
                            fontWeight: 600,
                            color: '#212529'
                        }}>
                            {caseItem.title}
                        </h1>
                        <span style={{
                            padding: '6px 16px',
                            borderRadius: '16px',
                            fontSize: '13px',
                            fontWeight: 500,
                            backgroundColor: getStatusColor(caseItem.status) + '20',
                            color: getStatusColor(caseItem.status),
                            border: `1px solid ${getStatusColor(caseItem.status)}`
                        }}>
                            {getStatusText(caseItem.status)}
                        </span>
                    </div>
                    
                    {caseItem.description && (
                        <p style={{ 
                            margin: '15px 0', 
                            fontSize: '15px', 
                            color: '#495057',
                            lineHeight: '1.6'
                        }}>
                            {caseItem.description}
                        </p>
                    )}
                    
                    <div style={{ 
                        marginTop: '15px',
                        fontSize: '13px',
                        color: '#868e96',
                        display: 'flex',
                        gap: '20px',
                        flexWrap: 'wrap'
                    }}>
                        <span>ID кейса: {caseItem.id}</span>
                        <span>Трек ID: {caseItem.term_id}</span>
                        <span>Автор ID: {caseItem.user_id}</span>
                    </div>
                </div>

                {/* Список команд */}
                <p className={styles.titleFrom} style={{marginTop: 10, marginBottom: 10}}>
                    Команды ({teams.length})
                </p>

                {teams.length > 0 ? (
                    <ul style={{ 
                        listStyle: 'none', 
                        padding: 0, 
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px'
                    }}>
                        {teams.map((team) => (
                            <li
                                key={team.id}
                                style={{
                                    background: '#f8f9fa',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Link 
                                    href={`/teams/${team.id}`}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ 
                                                margin: 0, 
                                                fontSize: '16px', 
                                                fontWeight: 600,
                                                color: '#EF3124',
                                                cursor: 'pointer',
                                                marginBottom: '8px'
                                            }}>
                                                {team.title}
                                            </h3>
                                            <div style={{ 
                                                fontSize: '12px',
                                                color: '#868e96',
                                                display: 'flex',
                                                gap: '15px',
                                                flexWrap: 'wrap'
                                            }}>
                                                <span>ID: {team.id}</span>
                                                {team.workspace_link && (
                                                    <span>Рабочее пространство: {team.workspace_link}</span>
                                                )}
                                                {team.final_mark !== null && (
                                                    <span>Итоговая оценка: {team.final_mark}</span>
                                                )}
                                            </div>
                                        </div>
                                        <span style={{
                                            color: '#EF3124',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            marginLeft: '15px'
                                        }}>
                                            →
                                        </span>
                                    </div>
                                </Link>
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


