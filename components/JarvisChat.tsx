import { useState, useRef, useEffect } from 'react'
import MessageFeedback from './MessageFeedback'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface JarvisChatProps {
  isOpen: boolean
  onClose: () => void
}

export default function JarvisChat({ isOpen, onClose }: JarvisChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Привет! Я ДЖАРВИС, ваш AI-помощник в мире веб-разработки. Чем могу помочь?',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [interactionIds, setInteractionIds] = useState<{[messageId: string]: string}>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const sessionId = useRef(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)

  // Функция для сохранения взаимодействия в базе знаний
  const saveInteractionToLearning = async (userMessage: string, botResponse: string, aiMessageId: string) => {
    try {
      const response = await fetch('/api/learning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'save_interaction',
          userMessage,
          botResponse,
          sessionId: sessionId.current,
          context: messages.slice(-3).map(m => m.text),
          tags: extractTags(userMessage + ' ' + botResponse)
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setInteractionIds(prev => ({
            ...prev,
            [aiMessageId]: data.data.interactionId
          }))
          console.log('Interaction saved for learning:', data.data.interactionId)
        }
      } else {
        console.error('Failed to save interaction, status:', response.status)
      }
    } catch (error) {
      console.error('Error saving interaction for learning:', error)
      // Не блокируем пользовательский интерфейс при ошибках сохранения
    }
  }

  // Извлечение тегов из текста
  const extractTags = (text: string): string[] => {
    const commonTags = [
      'веб-разработка', 'дизайн', 'программирование', 'ai', 'технологии',
      'фронтенд', 'бэкенд', 'react', 'javascript', 'typescript', 'css',
      'html', 'api', 'база данных', 'сеть', 'безопасность'
    ]

    const lowerText = text.toLowerCase()
    return commonTags.filter(tag => lowerText.includes(tag))
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [inputText])

  const generateJarvisResponse = async (userMessage: string, conversationHistory: Message[]): Promise<string> => {
    try {
      // Подготавливаем историю сообщений для API
      const apiMessages = conversationHistory
        .filter(msg => msg.text !== 'Привет! Я ДЖАРВИС, ваш AI-помощник в мире веб-разработки. Чем могу помочь?') // Исключаем начальное сообщение
        .map(msg => ({
          role: msg.isUser ? 'user' as const : 'assistant' as const,
          content: msg.text
        }))

      // Добавляем текущее сообщение пользователя
      apiMessages.push({
        role: 'user',
        content: userMessage
      })

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Проверяем что ответ не пустой
      if (!data.message || data.message.trim().length === 0) {
        console.warn('Empty response from API, using fallback')
        return 'Извините, я получил пустой ответ. Попробуйте переформулировать вопрос! 🤔'
      }

      return data.message
    } catch (error) {
      console.error('Error calling AI API:', error)

      // Резервные ответы в случае ошибки
      const fallbackResponses = [
        'Я ДЖАРВИС и я здесь, чтобы помочь! Попробуйте ещё раз. Если проблемы повторяются - опишите ваш вопрос подробнее! 🚀',
        'Привет! Я ДЖАРВИС и всегда готов помочь с веб-разработкой! Попробуйте переформулировать вопрос или задайте новый! ✨',
        'Я готов ответить на любые вопросы о веб-разработке и AI! Попробуйте снова. 🔧',
      ]

      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
    }
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    }

    const currentInput = inputText
    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    try {
      // Получаем ответ от AI
      const aiText = await generateJarvisResponse(currentInput, [...messages, userMessage])

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiResponse])

      // Сохраняем взаимодействие для обучения только если ответ не пустой
      if (aiText && aiText.trim().length > 0) {
        await saveInteractionToLearning(currentInput, aiText, aiResponse.id)
      } else {
        console.log('Skipping learning save: empty AI response')
      }
    } catch (error) {
      console.error('Error generating AI response:', error)

      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Извините, произошла ошибка. Попробуйте еще раз',
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }


  if (!isOpen) return null

  return (
    <div className="jarvis-chat-overlay modal">
      <div className="jarvis-chat-container-modal">
        {/* Header */}
        <div className="jarvis-chat-header">
          <div className="jarvis-chat-title">
            <div className="jarvis-avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            <div>
              <h3>ДЖАРВИС</h3>
              <div className="status-indicator">
                В сети
              </div>
            </div>
          </div>
          <button className="jarvis-close-btn" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="jarvis-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}
            >
              {!message.isUser && (
                <div className="message-avatar">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
              )}
              <div className="message-content">
                <div className="message-bubble">
                  {message.text.trim().split('\n').filter(line => line.trim()).map((line, index) => (
                    <div key={index}>
                      {line.trim()}
                      {index < message.text.trim().split('\n').filter(line => line.trim()).length - 1 && <br />}
                    </div>
                  ))}
                </div>
                {!message.isUser && interactionIds[message.id] && (
                  <MessageFeedback
                    interactionId={interactionIds[message.id]}
                    onFeedbackSent={(rating) => {
                      console.log(`Feedback sent for message ${message.id}: ${rating}`)
                    }}
                  />
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message ai-message">
              <div className="message-avatar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                  <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              <div className="message-content">
                <div className="message-bubble typing-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="jarvis-input-area">
          <div className="jarvis-input-container">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Сообщение ДЖАРВИСУ..."
              className="jarvis-textarea"
              rows={1}
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="jarvis-send-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M7 11L12 6L17 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 18V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
