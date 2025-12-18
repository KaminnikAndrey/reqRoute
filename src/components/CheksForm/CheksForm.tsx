import { Card, Typography, List, Tag, Button } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styles from "./styles.module.css";

const { Title, Text } = Typography;

export default function ChecksForm() {
    const checks = [
        'Название, дата/время заполнены',
        'Формат и доступ выбраны',
        'Ответственный указан',
        'Ссылка/адрес заполнены'
    ];

    return (
        <Card
            style={{
                maxWidth: 600,
                width: 400,
                margin: '0',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                backgroundColor: "#FAFAFA",
                border: "1px solid #E9ECEF",
                marginBottom: "20px"
            }}
            styles={{ body: { padding: 15 } }}
        >
            <p className={styles.titleFrom}>Проверки перед публикацией</p>

            <ul style={{
                paddingLeft: 20,
                margin: 0,
                fontSize: '14px',
                lineHeight: '1.6'
            }}>
                {checks.map((check, index) => (
                    <li key={index} style={{ marginBottom: '8px', listStyle: "outside", color: "#444444" }}>
                        <Text>{check}</Text>
                    </li>
                ))}
            </ul>
        </Card>
    );

}