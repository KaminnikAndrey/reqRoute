// src/config/routes.ts
export const ROUTES = {
    // Публичные маршруты (доступны без авторизации)
    PUBLIC: {
        HOME: '/',
        LOGIN: '/login',
        REGISTRATION: '/registration',
        // Если есть страницы, которых нет в структуре, можно временно закомментировать
        // FORGOT_PASSWORD: '/forgot-password',
        // RESET_PASSWORD: '/reset-password',
        // POLICY: '/policy',
        // PRIVACY: '/privacy',
    },

    // Защищенные маршруты (требуют авторизации)
    PROTECTED: {
        APP: '/app',
        CREATE_EVENT: '/app/createEvent',
        MAIN: '/app/main',
        MINUTES_OF_MEETING: '/app/minutesOfMeeting',
        VOTING: '/app/voting',
        // Можно добавить дополнительные маршруты при их появлении
        // DASHBOARD: '/dashboard',
        // CASES: '/cases',
        // PROFILE: '/profile',
        // SETTINGS: '/settings',
    },

    // API маршруты
    API: {
        AUTH: {
            LOGIN: '/api/auth/login',
            REGISTER: '/api/auth/register',
            LOGOUT: '/api/auth/logout',
            ME: '/api/auth/me',
        },
        CASES: '/api/cases',
        MEETINGS: '/api/meetings',
    }
}

// Проверка является ли маршрут защищенным
export const isProtectedRoute = (pathname: string): boolean => {
    const protectedRoutes = Object.values(ROUTES.PROTECTED);

    // Проверяем точное соответствие или начинается с защищенного маршрута
    return protectedRoutes.some(route =>
        pathname === route ||
        pathname.startsWith(route + '/')
    )
}

// Проверка является ли маршрут публичным
export const isPublicRoute = (pathname: string): boolean => {
    const publicRoutes = Object.values(ROUTES.PUBLIC);

    return publicRoutes.some(route =>
        pathname === route ||
        pathname.startsWith(route + '/')
    )
}

// Дополнительная функция для проверки маршрутов внутри app
export const getAppRoute = (pathname: string): string | null => {
    if (pathname.startsWith('/app/')) {
        const parts = pathname.split('/');
        if (parts.length > 2) {
            return `/app/${parts[2]}`;
        }
    }
    return null;
}