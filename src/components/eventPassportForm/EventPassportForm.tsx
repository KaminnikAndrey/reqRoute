import { Card, Form, Input, Typography, FormInstance } from 'antd';
import styles from "./styles.module.css"

const { Title, Text } = Typography;
const { TextArea } = Input;

interface EventPassportFormProps {
    form?: FormInstance;
}

export default function EventPassportForm({ form }: EventPassportFormProps) {
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
            styles={{ body: { padding: 15 } }}
        >
            {/* Заголовок */}
            <p className={styles.titleFrom}>Паспорт мероприятия</p>

            <Form
                form={form}
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