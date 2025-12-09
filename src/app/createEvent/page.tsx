'use client'

import { useState } from 'react'
import styles from "./styles.module.css"
import Link from "next/link";
import Header from "@/app/components/header/Header";
import {ColorBlock} from "@/app/components/ColorBlock/ColorBlock";
import EventPassportForm from "@/app/components/eventPassportForm/EventPassportForm";
import FormatAccessForm from "@/app/components/FormatAccessForm/FormatAccessForm";
import DateTimeForm from "@/app/components/DateTimeForm/DateTimeForm";
import SpeakersForm from "@/app/components/SpeakersForm/SpeakersForm";
import IntegrationFilesForm from "@/app/components/IntegrationFilesForm/IntegrationFilesForm";
import RegistrationForm from "@/app/components/RegistrationForm/RegistrationForm";
import ChecksForm from "@/app/components/CheksForm/CheksForm";

export default function createEvent() {


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
                <EventPassportForm/>
                <FormatAccessForm/>
                <DateTimeForm/>
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
                    >
                        Опубликовать
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