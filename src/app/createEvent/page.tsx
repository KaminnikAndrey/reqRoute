'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Form } from 'antd'
import styles from "./styles.module.css"
import Link from "next/link";
import Header from "@/components/header/Header";
import {ColorBlock} from "@/components/ColorBlock/ColorBlock";
import EventPassportForm from "@/components/eventPassportForm/EventPassportForm";
import FormatAccessForm from "@/components/FormatAccessForm/FormatAccessForm";
import DateTimeForm from "@/components/DateTimeForm/DateTimeForm";
import SpeakersForm from "@/components/SpeakersForm/SpeakersForm";
import IntegrationFilesForm from "@/components/IntegrationFilesForm/IntegrationFilesForm";
import RegistrationForm from "@/components/RegistrationForm/RegistrationForm";
import { meetingsClient } from '@/lib/clients'
import { useUserTeams } from '@/hooks/useUserTeams'

export default function createEvent() {
    const router = useRouter()
    const [formEventPassport] = Form.useForm()
    const [formDateTime] = Form.useForm()
    const [formFormatAccess] = Form.useForm()
    const [isPublishing, setIsPublishing] = useState(false)
    const { teams, isLoading: teamsLoading } = useUserTeams()

    const handlePublish = async () => {
        try {
            setIsPublishing(true)

            // Валидация форм
            await Promise.all([
                formEventPassport.validateFields(),
                formDateTime.validateFields(),
                formFormatAccess.validateFields()
            ])

            // Получаем данные из форм
            const eventPassportData = formEventPassport.getFieldsValue()
            const dateTimeData = formDateTime.getFieldsValue()
            const formatAccessData = formFormatAccess.getFieldsValue()

            // Формируем date_time из даты и времени
            const date = dateTimeData.date
            const startTime = dateTimeData.startTime
            if (!date || !startTime) {
                throw new Error('Необходимо указать дату и время начала')
            }

            const dateTime = new Date(`${date}T${startTime}`).toISOString()

            // Формируем summary из данных мероприятия
            const summaryParts: string[] = []
            if (eventPassportData.eventName) {
                summaryParts.push(`Название: ${eventPassportData.eventName}`)
            }
            if (eventPassportData.shortDescription) {
                summaryParts.push(`Описание: ${eventPassportData.shortDescription}`)
            }
            if (formatAccessData.platform) {
                summaryParts.push(`Платформа/Адрес: ${formatAccessData.platform}`)
            }

            const summary = summaryParts.join('\n') || null

            // Получаем recording_link из платформы
            const recordingLink = formatAccessData.platform || null

            // Используем команду с ID 9
            const teamId = 9

            // Создаем встречу
            const meetingData = {
                team_id: teamId,
                date_time: dateTime,
                summary: summary,
                recording_link: recordingLink,
            }

            await meetingsClient.create(meetingData)

            console.log('✅ Мероприятие создано')
            
            // Перенаправляем на главную страницу
            router.push('/main')
        } catch (err) {
            console.error('❌ Ошибка создания мероприятия:', err)
        } finally {
            setIsPublishing(false)
        }
    }

    return (
            <div className={styles.center}>
                <div className={styles.wrapper}>
                    <Header/>
                    <p className={styles.text} style={{marginBottom: "5px"}}>Мероприятия · Новое</p>
                    <p className={styles.title}>Создание мероприятия</p>
                    <div className={styles.wrap}>
                        <ColorBlock isActive={true}/>
                        <ColorBlock />
                        <ColorBlock />
                        <ColorBlock />

                    </div>
                    <EventPassportForm form={formEventPassport}/>
                    <FormatAccessForm form={formFormatAccess}/>
                    <DateTimeForm form={formDateTime}/>
                    <SpeakersForm/>
                    <IntegrationFilesForm/>
                    <RegistrationForm/>
                    {/*<ChecksForm/>*/}
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
                    <div className={styles.wrap} style={{marginBottom: "20px"}}>
                        <button
                            className={`${styles.btnAccessActive}`}
                            type="button"
                            style={{width: "195px"}}
                            onClick={handlePublish}
                            disabled={isPublishing}
                        >
                            {isPublishing ? 'Публикация...' : 'Опубликовать'}
                        </button>
                        <button
                            className={`${styles.btnAccess}`}
                            type="button"
                            style={{width: "195px"}}
                        >
                            Черновик
                        </button>
                    </div>
                    <a className={styles.link} href="#" style={{display: "block", margin: "0 auto", marginBottom: 20}}>support@reqroute.com</a>
                    <div className={styles.wrap}>
                        <p className={styles.text}>© ReqRoute · 2025</p>
                        <p className={styles.text}>Главная · О проекте · Политика</p>
                    </div>
                </div>
            </div>

    )
}