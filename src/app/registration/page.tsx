// src/app/registration/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from "./styles.module.css"
import Link from "next/link"
import { authApiClient } from '@/lib/authApi'

export default function Registration() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Локальное состояние для ошибок валидации
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormErrors({})

        const formData = new FormData(e.target as HTMLFormElement)

        // Получаем данные из формы
        const firstName = (formData.get('firstName') as string)?.trim() || ''
        const lastName = (formData.get('lastName') as string)?.trim() || ''
        const email = (formData.get('email') as string)?.trim() || ''
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string
        const agreement = formData.get('agreement') === 'on'

        // Валидация
        const errors: Record<string, string> = {}

        if (!firstName) {
            errors.firstName = 'Имя обязательно'
        }

        if (!lastName) {
            errors.lastName = 'Фамилия обязательна'
        }

        if (!email) {
            errors.email = 'Email обязателен'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Введите корректный email'
        }

        if (!password) {
            errors.password = 'Пароль обязателен'
        } else if (password.length < 8) {
            errors.password = 'Пароль должен содержать не менее 8 символов'
        }

        if (!confirmPassword) {
            errors.confirmPassword = 'Подтверждение пароля обязательно'
        } else if (password !== confirmPassword) {
            errors.confirmPassword = 'Пароли не совпадают'
        }

        if (!agreement) {
            errors.agreement = 'Необходимо согласиться с правилами'
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Регистрация через API
            const full_name = `${firstName} ${lastName}`.trim()
            await authApiClient.register({
                full_name,
                email,
                password,
            })

            // Перенаправление после успешной регистрации и автоматического входа
            router.push('/main')

        } catch (err: any) {
            console.error('Ошибка регистрации:', err)
            setError(err.message || 'Ошибка регистрации. Попробуйте еще раз.')
        } finally {
            setLoading(false)
        }
    }

    return (
            <div className={styles.center}>
                <div className={styles.wrapper}>
                    <div className={styles.wrap}>
                    <span className={styles.logo}>
                        <img src="/logo.svg" alt="logo" width={24} height={24}/>
                        <span>ReqRoute</span>
                    </span>
                        <Link href="/" className={styles.link}>
                            На главную
                        </Link>
                    </div>

                    <p className={styles.title}>Регистрация</p>
                    <p className={styles.text}>Создайте аккаунт для работы с ReqRoute</p>

                    {/* Показываем общую ошибку */}
                    {error && (
                        <div className={styles.errorMessage}>
                            {error}
                        </div>
                    )}

                    <form className={styles.form} onSubmit={handleSubmit}>
                        {/* Имя и Фамилия в одной строке */}
                        <div className={styles.wrapInputs}>
                            <div className={styles.formGroup}>
                                <label htmlFor="firstName" className={styles.label}>
                                    Имя
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    className={`${styles.input} ${formErrors.firstName ? styles.inputError : ''}`}
                                    placeholder="Иван"
                                    required
                                    disabled={loading}
                                />
                                {formErrors.firstName && (
                                    <span className={styles.errorText}>{formErrors.firstName}</span>
                                )}
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="lastName" className={styles.label}>
                                    Фамилия
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    className={`${styles.input} ${formErrors.lastName ? styles.inputError : ''}`}
                                    placeholder="Иванов"
                                    required
                                    disabled={loading}
                                />
                                {formErrors.lastName && (
                                    <span className={styles.errorText}>{formErrors.lastName}</span>
                                )}
                            </div>
                        </div>

                        {/* E-mail */}
                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>
                                E-mail
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className={`${styles.input} ${formErrors.email ? styles.inputError : ''}`}
                                placeholder="name@company.com"
                                required
                                disabled={loading}
                            />
                            {formErrors.email && (
                                <span className={styles.errorText}>{formErrors.email}</span>
                            )}
                        </div>

                        {/* Пароль */}
                        <div className={styles.formGroup}>
                            <label htmlFor="password" className={styles.label}>
                                Пароль
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className={`${styles.input} ${formErrors.password ? styles.inputError : ''}`}
                                placeholder="Минимум 8 символов"
                                required
                                minLength={8}
                                disabled={loading}
                            />
                            {formErrors.password && (
                                <span className={styles.errorText}>{formErrors.password}</span>
                            )}
                        </div>

                        {/* Повторите пароль */}
                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword" className={styles.label}>
                                Повторите пароль
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className={`${styles.input} ${formErrors.confirmPassword ? styles.inputError : ''}`}
                                placeholder="Ещё раз пароль"
                                required
                                minLength={8}
                                disabled={loading}
                            />
                            {formErrors.confirmPassword && (
                                <span className={styles.errorText}>{formErrors.confirmPassword}</span>
                            )}
                        </div>

                        {/* Чекбокс согласия */}
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    className={styles.checkboxInput}
                                    name="agreement"
                                    required
                                    disabled={loading}
                                />
                                <span className={styles.customCheckbox}></span>
                                <span className={styles.text}>
                                Cоглашаюсь с <Link href="/policy" className={styles.link}>Правилами</Link> и <Link href="/privacy" className={styles.link}>политикой конфиденциальности</Link>
                            </span>
                            </label>
                            {formErrors.agreement && (
                                <span className={styles.errorText}>{formErrors.agreement}</span>
                            )}
                        </div>

                        {/* Кнопка Зарегистрироваться */}
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                        </button>

                        {/* Ссылка на вход */}
                        <div className={styles.registerContainer}>
                            <span className={styles.text}>Уже есть аккаунт? </span>
                            <Link href="/login" className={styles.link}>
                                Войти
                            </Link>
                        </div>
                    </form>

                    <span className={styles.divider}>или</span>

                    <div className={styles.footer}>
                        <span className={styles.text}>© ReqRoute · 2025</span>
                    </div>
                </div>
            </div>
    )
}