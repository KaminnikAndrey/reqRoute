// src/lib/meetingApi.ts
// Обертка для обратной совместимости - использует новый clients API
import { meetingsClient } from './clients'
import type { MeetingRead, PaginatedResponse } from './apiTypes'

// Реэкспорт типов для обратной совместимости
export type { MeetingRead, PaginatedResponse }

class MeetingApiClient {
    async getMeetings(params: { page?: number; page_size?: number } = {}): Promise<PaginatedResponse<MeetingRead>> {
        return meetingsClient.list(params)
    }

    async getMeetingById(meetingId: number): Promise<MeetingRead> {
        return meetingsClient.getById(meetingId)
    }

    // Для обратной совместимости
    async getMeeting(meetingId: number): Promise<any> {
        try {
            const apiData = await this.getMeetingById(meetingId)
            return this.transformToUIFormat(apiData)
        } catch (error) {
            console.error('Ошибка загрузки встречи:', error)
            // Возвращаем мок, если API недоступно
            return this.getMockMeeting()
        }
    }

    async updateMeetingStatus(meetingId: number, status: string): Promise<any> {
        console.warn('⚠️ Эндпоинт обновления статуса пока не реализован')
        return { success: true, status }
    }

    async saveMeeting(meetingId: number, meetingData: any): Promise<any> {
        console.warn('⚠️ Эндпоинт сохранения встречи пока не реализован')
        return { success: true, meetingId }
    }

    private transformToUIFormat(apiData: MeetingRead): any {
        return {
            title: 'Протокол встречи',
            teamName: `Команда ${apiData.team_id}`,
            date: new Date(apiData.date_time).toLocaleDateString('ru-RU'),
            time: new Date(apiData.date_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            location: '(Екб)',
            link: 'Контур.Толк',
            linkUrl: 'kontur.ru/room/',
            status: 'состоялась',
            decisions: '',
            comments: apiData.summary || '',
            people: this.generateMockPeople()
        }
    }

    private getMockMeeting() {
        return {
            title: 'Протокол встречи',
            teamName: 'Команда ReqRoute',
            date: 'Сегодня',
            time: '18:00–18:45',
            location: '(Екб)',
            link: 'Контур.Толк',
            linkUrl: 'kontur.ru/room/',
            status: 'состоялась',
            decisions: '',
            comments: '',
            people: [
                { id: 1, name: 'Иван Петров', role: 'Руководитель проекта', isPresent: true, type: 'organizer' },
                { id: 2, name: 'Иван Иван', role: 'Дизайнер', isPresent: true, type: 'organizer' },
                { id: 3, name: 'Мария Сидорова', role: 'Frontend разработчик', isPresent: true, isLate: true, type: 'participant' },
                { id: 4, name: 'Алексей Иванов', role: 'Backend разработчик', isPresent: true, isLate: false, type: 'participant' },
                { id: 5, name: 'Ольга Смирнова', role: 'Дизайнер', isPresent: false, isLate: false, type: 'participant' },
            ]
        }
    }

    private generateMockPeople() {
        return [
            { id: 1, name: 'Иван Петров', role: 'Руководитель проекта', isPresent: true, type: 'organizer' },
            { id: 2, name: 'Иван Иван', role: 'Дизайнер', isPresent: true, type: 'organizer' },
            { id: 3, name: 'Мария Сидорова', role: 'Frontend разработчик', isPresent: true, isLate: true, type: 'participant' },
            { id: 4, name: 'Алексей Иванов', role: 'Backend разработчик', isPresent: true, isLate: false, type: 'participant' },
            { id: 5, name: 'Ольга Смирнова', role: 'Дизайнер', isPresent: false, isLate: false, type: 'participant' },
        ]
    }
}

export const meetingApiClient = new MeetingApiClient()