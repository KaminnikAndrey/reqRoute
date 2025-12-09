'use client'

import { Typography } from 'antd'
import { useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import styles from "./styles.module.css"

const { Text } = Typography

interface OrganizerCardProps {
    name: string;
    role: string;
    initialIsPresent: boolean;
    forcePresent?: boolean | null;
    onToggle?: (isPresent: boolean) => void;
}

const OrganizerCard = forwardRef(function OrganizerCard({
                                                            name,
                                                            role,
                                                            initialIsPresent,
                                                            forcePresent = null,
                                                            onToggle
                                                        }: OrganizerCardProps, ref) {
    const [isPresent, setIsPresent] = useState(initialIsPresent)

    // Обновляем состояние при изменении forcePresent
    useEffect(() => {
        if (forcePresent !== null) {
            setIsPresent(forcePresent)
        }
    }, [forcePresent])

    const setPresence = (value: boolean) => {
        setIsPresent(value)
        onToggle?.(value)
    }

    // Экспортируем метод для родительского компонента
    useImperativeHandle(ref, () => ({
        setPresence
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
                    onClick={() => setPresence(!isPresent)}
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