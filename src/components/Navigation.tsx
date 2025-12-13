import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Navigation.module.css'

export default function Navigation() {
    const pathname = usePathname()

    return (
        <nav className={styles.nav}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Link href="/">МоеПриложение</Link>
                </div>

                <div className={styles.links}>
                    <Link
                        href="/"
                        className={`${styles.link} ${
                            pathname === '/' ? styles.active : ''
                        }`}
                    >
                        Главная
                    </Link>
                    <Link
                        href="/login"
                        className={`${styles.link} ${
                            pathname === '/login' ? styles.active : ''
                        }`}
                    >
                        Вход
                    </Link>
                    <Link
                        href="/registration"
                        className={`${styles.link} ${
                            pathname === '/registration' ? styles.active : ''
                        }`}
                    >
                        Регистрация
                    </Link>
                    <Link
                        href="/createEvent"
                        className={`${styles.link} ${
                            pathname === '/createEvent' ? styles.active : ''
                        }`}
                    >
                        createEvent
                    </Link>
                    <Link
                        href="/main"
                        className={`${styles.link} ${
                            pathname === '/main' ? styles.active : ''
                        }`}
                    >
                        main
                    </Link>
                </div>
            </div>
        </nav>
    )
}