'use client'

import { useState } from 'react'
import styles from "./styles.module.css"
import Link from "next/link";

export default function Login() {
    const [passwordError, setPasswordError] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitted(true)

        const formData = new FormData(e.target as HTMLFormElement)
        const password = formData.get('password') as string

        if (password.length < 8) {
            setPasswordError('Пароль должен содержать не менее 8 символов')
            return
        }

        setPasswordError('')
        // Отправка формы
        console.log('Форма отправлена')
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
                            className={styles.input}
                            placeholder="Введите ваш e-mail"
                            required
                        />
                    </div>

                    {/* Поле Пароль */}
                    <div className={styles.formGroup}>
                        <div className={styles.wrap}>
                            <label htmlFor="password" className={styles.label}>
                                Пароль
                            </label>
                            <Link href="/registration" className={styles.link}>
                                Забыли пароль?
                            </Link>
                        </div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className={`${styles.input} ${passwordError ? styles.inputError : ''}`}
                            placeholder="Введите ваш пароль"
                            required
                            minLength={8}
                        />
                        {isSubmitted && passwordError && (
                            <span className={styles.errorText}>{passwordError}</span>
                        )}
                    </div>

                    <div className={styles.wrap}>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    className={styles.checkboxInput}
                                    name="remember"
                                />
                                <span className={styles.customCheckbox}></span>
                                <span className={styles.text}>Запомнить меня</span>
                            </label>
                        </div>
                        <p className={styles.text}>Безопасное подключение</p>
                    </div>

                    {/* Кнопка Войти */}
                    <button type="submit" className={styles.submitButton}>
                        Войти
                    </button>

                    {/* Ссылка на регистрацию */}
                    <div className={styles.registerContainer}>
                        <span className={styles.text}>Нет аккаунта? </span>
                        <Link href="/registration" className={styles.link}>
                            Зарегистрироваться
                        </Link>
                    </div>
                </form>

                <span className={styles.divider}>или</span>

                <div className={styles.btnWrap}>
                    <button type="button" className={styles.socialButton}>
                        Войти через Google
                    </button>
                    <button type="button" className={styles.socialButton}>
                        Войти через GitHub
                    </button>
                </div>

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