import { Card, Typography, Button } from 'antd';
import { CalendarOutlined, VideoCameraOutlined } from '@ant-design/icons';
import styles from "./styles.module.css";

const { Text } = Typography;

interface MeetingCardProps {
    date: string;           // "Завтра", "Пт"
    time: string;          // "10:00–10:30", "15:00–16:00"
    title: string;         // "Созвон с командой разработки", "Демо для заказчика"
    platform: string;      // "Google Meet", "Zoom"
    detailsLink?: string;  // Ссылка для кнопки "Подробнее"
}

export default function MeetingLi({
                                        date,
                                        time,
                                           title,
                                        platform,
                                        detailsLink = "#"
                                    }: MeetingCardProps) {
    return (
        <Card
            style={{
                width: '100%',
                maxWidth: 400,
                margin: '8px 0',
                borderRadius: 8,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #f0f0f0'
            }}
            // bodyStyle={{ padding: 16 }}
        >
            {/* Дата и время */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, gap: 8 }}>
               <span className={styles.text}>{date}</span> <span className={styles.text}>{time}</span>
            </div>
            <strong>{title}</strong>

            {/* Платформа и кнопка */}
            <div className={styles.wrap}>
                <p className={styles.text}>{platform}</p>
                <a href="#" className={styles.link}>Подробнее</a>
            </div>
        </Card>
    );
}