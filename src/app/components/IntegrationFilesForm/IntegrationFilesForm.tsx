import { Card, Form, Input, Typography, Button, message } from 'antd';
import {LinkOutlined, CheckOutlined, CloudUploadOutlined, PlusOutlined} from '@ant-design/icons';
import styles from "./styles.module.css";

const { Title, Text } = Typography;

export default function IntegrationFilesForm() {
    const [form] = Form.useForm();

    const handleCheckZoom = () => {
        const zoomLink = form.getFieldValue('zoomLink');
        if (!zoomLink) {
            message.warning('Введите ссылку на Zoom');
            return;
        }
        message.success('Ссылка проверена успешно!');
    };

    const handleFileUpload = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const file = files[0];
            const isPptx = file.name.endsWith('.pptx');
            const isPdf = file.name.endsWith('.pdf');

            if (!isPptx && !isPdf) {
                message.error('Можно загружать только PDF и PPTX файлы!');
                return;
            }
            message.success(`Файл ${file.name} готов к загрузке`);
        }
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
            bodyStyle={{ padding: 15 }}
        >
            <p className={styles.titleFrom}>Интеграции и документы</p>

            <Form form={form} layout="vertical">
                {/* Zoom ссылка */}
                <Form.Item
                    style={{ margin: "10px 0" }}
                >
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Input
                            placeholder="Ссылка Zoom/Meet/Teams"
                            size="large"
                            style={{ borderRadius: 8, flex: 1 }}
                            prefix={<LinkOutlined />}
                        />
                        <Button
                            type="dashed"
                            size="large"
                            onClick={handleCheckZoom}
                            style={{ borderRadius: 8, color: "#EF3124", border: "1px solid #EF3124", margin: "0 auto", display: "block", fontSize: 12}}
                        >
                            Проверить
                        </Button>
                    </div>
                </Form.Item>

                {/* Загрузка файлов */}
                <Form.Item style={{marginBottom: 0}}>
                    <div
                        style={{
                            border: '2px dashed #d9d9d9',
                            borderRadius: 8,
                            textAlign: 'center',
                            backgroundColor: '#fafafa',
                            padding: 5,
                            cursor: 'pointer'
                        }}
                        onClick={() => document.getElementById('fileInput').click()}
                    >
                        <div style={{ color: '#6B7280'}}>
                            Перетащите файлы (.pdf, .pptx) или вставьте ссылки
                        </div>

                        <input
                            id="fileInput"
                            type="file"
                            accept=".pdf,.pptx"
                            multiple
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                        />
                    </div>
                </Form.Item>
            </Form>
        </Card>
    );
}