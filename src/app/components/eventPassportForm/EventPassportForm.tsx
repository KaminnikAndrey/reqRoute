import { Card, Form, Input, Typography } from 'antd';
import styles from "./styles.module.css"

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function EventPassportForm() {
    return (
        <Card
            style={{
                maxWidth: 600,
                width: 400,
                margin: '15px 0 0 0',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                padding: 0,
                border: "1px solid #E9ECEF"

            }}
            bodyStyle={{ padding: 15 }}
        >
            {/* Заголовок */}
            <p className={styles.titleFrom}>Паспорт мероприятия</p>

            <Form
                layout="vertical"
                requiredMark="optional"
            >
                {/* Название мероприятия */}
                <Form.Item
                    label="Название"
                    name="eventName"
                    rules={[{ required: true, message: 'Введите название мероприятия' }]}
                    style={{marginBottom: "7px"}}
                >
                    <Input
                        placeholder="IT Leadership Meetup"
                        size="large"
                        style={{ borderRadius: 8, fontWeight: 400, fontSize: 14}}
                    />
                </Form.Item>

                {/* Короткое описание */}
                <Form.Item
                    label="Короткое описание"
                    name="shortDescription"
                    rules={[{ required: true, message: 'Введите описание мероприятия' }]}
                    style={{marginBottom: "7px"}}
                >
                    <TextArea
                        placeholder="Цель, аудитория"
                        rows={4}
                        style={{ borderRadius: 8, fontWeight: 400, fontSize: 14, resize: 'none' }}


                    />
                </Form.Item>
            </Form>
        </Card>
    );
}