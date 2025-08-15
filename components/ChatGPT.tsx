import React, { useState, useRef, useEffect } from 'react'
import { ChatHistoryManager, ChatSession, Message } from '../lib/chatHistory'
import { useTheme } from '../contexts/ThemeContext'
import MessageFeedback from './MessageFeedback'

interface ChatGPTProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChatGPT({ isOpen, onClose }: ChatGPTProps) {
  const { isDarkTheme } = useTheme()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Привет! Я ДЖАРВИС - консультант нашего сайта! 😊\n\nПомогу выбрать услуги, расскажу о тарифах и отвечу на ваши вопросы\n\nЧем могу быть полезен?',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [currentThinkingText, setCurrentThinkingText] = useState('')
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isUploadingFile, setIsUploadingFile] = useState(false)
  const [interactionIds, setInteractionIds] = useState<{[messageId: string]: string}>({})

  // Голосовые функц��и
  const [isListening, setIsListening] = useState(false)
  const [voiceMode, setVoiceMode] = useState<'text' | 'voice'>('text') // 'text' = только текст, 'voice' = текст + голос
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const sessionId = useRef(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)

  // Инициализация голосовых API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Speech Recognition API
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = false
        recognitionInstance.interimResults = false
        recognitionInstance.lang = 'ru-RU'

        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setInputText(transcript)
          setIsListening(false)
        }

        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
        }

        setRecognition(recognitionInstance)
      }

      // Speech Synthesis API
      if (window.speechSynthesis) {
        setSpeechSynthesis(window.speechSynthesis)
      }
    }
  }, [])

  // Функция для сохранения взаимодействия в базе знаний
  const saveInteractionToLearning = async (userMessage: string, botResponse: string, userMessageId: string) => {
    try {
      console.log('=== SAVING INTERACTION TO LEARNING ===')
      console.log('userMessage:', userMessage)
      console.log('botResponse:', botResponse)
      console.log('sessionId:', sessionId.current)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

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
          context: messages.slice(-3).map(m => m.text), // Последние 3 сообщения как контекст
          tags: extractTags(userMessage + ' ' + botResponse)
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Сохраняем ID взаимодействия для связи с сообщением
          setInteractionIds(prev => ({
            ...prev,
            [userMessageId]: data.data.interactionId
          }))
          console.log('Interaction saved for learning:', data.data.interactionId)
        }
      } else {
        console.error('Failed to save interaction, status:', response.status)
      }
    } catch (error) {
      console.error('Error saving interaction for learning:', error)
      // Не блокируем пользовательский ��нтерфейс при ошибках сохранения
      // Это не к��итично для работы чата
    }
  }

  // Извлечение тегов из текста
  const extractTags = (text: string): string[] => {
    const commonTags = [
      'веб-разработка', 'дизайн', 'программирование', 'ai', 'технологии',
      'фронтенд', 'бэкенд', 'react', 'javascript', 'typescript', 'css',
      'html', 'api', 'база данных', 'сеть', 'безопасность', 'ui', 'ux'
    ]

    const lowerText = text.toLowerCase()
    return commonTags.filter(tag => lowerText.includes(tag))
  }

  // Функция для запуска голосового ввода
  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true)
      recognition.start()
    }
  }

  // Функция для остановки голосового ввода
  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop()
      setIsListening(false)
    }
  }

  // Функция для озвучивания текста
  const speakText = (text: string) => {
    if (speechSynthesis && voiceMode === 'voice') {
      // Останавливаем предыдущее воспроизведение
      speechSynthesis.cancel()

      // Очищаем текст от эмодзи и специальных символов для лучшего произношения
      const cleanText = text
        .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
        .replace(/[•·]/g, '')
        .trim()

      if (cleanText) {
        const utterance = new SpeechSynthesisUtterance(cleanText)
        utterance.lang = 'ru-RU'
        utterance.rate = 0.9
        utterance.pitch = 1.0
        utterance.volume = 0.8

        speechSynthesis.speak(utterance)
      }
    }
  }

  // Переключение режима голоса
  const toggleVoiceMode = () => {
    setVoiceMode(prev => prev === 'text' ? 'voice' : 'text')
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [inputText])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const generateJarvisResponse = async (userMessage: string, conversationHistory: Message[]): Promise<string> => {
    try {
      // Обычный чат-запрос
      const apiMessages = conversationHistory
        .filter(msg => !msg.text.includes('Привет! Я ДЖАРВИС, ваш AI-помощник!'))
        .map(msg => ({
          role: msg.isUser ? 'user' : 'assistant' as const,
          content: msg.text
        }))

      apiMessages.push({
        role: 'user' as const,
        content: userMessage
      })

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          sessionId: sessionId.current
        }),
      })

      if (!response.ok) {
        if (response.status === 429) {
          return 'Слишком много запросов. Пожалуйста, подождите немного перед следующим сообщением. ⏳'
        }
        
        const errorText = await response.text()
        console.error('Chat API error:', errorText)
        return 'Извините, произошла ошибка при обработке запроса. Попробуйте позже. 😔'
      }

      const data = await response.json()
      
      if (data.error) {
        console.error('Chat API returned error:', data.error)
        return 'Извините, произошл�� ошибка. Попр��буйте переформулировать вопро��. 🤔'
      }

      return data.message || 'Извините, не могу ответить на этот вопрос. Попробуйте спросить что-то другое! 🤷‍♂️'

    } catch (error) {
      console.error('Error generating response:', error)
      return 'Произошла ошибка при г��нерации ответа. Проверьте подключение к интернету и ��опробуйте снова. 🌐'
    }
  }

  // Эффект печатания для thinking
  const typeText = async (text: string, speed: number = 30) => {
    return new Promise<void>((resolve) => {
      let i = 0
      const timer = setInterval(() => {
        if (i < text.length) {
          setCurrentThinkingText(prev => prev + text.charAt(i))
          i++
        } else {
          clearInterval(timer)
          resolve()
        }
      }, speed)
    })
  }

  const showThinkingProcess = async (userMessage: string) => {
    // Более умная генерация мыслей на основе анализа вопроса
    const generateThinking = (message: string) => {
      const lowerMessage = message.toLowerCase()
      const words = lowerMessage.split(' ')

      // Анализируем тип вопроса
      const isQuestion = message.includes('?') || words.some(w => ['как', 'что', 'где', 'когда', 'почему', 'зачем', 'кто'].includes(w))
      const isTechnical = words.some(w => ['код', 'программ', 'сайт', 'веб', 'javascript', 'react', 'css', 'html', 'api', 'база', 'данных'].includes(w))
      const isPricing = words.some(w => ['цена', 'стоимость', 'тариф', 'план', 'подписка', 'оплата'].includes(w))
      const isGreeting = words.some(w => ['привет', 'здравствуй', 'добро', 'hello', 'hi'].includes(w))

      if (isGreeting) {
        return [
          'Пользователь поздоровался',
          'Отвечу дружелюбно и предложу помощь'
        ]
      }

      if (isPricing) {
        return [
          'Запрос о ценах и тарифах',
          'Проанализирую потребности пользователя',
          'Подбер�� оптимальный тарифный план'
        ]
      }

      if (isTechnical) {
        return [
          'Технический вопрос - анализирую детали',
          'Подготовлю практические решения',
          'Учту лучшие практики разработки'
        ]
      }

      if (isQuestion) {
        return [
          'Анализирую суть вопроса',
          'Структурирую ответ для максимальной пользы',
          'Добавлю примеры и практические советы'
        ]
      }

      // Для остальных случаев
      return [
        'Обрабатываю запрос',
        'Формирую наиболее полезный ответ'
      ]
    }

    const thinkingSteps = generateThinking(userMessage)

    // Создаем блок мышления
    const thinkingBlockId = `thinking_block_${Date.now()}`
    const initialThinkingMessage: Message = {
      id: thinkingBlockId,
      text: 'Thinking...',
      isUser: false,
      timestamp: new Date(),
      isThinking: true,
      isThinkingHeader: true
    }

    setMessages(prev => [...prev, initialThinkingMessage])
    setCurrentThinkingText('')
    await new Promise(resolve => setTimeout(resolve, 200))

    // Печатаем каждую мысль с эффектом печатания
    let fullThought = ''
    for (let i = 0; i < thinkingSteps.length; i++) {
      if (i > 0) {
        fullThought += '\n\n'
        setCurrentThinkingText(fullThought)
      }

      const currentStep = thinkingSteps[i]
      await typeText(currentStep, 25) // Быстрая печать
      fullThought += currentStep

      // Обновляем сообщение
      setMessages(prev => prev.map(msg =>
        msg.id === thinkingBlockId
          ? { ...msg, text: `Thinking...\n\n${fullThought}` }
          : msg
      ))

      // Короткая пауза между мыслями
      if (i < thinkingSteps.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    }

    // Финальная пауза
    await new Promise(resolve => setTimeout(resolve, 400))
  }

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return

    const userMessage = inputText.trim()
    const userMessageId = Date.now().toString()
    const newUserMessage: Message = {
      id: userMessageId,
      text: userMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newUserMessage])
    setInputText('')
    setIsTyping(true)

    try {
      // Показываем процесс мышления
      await showThinkingProcess(userMessage)

      const response = await generateJarvisResponse(userMessage, messages)

      // Удаляем ��лок thinking перед показом ответа
      setMessages(prev => prev.filter(msg => !msg.isThinking))

      // Небольшая пауза перед показом ответа
      await new Promise(resolve => setTimeout(resolve, 300))

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])

      // Озвучиваем ответ бота если включен голосовой режим
      if (voiceMode === 'voice') {
        setTimeout(() => speakText(response), 500) // Небольшая задержка для плавности
      }

      // Сохраняем взаимодействие для обучения
      await saveInteractionToLearning(userMessage, response, userMessageId)

    } catch (error) {
      console.error('Error in handleSendMessage:', error)

      // Удаляем блок thinking при ошибке
      setMessages(prev => prev.filter(msg => !msg.isThinking))

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Извините, произошла ошибк��. Попробуйте позже. 😔',
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('Файл слишком большой. Максимальны�� размер: 5MB')
      return
    }

    setIsUploadingFile(true)

    try {
      // Просто добавляем сообщение о загруженном файле
      const fileMessage: Message = {
        id: Date.now().toString(),
        text: `📎 Файл загружен: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`,
        isUser: true,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, fileMessage])

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `✅ Файл "${file.name}" получен! К сожалени��, обра��отка файлов пока находится в разработке. Но вы може��е описать содержимое файла текстом, и я пос��араюсь помочь! 📝`,
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botResponse])

    } catch (error) {
      console.error('Error handling file upload:', error)
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: '��ши��ка при загрузке файла. Попробуйте позже. 😔',
        isUser: false,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsUploadingFile(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const clearChat = () => {
    setMessages([{
      id: '1',
      text: 'Привет! Я ДЖАРВИС - консультант нашего сайта! 😊\n\nПомогу выбрать услуги, расскажу о тарифах и отвечу на ваши вопросы\n\nЧем могу быть полезен?',
      isUser: false,
      timestamp: new Date()
    }])
    setInteractionIds({})
    setCurrentThinkingText('')
  }

  if (!isOpen) return null

  return (
    <div className={`jarvis-chat-overlay ${isDarkTheme ? 'dark-theme' : ''}`}>
      <div className="jarvis-chat-container">
        <div className="jarvis-chat-header">
          <div className="header-info">
            <div className="jarvis-avatar">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F321030175d41423db42a978adc722c81%2F37b07a37d18e47b9a7c20f69c11e21f0?format=webp&width=800"
                alt="JARVIS"
                width="32"
                height="32"
              />
            </div>
            <div className="header-text">
              <h3>ДЖАРВИС</h3>
              <span className="status">AI Помощник Онлайн</span>
            </div>
          </div>
          <div className="header-actions">
            <button
              className={`voice-mode-btn ${voiceMode === 'voice' ? 'active' : ''}`}
              onClick={toggleVoiceMode}
              title={`Голосовой режим: ${voiceMode === 'voice' ? 'ВКЛ' : 'ВЫКЛ'}`}
            >
              {voiceMode === 'voice' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="m19 10-2 2-2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 10v2a7 7 0 0 0 14 0v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 10v2a7 7 0 0 0 14 0v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="m17 14 2-2-2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
            <button className="clear-chat-btn" onClick={clearChat} title="Очистить чат">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button className="close-btn" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="jarvis-chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.isUser ? 'user-message' : 'bot-message'} ${message.isThinking ? 'thinking-message' : ''}`}>
              {!message.isUser && (
                <div className="message-avatar">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F321030175d41423db42a978adc722c81%2F37b07a37d18e47b9a7c20f69c11e21f0?format=webp&width=800"
                    alt="JARVIS"
                    width="28"
                    height="28"
                  />
                </div>
              )}
              <div className="message-content">
                <div
                  className={`message-text ${message.isThinking ? 'thinking-text' : ''}`}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {message.isThinking ? (
                    <div>
                      <div className="thinking-title">🤔 Думаю...</div>
                      <div className="thinking-content">
                        {message.text.replace('Thinking...\n\n', '')}
                        <span className="thinking-cursor">|</span>
                      </div>
                    </div>
                  ) : (
                    message.text
                  )}
                </div>
                {!message.isThinking && (
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                )}
              </div>
              {!message.isUser && !message.isThinking && interactionIds[message.id] && (
                <MessageFeedback
                  interactionId={interactionIds[message.id]}
                  messageId={message.id}
                />
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot-message">
              <div className="message-avatar">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F321030175d41423db42a978adc722c81%2F37b07a37d18e47b9a7c20f69c11e21f0?format=webp&width=800"
                  alt="JARVIS"
                  width="28"
                  height="28"
                />
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="jarvis-chat-input">
          <div className="input-container">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Напишите сообщение..."
              className="jarvis-message-input"
              rows={1}
              disabled={isTyping}
            />

            <div className="input-buttons">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                accept=".txt,.pdf,.doc,.docx,.md"
              />
              <button
                className={`jarvis-attachment-btn ${isUploadingFile ? 'uploading' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingFile}
                title="Прикрепить файл"
              >
                {isUploadingFile ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>

              {recognition && (
                <button
                  className={`jarvis-mic-btn ${isListening ? 'listening' : ''}`}
                  onClick={isListening ? stopListening : startListening}
                  disabled={isTyping}
                  title={isListening ? "Остановить запись" : "Голосовой ввод"}
                >
                  {isListening ? (
                    <div className="mic-recording">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="currentColor"/>
                        <path d="M5 10v2a7 7 0 0 0 14 0v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5 10v2a7 7 0 0 0 14 0v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  )}
                </button>
              )}

              <button
                className={`jarvis-send-btn ${!inputText.trim() || isTyping ? 'disabled' : ''}`}
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: stretch;
          justify-content: stretch;
          z-index: 10000;
          padding: 0;
        }

        .jarvis-chat-container {
          background: #ffffff;
          border-radius: 0;
          box-shadow: none;
          width: 100%;
          max-width: none;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .dark-theme .jarvis-chat-container {
          background: #1a1a1a;
          color: #ffffff;
        }

        .jarvis-chat-header {
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dark-theme .jarvis-chat-header {
          background: #2d2d2d;
          border-bottom: 1px solid #404040;
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .jarvis-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f0f0;
        }

        .jarvis-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .header-text h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #000000;
        }

        .dark-theme .header-text h3 {
          color: #ffffff;
        }

        .status {
          font-size: 12px;
          color: #10b981;
          font-weight: 500;
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .voice-mode-btn,
        .clear-chat-btn,
        .close-btn {
          background: none;
          border: none;
          color: #666666;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .voice-mode-btn:hover,
        .clear-chat-btn:hover,
        .close-btn:hover {
          background: #f0f0f0;
          color: #000000;
        }

        .voice-mode-btn.active {
          background: #10b981;
          color: #ffffff;
        }

        .voice-mode-btn.active:hover {
          background: #059669;
        }

        .dark-theme .voice-mode-btn,
        .dark-theme .clear-chat-btn,
        .dark-theme .close-btn {
          color: #cccccc;
        }

        .dark-theme .voice-mode-btn:hover,
        .dark-theme .clear-chat-btn:hover,
        .dark-theme .close-btn:hover {
          background: #404040;
          color: #ffffff;
        }

        .dark-theme .voice-mode-btn.active {
          background: #10b981;
          color: #ffffff;
        }

        .jarvis-chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 24px 40px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 100%;
          background: #ffffff;
        }

        .message {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          width: 100%;
        }

        .user-message {
          flex-direction: row-reverse;
          justify-content: flex-start;
        }

        .message-avatar {
          width: 30px;
          height: 30px;
          border-radius: 6px;
          overflow: hidden;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #10a37f;
          margin-top: 4px;
        }

        .message-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .message-content {
          max-width: 80%;
          display: flex;
          flex-direction: column;
          gap: 4px;
          word-wrap: break-word;
          overflow-wrap: break-word;
          min-width: 0;
        }

        .user-message .message-content {
          align-items: flex-end;
        }

        .message-text {
          background: #f7f7f8;
          padding: 12px 16px;
          border-radius: 18px;
          color: #374151;
          line-height: 1.5;
          font-size: 14px;
          word-break: normal;
          overflow-wrap: break-word;
          white-space: pre-wrap;
          max-width: 100%;
          display: block;
          border: 1px solid #e5e7eb;
        }

        .user-message .message-text {
          background: #2563eb;
          color: #ffffff;
          border: 1px solid #2563eb;
          white-space: pre-wrap;
        }

        .dark-theme .jarvis-chat-messages {
          background: #212121;
        }

        .dark-theme .message-text {
          background: #2f2f2f;
          color: #ececec;
          border: 1px solid #404040;
        }

        .dark-theme .user-message .message-text {
          background: #2563eb;
          color: #ffffff;
          border: 1px solid #2563eb;
        }

        .message-time {
          font-size: 11px;
          color: #9ca3af;
          padding: 0 4px;
          margin-top: 4px;
          font-weight: 400;
        }

        .typing-indicator {
          background: #f7f7f8;
          padding: 12px 16px;
          border-radius: 18px;
          display: flex;
          gap: 4px;
          align-items: center;
          border: 1px solid #e5e7eb;
        }

        .dark-theme .typing-indicator {
          background: #2f2f2f;
          border: 1px solid #404040;
        }

        .typing-indicator span {
          width: 6px;
          height: 6px;
          background: #999999;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(1) { animation-delay: 0s; }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .jarvis-chat-input {
          background: #f8f9fa;
          border-top: 1px solid #e9ecef;
          padding: 16px 40px;
        }

        .dark-theme .jarvis-chat-input {
          background: #2d2d2d;
          border-top: 1px solid #404040;
        }

        .input-container {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #ffffff;
          border-radius: 24px;
          padding: 12px 16px;
          border: 2px solid transparent;
          transition: border-color 0.2s;
        }

        .input-container:focus-within {
          border-color: #007bff;
        }

        .dark-theme .input-container {
          background: #404040;
          border-color: transparent;
        }

        .dark-theme .input-container:focus-within {
          border-color: #0056b3;
        }

        .input-buttons {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .jarvis-attachment-btn {
          background: none;
          border: none;
          color: #666666;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
        }

        .jarvis-attachment-btn:hover {
          background: #f0f0f0;
          color: #007bff;
        }

        .jarvis-attachment-btn.uploading {
          color: #007bff;
          cursor: not-allowed;
        }

        .dark-theme .jarvis-attachment-btn {
          color: #cccccc;
        }

        .dark-theme .jarvis-attachment-btn:hover {
          background: #555555;
          color: #ffffff;
        }

        .loading-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid #e5e7eb;
          border-top: 2px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .jarvis-message-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-size: 14px;
          line-height: 1.4;
          resize: none;
          min-height: 24px;
          max-height: 120px;
          color: #000000;
          font-family: inherit;
          padding: 0;
        }

        .jarvis-message-input::placeholder {
          color: #999999;
        }

        .dark-theme .jarvis-message-input {
          color: #ffffff;
        }

        .dark-theme .jarvis-message-input::placeholder {
          color: #cccccc;
        }

        .jarvis-send-btn {
          background: #007bff;
          border: none;
          color: #ffffff;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
        }

        .jarvis-send-btn:hover:not(.disabled) {
          background: #0056b3;
          transform: scale(1.05);
        }

        .jarvis-send-btn.disabled {
          background: #cccccc;
          cursor: not-allowed;
          transform: none;
        }

        .dark-theme .jarvis-send-btn.disabled {
          background: #555555;
        }

        /* Стили для сообщений мышления */
        .thinking-message {
          opacity: 0.8;
        }

        .thinking-text {
          background: #f8f9fa !important;
          border: 1px solid #e1e5e9 !important;
          border-left: 3px solid #6366f1 !important;
          color: #495057 !important;
          font-family: 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace !important;
          font-size: 12px !important;
          line-height: 1.4 !important;
          padding: 10px 14px !important;
          border-radius: 6px !important;
          white-space: pre-line !important;
          max-width: 80% !important;
        }

        .thinking-text .thinking-title {
          font-weight: 600;
          color: #6366f1;
          margin-bottom: 8px;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .thinking-content {
          position: relative;
        }

        .thinking-cursor {
          animation: blink 1s infinite;
          color: #6366f1;
          font-weight: bold;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .dark-theme .thinking-text {
          background: #1e1e1e !important;
          border: 1px solid #333 !important;
          border-left: 4px solid #6366f1 !important;
          color: #e1e5e9 !important;
        }

        .dark-theme .thinking-text .thinking-title {
          color: #8b9dd4;
        }

        .dark-theme .thinking-cursor {
          color: #8b9dd4;
        }

      `}</style>
    </div>
  )
}
