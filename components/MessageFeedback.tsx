import { useState } from 'react'

interface MessageFeedbackProps {
  interactionId: string
  onFeedbackSent?: (rating: 'positive' | 'negative') => void
}

export default function MessageFeedback({ interactionId, onFeedbackSent }: MessageFeedbackProps) {
  const [rating, setRating] = useState<'positive' | 'negative' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showComment, setShowComment] = useState(false)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleRating = async (newRating: 'positive' | 'negative') => {
    if (submitted) return

    setRating(newRating)
    
    if (newRating === 'negative') {
      setShowComment(true)
      return
    }

    await submitFeedback(newRating)
  }

  const submitFeedback = async (finalRating: 'positive' | 'negative', finalComment?: string) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/learning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'save_feedback',
          interactionId,
          rating: finalRating,
          comment: finalComment || comment
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitted(true)
        onFeedbackSent?.(finalRating)
        console.log('Feedback sent successfully')
      } else {
        console.error('Failed to send feedback:', data.error)
      }
    } catch (error) {
      console.error('Error sending feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCommentSubmit = async () => {
    if (rating) {
      await submitFeedback(rating, comment)
      setShowComment(false)
    }
  }

  const handleCommentCancel = () => {
    setShowComment(false)
    setComment('')
    setRating(null)
  }

  if (submitted) {
    return (
      <div className="message-feedback submitted">
        <span className="feedback-thanks">
          Спасибо за обратную связь!
        </span>
      </div>
    )
  }

  return (
    <div className="message-feedback">
      {!showComment ? (
        <div className="feedback-buttons">
          <span className="feedback-question">Этот ответ был полезным?</span>
          <div className="rating-buttons">
            <button
              onClick={() => handleRating('positive')}
              disabled={isSubmitting}
              className={`feedback-btn positive ${rating === 'positive' ? 'selected' : ''}`}
              title="Да, полезно"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M14 9V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V9H6C4.89543 9 4 9.89543 4 11V13C4 14.1046 4.89543 15 6 15H8L10 21H18L20 15H20C21.1046 15 22 14.1046 22 13V11C22 9.89543 21.1046 9 20 9H14Z" fill="currentColor"/>
              </svg>
            </button>
            <button
              onClick={() => handleRating('negative')}
              disabled={isSubmitting}
              className={`feedback-btn negative ${rating === 'negative' ? 'selected' : ''}`}
              title="Нет, не полезно"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M10 15V19C10 20.1046 10.8954 21 12 21C13.1046 21 14 20.1046 14 19V15H18C19.1046 15 20 14.1046 20 13V11C20 9.89543 19.1046 9 18 9H16L14 3H6L4 9H4C2.89543 9 2 9.89543 2 11V13C2 14.1046 2.89543 15 4 15H10Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="feedback-comment">
          <div className="comment-header">
            <span>Помогите ДЖАРВИС стать лучше:</span>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Что можно улучшить в этом ответе?"
            className="comment-textarea"
            rows={3}
          />
          <div className="comment-actions">
            <button
              onClick={handleCommentSubmit}
              disabled={isSubmitting}
              className="comment-submit"
            >
              {isSubmitting ? 'Отправка...' : 'Отправить'}
            </button>
            <button
              onClick={handleCommentCancel}
              disabled={isSubmitting}
              className="comment-cancel"
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
