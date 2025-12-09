'use client'

import { Typography } from 'antd'
import { useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import styles from "./styles.module.css"

const { Text } = Typography

interface ParticipantCardProps {
    name: string;
    role: string;
    initialIsPresent: boolean;
    initialIsLate?: boolean;
    forcePresent?: boolean | null;
    forceLate?: boolean | null;
    onTogglePresence?: (isPresent: boolean) => void;
    onToggleLate?: (isLate: boolean) => void;
}

const ParticipantCard = forwardRef(function ParticipantCard({
                                                                name,
                                                                role,
                                                                initialIsPresent,
                                                                initialIsLate = false,
                                                                forcePresent = null,
                                                                forceLate = null,
                                                                onTogglePresence,
                                                                onToggleLate
                                                            }: ParticipantCardProps, ref) {
    const [isPresent, setIsPresent] = useState(initialIsPresent)
    const [isLate, setIsLate] = useState(initialIsLate)

    // Обновляем состояние при изменении forcePresent
    useEffect(() => {
        if (forcePresent !== null) {
            setIsPresent(forcePresent)
            // Если устанавливаем отсутствие, сбрасываем опоздание
            if (!forcePresent) {
                setIsLate(false)
            }
        }
    }, [forcePresent])

    // Обновляем состояние при изменении forceLate
    useEffect(() => {
        if (forceLate !== null && isPresent) {
            setIsLate(forceLate)
        }
    }, [forceLate, isPresent])

    const setPresence = (value: boolean) => {
        setIsPresent(value)
        if (!value) {
            setIsLate(false) // Сбрасываем опоздание при отсутствии
        }
        onTogglePresence?.(value)
    }

    const setLate = (value: boolean) => {
        if (isPresent) {
            setIsLate(value)
            onToggleLate?.(value)
        }
    }

    // Экспортируем методы для родительского компонента
    useImperativeHandle(ref, () => ({
        setPresence,
        setLate
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
                        onClick={() => setPresence(!isPresent)}
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
                        onClick={() => setLate(!isLate)}
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