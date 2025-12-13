import { Card, Typography, Tag } from 'antd';
import { BellOutlined, ClockCircleOutlined } from '@ant-design/icons';
import styles from "./styles.module.css";

const { Text } = Typography;

export default function ReviewsCard() {

    return (
        <Card
            style={{
                width: '100%',
                maxWidth: 400,
                marginBottom: '15px',
                borderRadius: 8,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #f0f0f0'
            }}
            // bodyStyle={{ padding: 15 }}
        >
            <p className={styles.titleFrom}>Отзывы</p>
            <ul style={{display: "flex", flexDirection: "column", gap: 10}}>
                <li style={{borderLeft: "3px solid #EF3124", paddingLeft: 15, fontFamily: 'Roboto',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    verticalAlign: 'middle'
                }}>«ReqRoute помог нам ...»</li>
                <li style={{borderLeft: "3px solid #EF3124", paddingLeft: 15, fontFamily: 'Roboto',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    verticalAlign: 'middle'
                }}>«Чёткий календарь и напоминания — идеальное
                    сочетание для команды мероприятий.»</li>
            </ul>

        </Card>
    );
}