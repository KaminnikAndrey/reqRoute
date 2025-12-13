import { Card, Typography, Button } from 'antd';
import { CalendarOutlined, VideoCameraOutlined } from '@ant-design/icons';
import styles from "./styles.module.css";

const { Text } = Typography;

interface MeetingCardProps {
    title: string;
    text: string;
}

export default function PlannerCard({
                                      title,
                                      text
                                  }: MeetingCardProps) {
    return (
        <Card
            style={{
                width: '100%',
                maxWidth: 195,
                borderRadius: 8,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #f0f0f0'
            }}
            // bodyStyle={{ padding: 15 }}
        >
            <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '6px',
                backgroundColor: '#EF3124',
                position: 'relative',
                marginBottom: 10
            }}>
            </div>
            <strong>{title}</strong>
            <p className={styles.text}>{text}</p>
        </Card>
    );
}