// src/utils/transformers.ts
import { CaseFromApi, CaseForUI, CommentFromApi } from '@/types'

export function mapApiCaseToUI(apiCase: CaseFromApi): CaseForUI {
    return {
        id: apiCase.id,
        caseName: apiCase.title,
        track: getTrackFromTermId(apiCase.term_id),
        author: getUserName(apiCase.user_id),
        status: getStatusText(apiCase.status),
        description: apiCase.description || 'Нет описания',
        currentRating: calculateRating(apiCase),
        passingThreshold: 50,
        likes: apiCase.likes_count || 0,
        dislikes: apiCase.dislikes_count || 0,
        stage: mapStatusToStage(apiCase.status),
        comments: [],
        userVote: null
    }
}

export function mapApiCommentToUI(comment: CommentFromApi) {
    return {
        id: comment.id,
        author: comment.author_name || 'Аноним',
        text: comment.text,
        timestamp: formatTimestamp(comment.created_at)
    }
}

function getTrackFromTermId(termId: number): string {
    const tracks: Record<number, string> = {
        1: 'Бизнес-аналитика',
        2: 'Экологические технологии',
        3: 'Образовательные технологии',
        4: 'Логистика и доставка',
        5: 'Сельское хозяйство',
        6: 'Медицинские технологии',
        7: 'HR-технологии',
        8: 'Финтех',
        9: 'Умные города',
        10: 'Биомедицинские технологии'
    }
    return tracks[termId] || `Трек ${termId}`
}

function getUserName(userId: number): string {
    const users: Record<number, string> = {
        1: 'Команда ReqRoute',
        2: 'GreenTech Solutions',
        3: 'EduSchedule Pro',
        4: 'ЛогистПро',
        5: 'AgroSmart',
        6: 'MedConnect',
        7: 'HR Tech Innovations',
        8: 'CrowdInvest Pro'
    }
    return users[userId] || `Пользователь ${userId}`
}

function getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
        'draft': 'Черновик',
        'active': 'В разработке',
        'voting in progress': 'На голосовании',
        'done': 'Отобран'
    }
    return statusMap[status] || status
}

function calculateRating(apiCase: CaseFromApi): number {
    const likes = apiCase.likes_count || 0
    const dislikes = apiCase.dislikes_count || 0
    const totalVotes = likes + dislikes

    if (totalVotes === 0) return 0
    return Math.round((likes / totalVotes) * 100)
}

function mapStatusToStage(status: string): string {
    const statusMap: Record<string, string> = {
        'draft': 'Черновики',
        'active': 'В разработке',
        'voting in progress': 'На голосовании',
        'done': 'Отобранные'
    }
    return statusMap[status] || 'Предложения'
}

function formatTimestamp(dateString: string): string {
    if (!dateString) return 'Недавно'

    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Только что'
    if (diffMins < 60) return `${diffMins} мин назад`
    if (diffHours < 24) return `${diffHours} ч назад`
    if (diffDays < 7) return `${diffDays} д назад`

    return date.toLocaleDateString('ru-RU')
}