import { Card, Form, Input, Typography, Radio, Checkbox, Space, FormInstance } from 'antd';
import Link from "next/link";
import styles from "./styles.module.css"
import { useState } from 'react';

const { Title, Text } = Typography;

interface FormatAccessFormProps {
    form?: FormInstance;
}

export default function FormatAccessForm({ form }: FormatAccessFormProps) {
    const [activeButton, setActiveButton] = useState<string>('online');

    const handleButtonClick = (buttonName: string) => {
        setActiveButton(buttonName);
    };

    return (
        <Card
            style={{
                maxWidth: 600,
                margin: '15px 0',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: "1px solid #E9ECEF"

            }}
            styles={{ body: { padding: 15 } }}
        >
            <p className={styles.titleFrom}>Формат и доступ</p>
            <Form form={form} layout="vertical">
                {/* Кнопки формата */}
                <div style={{ marginBottom: 16 }}>
                    <button
                        className={`${styles.btnAccess} ${activeButton === 'online' ? styles.btnAccessActive : ''}`}
                        onClick={() => handleButtonClick('online')}
                        type="button"
                    >
                        Онлайн
                    </button>
                    <button
                        className={`${styles.btnAccess} ${activeButton === 'offline' ? styles.btnAccessActive : ''}`}
                        onClick={() => handleButtonClick('offline')}
                        type="button"
                    >
                        Офлайн
                    </button>
                    <button
                        className={`${styles.btnAccess} ${activeButton === 'hybrid' ? styles.btnAccessActive : ''}`}
                        onClick={() => handleButtonClick('hybrid')}
                        type="button"
                    >
                        Гибрид
                    </button>
                </div>

                {/* 2 инпута через flex */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 7, paddingTop: 10 }}>
                    <Form.Item
                        label="Доступ"
                        name="access"
                        style={{ flex: 1, marginBottom: 7 }}
                        rules={[{ message: 'Выберите тип доступа' }]}
                    >
                        <Input
                            placeholder="Выберите доступ"
                            size="large"
                            style={{ borderRadius: 8, marginBottom: 7 }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Лимит участников"
                        name="participantLimit"
                        style={{ flex: 1 }}
                    >
                        <Input
                            placeholder="0"
                            size="large"
                            style={{ borderRadius: 8 }}
                            type="number"
                        />
                    </Form.Item>
                </div>

                {/* Инпут платформа/адрес */}
                <Form.Item
                    label="Платформа/Адрес"
                    name="platform"
                    rules={[{ message: 'Введите платформу или адрес' }]}
                    style={{ marginTop: -20 }}
                >
                    <Input
                        placeholder="Zoom / Екатеринбург, ул. Пример, 1"
                        size="large"
                        style={{ borderRadius: 8 }}
                    />
                </Form.Item>

                {/* Чекбокс */}
                <div className={styles.checkboxGroup} style={{ marginTop: -20 }}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            className={styles.checkboxInput}
                            name="agreement"
                            required
                        />
                        <span className={styles.customCheckbox}></span>
                        <span className={styles.text}>
                            Нужна модерация вопросов и чат-фильтрация
                        </span>
                    </label>
                </div>
            </Form>
        </Card>
    );
}