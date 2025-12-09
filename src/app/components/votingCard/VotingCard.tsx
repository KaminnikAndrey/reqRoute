'use client'

import { useState } from 'react'
import { Button, Input } from 'antd'
import { CaretDownOutlined, CaretUpOutlined, UserOutlined } from '@ant-design/icons'
import styles from "./styles.module.css"

const { TextArea } = Input

interface Comment {
    id: number
    author: string
    text: string
    timestamp: string
}

interface VotingCardProps {
    caseName: string
    track: string
    author: string
    status: string
    description: string
    currentRating: number
    passingThreshold: number
    likes: number
    dislikes: number
    comments: Comment[]
    userVote?: 'like' | 'dislike' | null
    onVote?: (vote: 'like' | 'dislike') => void
    onAddComment?: (comment: string) => void
}

const VotingCard: React.FC<VotingCardProps> = ({
                                                   caseName = 'Мониторинг заявок',
                                                   track = 'Трек',
                                                   author = 'Команда ReqRoute',
                                                   status = 'На голосовании',
                                                   description = 'Кратко: ...',
                                                   currentRating = 75,
                                                   passingThreshold = 50,
                                                   likes = 24,
                                                   dislikes = 8,
                                                   comments = [],
                                                   userVote = null,
                                                   onVote,
                                                   onAddComment
                                               }) => {
    const [isCommentsExpanded, setIsCommentsExpanded] = useState(false)
    const [newComment, setNewComment] = useState('')

    const handleVote = (vote: 'like' | 'dislike') => {
        if (onVote) {
            onVote(vote)
        }
    }

    const handleAddComment = () => {
        if (newComment.trim() && onAddComment) {
            onAddComment(newComment)
            setNewComment('')
        }
    }

    const toggleComments = () => {
        setIsCommentsExpanded(!isCommentsExpanded)
    }

    return (
        <div className={styles.votingCard}>
            {/* 1. Верхний блок: название, трек, автор и статус */}
            <div className={styles.header}>
                <div className={styles.caseInfo}>
                    <h3 className={styles.caseName}>Кейс :«{caseName}»</h3>
                </div>
                <div className={styles.statusContainer}>
                    <span className={`${styles.status} ${styles.voting}`}>
                        {status}
                    </span>
                </div>
            </div>
            <div className={styles.metaInfo}>
                <span className={styles.author}>Автор: {author}</span>
                <span className={styles.separator}>•</span>
                <span className={styles.author}>Трек: {track}</span>
            </div>

            {/* 2. Описание */}
            <div className={styles.description}>
                <p>{description}</p>
            </div>

            {/* 3. Рейтинг и голосование */}
            <div className={styles.ratingSection}>
                <div className={styles.ratingInfo}>
                    <div className={styles.ratingItem}>
                        <span className={styles.ratingLabel}>Текущий рейтинг:</span>
                        <span className={styles.ratingValue}>{currentRating}%</span>
                    </div>
                    <div className={styles.ratingItem}>
                        <span className={styles.ratingLabel}>Порог прохождения:</span>
                        <span className={styles.passingThreshold}>{passingThreshold}%</span>
                    </div>
                </div>

                <div className={styles.votingButtons}>
                    <button
                        className={`${styles.voteButton} ${userVote === 'like' ? styles.active : ''}`}
                        onClick={() => handleVote('like')}
                    >
                        <span className={styles.icon}>👍</span>
                        <span className={styles.count}>{likes}</span>
                    </button>
                    <button
                        className={`${styles.voteButton} ${userVote === 'dislike' ? styles.active : ''}`}
                        onClick={() => handleVote('dislike')}
                    >
                        <span className={styles.icon}>👎</span>
                        <span className={styles.count}>{dislikes}</span>
                    </button>
                </div>
            </div>

            {/* 4. Комментарии менторов */}
            <div className={styles.commentsSection}>
                <div className={styles.commentsHeader}>
                    <h4 className={styles.commentsTitle}>
                        Комментарии менторов ({comments.length})
                    </h4>
                    <Button
                        type="text"
                        icon={isCommentsExpanded ? <CaretUpOutlined /> : <CaretDownOutlined />}
                        onClick={toggleComments}
                        className={styles.expandButton}
                    >
                        {isCommentsExpanded ? 'Свернуть' : 'Развернуть'}
                    </Button>
                </div>

                {isCommentsExpanded && (
                    <div className={styles.commentsList}>
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <div key={comment.id} className={styles.comment}>
                                    <div className={styles.commentHeader}>
                                        <UserOutlined className={styles.commentIcon} />
                                        <span className={styles.commentAuthor}>{comment.author}</span>
                                        <span className={styles.commentTime}>{comment.timestamp}</span>
                                    </div>
                                    <p className={styles.commentText}>{comment.text}</p>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noComments}>Комментариев пока нет</p>
                        )}
                    </div>
                )}
            </div>

            {/* 5. Поле для добавления комментария */}
            <div className={styles.addCommentSection}>
                <TextArea
                    rows={3}
                    placeholder="Добавить комментарий..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className={styles.commentInput}
                    style={{ resize: 'vertical', minHeight: '80px', maxHeight: '200px' }}
                />
                <div className={styles.commentActions}>
                    <button
                        className={styles.sendButton}
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                    >
                        Отправить
                    </button>
                </div>
            </div>
        </div>
    )
}

export default VotingCard