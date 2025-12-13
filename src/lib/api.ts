// src/lib/api.ts
import {
    CaseFromApi,
    PaginatedResponse,
    VoteResponse,
    CommentFromApi
} from '@/types'

const API_MODE = process.env.NEXT_PUBLIC_API_MODE || 'mock'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class CasesApiClient {
    // Моковые данные
    private mockCases: CaseFromApi[] = []
    private mockComments: Map<number, CommentFromApi[]> = new Map()

    constructor() {
        this.initializeMockData()
    }

    // Инициализация тестовых данных
    private initializeMockData() {
        // Генерация 25 тестовых кейсов ПО СХЕМЕ Swagger
        this.mockCases = Array.from({ length: 25 }, (_, i) => {
            const statuses = ['draft', 'active', 'voting in progress', 'done'] as const
            const status = statuses[i % 4]

            return {
                id: i + 1,
                term_id: (i % 5) + 1,
                user_id: (i % 3) + 1,
                title: this.getMockTitle(i),
                description: this.getMockDescription(i),
                status: status,
                likes_count: Math.floor(Math.random() * 100),
                dislikes_count: Math.floor(Math.random() * 30),
                created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                updated_at: new Date().toISOString()
            }
        })

        // Генерация комментариев
        this.mockCases.forEach(caseItem => {
            this.mockComments.set(caseItem.id, this.generateMockComments(caseItem.id))
        })
    }

    private getMockTitle(index: number): string {
        const titles = [
            'Мониторинг заявок в реальном времени',
            'Эко-мониторинг промышленных зон',
            'Умное расписание для ВУЗов',
            'Оптимизация логистики доставки',
            'Умная система ирригации',
            'Телемедицинская платформа',
            'Цифровой HR-ассистент',
            'Платформа коллективных инвестиций',
            'Система управления умным домом',
            'Нейроинтерфейс для реабилитации'
        ]
        return titles[index % titles.length]
    }

    private getMockDescription(index: number): string {
        const descriptions = [
            'Разработана система автоматического мониторинга заявок с AI-аналитикой в реальном времени',
            'Комплексная система мониторинга экологических показателей промышленных предприятий',
            'Система автоматического составления расписания с учетом преподавательской нагрузки',
            'Инновационное решение для оптимизации маршрутов доставки с использованием ML',
            'Автоматизированная система полива с использованием данных с датчиков влажности почвы',
            'Платформа для удаленных медицинских консультаций с интеграцией устройств',
            'AI-ассистент для автоматизации процессов найма и адаптации сотрудников',
            'Инвестиционная платформа для коллективных инвестиций в крупные проекты',
            'Единая платформа для управления устройствами умного дома с голосовым управлением',
            'Инновационная система нейрореабилитации пациентов после инсульта'
        ]
        return descriptions[index % descriptions.length]
    }

    private generateMockComments(caseId: number): CommentFromApi[] {
        const authors = [
            { id: 1, name: 'Иван Петров' },
            { id: 2, name: 'Мария Сидорова' },
            { id: 3, name: 'Алексей Козлов' },
            { id: 4, name: 'Елена Воробьева' },
            { id: 5, name: 'Дмитрий Новиков' }
        ]

        const texts = [
            'Отличный проект! Особенно понравилась система аналитики в реальном времени.',
            'Интересное решение, но нужно доработать раздел отчетности.',
            'Поддерживаю! Такая система давно нужна на рынке.',
            'Очень актуально для промышленных регионов.',
            'Интересная идея, но какова стоимость внедрения?',
            'Внедрили тестовую версию - уже видим экономию!',
            'Для засушливых регионов - просто спасение!',
            'Как преподаватель могу сказать - такая система сильно упростила бы работу.'
        ]

        const count = Math.floor(Math.random() * 4) + 1 // 1-4 комментария

        return Array.from({ length: count }, (_, i) => ({
            id: caseId * 100 + i + 1,
            case_id: caseId,
            user_id: authors[i % authors.length].id,
            text: texts[i % texts.length],
            author_name: authors[i % authors.length].name,
            created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        }))
    }

    // Задержка для имитации сети
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    // Основной метод запроса
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        // Если режим mock - используем локальные данные
        if (API_MODE === 'mock') {
            console.log(`📡 MOCK запрос: ${options.method || 'GET'} ${endpoint}`)
            await this.delay(300) // Имитация задержки сети
            return this.handleMockRequest(endpoint, options) as T
        }

        // Реальный запрос (когда появится сервер)
        const url = `${API_BASE_URL}${endpoint}`
        console.log(`🌐 REAL запрос: ${url}`)

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            if (response.status === 204) {
                return null as T
            }

            return await response.json()
        } catch (error) {
            console.error('❌ API request failed:', error)
            throw error
        }
    }

    // Обработка mock запросов
    private handleMockRequest(endpoint: string, options: RequestInit): any {
        const method = options.method || 'GET'

        // GET /api/v1/cases/
        if (endpoint.includes('/api/v1/cases/') && method === 'GET') {
            const url = new URL(`http://localhost${endpoint}`)
            const page = parseInt(url.searchParams.get('page') || '1')
            const pageSize = parseInt(url.searchParams.get('page_size') || '100')

            const start = (page - 1) * pageSize
            const end = start + pageSize

            return {
                total: this.mockCases.length,
                page: page,
                page_size: pageSize,
                items: this.mockCases.slice(start, end)
            }
        }

        // GET /api/v1/cases/{id}
        if (endpoint.match(/\/api\/v1\/cases\/\d+$/) && method === 'GET') {
            const match = endpoint.match(/\/api\/v1\/cases\/(\d+)$/)
            if (match) {
                const caseId = parseInt(match[1])
                const caseItem = this.mockCases.find(c => c.id === caseId)
                return caseItem || null
            }
        }

        // POST /api/v1/cases/{id}/vote
        if (endpoint.match(/\/api\/v1\/cases\/\d+\/vote$/) && method === 'POST') {
            const match = endpoint.match(/\/api\/v1\/cases\/(\d+)\/vote$/)
            if (match) {
                const caseId = parseInt(match[1])
                const body = JSON.parse(options.body as string)
                const voteType = body.vote // 'like' или 'dislike'

                // Обновляем статистику
                const caseItem = this.mockCases.find(c => c.id === caseId)
                if (caseItem) {
                    if (voteType === 'like') {
                        caseItem.likes_count = (caseItem.likes_count || 0) + 1
                    } else {
                        caseItem.dislikes_count = (caseItem.dislikes_count || 0) + 1
                    }
                }

                return {
                    case_id: caseId,
                    total_likes: caseItem?.likes_count || 0,
                    total_dislikes: caseItem?.dislikes_count || 0,
                    user_vote: voteType
                }
            }
        }

        // POST /api/v1/cases/{id}/comments
        if (endpoint.match(/\/api\/v1\/cases\/\d+\/comments$/) && method === 'POST') {
            const match = endpoint.match(/\/api\/v1\/cases\/(\d+)\/comments$/)
            if (match) {
                const caseId = parseInt(match[1])
                const body = JSON.parse(options.body as string)

                const newComment: CommentFromApi = {
                    id: Date.now(),
                    case_id: caseId,
                    user_id: 999, // ID текущего пользователя
                    text: body.text,
                    author_name: 'Вы',
                    created_at: new Date().toISOString()
                }

                // Добавляем комментарий
                const comments = this.mockComments.get(caseId) || []
                comments.push(newComment)
                this.mockComments.set(caseId, comments)

                return newComment
            }
        }

        // GET /api/v1/cases/{id}/comments
        if (endpoint.match(/\/api\/v1\/cases\/\d+\/comments$/) && method === 'GET') {
            const match = endpoint.match(/\/api\/v1\/cases\/(\d+)\/comments$/)
            if (match) {
                const caseId = parseInt(match[1])
                return this.mockComments.get(caseId) || []
            }
        }

        // Дефолтный ответ
        return { message: 'Mock response for endpoint', endpoint }
    }


    // ============ PUBLIC API METHODS ============

    async getCases(params: Record<string, string | number> = {}): Promise<PaginatedResponse<CaseFromApi>> {
        const query = new URLSearchParams(params as Record<string, string>).toString()
        return this.request<PaginatedResponse<CaseFromApi>>(`/api/v1/cases/${query ? `?${query}` : ''}`)
    }

    async voteForCase(caseId: number, voteType: 'like' | 'dislike'): Promise<VoteResponse> {
        return this.request<VoteResponse>(`/api/v1/cases/${caseId}/vote`, {
            method: 'POST',
            body: JSON.stringify({ vote: voteType }),
        })
    }

    async addCommentToCase(caseId: number, comment: string): Promise<CommentFromApi> {
        return this.request<CommentFromApi>(`/api/v1/cases/${caseId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ text: comment }),
        })
    }

    async getCaseComments(caseId: number): Promise<CommentFromApi[]> {
        return this.request<CommentFromApi[]>(`/api/v1/cases/${caseId}/comments`)
    }
}



export const casesApiClient = new CasesApiClient()