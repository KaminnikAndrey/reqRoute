'use client'

import { useState } from 'react'
import styles from "./styles.module.css";

interface VotingButtonsProps {
    buttons?: string[]
    initialActive?: number
    onButtonClick?: (index: number, buttonText: string) => void
}

const VotingButtons: React.FC<VotingButtonsProps> = ({
                                                         buttons = ['На голосовании', 'Предложения', 'Черновики', 'В разработке', 'Отобранные'],
                                                         initialActive = 0,
                                                         onButtonClick
                                                     }) => {
    const [activeButton, setActiveButton] = useState<number>(initialActive)

    const handleButtonClick = (index: number) => {
        setActiveButton(index)
        if (onButtonClick) {
            onButtonClick(index, buttons[index])
        }
    }

    return (
        <div className={styles.votingButtonsContainer}>
            {buttons.map((buttonText, index) => (
                <button
                    key={index}
                    className={`${styles.votingButton} ${activeButton === index ? styles.active : ''}`}
                    onClick={() => handleButtonClick(index)}
                >
                    {buttonText}
                </button>
            ))}
        </div>
    )
}

export default VotingButtons