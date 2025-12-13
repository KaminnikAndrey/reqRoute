import { Card, Typography, Tag } from 'antd';
import { BellOutlined, ClockCircleOutlined } from '@ant-design/icons';
import styles from "./styles.module.css";

const { Text } = Typography;

export default function NotificationCard() {

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
            // bodyStyle={{ padding: 30 }}
        >
            <p className={styles.titleFrom}>Уведомления</p>
            <ul>
                <li className={styles.text} style={{listStyle: "outside"}}>Сегодня митап в 18:00</li>
                <li className={styles.text} style={{listStyle: "outside"}}>Напоминание: отправить материалы</li>
            </ul>

        </Card>
    );
}