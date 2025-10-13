import { Card, Form, Input, Typography, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from "./styles.module.css";
import { useState } from 'react';

const { Title, Text } = Typography;

export default function RegistrationForm() {
    const [registrationType, setRegistrationType] = useState<string>('open');

    return (
        <Card
            style={{
                maxWidth: 600,
                width: 400,
                margin: '15px 0',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: "1px solid #E9ECEF"

            }}
            bodyStyle={{ padding: 15 }}
        >
            <p className={styles.titleFrom}>Регистрация</p>

            <Form layout="vertical">
                {/* Кнопки типа регистрации */}
                <div style={{ marginBottom: 10 }}>
                    <div className={styles.wrapBtn}>
                        <button
                            className={`${styles.btnAccess} ${registrationType === 'open' ? styles.btnAccessActive : ''}`}
                            onClick={() => setRegistrationType('open')}
                            type="button"
                            style={{width: "195px"}}
                        >
                            Открыта
                        </button>
                        <button
                            className={`${styles.btnAccess} ${registrationType === 'invite' ? styles.btnAccessActive : ''}`}
                            onClick={() => setRegistrationType('invite')}
                            type="button"
                            style={{width: "195px"}}

                        >
                            По приглашению
                        </button>
                    </div>
                </div>

                {/* Дополнительные поля */}
                <div>
                    <Text  style={{ display: 'block', marginBottom: 5 }}>
                        Доп. поля формы (через запятую)
                    </Text>

                    <Input
                        placeholder="Должность, Компания, Телеграм"
                        size="large"
                        style={{ borderRadius: 8, marginBottom: 0 }}
                    />
                </div>
            </Form>
        </Card>
    );
}