// src/hooks/useCasesApi.ts
import { useCallback } from 'react'
import { casesApiClient } from '@/lib/api'
import { useCasesStore } from '@/store/useCasesStore'
import { mapApiCaseToUI } from '@/utils/transformers'

export function useCasesApi() {
    const { setCases, setLoading, setError } = useCasesStore()

    const fetchCases = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await casesApiClient.getCases({ page_size: 100 })
            const uiCases = response.items.map(mapApiCaseToUI)
            setCases(uiCases)
            return uiCases
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }, [setCases, setLoading, setError])

    const voteForCase = useCallback(async (caseId: number, voteType: 'like' | 'dislike') => {
        try {
            // Оптимистичное обновление UI
            useCasesStore.getState().updateVote(caseId, voteType)

            // "Отправка" на сервер
            await casesApiClient.voteForCase(caseId, voteType)

        } catch (err) {
            console.error('Ошибка голосования:', err)
            // При ошибке - перезагружаем данные
            await fetchCases()
            throw err
        }
    }, [fetchCases])

    const addCommentToCase = useCallback(async (caseId: number, comment: string) => {
        try {
            // Оптимистичное обновление UI
            useCasesStore.getState().addComment(caseId, comment)

            // "Отправка" на сервер
            const response = await casesApiClient.addCommentToCase(caseId, comment)
            return response
        } catch (err) {
            console.error('Ошибка добавления комментария:', err)
            await fetchCases()
            throw err
        }
    }, [fetchCases])

    const fetchComments = useCallback(async (caseId: number) => {
        try {
            const comments = await casesApiClient.getCaseComments(caseId)
            return comments
        } catch (err) {
            console.error('Ошибка загрузки комментариев:', err)
            throw err
        }
    }, [])

    return {
        fetchCases,
        voteForCase,
        addCommentToCase,
        fetchComments
    }
}