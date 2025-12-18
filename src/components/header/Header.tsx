'use client'

import { useState } from 'react'
import styles from "./styles.module.css"
import Link from "next/link";
import GlobalSearch from "@/components/globalSearch/globalSearch";

export default function Header() {

    return (
       <>
                <div className={styles.wrap}>

                <span className={styles.logo}>
                            <img src="/logo.svg" alt="logo" width={24} height={24}/>
                            <span>ReqRoute</span>
                </span>
                <nav className={styles.nav}>
                    <Link href="/main" className={styles.link}>
                        Главная
                    </Link>
                    <Link href="/createEvent" className={styles.link}>
                        Создание мероприятия
                    </Link>
                    <Link href="/voting" className={styles.link}>
                        Голосование
                    </Link>
                </nav>
                </div>
                <GlobalSearch/>
        </>
    )
}