'use client'

import { useState, useEffect } from 'react'
import styles from "../main/styles.module.css"
import Link from "next/link";
import Header from "@/components/header/Header";
import { casesClient } from '@/lib/clients'
import type { CaseRead } from '@/lib/apiTypes'

export default function Cases() {
    const [cases, setCases] = useState<CaseRead[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        fetchCases()
    }, [])

    const fetchCases = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await casesClient.list({ page_size: 100 })
            setCases(response.items)
        } catch (err) {
            console.error('Ошибка загрузки кейсов:', err)
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
                        Загрузка кейсов...
                    </div>
                </div>
            </div>
        );
    }

    if (error && cases.length === 0) {
        return (
            <div className={styles.center}>
                <div className={styles.wrapper}>
                    <Header />
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#dc3545'
                    }}>
                        <h3>Ошибка при загрузке кейсов</h3>
                        <p>{error.message || 'Неизвестная ошибка'}</p>
                        <button 
                            onClick={fetchCases} 
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

    return (
        <div className={styles.center}>
            <div className={styles.wrapper}>
                <Header/>
                
                <p className={styles.titleFrom} style={{marginTop: 10, marginBottom: 10}}>
                    Все кейсы ({cases.length})
                </p>

                {cases.length > 0 ? (
                    <ul style={{ 
                        listStyle: 'none', 
                        padding: 0, 
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px'
                    }}>
                        {cases.map((caseItem) => (
                            <li
                                key={caseItem.id}
                                style={{
                                    background: '#f8f9fa',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}
                            >
                                <Link 
                                    href={`/cases/${caseItem.id}`}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: '10px'
                                    }}>
                                        <h3 style={{ 
                                            margin: 0, 
                                            fontSize: '16px', 
                                            fontWeight: 600,
                                            color: '#EF3124',
                                            cursor: 'pointer'
                                        }}>
                                            {caseItem.title}
                                        </h3>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: 500,
                                            backgroundColor: getStatusColor(caseItem.status) + '20',
                                            color: getStatusColor(caseItem.status),
                                            border: `1px solid ${getStatusColor(caseItem.status)}`
                                        }}>
                                            {getStatusText(caseItem.status)}
                                        </span>
                                    </div>
                                </Link>
                                
                                {caseItem.description && (
                                    <p style={{ 
                                        margin: '10px 0 0 0', 
                                        fontSize: '14px', 
                                        color: '#495057',
                                        lineHeight: '1.5'
                                    }}>
                                        {caseItem.description}
                                    </p>
                                )}
                                
                                <div style={{ 
                                    marginTop: '10px',
                                    fontSize: '12px',
                                    color: '#868e96',
                                    display: 'flex',
                                    gap: '15px'
                                }}>
                                    <span>ID: {caseItem.id}</span>
                                    <span>Трек ID: {caseItem.term_id}</span>
                                    <span>Автор ID: {caseItem.user_id}</span>
                                </div>
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
                            Кейсы не найдены
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


