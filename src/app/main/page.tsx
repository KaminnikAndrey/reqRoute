'use client'

import { useState } from 'react'
import styles from "./styles.module.css"
import Link from "next/link";
import Header from "@/components/header/Header";
import MeetingCard from "@/components/MeetingCard/MeetingCard";
import MeetingLi from "@/components/MeetingLi/MeetingLi";
import PlannerCard from "@/components/PlannerCard/PlannerCard";
import Calendar from "@/components/Calendar/Calendar";
import NotificationCard from "@/components/NotificationCard/NotificationCard";
import MemberCard from "@/components/MemberCard/MemberCard";
import ReviewsCard from "@/components/ReviewsCard/ReviewsCard";
import { formatMeetingDate, formatMeetingTime } from '@/utils/dateFormatters';
import {useUpcomingMeetings} from "@/hooks/useMeetingApi";
import { useUserTeams } from "@/hooks/useUserTeams";

export default function Main() {
    const { upcomingMeetings, isLoading: meetingsLoading, isError: meetingsError, error: meetingsErrorObj } = useUpcomingMeetings();
    const { teams, isLoading: teamsLoading, error: teamsError } = useUserTeams();
    const isLoading = meetingsLoading || teamsLoading;
    const hasError = meetingsError || teamsError;

    if (isLoading) {
        return (
            <div className={styles.center}>
                <div className={styles.wrapper}>
                    <Header />
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#666'
                    }}>
                        Загрузка данных...
                    </div>
                </div>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className={styles.center}>
                <div className={styles.wrapper}>
                    <Header />
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#dc3545'
                    }}>
                        <h3>Ошибка при загрузке данных</h3>
                        <p>{meetingsErrorObj?.message || teamsError?.message || 'Неизвестная ошибка'}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Получаем всех участников из всех команд для отображения
    const allMembers = teams.flatMap(team => 
        team.members.map(({ student, membership }) => ({
            name: student.full_name,
            profession: membership.role || 'Участник'
        }))
    ).slice(0, 3); // Берем первых 3 участников

    return (
        <div className={styles.center}>
            <div className={styles.wrapper}>
                <Header/>
                
                {/* Ближайший созвон - используем MeetingCard если есть встречи */}
                {upcomingMeetings.length > 0 && (
                    <MeetingCard
                        meetingId={upcomingMeetings[0].id}
                        date={formatMeetingDate(upcomingMeetings[0].date_time)}
                        time={formatMeetingTime(upcomingMeetings[0].date_time)}
                        title={upcomingMeetings[0].summary || `Встреча команды #${upcomingMeetings[0].team_id}`}
                        meetingLink={`/minutesOfMeeting?meetingId=${upcomingMeetings[0].id}`}
                    />
                )}
                
                <p className={styles.titleFrom} style={{marginTop: 10, marginBottom: 10}}>Запланированные встречи</p>
                
                {upcomingMeetings.length > 0 ? (
                    upcomingMeetings.slice(0, 3).map(meeting => (
                        <MeetingLi 
                            key={meeting.id}
                            date={formatMeetingDate(meeting.date_time)} 
                            time={formatMeetingTime(meeting.date_time)} 
                            title={meeting.summary || `Встреча команды #${meeting.team_id}`} 
                            platform={meeting.recording_link ? 'Google Meet' : 'Очная встреча'}
                            detailsLink={`/minutesOfMeeting?meetingId=${meeting.id}`}
                        />
                    ))
                ) : (
                    <>
                        <MeetingLi date={"Завтра"} time={"10:00–10:30"} title={"Созвон с командой разработки"} platform={"Google Meet"}/>
                        <MeetingLi date={"Пт"} time={"15:00–16:00"} title={"Демо для заказчика"} platform={"Zoom"}/>
                        <MeetingLi date={"Пн"} time={"12:30–13:00"} title={"Созвон командой "} platform={"Teams"}/>
                    </>
                )}

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
                    {allMembers.length > 0 ? (
                        allMembers.map((member, index) => (
                            <MemberCard key={index} name={member.name} profession={member.profession}/>
                        ))
                    ) : (
                        <>
                            <MemberCard name={"Алексей"} profession={"CEO"}/>
                            <MemberCard name={"Мария"} profession={"CТO"}/>
                            <MemberCard name={"Ирина"} profession={"UX/UI"}/>
                        </>
                    )}
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
    )
}