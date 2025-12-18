import { Card, Form, Input, Typography } from 'antd';
import styles from "./styles.module.css";

const { Title, Text } = Typography;

export default function SpeakersForm() {
    return (
        <Card
            style={{
                maxWidth: 600,
                width: 400,
                margin: '15px 0',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: "1px solid #E9ECEF"
            }}
            styles={{ body: { padding: 15 } }}
        >
            <p className={styles.titleFrom}>Спикеры и ответственные</p>

            <Form layout="vertical">
                {/* Спикер 1 */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
                    <Form.Item
                    >
                        <Input
                            placeholder="Имя спикера"
                            size="large"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>
                    <Form.Item
                    >
                        <Input
                            placeholder="Роль"
                            size="large"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>
                </div>

                {/* Спикер 2 */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
                    <Form.Item
                        style={{ borderRadius: 8, marginBottom: 0 }}

                    >
                        <Input
                            placeholder="Имя спикера"
                            size="large"
                            style={{ borderRadius: 8, marginBottom: 0 }}
                        />
                    </Form.Item>
                    <Form.Item
                        style={{ borderRadius: 8, marginBottom: 0 }}

                    >
                        <Input
                            placeholder="Роль"
                            size="large"
                            style={{ borderRadius: 8, marginBottom: 0 }}
                        />
                    </Form.Item>
                </div>

                {/* Ответственный организатор */}
                <Form.Item
                    label="Ответственный организатор"
                    name="organizer"
                    style={{ marginBottom: 0 }}
                >
                    <Input
                        placeholder="ФИО организатора"
                        size="large"
                        style={{ borderRadius: 8 }}
                    />
                </Form.Item>
            </Form>
        </Card>
    );
}