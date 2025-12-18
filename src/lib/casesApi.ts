// src/lib/casesApi.ts
// Обертка для обратной совместимости - использует новый clients API
import { casesClient } from './clients'
import type { CaseRead, PaginatedResponse } from './apiTypes'
import type { CaseFromApi } from '@/types'

// Реэкспорт типов для обратной совместимости
export type { CaseRead, PaginatedResponse }

// Мок данные для кейсов
function getMockCases(): CaseFromApi[] {
    return [
        {
            id: 1,
            term_id: 1,
            user_id: 1,
            title: 'Система управления проектами ReqRoute',
            description: 'Веб-платформа для автоматизации учета работы с вузами. Включает управление командами, встречами, кейсами и протоколами.',
            status: 'voting in progress',
            likes_count: 15,
            dislikes_count: 2,
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: 2,
            term_id: 2,
            user_id: 2,
            title: 'GreenTech - Мониторинг экологии',
            description: 'Мобильное приложение для отслеживания экологических показателей в реальном времени.',
            status: 'voting in progress',
            likes_count: 23,
            dislikes_count: 1,
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: 3,
            term_id: 3,
            user_id: 3,
            title: 'EduSchedule Pro',
            description: 'Платформа для автоматизации расписания учебных заведений с интеграцией календарей.',
            status: 'voting in progress',
            likes_count: 18,
            dislikes_count: 3,
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: 4,
            term_id: 4,
            user_id: 4,
            title: 'ЛогистПро - Умная логистика',
            description: 'Система оптимизации маршрутов доставки с использованием AI и машинного обучения.',
            status: 'active',
            likes_count: 12,
            dislikes_count: 0,
            created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: 5,
            term_id: 5,
            user_id: 5,
            title: 'AgroSmart - Умное сельское хозяйство',
            description: 'IoT-решение для мониторинга состояния почвы и автоматизации полива.',
            status: 'voting in progress',
            likes_count: 9,
            dislikes_count: 4,
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: 6,
            term_id: 6,
            user_id: 6,
            title: 'MedConnect - Телемедицина',
            description: 'Платформа для онлайн-консультаций с врачами и управления медицинскими записями.',
            status: 'done',
            likes_count: 31,
            dislikes_count: 2,
            created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: 7,
            term_id: 7,
            user_id: 7,
            title: 'HR Tech Innovations',
            description: 'Система автоматизации HR-процессов: подбор, онбординг, оценка сотрудников.',
            status: 'voting in progress',
            likes_count: 7,
            dislikes_count: 5,
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: 8,
            term_id: 8,
            user_id: 8,
            title: 'CrowdInvest Pro',
            description: 'Платформа для краудфандинга и инвестирования в стартапы.',
            status: 'draft',
            likes_count: 0,
            dislikes_count: 0,
            created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
        }
    ]
}

export interface VoteResponse {
    case_id: number
    total_likes: number
    total_dislikes: number
    user_vote: 'like' | 'dislike' | null
}

export interface CommentFromApi {
    id: number
    case_id: number
    user_id: number
    text: string
    author_name?: string
    created_at: string
}

class CasesApiClient {
    async getCases(params: { page?: number; page_size?: number } = {}): Promise<PaginatedResponse<CaseRead>> {
        try {
            // Пытаемся получить данные из API
            return await casesClient.list(params)
        } catch (error) {
            // Если API недоступен, используем мок данные
            console.warn('⚠️ API недоступен, используем мок данные для кейсов')
            const mockCases = getMockCases()
            
            // Преобразуем мок данные в формат CaseRead (расширенный с likes/dislikes)
            const items: any[] = mockCases.map(caseItem => ({
                id: caseItem.id,
                term_id: caseItem.term_id,
                user_id: caseItem.user_id,
                title: caseItem.title,
                description: caseItem.description,
                status: caseItem.status as 'draft' | 'active' | 'voting in progress' | 'done',
                likes_count: caseItem.likes_count,
                dislikes_count: caseItem.dislikes_count
            }))
            
            return {
                total: items.length,
                page: params.page || 1,
                page_size: params.page_size || 10,
                items
            }
        }
    }

    async getCaseById(caseId: number): Promise<CaseRead> {
        return casesClient.getById(caseId)
    }

    // Для обратной совместимости с вашим существующим кодом
    async voteForCase(caseId: number, voteType: 'like' | 'dislike'): Promise<VoteResponse> {
        console.warn('⚠️ Эндпоинт голосования пока не реализован в бэкенде')
        // Пока возвращаем мок, пока не добавите эндпоинт в бэкенд
        return {
            case_id: caseId,
            total_likes: 0,
            total_dislikes: 0,
            user_vote: voteType
        }
    }

    async addCommentToCase(caseId: number, comment: string): Promise<CommentFromApi> {
        console.warn('⚠️ Эндпоинт комментариев пока не реализован в бэкенде')
        return {
            id: Date.now(),
            case_id: caseId,
            user_id: 999, // ID текущего пользователя
            text: comment,
            author_name: 'Вы',
            created_at: new Date().toISOString()
        }
    }

    async getCaseComments(caseId: number): Promise<CommentFromApi[]> {
        console.warn('⚠️ Эндпоинт комментариев пока не реализован в бэкенде')
        return []
    }
}

export const casesApiClient = new CasesApiClient()