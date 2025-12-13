// src/store/useCasesStore.ts
import { create } from 'zustand'
import { CaseForUI } from '@/types'

interface CasesStore {
    cases: CaseForUI[]
    loading: boolean
    error: string | null

    // Геттеры
    totalCases: number
    presentCases: number
    absentCases: number

    // Действия
    setCases: (cases: CaseForUI[]) => void
    updateVote: (caseId: number, voteType: 'like' | 'dislike') => void
    addComment: (caseId: number, comment: string) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void

    // Хелперы
    getStats: () => {
        total: number
        present: number
        absent: number
        voting: number
        selected: number
        draft: number
        inProgress: number
        proposals: number
    }

    getCaseById: (id: number) => CaseForUI | undefined
    getCasesByStage: (stage: string) => CaseForUI[]
}

export const useCasesStore = create<CasesStore>((set, get) => ({
    // Начальное состояние
    cases: [],
    loading: false,
    error: null,

    // Геттеры
    get totalCases() {
        return get().cases.length
    },

    get presentCases() {
        return get().cases.filter(c =>
            c.stage === 'На голосовании' || c.stage === 'В разработке'
        ).length
    },

    get absentCases() {
        return get().cases.filter(c =>
            c.stage === 'Черновики' || c.stage === 'Отобранные' || c.stage === 'Предложения'
        ).length
    },

    // Действия
    setCases: (cases) => set({
        cases,
        error: null
    }),

    updateVote: (caseId, voteType) =>
        set(state => ({
            cases: state.cases.map(caseItem => {
                if (caseItem.id === caseId) {
                    const currentVote = caseItem.userVote

                    if (currentVote === voteType) {
                        return {
                            ...caseItem,
                            userVote: null,
                            likes: voteType === 'like' ? caseItem.likes - 1 : caseItem.likes,
                            dislikes: voteType === 'dislike' ? caseItem.dislikes - 1 : caseItem.dislikes
                        }
                    }

                    if (currentVote && currentVote !== voteType) {
                        return {
                            ...caseItem,
                            userVote: voteType,
                            likes: voteType === 'like' ? caseItem.likes + 1 : caseItem.likes - 1,
                            dislikes: voteType === 'dislike' ? caseItem.dislikes + 1 : caseItem.dislikes - 1
                        }
                    }

                    return {
                        ...caseItem,
                        userVote: voteType,
                        likes: voteType === 'like' ? caseItem.likes + 1 : caseItem.likes,
                        dislikes: voteType === 'dislike' ? caseItem.dislikes + 1 : caseItem.dislikes
                    }
                }
                return caseItem
            })
        })),

    addComment: (caseId, comment) =>
        set(state => ({
            cases: state.cases.map(caseItem => {
                if (caseItem.id === caseId) {
                    const newComment = {
                        id: Date.now(),
                        author: 'Вы',
                        text: comment,
                        timestamp: 'Только что'
                    }
                    return {
                        ...caseItem,
                        comments: [...caseItem.comments, newComment]
                    }
                }
                return caseItem
            })
        })),

    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    // Хелперы
    getStats: () => {
        const cases = get().cases
        const voting = cases.filter(c => c.stage === 'На голосовании').length
        const selected = cases.filter(c => c.stage === 'Отобранные').length
        const draft = cases.filter(c => c.stage === 'Черновики').length
        const inProgress = cases.filter(c => c.stage === 'В разработке').length
        const proposals = cases.filter(c => c.stage === 'Предложения').length

        return {
            total: cases.length,
            present: voting + inProgress,
            absent: selected + draft + proposals,
            voting,
            selected,
            draft,
            inProgress,
            proposals
        }
    },

    getCaseById: (id: number) => {
        return get().cases.find(c => c.id === id)
    },

    getCasesByStage: (stage: string) => {
        return get().cases.filter(c => c.stage === stage)
    }
}))