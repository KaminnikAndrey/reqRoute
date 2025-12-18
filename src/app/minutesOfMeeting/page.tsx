// src/app/minutes/page.tsx (или ваш путь)
'use client'

import { Card, Typography, Input } from 'antd'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import styles from "./styles.module.css"
import Header from "@/components/header/Header";
import OrganizerCard from "@/components/OrganizerCard/OrganizerCard";
import ParticipantCard from "@/components/ParticipantCard/ParticipantCard";
import { useMeetingStore } from '@/store/useMeetingStore'
import { useMeeting } from '@/hooks/useMeetingApi'
import { meetingsClient } from '@/lib/clients'
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const { Text } = Typography
const { TextArea } = Input

export default function MinutesOfMeeting() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const meetingIdParam = searchParams.get('meetingId')
    const meetingId = meetingIdParam ? parseInt(meetingIdParam, 10) : undefined

    // Загружаем данные встречи из API
    const { meeting: apiMeeting, isLoading: meetingLoading } = useMeeting(meetingId)

    // Получаем данные и методы из store
    const meeting = useMeetingStore(state => state.meeting)
    const setMeeting = useMeetingStore(state => state.setMeeting)
    const updateStatus = useMeetingStore(state => state.updateStatus)
    const updateDecisions = useMeetingStore(state => state.updateDecisions)
    const updateComments = useMeetingStore(state => state.updateComments)
    const forceMarkAllPresent = useMeetingStore(state => state.forceMarkAllPresent)
    const forceClearAllChecks = useMeetingStore(state => state.forceClearAllChecks)

    const getTotalCount = useMeetingStore(state => state.getTotalCount)
    const getPresentCount = useMeetingStore(state => state.getPresentCount)
    const getAbsentCount = useMeetingStore(state => state.getAbsentCount)
    const getOrganizers = useMeetingStore(state => state.getOrganizers)
    const getParticipants = useMeetingStore(state => state.getParticipants)

    // Локальные состояния для текстовых полей
    const [decisions, setDecisions] = useState(meeting.decisions)
    const [comments, setComments] = useState(meeting.comments)
    const [isSaving, setIsSaving] = useState(false)

    // Обновляем store при загрузке данных из API
    useEffect(() => {
        if (apiMeeting && apiMeeting.summary) {
            // Парсим summary обратно в decisions и comments
            const summary = apiMeeting.summary
            
            // Пытаемся извлечь решения и комментарии из summary
            const decisionsMatch = summary.match(/Решения и следующие шаги:\s*\n([\s\S]*?)(?=\n\nКомментарии:|$)/)
            const commentsMatch = summary.match(/Комментарии:\s*\n([\s\S]*?)(?=\n\nСтатус:|$)/)
            
            if (decisionsMatch && decisionsMatch[1]) {
                setDecisions(decisionsMatch[1].trim())
                updateDecisions(decisionsMatch[1].trim())
            }
            
            if (commentsMatch && commentsMatch[1]) {
                setComments(commentsMatch[1].trim())
                updateComments(commentsMatch[1].trim())
            }
        }
    }, [apiMeeting, updateDecisions, updateComments])

    // Синхронизируем локальные состояния с store
    useEffect(() => {
        setDecisions(meeting.decisions)
    }, [meeting.decisions])

    useEffect(() => {
        setComments(meeting.comments)
    }, [meeting.comments])

    const handleStatusClick = (status: any) => {
        updateStatus(status)
    }

    const handleSave = async () => {
        if (!meetingId) {
            console.error('❌ ID встречи не указан')
            return
        }

        setIsSaving(true)

        try {
            // Обновляем текстовые поля в store
            updateDecisions(decisions)
            updateComments(comments)

            // Формируем данные для сохранения
            // Объединяем decisions и comments в summary
            const summaryParts: string[] = []
            
            if (decisions.trim()) {
                summaryParts.push(`Решения и следующие шаги:\n${decisions}`)
            }
            
            if (comments.trim()) {
                summaryParts.push(`Комментарии:\n${comments}`)
            }
            
            // Добавляем информацию о статусе
            if (meeting.status) {
                summaryParts.push(`Статус: ${meeting.status}`)
            }

            const summary = summaryParts.join('\n\n') || null

            // Отправляем данные на бэкенд
            await meetingsClient.update(meetingId, {
                summary: summary || null,
            })

            console.log('✅ Протокол сохранен на бэкенд')
            
            // Перенаправляем на главную страницу
            router.push('/main')
        } catch (err) {
            console.error('❌ Ошибка сохранения:', err)
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        console.log('Отмена...')
        // Можно сбросить изменения если нужно
    }

    // Функция для отметки всех как присутствующих
    const markAllAsPresent = () => {
        forceMarkAllPresent()
    }

    // Функция для снятия всех галочек
    const clearAllChecks = () => {
        forceClearAllChecks()
    }

    // Подсчет статистики
    const totalCount = getTotalCount()
    const presentCount = getPresentCount()
    const absentCount = getAbsentCount()

    // Получаем списки участников
    const organizers = getOrganizers()
    const participants = getParticipants()

    return (

        <div className={styles.center}>
            <div className={styles.wrapper}>
                <Header />

                {/* Основная карточка */}
                <Card className={styles.mainCard} bodyStyle={{padding: 0}}>

                    {/* 1 БЛОК: Заголовок и информация о встрече */}
                    <div className={styles.meetingHeader}>
                        <div className={styles.headerContent}>
                            {/* Левая часть */}
                            <div className={styles.headerLeft}>
                                <div className={styles.titleSection}>
                                    <Text className={styles.protocolTitle}>
                                        {meeting.title}
                                    </Text>
                                </div>

                                <div className={styles.infoSection}>
                                    <div className={styles.teamInfo}>
                                        <Text className={styles.teamName}>
                                            {meeting.teamName}
                                        </Text>
                                    </div>

                                    <div className={styles.timeLocationInfo}>
                                        <div className={styles.timeItem}>
                                            <Text className={styles.timeText}>
                                                {meeting.date},
                                            </Text>
                                        </div>
                                        <div className={styles.timeItem}>
                                            <Text className={styles.timeText}>
                                                {meeting.time}
                                            </Text>
                                        </div>
                                        <div className={styles.timeItem}>
                                            <Text className={styles.timeText}>
                                                {meeting.location}
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Правая часть */}
                            <div className={styles.headerRight}>
                                <div className={styles.meetingLinkContainer}>
                                    <Text className={styles.linkLabel}>
                                        Открыто в
                                    </Text>
                                    <div className={styles.roomLink}>
                                        <div className={styles.roomLinkTitle}>
                                            <Text strong className={styles.roomLinkText}>
                                                {meeting.link}
                                            </Text>
                                        </div>
                                        <Text className={styles.roomLinkUrl}>
                                            {meeting.linkUrl}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2 БЛОК: Статистика участников */}
                    <div className={styles.participantsBlock}>
                        <div className={styles.participantsStats}>
                            {/* Всего участников */}
                            <div className={`${styles.statItem} ${styles.statTotal}`}>
                                <div className={styles.statContent}>
                                    <div className={styles.statText}>
                                        <Text className={styles.statNumber}>
                                            {totalCount}
                                        </Text>
                                        <Text className={styles.statLabel}>Всего</Text>
                                    </div>
                                </div>
                            </div>

                            {/* Присутствуют */}
                            <div className={`${styles.statItem} ${styles.statPresent}`}>
                                <div className={styles.statContent}>
                                    <div className={styles.statText}>
                                        <Text className={styles.statNumber}>
                                            {presentCount}
                                        </Text>
                                        <Text className={styles.statLabel}>Присутствуют</Text>
                                    </div>
                                </div>
                            </div>

                            {/* Отсутствуют */}
                            <div className={`${styles.statItem} ${styles.statAbsent}`}>
                                <div className={styles.statContent}>
                                    <div className={styles.statText}>
                                        <Text className={styles.statNumber}>
                                            {absentCount}
                                        </Text>
                                        <Text className={styles.statLabel}>Отсутствуют</Text>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3 БЛОК: Кнопка отметки присутствующих */}
                    <div className={styles.markAttendanceBlock}>
                        <button
                            className={styles.subText}
                            onClick={markAllAsPresent}
                        >
                            Отметить всех как присутствующих
                        </button>
                        <button
                            className={styles.subText}
                            onClick={clearAllChecks}
                        >
                            Снять все галочки
                        </button>
                    </div>

                    <p className={styles.titleFrom}>Организаторы</p>
                    <div className={styles.organizerSection}>
                        {organizers.map(organizer => (
                            <OrganizerCard
                                key={organizer.id}
                                personId={organizer.id}
                                name={organizer.name}
                                role={organizer.role}
                            />
                        ))}
                    </div>

                    <p className={styles.titleFrom}>Участники</p>
                    <div className={styles.participantsSection}>
                        <div className={styles.participantsList}>
                            {participants.map(participant => (
                                <ParticipantCard
                                    key={participant.id}
                                    personId={participant.id}
                                    name={participant.name}
                                    role={participant.role}
                                />
                            ))}
                        </div>
                    </div>

                    <p className={styles.titleFrom}>Итог встречи</p>

                    {/* 4 БЛОК: Кнопки статуса встречи */}
                    <div className={styles.meetingStatusSection}>
                        <div className={styles.statusButtonsContainer}>
                            <button
                                className={`${styles.statusButton} ${meeting.status === 'состоялась' ? styles.statusActive : styles.statusInactive}`}
                                onClick={() => handleStatusClick('состоялась')}
                            >
                                Состоялась
                            </button>
                            <button
                                className={`${styles.statusButton} ${meeting.status === 'перенесена' ? styles.statusActive : styles.statusInactive}`}
                                onClick={() => handleStatusClick('перенесена')}
                            >
                                Перенесена
                            </button>
                            <button
                                className={`${styles.statusButton} ${meeting.status === 'отмена' ? styles.statusActive : styles.statusInactive}`}
                                onClick={() => handleStatusClick('отмена')}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>

                    {/* 5 БЛОК: Решения и следующие шаги */}
                    <div className={styles.textAreaSection}>
                        <p className={styles.textAreaTitle}>Решения и следующие шаги</p>
                        <div className={styles.textAreaContainer}>
                            <TextArea
                                className={styles.customTextArea}
                                placeholder="Опишите принятые решения и следующие шаги..."
                                value={decisions}
                                onChange={(e) => setDecisions(e.target.value)}
                                onBlur={() => updateDecisions(decisions)}
                                autoSize={{ minRows: 4, maxRows: 8 }}
                            />
                        </div>
                    </div>

                    {/* 6 БЛОК: Комментарии (заметки по встрече) */}
                    <div className={styles.textAreaSection}>
                        <p className={styles.textAreaTitle}>Комментарии (заметки по встрече)</p>
                        <div className={styles.textAreaContainer}>
                            <TextArea
                                className={styles.customTextArea}
                                placeholder="Добавьте заметки, комментарии или вопросы по встрече..."
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                onBlur={() => updateComments(comments)}
                                autoSize={{ minRows: 4, maxRows: 8 }}
                            />
                        </div>
                    </div>

                    {/* 7 БЛОК: Кнопки действий */}
                    <div className={styles.actionButtonsSection}>
                        <div className={styles.actionButtonsContainer}>
                            <button
                                className={`${styles.actionButton} ${styles.saveButton}`}
                                onClick={handleSave}
                                disabled={isSaving || !meetingId}
                            >
                                {isSaving ? 'Сохранение...' : 'Сохранить протокол'}
                            </button>
                            <button
                                className={`${styles.actionButton} ${styles.cancelButton}`}
                                onClick={handleCancel}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>

                </Card>
            </div>
        </div>


            )
}