import { useState, useRef, useEffect } from 'react'
import { ChatHistoryManager, ChatSession, Message } from '../lib/chatHistory'

interface JarvisChatProps {
  isOpen: boolean
  onClose: () => void
}

export default function JarvisChatEnhanced({ isOpen, onClose }: JarvisChatProps) {
  const [chatManager] = useState(() => ChatHistoryManager.getInstance())
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [inputText])

  useEffect(() => {
    if (isOpen) {
      loadChatHistory()
    }
  }, [isOpen])

  const loadChatHistory = () => {
    const allSessions = chatManager.getAllSessions()
    setSessions(allSessions)
    
    if (allSessions.length > 0) {
      const latestSession = allSessions[0]
      setCurrentSessionId(latestSession.id)
      setMessages(latestSession.messages)
    } else {
      createNewChat()
    }
  }

  const createNewChat = () => {
    const newSession = chatManager.createNewSession()
    setSessions(chatManager.getAllSessions())
    setCurrentSessionId(newSession.id)
    setMessages(newSession.messages)
  }

  const selectChat = (sessionId: string) => {
    const session = chatManager.getSession(sessionId)
    if (session) {
      setCurrentSessionId(sessionId)
      setMessages(session.messages)
    }
  }

  const deleteChat = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    chatManager.deleteSession(sessionId)
    const updatedSessions = chatManager.getAllSessions()
    setSessions(updatedSessions)
    
    if (sessionId === currentSessionId) {
      if (updatedSessions.length > 0) {
        const nextSession = updatedSessions[0]
        setCurrentSessionId(nextSession.id)
        setMessages(nextSession.messages)
      } else {
        createNewChat()
      }
    }
  }

  const generateJarvisResponse = async (userMessage: string, conversationHistory: Message[]): Promise<string> => {
    try {
      const apiMessages = conversationHistory
        .filter(msg => msg.text !== 'Привет! Я ДЖАРВИС, ваш AI-помощник в мире веб-разработки. Чем могу помочь?')
        .map(msg => ({
          role: msg.isUser ? 'user' as const : 'assistant' as const,
          content: msg.text
        }))

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

      return data.message
    } catch (error) {
      console.error('Error calling AI API:', error)
      
      const fallbackResponses = [
        'Извините, у меня временные проблемы с подключени��м к AI-серверу. Попробуйте еще раз через несколько секунд.',
        'Сейчас испытываю технические трудности, но я ДЖАРВИС и готов помочь! Попробуйте переформулировать вопрос.',
        'Произошла ошибка связи, но не волнуйтесь - я здесь. Напишите мне в Telegram  для прямой связи.',
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
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInputText('')
    setIsTyping(true)

    try {
      const aiText = await generateJarvisResponse(currentInput, updatedMessages)
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        isUser: false,
        timestamp: new Date()
      }
      
      const finalMessages = [...updatedMessages, aiResponse]
      setMessages(finalMessages)
      
      // Update session in storage
      chatManager.updateSession(currentSessionId, finalMessages)
      setSessions(chatManager.getAllSessions())
    } catch (error) {
      console.error('Error generating AI response:', error)
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Извините, произошла ошибка. Попробуйте еще раз или напишите мне в Telegram ',
        isUser: false,
        timestamp: new Date()
      }
      
      const finalMessages = [...updatedMessages, errorResponse]
      setMessages(finalMessages)
      chatManager.updateSession(currentSessionId, finalMessages)
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

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Сегодня'
    if (diffDays === 1) return 'Вчера'
    if (diffDays < 7) return `${diffDays} дн. назад`
    return date.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })
  }

  if (!isOpen) return null

  return (
    <div className="jarvis-chat-overlay">
      <div className="jarvis-chat-container">
        {/* Sidebar */}
        <div className={`jarvis-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-header">
            <button 
              className="new-chat-btn"
              onClick={createNewChat}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {!sidebarCollapsed && 'Новый чат'}
            </button>
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div className="chat-history">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`chat-item ${session.id === currentSessionId ? 'active' : ''}`}
                onClick={() => selectChat(session.id)}
              >
                <div className="chat-title">
                  {!sidebarCollapsed && session.title}
                </div>
                {!sidebarCollapsed && (
                  <>
                    <div className="chat-date">
                      {formatDate(session.updatedAt)}
                    </div>
                    <button 
                      className="delete-chat-btn"
                      onClick={(e) => deleteChat(session.id, e)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="jarvis-main-chat">
          {/* Header */}
          <div className="jarvis-chat-header">
            <div className="jarvis-chat-title">
              <div className="jarvis-avatar">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F86ccad5be3604b288119b4c361741253%2F60b029911e0b4e74939cea888d93edb9?format=webp&width=800"
                  alt="JARVIS"
                  width="20"
                  height="20"
                />
              </div>
              <div>
                <h3>ДЖАРВИС</h3>
                <div className="status-indicator">
                  <div className="status-dot"></div>
                  В сети
                </div>
              </div>
            </div>
            <button className="jarvis-close-btn" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets%2F86ccad5be3604b288119b4c361741253%2F60b029911e0b4e74939cea888d93edb9?format=webp&width=800"
                      alt="JARVIS"
                      width="20"
                      height="20"
                    />
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
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message ai-message">
                <div className="message-avatar">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F86ccad5be3604b288119b4c361741253%2F60b029911e0b4e74939cea888d93edb9?format=webp&width=800"
                    alt="JARVIS"
                    width="16"
                    height="16"
                  />
                </div>
                <div className="message-content">
                  <div className="message-bubble typing-indicator">
                    <div className="typing-content-wrapper">
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <span className="typing-text">печатает</span>
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
                placeholder="Напишите сообщение"
                className="jarvis-textarea"
                rows={1}
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="jarvis-send-btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .jarvis-chat-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
        }

        .jarvis-chat-container {
          width: 100%;
          height: 100vh;
          background: #ffffff;
          display: flex;
          overflow: hidden;
        }

        /* Sidebar Styles */
        .jarvis-sidebar {
          width: 260px;
          background: #171717;
          border-right: 1px solid #2d2d2d;
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease;
          height: 100vh;
        }

        .jarvis-sidebar.collapsed {
          width: 48px;
        }

        .sidebar-header {
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid #2d2d2d;
        }

        .new-chat-btn {
          flex: 1;
          height: 44px;
          padding: 0 12px;
          background: transparent;
          color: #ffffff;
          border: 1px solid #404040;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
          min-width: 0;
        }

        .new-chat-btn:hover {
          background: #2d2d2d;
          border-color: #525252;
        }

        .jarvis-sidebar.collapsed .new-chat-btn {
          padding: 0;
          width: 32px;
          justify-content: center;
        }

        .sidebar-toggle {
          width: 32px;
          height: 32px;
          background: transparent;
          border: none;
          cursor: pointer;
          border-radius: 6px;
          color: #a1a1aa;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sidebar-toggle:hover {
          background: #2d2d2d;
          color: #ffffff;
        }

        .chat-history {
          flex: 1;
          overflow-y: auto;
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .chat-history::-webkit-scrollbar {
          width: 4px;
        }

        .chat-history::-webkit-scrollbar-track {
          background: transparent;
        }

        .chat-history::-webkit-scrollbar-thumb {
          background: #404040;
          border-radius: 2px;
        }

        .chat-history::-webkit-scrollbar-thumb:hover {
          background: #525252;
        }

        .chat-item {
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
          position: relative;
          background: transparent;
          min-height: 44px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .chat-item:hover {
          background: #2d2d2d;
        }

        .chat-item.active {
          background: #2d2d2d;
        }

        .chat-title {
          font-size: 14px;
          font-weight: 400;
          color: #e5e5e5;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 1.4;
          padding-right: 24px;
        }

        .chat-date {
          font-size: 12px;
          color: #a1a1aa;
          margin-top: 2px;
          line-height: 1.2;
        }

        .delete-chat-btn {
          position: absolute;
          top: 50%;
          right: 8px;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          background: transparent;
          border: none;
          cursor: pointer;
          opacity: 0;
          border-radius: 4px;
          color: #a1a1aa;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-item:hover .delete-chat-btn {
          opacity: 1;
        }

        .delete-chat-btn:hover {
          background: #404040;
          color: #ffffff;
        }

        .jarvis-sidebar.collapsed .chat-item {
          padding: 8px;
          min-height: 32px;
        }

        .jarvis-sidebar.collapsed .chat-title,
        .jarvis-sidebar.collapsed .chat-date,
        .jarvis-sidebar.collapsed .delete-chat-btn {
          display: none;
        }

        /* Main Chat Styles */
        .jarvis-main-chat {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #ffffff;
        }

        .jarvis-chat-header {
          padding: 16px 24px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
          flex-shrink: 0;
        }

        .jarvis-chat-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .jarvis-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .jarvis-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .jarvis-chat-title h3 {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 4px 0;
          color: #000000;
        }

        .status-indicator {
          font-size: 12px;
          color: #666666;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
        }

        .jarvis-close-btn {
          background: none;
          border: none;
          color: #666666;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .jarvis-close-btn:hover {
          background: #f5f5f5;
          color: #000000;
        }

        .jarvis-messages {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          background: #ffffff;
          max-width: 100%;
        }

        .jarvis-messages::-webkit-scrollbar {
          width: 4px;
        }

        .jarvis-messages::-webkit-scrollbar-track {
          background: transparent;
        }

        .jarvis-messages::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 2px;
        }

        .jarvis-messages::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        .message {
          display: flex;
          gap: 8px;
          align-items: flex-start;
          max-width: 80%;
        }

        .user-message {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .ai-message {
          align-self: flex-start;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }

        .message-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .message-content {
          display: flex;
          flex-direction: column;
        }

        .message-bubble {
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.5;
          word-wrap: break-word;
        }

        .user-message .message-bubble {
          background: #000000;
          color: #ffffff;
          border-bottom-right-radius: 4px;
        }

        .ai-message .message-bubble {
          background: #f5f5f5;
          color: #000000;
          border-bottom-left-radius: 4px;
        }

        .typing-indicator {
          background: #f5f5f5 !important;
          color: #000000 !important;
        }

        .typing-content-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .typing-dots {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .typing-text {
          font-size: 12px;
          color: #999999;
          font-style: italic;
        }

        .typing-dots span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #999999;
          animation: typingBounce 1.4s ease-in-out infinite;
        }

        .typing-dots span:nth-child(1) { animation-delay: 0s; }
        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typingBounce {
          0%, 60%, 100% { 
            transform: translateY(0);
            opacity: 0.5;
          }
          30% { 
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        .jarvis-input-area {
          padding: 24px;
          background: #ffffff;
          border-top: 1px solid #e5e7eb;
          flex-shrink: 0;
        }

        .jarvis-input-container {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          background: #f9fafb;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          padding: 12px 16px;
          transition: all 0.2s ease;
          max-width: none;
        }

        .jarvis-input-container:focus-within {
          border-color: #374151;
          box-shadow: 0 0 0 1px #374151;
          background: #ffffff;
        }

        .jarvis-textarea {
          flex: 1;
          border: none;
          background: transparent;
          resize: none;
          outline: none;
          font-size: 16px;
          line-height: 1.5;
          max-height: 120px;
          min-height: 24px;
          color: #374151;
          font-family: inherit;
          font-weight: 400;
          /* Предотвращение зума на мобильных */
          -webkit-text-size-adjust: 100%;
          text-size-adjust: 100%;
          -webkit-appearance: none;
          transform: translateZ(0);
          touch-action: manipulation;
        }

        .jarvis-textarea::placeholder {
          color: #9ca3af;
        }

        .jarvis-textarea:disabled {
          color: #9ca3af;
        }

        .jarvis-send-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: none;
          background: #374151;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .jarvis-send-btn:hover:not(:disabled) {
          background: #1f2937;
        }

        .jarvis-send-btn:disabled {
          background: #e5e7eb;
          color: #9ca3af;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .jarvis-sidebar {
            width: 260px;
          }

          .jarvis-sidebar.collapsed {
            width: 50px;
          }

          .jarvis-chat-header {
            padding: 12px 16px;
          }

          .jarvis-messages {
            padding: 16px;
          }

          .jarvis-input-area {
            padding: 16px;
          }

          .message {
            max-width: 85%;
          }

          /* Hide avatar on mobile for more space */
          .message-avatar {
            display: none;
          }

          .message-content {
            max-width: 95%;
          }

          .user-message .message-content {
            margin-left: auto;
          }

          .ai-message .message-content {
            margin-right: auto;
          }
        }

        @media (max-width: 480px) {
          .jarvis-chat-container {
            flex-direction: column;
          }

          .jarvis-sidebar {
            width: 100%;
            height: auto;
            max-height: 40vh;
            border-right: none;
            border-bottom: 1px solid #e5e5e5;
          }

          .jarvis-sidebar.collapsed {
            height: 60px;
            width: 100%;
          }

          /* Предотвращение зума на мобильных */
          .jarvis-textarea {
            font-size: 16px !important;
            -webkit-text-size-adjust: 100% !important;
            text-size-adjust: 100% !important;
            transform: translateZ(0);
          }

          input, textarea, select {
            font-size: 16px !important;
            -webkit-text-size-adjust: 100% !important;
            text-size-adjust: 100% !important;
          }
        }
      `}</style>
    </div>
  )
}
