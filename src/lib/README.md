# API Clients Documentation

Эта директория содержит API клиенты для работы с бэкендом ReqRoute API.

## Структура

- `apiClient.ts` - Базовый клиент с поддержкой авторизации
- `apiTypes.ts` - Все TypeScript типы на основе Swagger спецификации
- `clients/` - Директория с клиентами для каждого ресурса
- `authApi.ts` - Клиент для аутентификации (совместимость со старым кодом)
- `casesApi.ts` - Клиент для кейсов (совместимость со старым кодом)
- `meetingApi.ts` - Клиент для встреч (совместимость со старым кодом)

## Использование

### Новые клиенты (рекомендуется)

```typescript
import { casesClient, meetingsClient, teamsClient } from '@/lib/clients'
import type { CaseRead, MeetingRead } from '@/lib/apiTypes'

// Получить список кейсов
const cases = await casesClient.list({ page: 1, page_size: 10 })

// Получить кейс по ID
const caseData = await casesClient.getById(1)

// Создать новый кейс
const newCase = await casesClient.create({
  term_id: 1,
  user_id: 1,
  title: 'Новый кейс',
  description: 'Описание',
  status: 'draft'
})

// Обновить кейс
const updatedCase = await casesClient.update(1, {
  title: 'Обновленное название'
})

// Удалить кейс
await casesClient.delete(1)
```

### Доступные клиенты

- `casesClient` - Работа с кейсами
- `termsClient` - Работа с семестрами
- `teamsClient` - Работа с командами
- `studentsClient` - Работа со студентами
- `membershipsClient` - Работа с членствами в командах
- `usersClient` - Работа с пользователями
- `meetingsClient` - Работа со встречами
- `assignmentsClient` - Работа с поручениями
- `checkpointsClient` - Работа с контрольными точками

### Типы

Все типы экспортируются из `apiTypes.ts`:

```typescript
import type {
  CaseRead,
  CaseCreate,
  CaseUpdate,
  MeetingRead,
  TeamRead,
  PaginatedResponse,
  // ... и другие
} from '@/lib/apiTypes'
```

### Авторизация

Авторизация работает автоматически через базовый клиент. Credentials сохраняются в localStorage через `authApiClient`:

```typescript
import { authApiClient } from '@/lib/authApi'

// Вход
await authApiClient.login('email@example.com', 'password')

// Получить текущего пользователя
const user = await authApiClient.getCurrentUser()

// Выход
await authApiClient.logout()
```

### Обработка ошибок

Все методы API клиентов могут выбрасывать ошибки. Рекомендуется использовать try/catch:

```typescript
try {
  const caseData = await casesClient.getById(1)
} catch (error) {
  console.error('Ошибка при получении кейса:', error.message)
}
```

### Пагинация

Все методы `list()` возвращают `PaginatedResponse<T>`:

```typescript
const response = await casesClient.list({ page: 1, page_size: 20 })
// response.items - массив элементов
// response.total - общее количество
// response.page - текущая страница
// response.page_size - размер страницы
```

## Совместимость со старым кодом

Старые клиенты (`casesApiClient`, `meetingApiClient`) остаются доступными для обратной совместимости, но под капотом используют новые клиенты.










