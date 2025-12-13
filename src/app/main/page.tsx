'use client'

import { useState } from 'react'
import styles from "./styles.module.css"
import Link from "next/link";
import Header from "@/app/components/header/Header";
import MeetingCard from "@/app/components/MeetingCard/MeetingCard";
import MeetingLi from "@/app/components/MeetingLi/MeetingLi";
import PlannerCard from "@/app/components/PlannerCard/PlannerCard";
import Calendar from "@/app/components/Calendar/Calendar";
import NotificationCard from "@/app/components/NotificationCard/NotificationCard";
import MemberCard from "@/app/components/MemberCard/MemberCard";
import ReviewsCard from "@/app/components/ReviewsCard/ReviewsCard";

export default function main() {


    return (
        <ProtectedRoute>
            <div className={styles.center}>
                <div className={styles.wrapper}>
                    <Header/>
                    <MeetingCard/>
                    <p className={styles.titleFrom} style={{marginTop: 10, marginBottom: 10}}>Запланированные встречи</p>
                    <MeetingLi date={"Завтра"} time={"10:00–10:30"} title={"Созвон с командой разработки"} platform={"Google Meet"}/>
                    <MeetingLi date={"Пт"} time={"15:00–16:00"} title={"Демо для заказчика"} platform={"Zoom"}/>
                    <MeetingLi date={"Пн"} time={"12:30–13:00"} title={"Созвон командой "} platform={"Teams"}/>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gridTemplateRows: '1fr 1fr',
                        gap: '10px',
                        marginBottom: '20px'
                    }}>
                        <PlannerCard title={"Календарь"} text={"Планирование"}/>
                        <PlannerCard title={"Уведомления"} text={"Email/SMS"}/>
                        <PlannerCard title={"Гости"} text={"Регистрация и списки"}/>
                        <PlannerCard title={"Аналитика"} text={"Отчёты и экспорт"}/>
                    </div>
                    <Calendar/>
                    <NotificationCard/>
                    <p className={styles.titleFrom} style={{marginTop: "15px auto"}}>Наша команда</p>
                    <ul className={styles.wrap} style={{marginTop: 10, marginBottom: 20}}>
                        <MemberCard name={"Алексей"} profession={"CEO"}/>
                        <MemberCard name={"Мария"} profession={"CТO"}/>
                        <MemberCard name={"Ирина"} profession={"UX/UI"}/>
                    </ul>
                    <ReviewsCard/>
                    <a className={styles.link} href="#" style={{display: "block", margin: "0 auto", marginBottom: 10}}>support@reqroute.com</a>
                    <span style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '400px',
                        height: 'fit-content',
                        borderTop: '1px solid #E9ECEF',
                        paddingTop: '11px',
                        gap: '8px',
                        alignItems: 'center',
                        marginBottom: '10px'
                    }}>
                </span>
                    <div className={styles.wrap}>
                        <p className={styles.text}>© ReqRoute · 2025</p>
                        <p className={styles.text}>
                            {/*<text href="/" className={styles.linkFooter}/>*/}
                            {/*    Главная*/}
                            {/*<Link/>*/}
                            {/*&nbsp;·&nbsp;*/}
                            {/*<Link className={styles.linkFooter} href="/"/>*/}
                            {/*    О проекте*/}
                            {/*<Link/>*/}
                            {/*&nbsp;·&nbsp;*/}
                            {/*<Link className={styles.linkFooter} href="/"/>*/}
                            {/*    Политика*/}
                            {/*<Link/>*/}
                        </p>
                    </div>
                </div>
            </div>
        </ProtectedRoute>

    )
}