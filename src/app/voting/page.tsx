// src/app/voting/page.tsx
'use client'

import { useState, useEffect } from 'react'

import styles from "./styles.module.css"
import Header from "@/components/header/Header";
import {useCasesStore} from "@/store";
import {useCasesApi} from "@/hooks/useCases";
import MentorCard from "@/components/mentorCard/mentorCard";
import StatsWidget from "@/components/StatsWidget/StatsWidget";
import VotingButtons from "@/components/voitingButtons/VoitingButtons";
import VotingCard from "@/components/votingCard/VotingCard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Voting() {
    const [selectedStage, setSelectedStage] = useState<string>('На голосовании')

    // Получаем данные из store
    const cases = useCasesStore(state => state.cases)
    const loading = useCasesStore(state => state.loading)
    const error = useCasesStore(state => state.error)
    const getCasesByStage = useCasesStore(state => state.getCasesByStage)

    // Получаем методы API
    const { fetchCases, voteForCase, addCommentToCase } = useCasesApi()

    // Загружаем кейсы при монтировании
    useEffect(() => {
        loadCases()
    }, [])

    const loadCases = async () => {
        try {
            await fetchCases()
        } catch (err) {
            console.error('Ошибка загрузки кейсов:', err)
        }
    }

    // Фильтруем кейсы по выбранной стадии
    const filteredCases = getCasesByStage(selectedStage)

    const handleStageSelect = (index: number, stage: string) => {
        setSelectedStage(stage)
    }

    const handleVote = async (caseId: number, vote: 'like' | 'dislike') => {
        try {
            await voteForCase(caseId, vote)
        } catch (err) {
            console.error('Ошибка голосования:', err)
            alert('Не удалось проголосовать. Попробуйте позже.')
        }
    }

    const handleAddComment = async (caseId: number, commentText: string) => {
        if (!commentText.trim()) return

        try {
            await addCommentToCase(caseId, commentText)
        } catch (err) {
            console.error('Ошибка добавления комментария:', err)
            alert('Не удалось добавить комментарий. Попробуйте позже.')
        }
    }

    const handleRefresh = () => {
        loadCases()
    }

    // Показываем загрузку
    if (loading && cases.length === 0) {
        return (
            <div className={styles.center}>
                <div className={styles.wrapper}>
                    <Header />
                    <div className={styles.loadingContainer}>
                        <p>Загрузка кейсов...</p>
                    </div>
                </div>
            </div>
        )
    }

    // Показываем ошибку
    if (error && cases.length === 0) {
        return (
            <div className={styles.center}>
                <div className={styles.wrapper}>
                    <Header />
                    <div className={styles.errorContainer}>
                        <p>Ошибка: {error}</p>
                        <button onClick={handleRefresh}>Повторить попытку</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <ProtectedRoute>

        <div className={styles.center}>
            <div className={styles.wrapper}>
                <Header />
                <MentorCard />

                <p className={styles.title}>Голосование за кейсы</p>
                <p className={styles.text}>
                    Выберите стадию кейсов, посмотрите список и проголосуйте 👍 / 👎.
                    Комментарии видны другим менторам.
                </p>

                <VotingButtons
                    initialActive={0}
                    onButtonClick={handleStageSelect}
                />

                <div className={styles.casesHeader}>
                    <h2 className={styles.titleFrom}>
                        {selectedStage} ({filteredCases.length})
                    </h2>
                    {loading && <span style={{ color: '#0070f3', fontSize: 14 }}>Обновление...</span>}
                </div>

                <div className={styles.casesList}>
                    {filteredCases.length > 0 && (
                        filteredCases.map((caseItem) => (
                            <VotingCard
                                key={caseItem.id}
                                id={caseItem.id}
                                caseName={caseItem.caseName}
                                track={caseItem.track}
                                author={caseItem.author}
                                status={caseItem.status}
                                description={caseItem.description}
                                currentRating={caseItem.currentRating}
                                passingThreshold={caseItem.passingThreshold}
                                likes={caseItem.likes}
                                dislikes={caseItem.dislikes}
                                comments={caseItem.comments}
                                userVote={caseItem.userVote}
                                onVote={handleVote}
                                onAddComment={handleAddComment}
                            />
                        ))
                    )}
                </div>

                <div style={{ textAlign: 'center', padding: 15, color: '#666', fontSize: 14 }}>
                    <p>
                        Всего кейсов: {cases.length} |
                        Загружено: {filteredCases.length}
                    </p>
                </div>
            </div>
        </div>
        </ProtectedRoute>

    )
}