// src/components/votingCard/VotingCard.tsx
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
    id: number
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
    onVote?: (id: number, vote: 'like' | 'dislike') => void
    onAddComment?: (id: number, comment: string) => void
}

const VotingCard: React.FC<VotingCardProps> = ({
                                                   id,
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
    const [commentLoading, setCommentLoading] = useState(false)

    const handleVote = (vote: 'like' | 'dislike') => {
        if (onVote) {
            onVote(id, vote)
        }
    }

    const handleAddComment = async () => {
        if (!newComment.trim() || !onAddComment) return

        setCommentLoading(true)
        try {
            await onAddComment(id, newComment)
            setNewComment('')
        } catch (error) {
            console.error('Ошибка при добавлении комментария:', error)
        } finally {
            setCommentLoading(false)
        }
    }

    const toggleComments = () => {
        setIsCommentsExpanded(!isCommentsExpanded)
    }

    const getStatusColor = () => {
        switch (status) {
            case 'На голосовании':
                return styles.voting
            case 'Отобран':
                return styles.selected
            case 'В разработке':
                return styles.inProgress
            case 'Черновик':
                return styles.draft
            case 'Предложение':
                return styles.proposal
            default:
                return styles.voting
        }
    }

    return (
        <div className={styles.votingCard}>
            <div className={styles.header}>
                <div className={styles.caseInfo}>
                    <h3 className={styles.caseName}>Кейс: «{caseName}»</h3>
                    <div className={styles.metaInfo}>
                        <span className={styles.author}>Автор: <br />{author}</span>
                        <span className={styles.author}>Трек: <br />{track}</span>
                    </div>
                </div>
                <div className={styles.statusContainer}>
                    <span className={styles.status}>
                        {status}
                    </span>
                </div>
            </div>

            <div className={styles.description}>
                <p>{description}</p>
            </div>

            <div className={styles.ratingSection}>
                <div className={styles.ratingInfo}>
                    <div className={styles.ratingItem}>
                        <span className={styles.ratingLabel}>Текущий рейтинг:</span>
                        <div className={styles.ratingBarContainer}>
                            <div
                                className={styles.ratingBar}
                                style={{ width: `${Math.min(currentRating, 100)}%` }}
                            />
                            <span className={styles.ratingValue}>{currentRating}%</span>
                        </div>
                    </div>
                    <div className={styles.ratingItem}>
                        <span className={styles.ratingLabel}>Порог прохождения:</span>
                        <span className={styles.passingThreshold}>{passingThreshold}%</span>
                    </div>
                </div>

                <div className={styles.votingButtons}>
                    <button
                        className={`${styles.voteButton} ${userVote === 'like' ? styles.activeLike : ''}`}
                        onClick={() => handleVote('like')}
                        disabled={status !== 'На голосовании'}
                    >
                        <span className={styles.icon}>👍</span>
                        <span className={styles.count}>{likes}</span>
                    </button>
                    <button
                        className={`${styles.voteButton} ${userVote === 'dislike' ? styles.activeDislike : ''}`}
                        onClick={() => handleVote('dislike')}
                        disabled={status !== 'На голосовании'}
                    >
                        <span className={styles.icon}>👎</span>
                        <span className={styles.count}>{dislikes}</span>
                    </button>
                </div>
            </div>

            <div className={styles.commentsSection}>
                <div className={styles.commentsHeader}>
                    <h4 className={styles.commentsTitle}>
                        Комментарии менторов ({comments.length})
                    </h4>
                    {comments.length > 0 && (
                        <Button
                            type="text"
                            icon={isCommentsExpanded ? <CaretUpOutlined /> : <CaretDownOutlined />}
                            onClick={toggleComments}
                            className={styles.expandButton}
                        >
                            {isCommentsExpanded ? 'Свернуть' : 'Развернуть'}
                        </Button>
                    )}
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

            <div className={styles.addCommentSection}>
                <TextArea
                    rows={3}
                    placeholder="Добавить комментарий..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className={styles.commentInput}
                    disabled={commentLoading}
                />
                <div className={styles.commentActions}>
                    <button
                        className={styles.sendButton}
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || commentLoading}
                    >
                        {commentLoading ? 'Отправка...' : 'Отправить'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default VotingCard