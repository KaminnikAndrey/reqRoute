// src/components/OrganizerCard/OrganizerCard.tsx
'use client'

import { Typography } from 'antd'
import { forwardRef, useImperativeHandle } from 'react'
import styles from "./styles.module.css"
import { useMeetingStore } from '@/store/useMeetingStore'

const { Text } = Typography

interface OrganizerCardProps {
    personId: number;
    name: string;
    role: string;
    onToggle?: (isPresent: boolean) => void;
}

const OrganizerCard = forwardRef(function OrganizerCard({
                                                            personId,
                                                            name,
                                                            role,
                                                            onToggle
                                                        }: OrganizerCardProps, ref) {
    // Получаем данные и методы из store
    const organizer = useMeetingStore(state =>
        state.meeting.people.find(p => p.id === personId && p.type === 'organizer')
    )
    const togglePresence = useMeetingStore(state => state.togglePresence)

    if (!organizer) return null

    const isPresent = organizer.isPresent

    const handleToggle = () => {
        // Обновляем в store
        togglePresence(personId)

        // Вызываем callback если есть
        if (onToggle) {
            onToggle(!isPresent)
        }
    }

    // Экспортируем метод для родительского компонента (для совместимости)
    useImperativeHandle(ref, () => ({
        setPresence: (value: boolean) => {
            // Эта логика теперь в store, но оставляем для совместимости
            console.log(`Принудительная установка присутствия для организатора ${personId}: ${value}`)
        }
    }))

    return (
        <div className={styles.organizerCard}>
            {/* Левая часть: Информация об организаторе */}
            <div className={styles.organizerInfo}>
                <Text className={styles.organizerName}>{name}</Text>
                <Text className={styles.organizerRole}>{role}</Text>
            </div>

            {/* Правая часть: Статус присутствия - кликабельная */}
            <div className={styles.organizerStatus}>
                <button
                    className={`${styles.statusIndicator} ${isPresent ? styles.present : styles.absent}`}
                    onClick={handleToggle}
                    aria-label={isPresent ? 'Отметить как отсутствующего' : 'Отметить как присутствующего'}
                >
                    {isPresent && (
                        <div className={styles.checkmark}>
                            <div className={styles.checkmarkLine1}></div>
                            <div className={styles.checkmarkLine2}></div>
                        </div>
                    )}
                </button>
                <Text className={`${styles.statusLabel} ${isPresent ? styles.presentText : styles.absentText}`}>
                    Присутствовал
                </Text>
            </div>
        </div>
    )
})


export default OrganizerCard