// src/lib/index.ts
// Главный файл для экспорта всех API клиентов и типов

// Базовый клиент
export { apiClient } from './apiClient'

// Все API клиенты
export * from './clients'

// Типы
export * from './apiTypes'

// Старые клиенты (для обратной совместимости)
export { casesApiClient } from './casesApi'
export { meetingApiClient } from './meetingApi'
export { authApiClient } from './authApi'










