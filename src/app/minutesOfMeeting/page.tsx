'use client'

import { Card, Typography, Input } from 'antd'
import { useState, useRef } from 'react'
import styles from "./styles.module.css"
import Header from "@/app/components/header/Header"
import OrganizerCard from "@/app/components/OrganizerCard/OrganizerCard";
import ParticipantCard from "@/app/components/ParticipantCard/ParticipantCard";

const { Text } = Typography
const { TextArea } = Input

type MeetingStatus = 'состоялась' | 'перенесена' | 'отмена'

interface OrganizerRef {
    setPresence: (value: boolean) => void;
}

interface ParticipantRef {
    setPresence: (value: boolean) => void;
    setLate: (value: boolean) => void;
}

export default function MinutesOfMeeting() {
    const [activeStatus, setActiveStatus] = useState<MeetingStatus>('состоялась')
    const [decisions, setDecisions] = useState('')
    const [comments, setComments] = useState('')

    // Состояние для принудительного обновления
    const [forceAllPresent, setForceAllPresent] = useState<boolean | null>(null)
    const [forceAllAbsent, setForceAllAbsent] = useState<boolean | null>(null)

    // Ссылки для управления состоянием карточек
    const organizerRefs = useRef<OrganizerRef[]>([])
    const participantRefs = useRef<ParticipantRef[]>([])

    const handleStatusClick = (status: MeetingStatus) => {
        setActiveStatus(status)
    }

    const handleSave = () => {
        console.log('Сохранение протокола...')
        // Здесь будет логика сохранения
    }

    const handleCancel = () => {
        console.log('Отмена...')
        // Здесь будет логика отмены
    }

    // Функция для отметки всех как присутствующих
    const markAllAsPresent = () => {
        // Устанавливаем флаг для принудительного обновления
        setForceAllPresent(true)
        setForceAllAbsent(null)

        // Вызываем методы установки состояния в каждом компоненте
        organizerRefs.current.forEach(ref => {
            if (ref && ref.setPresence) ref.setPresence(true)
        })

        participantRefs.current.forEach(ref => {
            if (ref && ref.setPresence) ref.setPresence(true)
            // Опоздание оставляем как есть, не сбрасываем
        })
    }

    // Функция для снятия всех галочек
    const clearAllChecks = () => {
        // Устанавливаем флаг для принудительного обновления
        setForceAllPresent(null)
        setForceAllAbsent(true)

        // Вызываем методы установки состояния в каждом компоненте
        organizerRefs.current.forEach(ref => {
            if (ref && ref.setPresence) ref.setPresence(false)
        })

        participantRefs.current.forEach(ref => {
            if (ref && ref.setPresence) ref.setPresence(false)
            if (ref && ref.setLate) ref.setLate(false)
        })
    }

    // Обработчики для обновления статистики
    const handleOrganizerToggle = (isPresent: boolean) => {
        // Можно обновлять общую статистику если нужно
        console.log(`Организатор: ${isPresent ? 'присутствует' : 'отсутствует'}`)
    }

    const handleParticipantTogglePresence = (isPresent: boolean) => {
        console.log(`Участник: ${isPresent ? 'присутствует' : 'отсутствует'}`)
    }

    const handleParticipantToggleLate = (isLate: boolean) => {
        console.log(`Участник: ${isLate ? 'опоздал' : 'не опоздал'}`)
    }

    // Подсчет статистики
    const totalCount = 2 + 3 // организаторы + участники
    const presentCount = organizerRefs.current.filter(ref =>
        ref && (ref as any).isPresent !== false
    ).length + participantRefs.current.filter(ref =>
        ref && (ref as any).isPresent === true
    ).length
    const absentCount = totalCount - presentCount

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
                                        Протокол встречи
                                    </Text>
                                </div>

                                <div className={styles.infoSection}>
                                    <div className={styles.teamInfo}>
                                        <Text className={styles.teamName}>
                                            Команда ReqRoute
                                        </Text>
                                    </div>

                                    <div className={styles.timeLocationInfo}>
                                        <div className={styles.timeItem}>
                                            <Text className={styles.timeText}>
                                                Сегодня,
                                            </Text>
                                        </div>
                                        <div className={styles.timeItem}>
                                            <Text className={styles.timeText}>
                                                18:00–18:45
                                            </Text>
                                        </div>
                                        <div className={styles.timeItem}>
                                            <Text className={styles.timeText}>
                                                (Екб)
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
                                                Контур.Толк
                                            </Text>
                                        </div>
                                        <Text className={styles.roomLinkUrl}>
                                            kontur.ru/room/
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
                        <OrganizerCard
                            name="Иван Петров"
                            role="Руководитель проекта"
                            initialIsPresent={true}
                            forcePresent={forceAllPresent !== null ? forceAllPresent : forceAllAbsent !== null ? false : null}
                            ref={el => {
                                if (el) organizerRefs.current[0] = el
                            }}
                            onToggle={handleOrganizerToggle}
                        />
                        <OrganizerCard
                            name="Иван Иван"
                            role="Дизайнер"
                            initialIsPresent={true}
                            forcePresent={forceAllPresent !== null ? forceAllPresent : forceAllAbsent !== null ? false : null}
                            ref={el => {
                                if (el) organizerRefs.current[1] = el
                            }}
                            onToggle={handleOrganizerToggle}
                        />
                    </div>

                    <p className={styles.titleFrom}>Участники</p>
                    <div className={styles.participantsSection}>
                        <div className={styles.participantsList}>
                            <ParticipantCard
                                name="Мария Сидорова"
                                role="Frontend разработчик"
                                initialIsPresent={true}
                                initialIsLate={true}
                                forcePresent={forceAllPresent !== null ? forceAllPresent : forceAllAbsent !== null ? false : null}
                                ref={el => {
                                    if (el) participantRefs.current[0] = el
                                }}
                                onTogglePresence={handleParticipantTogglePresence}
                                onToggleLate={handleParticipantToggleLate}
                            />
                            <ParticipantCard
                                name="Алексей Иванов"
                                role="Backend разработчик"
                                initialIsPresent={true}
                                initialIsLate={false}
                                forcePresent={forceAllPresent !== null ? forceAllPresent : forceAllAbsent !== null ? false : null}
                                ref={el => {
                                    if (el) participantRefs.current[1] = el
                                }}
                                onTogglePresence={handleParticipantTogglePresence}
                                onToggleLate={handleParticipantToggleLate}
                            />
                            <ParticipantCard
                                name="Ольга Смирнова"
                                role="Дизайнер"
                                initialIsPresent={false}
                                initialIsLate={false}
                                forcePresent={forceAllPresent !== null ? forceAllPresent : forceAllAbsent !== null ? false : null}
                                ref={el => {
                                    if (el) participantRefs.current[2] = el
                                }}
                                onTogglePresence={handleParticipantTogglePresence}
                                onToggleLate={handleParticipantToggleLate}
                            />
                        </div>
                    </div>

                    <p className={styles.titleFrom}>Итог встречи</p>

                    {/* 4 БЛОК: Кнопки статуса встречи */}
                    <div className={styles.meetingStatusSection}>
                        <div className={styles.statusButtonsContainer}>
                            <button
                                className={`${styles.statusButton} ${activeStatus === 'состоялась' ? styles.statusActive : styles.statusInactive}`}
                                onClick={() => handleStatusClick('состоялась')}
                            >
                                Состоялась
                            </button>
                            <button
                                className={`${styles.statusButton} ${activeStatus === 'перенесена' ? styles.statusActive : styles.statusInactive}`}
                                onClick={() => handleStatusClick('перенесена')}
                            >
                                Перенесена
                            </button>
                            <button
                                className={`${styles.statusButton} ${activeStatus === 'отмена' ? styles.statusActive : styles.statusInactive}`}
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
                            >
                                Сохранить протокол
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