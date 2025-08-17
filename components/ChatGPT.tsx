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
  const [typingText, setTypingText] = useState('')
  const [isDisplayingTyping, setIsDisplayingTyping] = useState(false)
  const [isUploadingFile, setIsUploadingFile] = useState(false)
  const [interactionIds, setInteractionIds] = useState<{[messageId: string]: string}>({})

  // Голосовые функции
  const [isListening, setIsListening] = useState(false)
  const [voiceMode, setVoiceMode] = useState<'text' | 'voice'>('voice') // 'text' = только текст, 'voice' = текст + голос
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null)
  const [autoSendTimer, setAutoSendTimer] = useState<NodeJS.Timeout | null>(null)
  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null)
  const inputTextRef = useRef('')

  // ElevenLabs ключи (4 ключа с разных аккаунтов для ротации - ОБНОВЛЕНЫ С ВАШИМИ КЛЮЧАМИ)
  const [elevenLabsKeys] = useState([
    { key: 'sk_1df0aad8b96f47707c32565c8a91421e994da2f1858563f1', isActive: true, usage: 0, limit: 10000, errorCount: 0 }, // Ключ 1
    { key: 'sk_5db328d5ec7cec7e73430d76b064cfb0c883cbc757497b22', isActive: true, usage: 0, limit: 10000, errorCount: 0 }, // Ключ 2
    { key: 'sk_069e38bd4f02f37b61dce186ba7147400b62b49ba5ce2a6b', isActive: true, usage: 0, limit: 10000, errorCount: 0 }, // Ключ 3
    { key: 'sk_461e30f29ff6c05c74b34778cb0933a05b641f27bf766ab0', isActive: true, usage: 0, limit: 10000, errorCount: 0 }, // Ключ 4
  ])

  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const sessionId = useRef(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)

  // Обновляем ref при изменении inputText
  useEffect(() => {
    inputTextRef.current = inputText
  }, [inputText])

  // Инициализация г��лосовых API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Speech Recognition API
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = true // Включаем непрерывное распознавание
        recognitionInstance.interimResults = true // Включаем промежуточные результаты
        recognitionInstance.lang = 'ru-RU'

        recognitionInstance.onresult = (event: any) => {
          let finalTranscript = ''
          let interimTranscript = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          // Показываем промежуточные результаты для лучшего UX (в реальном времени)
          if (interimTranscript) {
            console.log('🔄 Промежуточный текст:', interimTranscript)
            // Обновляем поле ввода только промежуточным текстом (заменяем, ��е добавляем)
            setInputText(interimTranscript)
          }

          // Обрабатываем финальный текст и запускаем автоотправку
          if (finalTranscript) {
            console.log('📝 Получен финальный текст:', finalTranscript)
            // Устанавливаем только финальный текст (не накапливаем)
            setInputText(finalTranscript.trim())
            inputTextRef.current = finalTranscript.trim()

            // Очищаем существующий таймер
            if (autoSendTimer) {
              clearTimeout(autoSendTimer)
              console.log('⏰ Очищен предыдущий таймер автоотправки')
            }

            // Запускаем таймер автоотправки через 2 секунды посл�� последних слов
            console.log('⏱️ Запускаем таймер автоотправки (2 сек)')
            const timer = setTimeout(() => {
              console.log('🚀 Время вышло! Автоматическая отправка сообщения')
              // Используем актуальный текст из ref
              const currentText = inputTextRef.current?.trim()
              if (currentText && currentText.length > 0) {
                console.log('📤 Отправляем голосовое сообщение:', currentText)
                handleVoiceAutoSend(currentText)
              } else {
                console.log('⚠️ Нет текста для отправки, очищаем поле')
                setInputText('')
                inputTextRef.current = ''
              }
              setIsListening(false)
              recognitionInstance.stop()
            }, 2000) // 2 секунды

            setAutoSendTimer(timer)
          }
        }

        recognitionInstance.onspeechstart = () => {
          console.log('🎤 Начало речи обнаружено')
          // О��ищаем таймер тишины при начале речи
          if (silenceTimer) {
            clearTimeout(silenceTimer)
            setSilenceTimer(null)
            console.log('🔇 Таймер тишины очищен (речь возобновилась)')
          }
        }

        recognitionInstance.onspeechend = () => {
          console.log('🔇 Конец речи, ��апускаем таймер тишины (3 сек)')
          // Запускаем таймер тишины
          const timer = setTimeout(() => {
            console.log('😴 Длительная тишина обнаружена, останавливаем распознавание')
            setIsListening(false)
            recognitionInstance.stop()
          }, 3000) // 3 секунды тишины
          setSilenceTimer(timer)
        }

        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)

          // Игнор��руем ошибки "no-speech" (отсутст��ие речи) - это норм��льно
          if (event.error === 'no-speech') {
            console.log('⚠️ Нет речи - ожид��ем дальше')
            return
          }

          // Для других ошибок останавливаем
          setIsListening(false)

          // Очищаем ��а��меры
          if (autoSendTimer) {
            clearTimeout(autoSendTimer)
            setAutoSendTimer(null)
          }
          if (silenceTimer) {
            clearTimeout(silenceTimer)
            setSilenceTimer(null)
          }
        }

        recognitionInstance.onend = () => {
          console.log('🛑 Распознавание остановлено')
          setIsListening(false)

          // Очища��м тай��еры при завершении
          if (autoSendTimer) {
            clearTimeout(autoSendTimer)
            setAutoSendTimer(null)
          }
          if (silenceTimer) {
            clearTimeout(silenceTimer)
            setSilenceTimer(null)
          }
        }

        setRecognition(recognitionInstance)
      }

      // Speech Synthesis API
      if (window.speechSynthesis) {
        setSpeechSynthesis(window.speechSynthesis)

        // Форсируем загрузку голос��в (работае�� в большинс��ве браузеров)
        const forceLoadVoices = () => {
          // Создаем пуст��е высказывание чтобы актлювир��ват�� голоса
          const utterance = new SpeechSynthesisUtterance('')
          window.speechSynthesis.speak(utterance)
          window.speechSynthesis.cancel()
        }

        // Инициализируем г��лоса (некоторчие браузеры загружают их асинхронно)
        const loadVoices = () => {
          const voices = window.speechSynthesis.getVoices()
          const russianVoices = voices.filter(v => v.lang.includes('ru') || v.lang.includes('RU'))
          console.log('🎤 Русские голо���� загружены:', russianVoices.length)
          russianVoices.forEach(v => console.log(`  - ${v.name} (${v.lang}) ${v.localService ? '[Локальный]' : '[Онлайн]'}`))
        }

        // Попытка 1: загрузка сразу
        if (window.speechSynthesis.getVoices().length > 0) {
          loadVoices()
        } else {
          // Попытка 2: форсируем загрузку
          forceLoadVoices()
          setTimeout(loadVoices, 100)
        }

        // Попыт��а 3: подписываемс���� на событие загрузки голосов
        window.speechSynthesis.onvoiceschanged = () => {
          loadVoices()
        }

        // Попытка 4: дополн��т��льная загрузка через секунду
        setTimeout(() => {
          if (window.speechSynthesis.getVoices().length === 0) {
            forceLoadVoices()
            setTimeout(loadVoices, 200)
          }
        }, 1000)
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
          // Сохраняем ID взлюимодействия для связи с сообщениелю
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
      // Не блокируем пользовательский интерфейс при ошибк��х сохранения
      // Это не кри��ично для работы чата
    }
  }

  // Извлечение тегов из текста
  const extractTags = (text: string): string[] => {
    const commonTags = [
      'веб-разработка', 'дизай��', 'программирование', 'ai', 'технологии',
      'фронтенд', 'бэкенд', 'react', 'javascript', 'typescript', 'css',
      'html', 'api', 'база данных', 'сеть', 'безопасность', 'ui', 'ux'
    ]

    const lowerText = text.toLowerCase()
    return commonTags.filter(tag => lowerText.includes(tag))
  }

  // Функ��ия для з��пуска голосового ввода
  const startListening = () => {
    if (recognition && !isListening) {
      console.log('🎙️ ЗАПУСК голосового ввода с автоотправкой')
      console.log('🧹 Очищаем поле ввода для новой записи')
      setInputText('') // Очищаем поле ввода дл�� новой записи
      inputTextRef.current = '' // Также очищаем ref
      setIsListening(true)

      try {
        recognition.start()
        console.log('✅ Speech Recognition успешно запущен')
      } catch (error) {
        console.error('❌ Ошибка запуска распознавания:', error)
        setIsListening(false)
      }
    } else {
      console.log('⚠️ Не удалось запустить: recognition не готов или уж�� слушает')
    }
  }

  // Ф��нкция для остановки голосового ��вода
  const stopListening = () => {
    if (recognition && isListening) {
      console.log('⏹�� Остановка голосового ввода')
      recognition.stop()
      setIsListening(false)

      // Очищаем все таймеры
      if (autoSendTimer) {
        clearTimeout(autoSendTimer)
        setAutoSendTimer(null)
      }
      if (silenceTimer) {
        clearTimeout(silenceTimer)
        setSilenceTimer(null)
      }
    }
  }

  // Функция для получения лучшего мужского голоса
  const getBestMaleVoice = () => {
    const voices = speechSynthesis.getVoices()
    let selectedVoice = null

    console.log('🔍 Поиск голосов. Всего доступно:', voices.length)

    // Логируем все русские ��олоса для отла��ки
    const russianVoices = voices.filter(v => v.lang.includes('ru') || v.lang.includes('RU'))
    console.log('🇷🇺 Русские голоса:', russianVoices.map(v => `${v.name} (${v.lang}) ${v.localService ? '[Локальный]' : '[Онлайн]'}`))

    // ПРИОРИТЕТ 1: ����амые качественные мужс��ие голоса (менее роботичные)
    const premiumMaleVoices = [
      'Google русский (Россия)', // Самый качеств��нный если есть
      'Microsoft Pavel - Russian (Russia)', // MS Neural голос
      'Google русский',
      'Pavel (Enhanced)', // Если е����ь улучшенная версия
      'Yuri (Natural)', // Естественный ��ариант
      'Microsoft Pavel',
      'Pavel',
      'Yuri'
    ]

    for (const premiumVoice of premiumMaleVoices) {
      selectedVoice = russianVoices.find(v =>
        v.name.toLowerCase().includes(premiumVoice.toLowerCase())
      )
      if (selectedVoice) {
        console.log('✅ Найден ка��ественный голос:', selectedVoice.name)
        break
      }
    }

    // ПРИОРИТЕТ 2: Качественные голоса (предпочитаем локальные)
    if (!selectedVoice) {
      const qualityVoices = [
        'Google русский',
        'Microsoft Irina - Russian (Russia)', // Хотя женский, но качестлюенный
        'Russian (Russia)',
        'ru-RU'
      ]

      for (const quality of qualityVoices) {
        selectedVoice = russianVoices.find(v =>
          v.name.includes(quality) && v.localService
        )
        if (selectedVoice) {
          console.log('✅ Найден качественный локальный голос:', selectedVoice.name)
          break
        }
      }
    }

    // ПРИОРИТЕТ 3: Любой рус��кий голос
    if (!selectedVoice) {
      selectedVoice = russianVoices.find(v => v.localService) || russianVoices[0]
      if (selectedVoice) {
        console.log('⚠️ Используем резер��ный ��олос:', selectedVoice.name)
      }
    }

    return selectedVoice
  }

  // Функция получения доступного ElevenLabs ключ�� (��исте���� ротации как у OpenRouter)
  const getNextAvailableElevenLabsKey = () => {
    // ��щем активные ключи с доступным лимитом
    const availableKeys = elevenLabsKeys.filter(k =>
      k.isActive && k.key.length > 0 && k.usage < k.limit && k.errorCount < 3
    )

    if (availableKeys.length > 0) {
      console.log(`🔑 Доступно ElevenLabs ключей: ${availableKeys.length}`)
      return availableKeys[0].key
    }

    // Если все ключи исчерпали лимит, сбрасываем счет��ик�� (новый месяц)
    const keysWithLimitReached = elevenLabsKeys.filter(k => k.usage >= k.limit)
    if (keysWithLimitReached.length > 0) {
      console.log('🔄 Сброс лимитов ElevenLabs к�����чей (новый месяц)')
      keysWithLimitReached.forEach(k => {
        k.usage = 0
        k.errorCount = 0
        k.isActive = true
      })

      const resetKey = elevenLabsKeys.find(k => k.key.length > 0)
      return resetKey ? resetKey.key : null
    }

    return null
  }

  // Отметить ключ как проблемный
  const markElevenLabsKeyAsProblematic = (apiKey: string, error: string) => {
    const keyInfo = elevenLabsKeys.find(k => k.key === apiKey)
    if (keyInfo) {
      keyInfo.errorCount++
      if (keyInfo.errorCount >= 3) {
        keyInfo.isActive = false
        console.log(`❌ ElevenLabs ключ отключен после 3 ошибок: ${apiKey.substring(0, 8)}...`)
      }
      console.log(`⚠️ ElevenLabs ошибка (${keyInfo.errorCount}/3): ${error}`)
    }
  }

  // Увеличить счетчик использования ключа
  const updateElevenLabsUsage = (apiKey: string, charactersUsed: number) => {
    const keyInfo = elevenLabsKeys.find(k => k.key === apiKey)
    if (keyInfo) {
      keyInfo.usage += charactersUsed
      console.log(`📊 ElevenLabs использование: ${keyInfo.usage}/${keyInfo.limit} ��имволов`)

      if (keyInfo.usage >= keyInfo.limit) {
        keyInfo.isActive = false
        console.log(`🚫 ElevenLabs ключ исчерпал лимит: ${apiKey.substring(0, 8)}...`)
      }
    }
  }

  // ��ункция для ElevenLabs TTS (пре��юиум качество)
  const speakWithElevenLabs = async (text: string): Promise<boolean> => {
    const apiKey = getNextAvailableElevenLabsKey()

    if (!apiKey) {
      console.log('❌ Нет доступных ElevenLabs ключей, fallback на браузерный TTS')
      return false
    }

    try {
      console.log(`🎤 Используем ElevenLabs ключ: ${apiKey.substring(0, 8)}...`)

      // Создаем AbortController для timeout контроля
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
      }, 15000) // 15 секунд timeout

      // Используем качественный русский мужской голос без акц��нта (лучший для русского языка)
      const voiceId = 'pNInz6obpgDQGcFmaJgB' // Adam (отличный английский голос, но хорошо произносит русский без акцента)

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2', // Лучше для русского яз��ка
          voice_settings: {
            stability: 0.95, // Максимальная стабильность для четкого русского произношения
            similarity_boost: 0.90, // Улучшенная похожесть на естественный голос
            style: 0.05, // Минимальная эмоциональность для четкого произношения русского
            use_speaker_boost: true // Усиление для лучшего качества звука
          }
        }),
        signal: controller.signal // Добавляем abort signal
      })

      // Очищае�� timeout при успешном ответе
      clearTimeout(timeoutId)

      if (response.ok) {
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)

        // 🚀 ОПТИМИЗАЦИЯ: предварительная загрузка для мгновенного старта
        audio.preload = 'auto'
        audio.volume = 1.0

        audio.onended = () => {
          URL.revokeObjectURL(audioUrl)
          console.log('✅ ElevenLabs TTS завершен')
        }

        audio.onerror = () => {
          console.error('❌ ��шибка воспроизведения ElevenLabs ауди��')
          URL.revokeObjectURL(audioUrl)
        }

        // 🚀 НЕМЕДЛЕННОЕ воспроизведение для синхронизации с текстом
        audio.play().then(() => {
          console.log('🎵 ElevenLabs TTS начал воспроизведен��е МГНОВЕННО')
        }).catch(error => {
          console.error('❌ Ошибка немедленного воспроизведения:', error)
        })

        // Обновляем счетчик испо��ьзования
        updateElevenLabsUsage(apiKey, text.length)

        console.log('🎵 ElevenLabs TTS успешно запущен')
        return true

      } else {
        let errorMessage = 'Unknown error'
        try {
          const errorData = await response.json()
          errorMessage = errorData.detail?.message || errorData.message || `HTTP ${response.status}`
        } catch {
          errorMessage = `HTTP ${response.status}`
        }

        markElevenLabsKeyAsProblematic(apiKey, errorMessage)

        if (response.status === 401) {
          console.log('🔑 Н���верный ключ ElevenLabs, пробуем следующий...')
        } else if (response.status === 429) {
          console.log('⏰ Лимит ElevenLabs ��ревышен, пробуем следующий ключ...')
        }

        return false
      }

    } catch (error) {
      let errorMessage = 'Network error'

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timeout (15s)'
          console.error('⏰ ElevenLabs timeout после 15 секунд')
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Network connectivity issue'
          console.error('🌐 ElevenLabs сетевая ошибка: проблемы подключения')
        } else {
          errorMessage = error.message
          console.error('💥 ElevenLabs ошибка сети:', error.message)
        }
      } else {
        console.error('💥 ElevenLabs неизвестная ошибка:', error)
      }

      markElevenLabsKeyAsProblematic(apiKey, errorMessage)
      return false
    }
  }

  // Функция для озвучивания ��екста (теперь �� ElevenLabs + fallback)
  const speakText = async (text: string) => {
    console.log('🎵 speakText вызвана. voiceMode:', voiceMode, 'text:', text.substring(0, 30) + '...')
    if (voiceMode !== 'voice') {
      console.log('❌ Голосовой режим выключен, пропускаем озвучивание')
      return
    }

    // Останавливаем предыдущее воспроизведение
    if (speechSynthesis) {
      speechSynthesis.cancel()
    }

    // Очищаем люекст
    const cleanText = text
      .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
      .replace(/[•▪▫]/g, '')
      .replace(/\n+/g, '. ')
      .trim()

    if (!cleanText) return

    console.log('���� === НАЧИНАЕМ ОЗВУЧИВАНИЕ ===')
    console.log(`📝 Тек��т: ${cleanText.substring(0, 50)}...`)

    // ЭТАП 1: Пробуем ElevenLabs (премиум качество) с повторными попытками
    const maxRetries = 2
    let retryCount = 0

    while (retryCount <= maxRetries) {
      try {
        console.log(`🔥 ЭТАП 1: ELEVENLABS TTS (попытка ${retryCount + 1}/${maxRetries + 1})`)
        const elevenLabsSuccess = await speakWithElevenLabs(cleanText)

        if (elevenLabsSuccess) {
          console.log('✅ === SUCCESS VIA ELEVENLABS ===')
          return
        }

        // Е��ли не удалось, пробуем следующи�� ключ
        retryCount++
        if (retryCount <= maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, retryCount), 3000) // Exponential backoff до 3 сек
          console.log(`⏳ Повторная попытка через ${delay}ms...`)
          await new Promise(resolve => setTimeout(resolve, delay))
        }

      } catch (error) {
        console.error('💥 ElevenLabs критическая оши��ка:', error)
        retryCount++
        if (retryCount <= maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, retryCount), 3000)
          console.log(`⏳ Повторная попытка после ошибки через ${delay}ms...`)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }

    console.log('❌ ElevenLabs недоступен после всех попыток, переходим к fallback')

    // ЭТАП 2: Fallback на браузерный TTS
    console.log('📱 ЭТАП 2: BROWSER TTS FALLBACK')
    console.log('🔍 speechSynthesis доступен:', !!speechSynthesis)

    if (speechSynthesis) {
      // Останавливаем предыдущее воспроизвед��ние
      speechSynthesis.cancel()

      // Ждем немного, чтоблю cancel ус��ел отработать
      setTimeout(() => {
        // Очищаем текст от эмодзлю и специальных символов дл�� ��учшего произношения
        const cleanText = text
          .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
          .replace(/[▪▫·]/g, '')
          .replace(/\n+/g, '. ') // Заменяем переносы на пауз����
          .trim()

        if (cleanText) {
          console.log('🎯 Создаем utterance для текста:', cleanText.substring(0, 30) + '...')
          const utterance = new SpeechSynthesisUtterance(cleanText)

          // Получ��ем лучший голос
          const selectedVoice = getBestMaleVoice()

          if (selectedVoice) {
            utterance.voice = selectedVoice
            console.log('🎤 Голос для озвучки:', selectedVoice.name, selectedVoice.lang)
          } else {
            console.log('⚠️ Голос не найден, используем голос по умолчанию')
          }

          // Настрой��и для более естестве��ного чивучания (менел�� роботично)
          utterance.lang = 'ru-RU'
          utterance.rate = 1.0   // Нормальная скоро��ть (не замедл��нная)
          utterance.pitch = 0.95 // Близко к естественному (не слишком низко)
          utterance.volume = 0.8 // Комфортная громкость

          // Добавляем обрлюботчики событий
          utterance.onstart = () => {
            console.log('🎵 Начало люз��учивания')
          }

          utterance.onend = () => {
            console.log('✅ Озвучивание завершено')
          }

          utterance.onerror = (event) => {
            console.error('❌ Ошибка озвучива��ия:', event.error)
          }

          console.log('🚀 Запускаем speechSynthesis.speak()')
          speechSynthesis.speak(utterance)
          console.log('��� speechSynthesis.speak() выполнен')
        }
      }, 100)
    }
  }

  // Переключение режима люолоса
  const toggleVoiceMode = () => {
    const newMode = voiceMode === 'text' ? 'voice' : 'text'
    setVoiceMode(newMode)

    // Те��тируем голос при включен���и
    if (newMode === 'voice') {
      setTimeout(() => {
        const voices = speechSynthesis.getVoices()
        const russianVoices = voices.filter(v => v.lang.includes('ru') || v.lang.includes('RU'))

        if (russianVoices.length === 0) {
          speakText('Внимание! Русски�� голос�� не найдены. Качество речи может быть низким.')
        } else {
          speakText('Голосовой режим включе��. Если голос звучит роботично, это огран��чение браузера.')
        }
      }, 300)
    }
  }


  // Функция ����ля тестирования гол��са
  const testVoice = () => {
    console.log('🧪 Тестиров��ние голоса JARVIS...')
    const testPhrase = 'Привет! Я ДЖАРВИС. Это тест моего нового голоса через ElevenLabs API.'
    speakText(testPhrase)
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

  // ��чистка таймеров при размонтировании
  useEffect(() => {
    return () => {
      if (autoSendTimer) {
        clearTimeout(autoSendTimer)
      }
      if (silenceTimer) {
        clearTimeout(silenceTimer)
      }
    }
  }, [])

  // Функция печающего эффекта
  const displayTextWithTypingEffect = async (message: Message, fullText: string) => {
    setIsDisplayingTyping(true)
    setTypingText('')

    // Добавляем сообщение с пустым текстом
    setMessages(prev => [...prev, { ...message, text: '' }])

    // Печатаем по одному символу
    for (let i = 0; i <= fullText.length; i++) {
      const currentText = fullText.slice(0, i)
      setTypingText(currentText)

      // Обновляем сообщение
      setMessages(prev => prev.map((msg, index) =>
        index === prev.length - 1 ? { ...msg, text: currentText } : msg
      ))

      // Скорость печати
      await new Promise(resolve => setTimeout(resolve, 20))
    }

    setIsDisplayingTyping(false)
    setTypingText('')
  }

  const generateJarvisResponse = async (userMessage: string, conversationHistory: Message[]): Promise<string> => {
    try {
      // Обычный чат-запрос
      const apiMessages = conversationHistory
        .filter(msg => !msg.text.includes('Прив��т! Я ДЖА��ВчиС, ваш AI-пом��щник!'))
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
          return 'Слишком много запро��ов. Пожалуйста, подождите немного перед следующим со��бщением. ⏳'
        }
        
        const errorText = await response.text()
        console.error('Chat API error:', errorText)
        return 'Извините, произошла ошибк�� пр�� обработк��� запроса. Попробуйте позже. 😔'
      }

      const data = await response.json()
      
      if (data.error) {
        console.error('Chat API returned error:', data.error)
        return 'Извините, п��оизошла ошибка. Попробуйте перефо��мулировать вопрос. ����'
      }

      return data.message || 'Извините, не могу ответить на это�� вопрос. Попробуйт�� спросить что-то другое! 🤷‍♂️'

    } catch (error) {
      console.error('Error generating response:', error)
      return 'Произошла оши��ка при генерации ответа. Проверьте подключение к интернету и попробуйте снова. 🌐'
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
          'Проанализирую потребности по��ьзователя',
          'Подберу оптимальный тарифный план'
        ]
      }

      if (isTechnical) {
        return [
          'Технический вопрос - анализирую ��етали',
          'Подготовлю практические решения',
          'Учту лучшие практики разработки'
        ]
      }

      if (isQuestion) {
        return [
          'Анализирую с��ть вопроса',
          'Структурирую ответ для максимальной пользы',
          'Добавлю примеры и практические советы'
        ]
      }

      // Для остальных случаев
      return [
        'Обрабатываю запрос',
        'Формирую наиболее полезный ��твет'
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

    // Пе��атаем каждую мысль с эффектом печатания
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

    // Фина��ьная пауза
    await new Promise(resolve => setTimeout(resolve, 400))
  }

  // ��пециальная функция для голосовой автоотправки (обходит проверку inputText)
  const handleVoiceAutoSend = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return

    // ��чищаем все голосовые таймеры п��и отправке сообщения
    if (autoSendTimer) {
      clearTimeout(autoSendTimer)
      setAutoSendTimer(null)
    }
    if (silenceTimer) {
      clearTimeout(silenceTimer)
      setSilenceTimer(null)
    }

    const userMessage = textToSend.trim()
    const userMessageId = Date.now().toString()
    const newUserMessage: Message = {
      id: userMessageId,
      text: userMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newUserMessage])
    setInputText('')
    inputTextRef.current = ''
    setIsTyping(true)

    try {
      // Показываем процесс мышления
      await showThinkingProcess(userMessage)

      const response = await generateJarvisResponse(userMessage, messages)

      // Удаляем блок thinking перед показом ответа
      setMessages(prev => prev.filter(msg => !msg.isThinking))

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      }

      // 🚀 ЗАПУСКАЕМ ГОЛОС СРАЗУ, БЕЗ ЗАДЕ��ЖЕК!
      if (voiceMode === 'voice') {
        console.log('🎤 🚀 МГНО��ЕННЫЙ запуск озвучивания (handleVoiceAutoSend):', response.substring(0, 50) + '...')
        // Запускаем ��звучивание параллельно, не блокируя UI
        speakText(response).catch(error => {
          console.error('Ошиб��а озвучивания:', error)
        })
      }

      // Показываем текст ОДНОВРЕМЕННО с голосом (без пауз)
      setMessages(prev => [...prev, botMessage])

      if (voiceMode !== 'voice') {
        console.log('🔇 Голосовой режим выключен')
      }

      // Сохраняем взаимодействие для обу��е��ия
      await saveInteractionToLearning(userMessage, response, userMessageId)

    } catch (error) {
      console.error('Error in handleVoiceAutoSend:', error)

      // Удаляем блок thinking при ошибке
      setMessages(prev => prev.filter(msg => !msg.isThinking))

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Извините, произошла ошибка. Попробуйте позже. 😔',
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
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

      // Удаляем блок thinking перед показом ответа
      setMessages(prev => prev.filter(msg => !msg.isThinking))

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      }

      // 🚀 ЗАПУСКАЕМ ГОЛОС СРАЗУ, БЕЗ ЗАДЕРЖЕК!
      if (voiceMode === 'voice') {
        console.log('🎤 🚀 МГНОВЕННЫЙ запуск озвучивания (handleSendMessage):', response.substring(0, 50) + '...')
        // Запускаем озвучивание параллельно, не блокир��я UI
        speakText(response).catch(error => {
          console.error('Ошибка озвучивания:', error)
        })
      }

      // Показываем текст ОДНОВРЕМЕ��НО �� голосом (без пауз)
      setMessages(prev => [...prev, botMessage])

      if (voiceMode !== 'voice') {
        console.log('🔇 Голосовой режим выключен')
      }

      // Сохраняем взаимодей��твие для обучения
      await saveInteractionToLearning(userMessage, response, userMessageId)

    } catch (error) {
      console.error('Error in handleSendMessage:', error)

      // Удаляем блок thinking при ошибке
      setMessages(prev => prev.filter(msg => !msg.isThinking))

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Извините, произошла ошибклю. Попробуйте позже. 😔',
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
      alert('Файл слишк��м большой. Максима��ьнылю размер: 5MB')
      return
    }

    setIsUploadingFile(true)

    try {
      // Просто ��обавляем сообщение о загруженном файле
      const fileMessage: Message = {
        id: Date.now().toString(),
        text: `📎 Файл загружен: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`,
        isUser: true,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, fileMessage])

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `✅ Фай�� "${file.name}" получен! К сожал��нилю, обралюотка фай��ов пока находится в разра��отке. Но вы можете описать содер��имое файла текстом, и я послюараю��ь помочь! 📝`,
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botResponse])

    } catch (error) {
      console.error('Error handling file upload:', error)
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'л��шилюка при загрузке файла. Попробуйте позже. люлю',
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
              <div className="message-content">
                <div
                  className={`message-text ${message.isThinking ? 'thinking-text' : ''}`}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {message.isThinking ? (
                    <div>
                      <div className="thinking-title">🤔 Думаю...</div>
                      <div className="thinking-content">
                        {message.text.replace('Thinking...\n\n', '').replace(/[�]/g, '')}
                        <span className="thinking-cursor">|</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Обрабатываем markdown изображения в тексте */}
                      {message.text.includes('![') && message.text.includes('](') ? (
                        <div>
                          {message.text.split(/(\!\[.*?\]\(.*?\))/g).map((part, index) => {
                            // Проверяем если это markdown изображение
                            const imageMatch = part.match(/\!\[(.*?)\]\((.*?)\)/)
                            if (imageMatch) {
                              const [, altText, imageUrl] = imageMatch
                              return (
                                <div key={index} className="generated-image-container">
                                  <img
                                    src={imageUrl}
                                    alt={altText}
                                    className="generated-image"
                                    style={{
                                      maxWidth: '100%',
                                      maxHeight: '400px',
                                      borderRadius: '8px',
                                      margin: '10px 0',
                                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                    }}
                                    onError={(e) => {
                                      console.error('Ошибка загрузки изображения:', imageUrl)
                                      e.currentTarget.style.display = 'none'
                                    }}
                                  />
                                </div>
                              )
                            }
                            return part
                          })}
                        </div>
                      ) : (
                        message.text
                      )}
                    </div>
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
          {isListening && (
            <div className="auto-send-indicator">
              🎤 Слушаю... Сообщение отправится автоматически через 2 сек после окончания речи
            </div>
          )}
          <div className="input-container">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isListening ? "Говорите..." : "Напишите сообщение..."}
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
                  title={isListening ? "Остановить запись (сообщение отправится автоматически через 2 сек после речи)" : "Голосовой ввод (автоотправка через 2 сек после речи)"}
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
        .test-voice-btn,
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
        .test-voice-btn:hover,
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

        .test-voice-btn {
          color: #3b82f6;
        }

        .test-voice-btn:hover {
          background: #dbeafe;
          color: #1d4ed8;
        }


        .dark-theme .voice-mode-btn,
        .dark-theme .test-voice-btn,
        .dark-theme .clear-chat-btn,
        .dark-theme .close-btn {
          color: #cccccc;
        }

        .dark-theme .voice-mode-btn:hover,
        .dark-theme .test-voice-btn:hover,
        .dark-theme .clear-chat-btn:hover,
        .dark-theme .close-btn:hover {
          background: #404040;
          color: #ffffff;
        }

        .dark-theme .voice-mode-btn.active {
          background: #10b981;
          color: #ffffff;
        }

        .dark-theme .test-voice-btn {
          color: #60a5fa;
        }

        .dark-theme .test-voice-btn:hover {
          background: #1e3a8a;
          color: #93c5fd;
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

        .auto-send-indicator {
          background: linear-gradient(135deg, #10b981, #059669);
          color: #ffffff;
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 12px;
          text-align: center;
          margin-bottom: 12px;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
          animation: autosend-pulse 2s infinite;
        }

        @keyframes autosend-pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
          }
          50% {
            transform: scale(1.02);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.5);
          }
        }

        .dark-theme .auto-send-indicator {
          background: linear-gradient(135deg, #10b981, #059669);
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
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

        .jarvis-attachment-btn,
        .jarvis-mic-btn {
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

        .jarvis-attachment-btn:hover,
        .jarvis-mic-btn:hover {
          background: #f0f0f0;
          color: #007bff;
        }

        .jarvis-attachment-btn.uploading {
          color: #007bff;
          cursor: not-allowed;
        }

        .jarvis-mic-btn.listening {
          background: #ef4444;
          color: #ffffff;
          animation: pulse 2s infinite;
        }

        .jarvis-mic-btn.listening:hover {
          background: #dc2626;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .mic-recording {
          position: relative;
        }

        .mic-recording::after {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border: 2px solid #ef4444;
          border-radius: 50%;
          animation: recordingRing 1.5s infinite;
        }

        @keyframes recordingRing {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        .dark-theme .jarvis-attachment-btn,
        .dark-theme .jarvis-mic-btn {
          color: #cccccc;
        }

        .dark-theme .jarvis-attachment-btn:hover,
        .dark-theme .jarvis-mic-btn:hover {
          background: #555555;
          color: #ffffff;
        }

        .dark-theme .jarvis-mic-btn.listening {
          background: #ef4444;
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

        /* ================================
           MOBILE RESPONSIVE FIXES
           ================================ */
        @media (max-width: 768px) {
          .jarvis-chat-messages {
            padding: 12px;
            gap: 6px;
          }

          .message {
            max-width: 100%;
            gap: 6px;
            margin-bottom: 8px;
          }

          /* Hide avatar on mobile for more space */
          .message-avatar {
            display: none;
          }

          .message-content {
            max-width: 95%;
          }

          .user-message .message-content {
            max-width: 85%;
            margin-left: auto;
          }

          .bot-message .message-content {
            max-width: 85%;
            margin-right: auto;
          }

          .message-text {
            padding: 10px 12px;
            font-size: 14px;
            line-height: 1.4;
            border-radius: 16px;
            max-width: 100%;
          }

          .user-message .message-text {
            background: #007bff;
            color: #ffffff;
            border-radius: 16px 16px 4px 16px;
          }

          .bot-message .message-text {
            background: #f1f3f4;
            color: #374151;
            border-radius: 16px 16px 16px 4px;
            border: 1px solid #e5e7eb;
          }

          .dark-theme .bot-message .message-text {
            background: #2f2f2f;
            color: #ececec;
            border: 1px solid #404040;
          }

          .message-time {
            font-size: 10px;
            padding: 0 8px;
            margin-top: 2px;
          }

          .user-message .message-time {
            text-align: right;
          }

          .bot-message .message-time {
            text-align: left;
          }

          .typing-indicator {
            padding: 10px 12px;
            border-radius: 16px 16px 16px 4px;
            background: #f1f3f4;
          }

          .dark-theme .typing-indicator {
            background: #2f2f2f;
          }

          /* Thinking message mobile styles */
          .thinking-text {
            max-width: 95% !important;
            font-size: 11px !important;
            padding: 8px 12px !important;
          }

          /* Generated image styles for mobile */
          .generated-image-container {
            margin: 8px 0;
          }

          .generated-image {
            max-width: 100% !important;
            max-height: 250px !important;
            border-radius: 12px !important;
          }
        }

        /* Extra small mobile devices */
        @media (max-width: 480px) {
          .message-content {
            max-width: 98%;
          }

          .user-message .message-content {
            max-width: 90%;
          }

          .bot-message .message-content {
            max-width: 90%;
          }

          .message-text {
            padding: 8px 10px;
            font-size: 13px;
          }

          .thinking-text {
            max-width: 98% !important;
            font-size: 10px !important;
          }

          .generated-image {
            max-height: 200px !important;
          }
        }

      `}</style>
    </div>
  )
}
