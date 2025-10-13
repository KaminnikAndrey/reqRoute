'use client'

import { useState } from 'react'
import styles from "./styles.module.css"
import Link from "next/link";
import GlobalSearch from "@/app/components/globalSearch/globalSearch";

export default function Header() {

    return (
       <>
                <div className={styles.wrap}>

                <span className={styles.logo}>
                            <img src="/logo.svg" alt="logo" width={24} height={24}/>
                            <span>ReqRoute</span>
                </span>
                <nav className={styles.nav}>
                    <Link href="/" className={styles.link}>
                        Главная
                    </Link>
                    <Link href="/" className={styles.link}>
                        О проекте
                    </Link>
                    <Link href="/" className={styles.link}>
                        Контакты
                    </Link>
                </nav>
                </div>
                <GlobalSearch/>
        </>
    )
}