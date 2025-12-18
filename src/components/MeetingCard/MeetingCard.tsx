import { Card, Typography, Button, Avatar, Tag } from 'antd';
import { CalendarOutlined, UserOutlined, VideoCameraOutlined, LinkOutlined } from '@ant-design/icons';
import styles from "./styles.module.css";
import { formatMeetingDate, formatMeetingTime } from '@/utils/dateFormatters';

const { Title, Text } = Typography;

interface MeetingCardProps {
    meetingId?: number;
    date?: string;
    time?: string;
    title?: string;
    meetingLink?: string;
}

export default function MeetingCard({ 
    meetingId, 
    date, 
    time, 
    title,
    meetingLink 
}: MeetingCardProps) {
    const displayDate = date || "Сегодня";
    const displayTime = time || "18:00-18:45 (МСК)";
    const displayTitle = title || "Созвон по проекту ReqRoute";
    const displayId = meetingId ? `RR-${meetingId}` : "RR-317";

    return (
        <Card  style={{
                maxWidth: 600,
                width: 400,
                margin: '0',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: "1px solid #E9ECEF"
            }}
            // bodyStyle={{ padding: 20 }}
        >
            <div className={styles.wrap} style={{marginBottom: 10}}>
                <Text style={{fontSize: "16px", fontWeight: 700}}>Ближайший созвон</Text>
                <p className={styles.text}> ID встречи: {displayId}</p>
            </div>
            <p>
                <span className={styles.text}>{displayDate},</span> <strong>{displayTime}</strong> <span className={styles.text}>• Тема</span> <strong>{displayTitle}</strong>
            </p>
            <div className={styles.wrap}>
                <div style={{display: "flex", gap: 5, alignItems: "center", marginBottom: 10}}>
                    <span style={{
                        display: 'flex',
                        width: '32px',
                        height: '32px',
                        borderRadius: '16px',
                        border: '2px solid #EF3124',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
  {/* Ваш контент внутри */}
</span>
                    <span style={{
                        display: 'flex',
                        width: '32px',
                        height: '32px',
                        borderRadius: '16px',
                        border: '2px solid #EF3124',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
  {/* Ваш контент внутри */}
</span><span style={{
                    display: 'flex',
                    width: '32px',
                    height: '32px',
                    borderRadius: '16px',
                    border: '2px solid #EF3124',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
  {/* Ваш контент внутри */}
</span>
                    <p className={styles.text}>+5 участников</p>
                </div>
            </div>
            <div className={styles.wrap}>
                <button
                    className={`${styles.btnAccessActive}`}
                    type="button"
                    style={{width: "175px"}}
                >
                    Опубликовать
                </button>
                <button
                    className={`${styles.btnAccess}`}
                    type="button"
                    style={{width: "175px"}}
                >
                    Черновик
                </button>
            </div>
        </Card>
    );
}