'use client'

import { useState } from 'react'
import styles from "./styles.module.css"
import Link from "next/link";

export default function Registration() {
    const [passwordError, setPasswordError] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitted(true)

        const formData = new FormData(e.target as HTMLFormElement)
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        // Проверка пароля
        if (password.length < 8) {
            setPasswordError('Пароль должен содержать не менее 8 символов')
            return
        }

        // Проверка совпадения паролей
        if (password !== confirmPassword) {
            setPasswordError('Пароли не совпадают')
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

                <p className={styles.title}>Регистрация</p>
                <p className={styles.text}>Создайте аккаунт для ....</p>

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
                                className={styles.input}
                                placeholder="Иван"
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="lastName" className={styles.label}>
                                Фамилия
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                className={styles.input}
                                placeholder="Иванов"
                                required
                            />
                        </div>
                    </div>

                    {/* Компания и Должность в одной строке */}
                    <div className={styles.formGroup}>
                        <div className={styles.formGroup}>
                            <label htmlFor="company" className={styles.label}>
                                Компания
                            </label>
                            <input
                                type="text"
                                id="company"
                                name="company"
                                className={styles.input}
                                placeholder="ReqRoute / Альфа-Банк / …"
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="position" className={styles.label}>
                                Должность (опционально)
                            </label>
                            <input
                                type="text"
                                id="position"
                                name="position"
                                className={styles.input}
                                placeholder="Product Manager / DevOps / …"
                                required
                            />
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
                            className={styles.input}
                            placeholder="name@company.com"
                            required
                        />
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
                            className={`${styles.input} ${passwordError ? styles.inputError : ''}`}
                            placeholder="Минимум 8 символов"
                            required
                            minLength={8}
                        />
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
                            className={`${styles.input} ${passwordError ? styles.inputError : ''}`}
                            placeholder="Ещё раз пароль"
                            required
                            minLength={8}
                        />
                        {isSubmitted && passwordError && (
                            <span className={styles.errorText}>{passwordError}</span>
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
                            />
                            <span className={styles.customCheckbox}></span>
                            <span className={styles.text}>
                                Cоглашаюсь с <Link href="/policy" className={styles.link}>Правилами</Link> и <Link href="/privacy" className={styles.link}>политикой конфиденциальности</Link>
                            </span>
                        </label>
                    </div>

                    {/* Кнопка Зарегистрироваться */}
                    <button type="submit" className={styles.submitButton}>
                        Зарегистрироваться
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