// src/store/useMeetingStore.ts
import { create } from 'zustand'
import { MeetingData, MeetingPerson, MeetingStatus } from '@/types/meeting'

interface MeetingStore {
    // Данные встречи
    meeting: MeetingData
    loading: boolean
    error: string | null

    // Действия
    setMeeting: (meeting: MeetingData) => void
    updateStatus: (status: MeetingStatus) => void
    updateDecisions: (decisions: string) => void
    updateComments: (comments: string) => void

    // Управление участниками
    togglePresence: (personId: number) => void
    toggleLate: (personId: number) => void
    markAllPresent: () => void
    clearAllChecks: () => void
    forceMarkAllPresent: () => void
    forceClearAllChecks: () => void

    // Загрузка/сохранение
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void

    // Геттеры
    getTotalCount: () => number
    getPresentCount: () => number
    getAbsentCount: () => number
    getOrganizers: () => MeetingPerson[]
    getParticipants: () => MeetingPerson[]
}

// Мок-данные для инициализации (совпадает с вашими данными)
const initialMeetingData: MeetingData = {
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
        // Организаторы (id: 1-2)
        { id: 1, name: 'Иван Петров', role: 'Руководитель проекта', isPresent: true, type: 'organizer' },
        { id: 2, name: 'Иван Иван', role: 'Дизайнер', isPresent: true, type: 'organizer' },

        // Участники (id: 3-5)
        { id: 3, name: 'Мария Сидорова', role: 'Frontend разработчик', isPresent: true, isLate: true, type: 'participant' },
        { id: 4, name: 'Алексей Иванов', role: 'Backend разработчик', isPresent: true, isLate: false, type: 'participant' },
        { id: 5, name: 'Ольга Смирнова', role: 'Дизайнер', isPresent: false, isLate: false, type: 'participant' },
    ]
}

export const useMeetingStore = create<MeetingStore>((set, get) => ({
    // Начальное состояние
    meeting: initialMeetingData,
    loading: false,
    error: null,

    // Установка данных встречи
    setMeeting: (meeting) => set({ meeting, error: null }),

    // Обновление статуса
    updateStatus: (status) =>
        set(state => ({
            meeting: { ...state.meeting, status }
        })),

    // Обновление решений
    updateDecisions: (decisions) =>
        set(state => ({
            meeting: { ...state.meeting, decisions }
        })),

    // Обновление комментариев
    updateComments: (comments) =>
        set(state => ({
            meeting: { ...state.meeting, comments }
        })),

    // Переключение присутствия
    togglePresence: (personId) =>
        set(state => ({
            meeting: {
                ...state.meeting,
                people: state.meeting.people.map(person =>
                    person.id === personId
                        ? {
                            ...person,
                            isPresent: !person.isPresent,
                            // Если снимаем присутствие, снимаем опоздание
                            isLate: !person.isPresent ? false : person.isLate
                        }
                        : person
                )
            }
        })),

    // Переключение опоздания (только для участников)
    toggleLate: (personId) =>
        set(state => ({
            meeting: {
                ...state.meeting,
                people: state.meeting.people.map(person =>
                    person.id === personId && person.type === 'participant'
                        ? { ...person, isLate: !person.isLate }
                        : person
                )
            }
        })),

    // Отметить всех как присутствующих (логический метод)
    markAllPresent: () =>
        set(state => ({
            meeting: {
                ...state.meeting,
                people: state.meeting.people.map(person => ({
                    ...person,
                    isPresent: true
                }))
            }
        })),

    // Снять все галочки (логический метод)
    clearAllChecks: () =>
        set(state => ({
            meeting: {
                ...state.meeting,
                people: state.meeting.people.map(person => ({
                    ...person,
                    isPresent: false,
                    isLate: person.type === 'participant' ? false : undefined
                }))
            }
        })),

    // Принудительно отметить всех как присутствующих
    forceMarkAllPresent: () =>
        set(state => ({
            meeting: {
                ...state.meeting,
                people: state.meeting.people.map(person => ({
                    ...person,
                    isPresent: true
                }))
            }
        })),

    // Принудительно снять все галочки
    forceClearAllChecks: () =>
        set(state => ({
            meeting: {
                ...state.meeting,
                people: state.meeting.people.map(person => ({
                    ...person,
                    isPresent: false,
                    isLate: person.type === 'participant' ? false : undefined
                }))
            }
        })),

    // Загрузка/ошибки
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    // Геттеры
    getTotalCount: () => get().meeting.people.length,

    getPresentCount: () =>
        get().meeting.people.filter(person => person.isPresent).length,

    getAbsentCount: () => {
        const state = get()
        return state.meeting.people.length - state.meeting.people.filter(person => person.isPresent).length
    },

    getOrganizers: () =>
        get().meeting.people.filter(person => person.type === 'organizer'),

    getParticipants: () =>
        get().meeting.people.filter(person => person.type === 'participant')
}))