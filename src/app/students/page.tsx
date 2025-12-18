'use client'

import { useState, useEffect } from 'react'
import styles from "../main/styles.module.css"
import Link from "next/link";
import Header from "@/components/header/Header";
import { studentsClient } from '@/lib/clients'
import type { StudentRead, StudentCreate } from '@/lib/apiTypes'
import { Input, Button } from 'antd'

export default function Students() {
    const [students, setStudents] = useState<StudentRead[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    
    // Форма создания студента
    const [newStudentName, setNewStudentName] = useState<string>('')

    useEffect(() => {
        fetchStudents()
    }, [])

    const fetchStudents = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await studentsClient.list({ page_size: 100 })
            setStudents(response.items)
        } catch (err) {
            console.error('Ошибка загрузки студентов:', err)
            setError(err instanceof Error ? err : new Error('Неизвестная ошибка'))
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateStudent = async () => {
        if (!newStudentName.trim()) {
            alert('Введите имя студента')
            return
        }

        setIsCreating(true)

        try {
            const newStudent: StudentCreate = {
                full_name: newStudentName.trim()
            }

            await studentsClient.create(newStudent)

            // Очищаем форму
            setNewStudentName('')

            // Обновляем список студентов
            await fetchStudents()
        } catch (err) {
            console.error('Ошибка создания студента:', err)
            alert('Не удалось создать студента')
        } finally {
            setIsCreating(false)
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
                        Загрузка студентов...
                    </div>
                </div>
            </div>
        );
    }

    if (error && students.length === 0) {
        return (
            <div className={styles.center}>
                <div className={styles.wrapper}>
                    <Header />
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#dc3545'
                    }}>
                        <h3>Ошибка при загрузке студентов</h3>
                        <p>{error.message || 'Неизвестная ошибка'}</p>
                        <Button onClick={fetchStudents} style={{ marginTop: '20px' }}>
                            Повторить попытку
                        </Button>
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
                    Все студенты ({students.length})
                </p>

                {/* Форма создания студента */}
                <div style={{
                    background: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    marginBottom: '20px'
                }}>
                    <p style={{ fontWeight: 600, marginBottom: '10px', fontSize: '14px' }}>Добавить студента</p>
                    
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#495057' }}>
                            ФИО студента *
                        </label>
                        <Input
                            placeholder="Например: Иванов Иван Иванович"
                            value={newStudentName}
                            onChange={(e) => setNewStudentName(e.target.value)}
                            onPressEnter={handleCreateStudent}
                            size="large"
                            style={{ borderRadius: 8 }}
                        />
                    </div>

                    <Button
                        type="primary"
                        onClick={handleCreateStudent}
                        loading={isCreating}
                        disabled={!newStudentName.trim()}
                        style={{ width: '100%', backgroundColor: '#EF3124', borderColor: '#EF3124' }}
                        size="large"
                    >
                        Добавить студента
                    </Button>
                </div>

                {/* Список студентов */}
                {students.length > 0 ? (
                    <ul style={{ 
                        listStyle: 'none', 
                        padding: 0, 
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}>
                        {students.map((student) => (
                            <li
                                key={student.id}
                                style={{
                                    background: '#f8f9fa',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}
                            >
                                <div style={{ fontWeight: 600, fontSize: '15px' }}>
                                    {student.full_name}
                                </div>
                                <div style={{ 
                                    fontSize: '12px', 
                                    color: '#868e96',
                                    marginTop: '5px'
                                }}>
                                    ID: {student.id}
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
                            Студенты не найдены
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


