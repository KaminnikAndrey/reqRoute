import React from 'react';
import { Card, Button, Tag, Space } from 'antd';
import { UserOutlined, MessageOutlined, LikeOutlined } from '@ant-design/icons';
import styles from './MentorCard.module.css';

interface MentorCardProps {
    mentorName?: string;
    accessMode?: string;
    isMentor?: boolean;
    showVoting?: boolean;
    showComments?: boolean;
    onMentorClick?: () => void;
}

export default function MentorCard({
                                                   isMentor = true,
                                                   showVoting = true,
                                                   showComments = true,
                                                   onMentorClick
                                               }: MentorCardProps)  {
    return (
        <Card className={styles.mentorCard} styles={{ body: { padding: 0 } }}
        >
            <div className={styles.mentorCardContent}>
                {/* Левая часть: Текстовая информация */}
                <div className={styles.mentorInfo}>
                    {/* Режим доступа - просто серый текст */}
                    <div className={styles.accessMode}>
                        <span className={styles.accessText}>Режим доступа</span>
                    </div>

                    <div className={styles.mentorDetails}>

                          <b>Ментор</b> &nbsp;·&nbsp;
                                <span className={styles.capabilitiesText}>
                          можно голосовать и комментировать кейсы
                        </span>

                    </div>
                </div>

                <div className={styles.mentorAction}>
                    <button
                        className={styles.mentorButton}
                        onClick={onMentorClick}
                    >
                        Mentor
                    </button>
                </div>
            </div>
        </Card>
    );
};
