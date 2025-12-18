// src/app/layout.tsx
import { Inter } from 'next/font/google'
import './globals.css'
import {AuthProviderNoRedirect} from "@/components/auth/AuthProviderNoRedirect";

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="ru">
        <body className={inter.className}>
        <AuthProviderNoRedirect>
            {children}
        </AuthProviderNoRedirect>
        </body>
        </html>
    )
}
