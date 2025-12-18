// src/utils/dateFormatters.ts

export const formatMeetingDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();

    // Сбрасываем время для сравнения только дат
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const meetingDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    // Разница в днях
    const diffTime = meetingDateOnly.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'Сегодня';
    } else if (diffDays === 1) {
        return 'Завтра';
    } else if (diffDays === -1) {
        return 'Вчера';
    } else if (diffDays > 1 && diffDays <= 7) {
        // Ближайшие дни недели
        const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        return days[date.getDay()];
    } else {
        // Формат: 15 дек
        const months = [
            'янв', 'фев', 'мар', 'апр', 'мая', 'июн',
            'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'
        ];
        return `${date.getDate()} ${months[date.getMonth()]}`;
    }
};

export const formatMeetingTime = (dateString: string, durationMinutes: number = 30): string => {
    const date = new Date(dateString);
    const endDate = new Date(date);
    endDate.setMinutes(endDate.getMinutes() + durationMinutes);

    const formatTime = (d: Date): string => {
        return d.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    return `${formatTime(date)}–${formatTime(endDate)}`;
};

export const formatDayOfWeekShort = (dateString: string): string => {
    const date = new Date(dateString);
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    return days[date.getDay()];
};

export const getTimeFromDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
};