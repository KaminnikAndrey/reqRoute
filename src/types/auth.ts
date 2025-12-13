// src/types/auth.ts
export interface RegistrationData {
    firstName: string
    lastName: string
    company: string
    position?: string
    email: string
    password: string
    confirmPassword: string
    agreement: boolean
}

export interface User {
    id: number
    firstName: string
    lastName: string
    email: string
    company: string
    position?: string
    createdAt: string
}

export interface AuthState {
    user: User | null
    loading: boolean
    error: string | null
    isAuthenticated: boolean
}

export interface LoginCredentials {
    email: string
    password: string
}

// src/types/auth.ts (добавляем к существующему)
export interface LoginFormData {
    email: string
    password: string
    remember: boolean
}