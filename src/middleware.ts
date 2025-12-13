// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ROUTES, isProtectedRoute, isPublicRoute } from '@/config/routes'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('auth_token')?.value

    // Пропускаем статические файлы и API маршруты
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api/') ||
        pathname.includes('.')
    ) {
        return NextResponse.next()
    }

    // Если маршрут защищенный и нет токена - редирект на логин
    if (isProtectedRoute(pathname) && !token) {
        const loginUrl = new URL(ROUTES.PUBLIC.LOGIN, request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // Если маршрут публичный и есть токен - редирект на дашборд
    if (isPublicRoute(pathname) && token && pathname !== ROUTES.PUBLIC.HOME) {
        return NextResponse.redirect(new URL(ROUTES.PROTECTED.DASHBOARD, request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}