// src/config/api.ts
export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    API_PREFIX: '/api/v1',

    getFullUrl: (endpoint: string) => {
        let normalizedEndpoint = endpoint.trim()
        
        // Если endpoint уже полный URL, возвращаем как есть (но исправляем дублирование если есть)
        if (normalizedEndpoint.startsWith('http://') || normalizedEndpoint.startsWith('https://')) {
            if (normalizedEndpoint.includes('/api/v1/api/v1')) {
                return normalizedEndpoint.replace(/\/api\/v1\/api\/v1/g, '/api/v1')
            }
            return normalizedEndpoint
        }
        
        // Убираем BASE_URL если он случайно включен
        if (normalizedEndpoint.startsWith(API_CONFIG.BASE_URL)) {
            normalizedEndpoint = normalizedEndpoint.substring(API_CONFIG.BASE_URL.length)
        }
        
        // КРИТИЧЕСКИ ВАЖНО: Убираем ВСЕ вхождения API_PREFIX из начала пути
        // Это предотвращает дублирование /api/v1/api/v1
        while (normalizedEndpoint.startsWith(API_CONFIG.API_PREFIX)) {
            normalizedEndpoint = normalizedEndpoint.substring(API_CONFIG.API_PREFIX.length)
        }
        
        // Нормализуем ведущие слэши - должен быть ровно один
        normalizedEndpoint = normalizedEndpoint.replace(/^\/+/, '/')
        
        // Собираем финальный URL
        const result = `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}${normalizedEndpoint}`
        
        // Финальная защита от дублирования на случай если что-то пошло не так
        if (result.includes('/api/v1/api/v1')) {
            return result.replace(/\/api\/v1\/api\/v1/g, '/api/v1')
        }
        
        return result
    }
}