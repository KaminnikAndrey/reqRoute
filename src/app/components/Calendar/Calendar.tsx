import { Card, Typography, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title, Text } = Typography;

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const today = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    const days = [];
    for (let i = 0; i < adjustedFirstDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const prevMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };

    const isToday = (day: number) => {
        return day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();
    };

    return (
        <div>
            {/* Заголовок с навигацией */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16
            }}>
                {/* Заголовок слева */}
                <Title level={4} style={{ margin: 0, color: '#111111', fontSize: 16 }}>
                    {monthNames[currentMonth]} {currentYear}
                </Title>

                {/* Стрелки справа */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                        type="text"
                        icon={<LeftOutlined />}
                        onClick={prevMonth}
                        size="small"
                        style={{ color: '#111111' }}
                    />
                    <Button
                        type="text"
                        icon={<RightOutlined />}
                        onClick={nextMonth}
                        size="small"
                        style={{ color: '#111111' }}
                    />
                </div>
            </div>

            {/* Дни недели */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                textAlign: 'center',
                marginBottom: 8
            }}>
                {weekDays.map(day => (
                    <Text key={day} style={{ fontSize: 12, fontWeight: 500, color: '#EF3124' }}>
                        {day}
                    </Text>
                ))}
            </div>

            {/* Дни месяца */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gridTemplateRows: 'repeat(6, 1fr)',
                gap: '4px'
            }}>
                {days.map((day, index) => (
                    <div
                        key={index}
                        style={{
                            height: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 4,
                            backgroundColor: isToday(day) ? '#EF3124' : 'transparent',
                            color: isToday(day) ? 'white' : day ? '#262626' : 'transparent',
                            fontSize: 12,
                            fontWeight: isToday(day) ? 600 : 400
                        }}
                    >
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
}