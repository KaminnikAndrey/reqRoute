// src/components/ParticipantCard/ParticipantCard.tsx
'use client'

import { Typography } from 'antd'
import { forwardRef, useImperativeHandle } from 'react'
import styles from "./styles.module.css"
import { useMeetingStore } from '@/store/useMeetingStore'

const { Text } = Typography

interface ParticipantCardProps {
    personId: number;
    name: string;
    role: string;
    onTogglePresence?: (isPresent: boolean) => void;
    onToggleLate?: (isLate: boolean) => void;
}

const ParticipantCard = forwardRef(function ParticipantCard({
                                                                personId,
                                                                name,
                                                                role,
                                                                onTogglePresence,
                                                                onToggleLate
                                                            }: ParticipantCardProps, ref) {
    // Получаем данные и методы из store
    const participant = useMeetingStore(state =>
        state.meeting.people.find(p => p.id === personId && p.type === 'participant')
    )
    const togglePresence = useMeetingStore(state => state.togglePresence)
    const toggleLate = useMeetingStore(state => state.toggleLate)

    if (!participant) return null

    const isPresent = participant.isPresent
    const isLate = participant.isLate ?? false

    const handleTogglePresence = () => {
        // Обновляем в store
        togglePresence(personId)

        // Вызываем callback если есть
        if (onTogglePresence) {
            onTogglePresence(!isPresent)
        }
    }

    const handleToggleLate = () => {
        // Только если участник присутствует
        if (isPresent) {
            // Обновляем в store
            toggleLate(personId)

            // Вызываем callback если есть
            if (onToggleLate) {
                onToggleLate(!isLate)
            }
        }
    }

    // Экспортируем методы для родительского компонента (для совместимости)
    useImperativeHandle(ref, () => ({
        setPresence: (value: boolean) => {
            // Эта логика теперь в store, но оставляем для совместимости
            console.log(`Принудительная установка присутствия для участника ${personId}: ${value}`)
        },
        setLate: (value: boolean) => {
            // Эта логика теперь в store, но оставляем для совместимости
            console.log(`Принудительная установка опоздания для участника ${personId}: ${value}`)
        }
    }))

    return (
        <div className={styles.participantCard}>
            {/* Левая часть: Информация об участнике */}
            <div className={styles.participantInfo}>
                <Text className={styles.participantName}>{name}</Text>
                <Text className={styles.participantRole}>{role}</Text>
            </div>

            {/* Правая часть: Статусы */}
            <div className={styles.participantStatus}>

                {/* Кнопка присутствия */}
                <div className={styles.presenceStatus}>
                    <button
                        className={`${styles.presenceIndicator} ${isPresent ? styles.present : styles.absent}`}
                        onClick={handleTogglePresence}
                        aria-label={isPresent ? 'Отметить как отсутствующего' : 'Отметить как присутствующего'}
                    >
                        {isPresent && (
                            <div className={styles.presenceCheckmark}>
                                <div className={styles.checkmarkLine1}></div>
                                <div className={styles.checkmarkLine2}></div>
                            </div>
                        )}
                    </button>
                    <Text className={`${styles.presenceLabel} ${isPresent ? styles.presentText : styles.absentText}`}>
                        Был
                    </Text>
                </div>

                {/* Кнопка опоздания */}
                <div className={styles.lateStatus}>
                    <button
                        className={`${styles.lateIndicator} ${isLate ? styles.lateActive : styles.lateInactive}`}
                        onClick={handleToggleLate}
                        disabled={!isPresent}
                        aria-label={isLate ? 'Снять отметку об опоздании' : 'Отметить как опоздавшего'}
                    >
                        {isLate && (
                            <div className={styles.lateCheckmark}>
                                <div className={styles.checkmarkLine1}></div>
                                <div className={styles.checkmarkLine2}></div>
                            </div>
                        )}
                    </button>
                    <Text className={`${styles.lateLabel} ${isLate ? styles.lateActiveText : styles.lateInactiveText}`}>
                        Опоздал
                    </Text>
                </div>
            </div>
        </div>
    )
})


export default ParticipantCard