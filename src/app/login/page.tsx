// src/app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from "./styles.module.css"
import Link from "next/link"
import { authApiClient } from '@/lib/authApi'

export default function Login() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormErrors({})
        setError(null)
        setLoading(true)

        const formData = new FormData(e.target as HTMLFormElement)
        const loginData = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            remember: formData.get('remember') === 'on'
        }

        // Валидация
        const errors: Record<string, string> = {}
        if (!loginData.email.trim()) {
            errors.email = 'Email обязателен'
        } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
            errors.email = 'Введите корректный email'
        }

        if (!loginData.password) {
            errors.password = 'Пароль обязателен'
        } else if (loginData.password.length < 8) {
            errors.password = 'Пароль должен быть не менее 8 символов'
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            setLoading(false)
            return
        }

        try {
            await authApiClient.login(loginData.email, loginData.password)
            // После успешного входа перенаправляем на главную
            router.push('/main')
        } catch (err: any) {
            console.error('Ошибка входа:', err)
            setError(err.message || 'Ошибка входа. Проверьте правильность email и пароля.')
        } finally {
            setLoading(false)
        }
    }

    // Автозаполнение тестовыми данными для быстрого тестирования
    const fillTestCredentials = () => {
        const emailInput = document.getElementById('email') as HTMLInputElement
        const passwordInput = document.getElementById('password') as HTMLInputElement

        if (emailInput && passwordInput) {
            emailInput.value = 'test@example.com'
            passwordInput.value = 'password123'
            // Триггерим события изменения для React
            emailInput.dispatchEvent(new Event('input', { bubbles: true }))
            passwordInput.dispatchEvent(new Event('input', { bubbles: true }))
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

                <p className={styles.title}>Вход в аккаунт</p>
                <p className={styles.text}>Продолжите работу с ReqRoute</p>

                {/* Показываем общую ошибку из store */}
                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}

                <form className={styles.form} onSubmit={handleSubmit}>
                    {/* Поле E-mail */}
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>
                            E-mail
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={`${styles.input} ${formErrors.email ? styles.inputError : ''}`}
                            placeholder="Введите ваш e-mail"
                            required
                            disabled={loading}
                            defaultValue="" // Добавляем defaultValue
                        />
                        {formErrors.email && (
                            <span className={styles.errorText}>{formErrors.email}</span>
                        )}
                    </div>

                    {/* Поле Пароль */}
                    <div className={styles.formGroup}>
                        <div className={styles.wrap}>
                            <label htmlFor="password" className={styles.label}>
                                Пароль
                            </label>
                            <Link href="/forgot-password" className={styles.link}>
                                Забыли пароль?
                            </Link>
                        </div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className={`${styles.input} ${formErrors.password ? styles.inputError : ''}`}
                            placeholder="Введите ваш пароль"
                            required
                            minLength={8}
                            disabled={loading}
                            defaultValue="" // Добавляем defaultValue
                        />
                        {formErrors.password && (
                            <span className={styles.errorText}>{formErrors.password}</span>
                        )}
                    </div>

                    <div className={styles.wrap}>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    className={styles.checkboxInput}
                                    name="remember"
                                    disabled={loading}
                                    defaultChecked // По умолчанию checked
                                />
                                <span className={styles.customCheckbox}></span>
                                <span className={styles.text}>Запомнить меня</span>
                            </label>
                        </div>
                        <p className={styles.text}>Безопасное подключение</p>
                    </div>

                    {/* Кнопка Войти */}
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span style={{ marginRight: '8px' }}>⏳</span>
                                Вход...
                            </>
                        ) : 'Войти'}
                    </button>

                    {/* Ссылка на регистрацию */}
                    <div className={styles.registerContainer}>
                        <span className={styles.text}>Нет аккаунта? </span>
                        <Link href="/registration" className={styles.link}>
                            Зарегистрироваться
                        </Link>
                    </div>

                    {/* Ссылка на тестовую страницу */}
                    <div className={styles.registerContainer} style={{ marginTop: '10px' }}>
                        <span className={styles.text}>Нет аккаунта? </span>
                        <Link href="/create-test-user" className={styles.link}>
                            Создать тестового пользователя
                        </Link>
                    </div>
                </form>

                <span className={styles.divider}>или</span>

                <div className={styles.wrap}>
                    <span className={styles.text}>© ReqRoute · 2025</span>
                    <Link href="/policy" className={styles.link}>
                        Политика
                    </Link>
                </div>
            </div>
        </div>
    )
}