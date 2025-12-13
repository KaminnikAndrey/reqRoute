// src/hooks/useMeetingApi.ts
import { useCallback } from 'react'
import { useMeetingStore } from '@/store/useMeetingStore'
import { MeetingData, MeetingStatus } from '@/types/meeting'

export function useMeetingApi() {
    const { setMeeting, setLoading, setError } = useMeetingStore()

    const fetchMeeting = useCallback(async (meetingId: number = 1) => {
        setLoading(true)
        setError(null)

        try {
            // В реальном приложении здесь будет запрос к API
            // Пока используем мок-данные из store
            console.log(`Загрузка встречи ${meetingId} (мок-режим)`)

            // Имитация загрузки
            await new Promise(resolve => setTimeout(resolve, 300))

            // Возвращаем текущие данные из store
            const currentMeeting = useMeetingStore.getState().meeting
            setMeeting(currentMeeting)
            return currentMeeting

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }, [setMeeting, setLoading, setError])

    const updateMeetingStatus = useCallback(async (meetingId: number, status: MeetingStatus) => {
        try {
            // Оптимистичное обновление
            useMeetingStore.getState().updateStatus(status)

            // Имитация запроса к API
            console.log(`Обновление статуса встречи ${meetingId} на: ${status}`)
            await new Promise(resolve => setTimeout(resolve, 200))

        } catch (err) {
            console.error('Ошибка обновления статуса:', err)
            // При ошибке перезагружаем данные
            await fetchMeeting(meetingId)
            throw err
        }
    }, [fetchMeeting])

    const saveMeeting = useCallback(async (meetingId: number = 1) => {
        try {
            const state = useMeetingStore.getState()
            const meetingData = state.meeting

            // Имитация сохранения на сервере
            console.log('Сохранение протокола:', meetingData)
            await new Promise(resolve => setTimeout(resolve, 500))

            console.log('✅ Протокол успешно сохранен')
            return meetingData

        } catch (err) {
            console.error('❌ Ошибка сохранения протокола:', err)
            throw err
        }
    }, [])

    return {
        fetchMeeting,
        updateMeetingStatus,
        saveMeeting
    }
}