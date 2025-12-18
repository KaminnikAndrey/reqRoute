// hooks/useCasesApi.ts (обновить)
import { useCallback } from 'react'
import { casesApiClient } from '@/lib/casesApi'
import { useCasesStore } from '@/store/useCasesStore'
import { mapApiCaseToUI } from '@/utils/transformers'

export function useCasesApi() {
    const { setCases, setLoading, setError, updateVote, addComment } = useCasesStore()

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
            const response = await casesApiClient.voteForCase(caseId, voteType)
            // Обновляем голос в store
            updateVote(caseId, voteType)
            return response
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка'
            setError(errorMessage)
            throw err
        }
    }, [updateVote, setError])

    const addCommentToCase = useCallback(async (caseId: number, comment: string) => {
        try {
            const response = await casesApiClient.addCommentToCase(caseId, comment)
            // Добавляем комментарий в store
            addComment(caseId, comment)
            return response
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка'
            setError(errorMessage)
            throw err
        }
    }, [addComment, setError])

    const fetchComments = useCallback(async (caseId: number) => {
        try {
            const comments = await casesApiClient.getCaseComments(caseId)
            return comments
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка'
            setError(errorMessage)
            throw err
        }
    }, [setError])

    return {
        fetchCases,
        voteForCase,
        addCommentToCase,
        fetchComments
    }
}