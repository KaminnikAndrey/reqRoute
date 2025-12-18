import { Card, Form, Input, Typography, Button, Select, FormInstance } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import styles from "./styles.module.css";
import { useState } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;

interface DateTimeFormProps {
    form?: FormInstance;
}

interface TimeSlot {
    id: number;
    time: string;
    name: string;
}

export default function DateTimeForm({ form }: DateTimeFormProps) {
    const [activeButton, setActiveButton] = useState<string>('online');
    const [slots, setSlots] = useState<TimeSlot[]>([
        { id: 1, time: '', name: '' },
        { id: 2, time: '', name: '' },
        { id: 3, time: '', name: '' }
    ]);

    const handleButtonClick = (buttonName: string) => {
        setActiveButton(buttonName);
    };

    const addSlot = () => {
        const newSlot: TimeSlot = {
            id: Date.now(),
            time: '',
            name: ''
        };
        setSlots([...slots, newSlot]);
    };

    const removeSlot = (id: number) => {
        if (slots.length > 1) {
            setSlots(slots.filter(slot => slot.id !== id));
        }
    };

    const updateSlot = (id: number, field: keyof TimeSlot, value: string) => {
        setSlots(slots.map(slot =>
            slot.id === id ? { ...slot, [field]: value } : slot
        ));
    };

    return (
        <Card
            style={{
                maxWidth: 600,
                width: 400,
                margin: '0',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: "1px solid #E9ECEF"

            }}
            styles={{ body: { padding: 15 } }}
        >
            <p className={styles.titleFrom}>Дата, время и программа</p>

            <div className={styles.wrapBtn}>
                <button
                    className={`${styles.btnAccess} ${activeButton === 'online' ? styles.btnAccessActive : ''}`}
                    onClick={() => handleButtonClick('online')}
                    type="button"
                >
                    Сегодня 18:00
                </button>
                <button
                    className={`${styles.btnAccess} ${activeButton === 'offline' ? styles.btnAccessActive : ''}`}
                    onClick={() => handleButtonClick('offline')}
                    type="button"
                >
                    Завтра 10:00
                </button>
                <button
                    className={`${styles.btnAccess} ${activeButton === 'hybrid' ? styles.btnAccessActive : ''}`}
                    onClick={() => handleButtonClick('hybrid')}
                    type="button"
                >
                    Пн 11:00
                </button>
            </div>

            <Form form={form} layout="vertical">
                {/* Первая строка: Дата и Старт */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 5 }}>
                    <Form.Item
                        label="Дата"
                        name="date"
                        style={{ flex: 1, marginBottom: 0 }}
                        rules={[{ message: 'Выберите дату' }]}
                    >
                        <Input
                            type="date"
                            size="large"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Старт"
                        name="startTime"
                        style={{ flex: 1, marginBottom: 0 }}
                        rules={[{ message: 'Выберите время начала' }]}
                    >
                        <Input
                            type="time"
                            size="large"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>
                </div>

                {/* Вторая строка: Длительность и Окончание */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 5 }}>
                    <Form.Item
                        label="Длительность"
                        name="duration"
                        style={{ flex: 1, marginBottom: 0 }}
                    >
                        <Input
                            placeholder="2 часа"
                            size="large"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Окончание"
                        name="endTime"
                        style={{ flex: 1, marginBottom: 0 }}
                    >
                        <Input
                            type="time"
                            size="large"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>
                </div>

                {/* Часовой пояс */}
                <Form.Item
                    label="Часовой пояс"
                    name="timezone"
                    style={{ marginBottom: 24 }}
                >
                    <Select
                        size="large"
                        placeholder="Выберите часовой пояс"
                        style={{ borderRadius: 8 }}
                    >
                        <Option value="+3">МСК (UTC+3)</Option>
                        <Option value="+4">UTC+4</Option>
                        <Option value="+5">UTC+5</Option>
                        <Option value="+6">UTC+6</Option>
                        <Option value="+7">UTC+7</Option>
                    </Select>
                </Form.Item>

                {/* Программа - динамические слоты */}
                <div style={{ marginBottom: 16 }}>
                    <Text strong style={{ display: 'block', marginBottom: 16 }}>
                        Программа мероприятия
                    </Text>

                    {slots.map((slot, index) => (
                        <div key={slot.id} style={{ display: 'flex', gap: 16, marginBottom: 12, alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                <Input
                                    type="time"
                                    size="large"
                                    placeholder="Время"
                                    style={{ borderRadius: 8 }}
                                    value={slot.time}
                                    onChange={(e) => updateSlot(slot.id, 'time', e.target.value)}
                                />
                            </div>
                            <div style={{ flex: 2 }}>
                                <Input
                                    placeholder="Название слота"
                                    size="large"
                                    style={{ borderRadius: 8 }}
                                    value={slot.name}
                                    onChange={(e) => updateSlot(slot.id, 'name', e.target.value)}
                                />
                            </div>
                            {slots.length > 1 && (
                                <Button
                                    type="text"
                                    danger
                                    icon={<MinusOutlined />}
                                    onClick={() => removeSlot(slot.id)}
                                    style={{ marginTop: 4 }}
                                    size="small"
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Кнопка добавить слот */}
                <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={addSlot}
                    style={{ width: '50%', borderRadius: 8, color: "#EF3124", border: "1px solid #EF3124", margin: "0 auto", display: "block"}}
                >
                    Добавить слот
                </Button>
            </Form>
        </Card>
    );
}