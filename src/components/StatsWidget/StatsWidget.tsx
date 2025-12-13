// src/components/StatsWidget.tsx
'use client'

import { Card, Row, Col } from 'antd'
import { useMemo } from 'react' // ← добавь
import {
    TeamOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    LikeOutlined,
    StarOutlined,
    EditOutlined
} from '@ant-design/icons'
import { useCasesStore } from '@/store/useCasesStore'

const StatsWidget = () => {
    // Запоминаем функцию getStats
    const getStats = useCasesStore(state => state.getStats)

    // Кешируем результат
    const stats = useMemo(() => getStats(), [getStats]) // ← вот это важно!

    return (
        <Card title="Статистика кейсов" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
                <Col xs={24} sm={8} md={6}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <TeamOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                        <div>
                            <div style={{ fontSize: 20, fontWeight: 'bold' }}>{stats.total}</div>
                            <div style={{ color: '#666' }}>Всего кейсов</div>
                        </div>
                    </div>
                </Col>

                <Col xs={24} sm={8} md={6}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                        <div>
                            <div style={{ fontSize: 20, fontWeight: 'bold' }}>{stats.present}</div>
                            <div style={{ color: '#666' }}>Активные</div>
                            <div style={{ fontSize: 12, color: '#999' }}>
                                Голосование: {stats.voting} | В работе: {stats.inProgress}
                            </div>
                        </div>
                    </div>
                </Col>

                <Col xs={24} sm={8} md={6}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <CloseCircleOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
                        <div>
                            <div style={{ fontSize: 20, fontWeight: 'bold' }}>{stats.absent}</div>
                            <div style={{ color: '#666' }}>Неактивные</div>
                            <div style={{ fontSize: 12, color: '#999' }}>
                                Отобранные: {stats.selected} | Черновики: {stats.draft}
                            </div>
                        </div>
                    </div>
                </Col>

                <Col xs={24} sm={8} md={6}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <StarOutlined style={{ fontSize: 24, color: '#722ed1' }} />
                        <div>
                            <div style={{ fontSize: 20, fontWeight: 'bold' }}>{stats.proposals}</div>
                            <div style={{ color: '#666' }}>Предложения</div>
                            <div style={{ fontSize: 12, color: '#999' }}>
                                <LikeOutlined style={{ marginRight: 4 }} /> {stats.voting} на голосовании
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Card>
    )
}

export default StatsWidget