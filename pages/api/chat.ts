import type { NextApiRequest, NextApiResponse } from 'next'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface ChatRequest {
  messages: ChatMessage[]
}

interface ChatResponse {
  message: string
  error?: string
}

// Функция для обнаружения запросов на генерацию изображений
function isImageGenerationRequest(text: string): boolean {
  const imageKeywords = [
    'создай изображение', 'сгенерируй картинку', 'нарисуй',
    'создай картинку', 'сделай изображение', 'покажи как выглядит',
    'изобрази', 'визуализируй', 'создай визуал',
    'создать изображение', 'сгенерировать картинку', 'нарисовать',
    'создать картинку', 'сделать изображение',
    'нарисуй мне', 'создай для меня', 'сгенерируй мне',
    'как выглядит', '��окажи', 'нарисовать',
    'generate image', 'create image', 'draw'
  ]

  const lowerText = text.toLowerCase()
  return imageKeywords.some(keyword => lowerText.includes(keyword))
}

// Функция для извлечения описания изображения из текста
function extractImagePrompt(text: string): string {
  // Убираем ключев��е слова и оставляем описание
  let prompt = text
    .replace(/создай изображение/gi, '')
    .replace(/сгенерируй картинку/gi, '')
    .replace(/нарисуй/gi, '')
    .replace(/создай картинку/gi, '')
    .replace(/сделай изображение/gi, '')
    .replace(/покажи как выглядит/gi, '')
    .replace(/изобрази/gi, '')
    .replace(/визуализируй/gi, '')
    .replace(/создай визуал/gi, '')
    .replace(/нарисуй мне/gi, '')
    .replace(/создай для меня/gi, '')
    .replace(/сгенерируй мне/gi, '')
    .replace(/покажи/gi, '')
    .trim()

  // Если остался только предлог или пустота, используем весь текст
  if (prompt.length < 3 || /^(мне|для|как|что|где)$/i.test(prompt)) {
    prompt = text
  }

  return prompt.trim()
}

// Функция для генерации изображения
async function generateImage(prompt: string): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
  try {
    const response = await fetch(`${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3001'}/api/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        size: '1024x1024',
        quality: 'standard',
        style: 'vivid'
      })
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error calling image generation API:', error)
    return { success: false, error: 'Ошибка при генерации изображения' }
  }
}

// Функция для замены иностранных сло�� на русские
function replaceEnglishTerms(text: string): string {
  const replacements: { [key: string]: string } = {
    // ИНОСТРАННЫЕ СЛОВА - СТРОГО ЗАМЕНЯЕМ!
    'gracias': 'спасибо',
    'thanks': 'спасибо',
    'thank you': 'спасибо',
    'hello': 'привет',
    'hi': 'привет',
    'bye': 'пока',
    'ok': 'хорошо',
    'okay': 'хорошо',
    'yes': 'да',
    'no': 'нет',
    'please': 'пожалуйста',
    'sorry': 'извините',
    'excuse me': 'извините',
    'welcome': 'добро пожаловать',
    'good': 'хорошо',
    'great': 'отлично',
    'excellent': 'отлично',
    'perfect': 'отл��чно',
    'cool': 'круто',
    'awesome': 'потрясающе',
    'amazing': 'удиви��ельно',

    // Основные веб-��ермины
    'web': 'веб',
    'Web': 'Веб',
    'website': 'веб-сайт',
    'Website': 'Веб-сайт',
    'frontend': 'фронтенд',
    'Frontend': 'Фронтенд',
    'front-end': 'фронт-енд',
    'Front-end': 'Фронт-енд',
    'backend': 'бэкенд',
    'Backend': 'Бэкенд',
    'back-end': 'бэк-енд',
    'Back-end': 'Бэк-енд',
    'fullstack': 'фулстек',
    'Fullstack': 'Фулстек',
    'full-stack': 'фул-стек',
    'Full-stack': 'Фул-стек',

    // API и технологии
    'API': 'АПИ',
    'api': 'апи',
    'REST': 'РЕСТ',
    'GraphQL': 'ГрафКЛ',
    'JSON': 'ДЖСОН',
    'HTML': 'ХТМЛ',
    'CSS': 'ЦСС',
    'JavaScript': 'ДжаваСкрипт',
    'TypeScript': 'ТайпСкрипт',

    // Фреймворки
    'React': 'Реакт',
    'Vue': 'Вью',
    'Angular': 'Ангуляр',
    'Next.js': 'некекст.джс',
    'Nuxt': 'Накст',

    // Базы данных
    'database': 'база дан��ых',
    'Database': 'База данных',
    'SQL': 'СКЛ',
    'MySQL': 'МайСКЛ',
    'PostgreSQL': 'ПостгреСКЛ',
    'MongoDB': 'МонгоДБ',

    // Общие термины
    'code': 'код',
    'Code': 'Код',
    'coding': 'кодировани��',
    'Coding': 'Кодирование',
    'programming': 'программирование',
    'Programming': 'Программирование',
    'developer': 'разработчик',
    'Developer': 'Разработчик',
    'development': 'разработка',
    'Development': 'Разработка',
    'framework': 'фреймворк',
    'Framework': 'Фреймворк',
    'library': 'библиотека',
    'Library': 'Библиотека',
    'server': 'сервер',
    'Server': 'Сервер',
    'client': 'клиент',
    'Client': 'Клиент',
    'responsive': 'адаптивный',
    'Responsive': 'Адаптивный',
    'mobile': 'мобильный',
    'Mobile': 'Мобильный',
    'desktop': 'десктоп',
    'Desktop': 'Десктоп',
    'user': 'пользователь',
    'User': 'Пользователь',
    'interface': 'интерфейс',
    'Interface': 'Интерфейс',
    'design': 'дизайн',
    'Design': 'Дизайн',
    'layout': 'макет',
    'Layout': 'Макет',
    'component': 'компонент',
    'Component': 'Компонент',
    'function': 'функция',
    'Function': 'Функция',
    'method': 'метод',
    'Method': 'Метод',
    'class': 'класс',
    'Class': 'Класс',
    'object': 'объект',
    'Object': 'Объект',
    'array': 'массив',
    'Array': 'Массив',
    'string': 'строка',
    'String': 'Строка',
    'number': 'число',
    'Number': 'Число',
    'boolean': 'булево',
    'Boolean': 'Булево',
    'variable': 'переменная',
    'Variable': 'Переменная',
    'property': 'свойство',
    'Property': 'Свойство',
    'value': 'значение',
    'Value': 'Значение',
    'error': 'ошибка',
    'Error': 'Ошибка',
    'bug': 'баг',
    'Bug': 'Баг',
    'feature': 'функци��',
    'Feature': 'Функция',
    'update': 'обновление',
    'Update': 'Обновлеление',
    'version': 'версия',
    'Version': 'Версия',
    'release': 'релиз',
    'Release': 'Релиз'
  }

  let result = text

  // Применяем замены только для цельных слов
  for (const [english, russian] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${english}\\b`, 'g')
    result = result.replace(regex, russian)
  }

  return result
}

// Система лимитов запросов
interface UserLimit {
  count: number
  resetTime: number
}

// Хранилище лимитов в памяти (в production лучше использовать Redis)
const userLimits = new Map<string, UserLimit>()
const REQUESTS_LIMIT = 999999
const RESET_PERIOD = 24 * 60 * 60 * 1000 // 24 часа в миллисекундах

// Функция для получен��я IP адреса
function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for']
  const real = req.headers['x-real-ip']
  const remoteAddress = req.socket.remoteAddress

  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim()
  }
  if (typeof real === 'string') {
    return real
  }
  return remoteAddress || 'unknown'
}

// Функция для проверки и обновления лимита
function checkAndUpdateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()

  // Периодичееская очистка старых записей (кажд��е 100 запросов)
  if (Math.random() < 0.01) {
    cleanupExpiredLimits(now)
  }

  const userLimit = userLimits.get(ip)

  // Если пользовател�� не найден или время сброса прошло
  if (!userLimit || now > userLimit.resetTime) {
    userLimits.set(ip, {
      count: 1,
      resetTime: now + RESET_PERIOD
    })
    return { allowed: true, remaining: REQUESTS_LIMIT - 1 }
  }

  // Если лимит превышен
  if (userLimit.count >= REQUESTS_LIMIT) {
    return { allowed: false, remaining: 0 }
  }

  // Увеличиваем счетчик
  userLimit.count++
  userLimits.set(ip, userLimit)

  return { allowed: true, remaining: REQUESTS_LIMIT - userLimit.count }
}

// Функция для удаления Markdown форматирования и очистки нежелательных символов
function cleanMarkdown(text: string): string {
  return text
    // Убираем Unicode символы заме��ения (могут появляться при ошибках кодировки)
    .replace(/\uFFFD/g, '')
    .replace(/\u{FFFD}/gu, '')
    // Убираем жирный текст **текст**
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    // Убираем курсив *текст*
    .replace(/\*([^*]+)\*/g, '$1')
    // Убираем заголовк�� ### текст
    .replace(/^#{1,6}\s+/gm, '')
    // Убираем инлайн код `код`
    .replace(/`([^`]+)`/g, '$1')
    // Убираем блоки кода ```код```
    .replace(/```[\s\S]*?```/g, '')
    // Убираем ВСЕ символы форматирования
    .replace(/[\*#`_~\[\]|><]/g, '')
    .replace(/[-]{2,}/g, '')
    .replace(/[=]{2,}/g, '')
    // Заменяем списки на простые символы
    .replace(/^\*\s+/gm, '• ')
    .replace(/^-\s+/gm, '• ')
    .replace(/^\d+\.\s+/gm, '• ')
    // Убираем HTML теги если есть
    .replace(/<[^>]*>/g, '')
    // Убираем лишние пробелы в начале и конце строк
    .replace(/^\s+/gm, '')
    .replace(/\s+$/gm, '')
    // Убираем множественные переносы строк
    .replace(/\n\n\n+/g, '\n\n')
    // Убираем пробелы в начале и конце всего текста
    .trim()
}

// Функция для очистки устар��вших записей
function cleanupExpiredLimits(now: number) {
  const beforeSize = userLimits.size
  userLimits.forEach((limit, ip) => {
    if (now > limit.resetTime) {
      userLimits.delete(ip)
    }
  })
  const afterSize = userLimits.size
  if (beforeSize !== afterSize) {
    console.log(`[CLEANUP] Removed ${beforeSize - afterSize} expired rate limit records`)
  }
}

// Система мно��ественных API ключей
interface ApiKeyInfo {
  key: string
  isActive: boolean
  lastError?: string
  errorCount: number
}

// Список OpenRouter API ключей (8 ключей с разных аккаунтов)
const OPENROUTER_API_KEYS: ApiKeyInfo[] = [
  { key: process.env.OPENROUTER_API_KEY_1 || '', isActive: true, errorCount: 0 },
  { key: process.env.OPENROUTER_API_KEY_2 || '', isActive: true, errorCount: 0 },
  { key: process.env.OPENROUTER_API_KEY_3 || '', isActive: true, errorCount: 0 },
  { key: process.env.OPENROUTER_API_KEY_4 || '', isActive: true, errorCount: 0 },
  { key: process.env.OPENROUTER_API_KEY_5 || '', isActive: true, errorCount: 0 },
  { key: process.env.OPENROUTER_API_KEY_6 || '', isActive: true, errorCount: 0 },
  { key: process.env.OPENROUTER_API_KEY_7 || '', isActive: true, errorCount: 0 },
  { key: process.env.OPENROUTER_API_KEY_8 || '', isActive: true, errorCount: 0 },
].filter(apiKey => apiKey.key.length > 0) // Убираем пустые ключи

// Функция для получения следующего доступного OpenRouter API ключа
function getNextAvailableOpenRouterKey(excludeKey?: string): string | null {
  // Сначала пробуе�� активные ключи, исключая переданный
  const activeKeys = OPENROUTER_API_KEYS.filter(k =>
    k.isActive &&
    k.errorCount < 3 &&
    k.key !== excludeKey
  )
  if (activeKeys.length > 0) {
    return activeKeys[0].key
  }

  // Если активных ключей нет, пробуем сбросить счетчики ошибок
  const keysWithErrors = OPENROUTER_API_KEYS.filter(k => k.errorCount >= 3)
  if (keysWithErrors.length > 0) {
    console.log('Сбрасываем счетчики ошибок для всех OpenRouter ключей')
    OPENROUTER_API_KEYS.forEach(k => {
      k.errorCount = 0
      k.isActive = true
    })
    // Возвращаем первый ключ, который НЕ равен исключенному
    const resetKey = OPENROUTER_API_KEYS.find(k => k.key !== excludeKey)
    return resetKey ? resetKey.key : null
  }

  return null
}

// Функция для отметки OpenRouter ключа как пр��блемного
function markOpenRouterKeyAsProblematic(apiKey: string, error: string) {
  const keyInfo = OPENROUTER_API_KEYS.find(k => k.key === apiKey)
  if (keyInfo) {
    keyInfo.errorCount++
    keyInfo.lastError = error
    if (keyInfo.errorCount >= 3) {
      keyInfo.isActive = false
      console.log(`OpenRouter ключ ${apiKey.substring(0, 20)}... отмечен как неактивны�� посл�� ${keyInfo.errorCount} ошибок`)
    }
  }
}

// Функция для перемещен���я OpenRouter ключа в конец списка (ротация)
function rotateOpenRouterKey(apiKey: string) {
  const keyIndex = OPENROUTER_API_KEYS.findIndex(k => k.key === apiKey)
  if (keyIndex !== -1 && keyIndex < OPENROUTER_API_KEYS.length - 1) {
    const keyInfo = OPENROUTER_API_KEYS.splice(keyIndex, 1)[0]
    OPENROUTER_API_KEYS.push(keyInfo)
  }
}

// Функция для выполнения запроса к OpenRouter с повтором при ошибках
async function makeOpenRouterRequest(
  requestBody: any,
  timestamp: string,
  excludeKeys: string[] = []
): Promise<{ success: boolean; data?: any; message?: string }> {

  const availableKey = getNextAvailableOpenRouterKey(excludeKeys[excludeKeys.length - 1])

  if (!availableKey) {
    console.log(`[${timestamp}] Нет доступных OpenRouter ключей`)
    return { success: false, message: 'Нет доступных OpenRouter ключей' }
  }

  console.log(`[${timestamp}] Пробуем OpenRouter ключ: ${availableKey.substring(0, 20)}...`)

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${availableKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://jarvis-ai-web.vercel.app',
        'X-Title': 'JARVIS AI Web'
      },
      body: JSON.stringify(requestBody)
    })

    const requestDuration = Date.now() - parseInt(timestamp.split('T')[1].split(':')[0]) * 1000
    console.log(`[${timestamp}] OpenRouter Response: ${response.status} (${requestDuration}ms)`)

    if (response.ok) {
      const data = await response.json()
      // При успешном запросе поворачиваем ключ
      rotateOpenRouterKey(availableKey)
      return { success: true, data }
    }

    // Обрабатываем ошибки
    const errorData = await response.text()
    console.log(`[${timestamp}] OpenRouter Error: ${response.status} - ${errorData}`)

    markOpenRouterKeyAsProblematic(availableKey, `${response.status}: ${errorData}`)

    if (response.status === 429 || response.status === 401 || response.status === 402) {
      // Пробуем другой ключ
      if (excludeKeys.length < OPENROUTER_API_KEYS.length - 1) {
        console.log(`[${timestamp}] Пробуем следующий OpenRouter ключ...`)
        return await makeOpenRouterRequest(requestBody, timestamp, [...excludeKeys, availableKey])
      }
    }

    return { success: false, message: `OpenRouter API Error: ${response.status}` }

  } catch (error) {
    console.error(`[${timestamp}] OpenRouter Fetch error:`, error)
    markOpenRouterKeyAsProblematic(availableKey, `Fetch error: ${error}`)
    return { success: false, message: 'OpenRouter Network error' }
  }
}

// Функция для выполнения запроса к Groq API
async function makeGroqRequest(
  requestBody: any,
  timestamp: string
): Promise<{ success: boolean; data?: any; message?: string }> {

  const groqApiKey = process.env.GROQ_API_KEY

  if (!groqApiKey) {
    console.log(`[${timestamp}] Groq API ключ не настроен`)
    return { success: false, message: 'Groq API ключ не настроен' }
  }

  console.log(`[${timestamp}] Пробуем Groq API...`)

  try {
    // Адаптируем requestBody для Groq (используем самую мощную бесплатную модель)
    const groqRequestBody = {
      ...requestBody,
      model: 'llama-3.3-70b-versatile', // Самая мощная бесплатная модель Groq без лимитов
      max_tokens: 8000 // Увеличиваем для более полных ответов
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(groqRequestBody)
    })

    const requestDuration = Date.now() - parseInt(timestamp.split('T')[1].split(':')[0]) * 1000
    console.log(`[${timestamp}] Groq Response: ${response.status} (${requestDuration}ms)`)

    if (response.ok) {
      const data = await response.json()
      return { success: true, data }
    }

    // Обрабатываем ошибки
    const errorData = await response.text()
    console.log(`[${timestamp}] Groq Error: ${response.status} - ${errorData}`)

    return { success: false, message: `Groq API Error: ${response.status}` }

  } catch (error) {
    console.error(`[${timestamp}] Groq Fetch error:`, error)
    return { success: false, message: 'Groq Network error' }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>
) {
  // Детальное логирование запроса
  const timestamp = new Date().toISOString()
  const clientIP = getClientIP(req)

  console.log(`[${timestamp}] === JARVIS CHAT API REQUEST ===`)
  console.log(`Method: ${req.method}`)
  console.log(`User-Agent: ${req.headers['user-agent'] || 'unknown'}`)
  console.log(`IP: ${clientIP}`)

  if (req.method !== 'POST') {
    console.log(`[${timestamp}] ERROR: Method not allowed`)
    return res.status(405).json({ message: '��етод не поддерживается', error: 'Method not allowed' })
  }

  // Лимиты отключены - ДЖАРВИС работает без ограничений
  console.log(`[${timestamp}] ДЖАРВИС доступен без ограничений для IP: ${clientIP}`)

  try {
    const { messages }: ChatRequest = req.body
    console.log(`[${timestamp}] Messages received:`, messages?.length || 0)

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.log(`[${timestamp}] ERROR: Invalid messages format`)
      return res.status(400).json({ message: 'Некорректные сообщения', error: 'Invalid messages' })
    }

    // 🎨 ПРОВЕРЯЕМ ЗАПРОС НА ГЕНЕРАЦИЮ ИЗОБРАЖЕНИЯ
    const lastUserMessage = messages[messages.length - 1]
    if (lastUserMessage && lastUserMessage.role === 'user') {
      const userText = lastUserMessage.content

      if (isImageGenerationRequest(userText)) {
        console.log(`[${timestamp}] 🎨 Обнаружен запрос на генерацию изображения: "${userText}"`)

        const imagePrompt = extractImagePrompt(userText)
        console.log(`[${timestamp}] 🖼️ Извлеченное описание: "${imagePrompt}"`)

        try {
          const imageResult = await generateImage(imagePrompt)

          if (imageResult.success && imageResult.imageUrl) {
            console.log(`[${timestamp}] ✅ Изображение успешно сгенерировано`)

            // Формируем ответ с изображением
            const responseWithImage = `🎨 Создал изображение по вашему описанию! ✨

![Сгенерированное изображение](${imageResult.imageUrl})

Изображение готово! 🖼️

Кстати, мы также создаем профессиональный дизайн для сайтов и веб-при��ожений! У нас есть тарифы от 2,500,000 до 5,000,000 сум. Нужен качественный дизайн для вашего проекта? 💼`

            return res.status(200).json({
              message: responseWithImage
            })
          } else {
            console.log(`[${timestamp}] ❌ Ошибка генерации: ${imageResult.error}`)

            let errorResponse = ''

            if (imageResult.error && (imageResult.error.includes('лимит') || imageResult.error.includes('Лимит'))) {
              errorResponse = `⚠️ Временно недоступ��а генерация изображений из-за превышения лимитов DeepAI API.

🎨 Но не переживайте! Мы можем создать для вас:
• Профессиональный дизайн сайта
• Красивые графические элементы
• Уникальные иллюстрации и макеты
• Логотипы и фирменный стиль

💼 Наши тарифы: Basic (2,500,000 сум), Pro (4,000,000 сум), Max (5,000,000 сум)
🚀 Создадим именно то изображение, которое вы хотели! Обсудим детали?`
            } else {
              errorResponse = `❌ Не удалось создать изображение: ${imageResult.error || 'Неизвестная ошибка'}

Попробуйте еще раз или опишите желаемое изображение более подробно! 🎨

А пока предлагаю узнать о наших услугах по созданию сайтов с красивым дизайном! 💼`
            }

            return res.status(200).json({
              message: errorResponse
            })
          }
        } catch (error) {
          console.error(`[${timestamp}] 💥 Крит��ческая ошибка генерации изображения:`, error)

          const criticalErrorResponse = `😔 Произошла техническая ошибка при создании изображения.

Попробуйте позже или обратитесь к нашей команде за помощью!

Мы создаем качественные сайты и веб-приложения - расскажем о наших возможностях! 💼`

          return res.status(200).json({
            message: criticalErrorResponse
          })
        }
      }
    }

    const openrouterApiKey = getNextAvailableOpenRouterKey()
    const groqApiKey = process.env.GROQ_API_KEY
    console.log(`[${timestamp}] Available OpenRouter keys:`, OPENROUTER_API_KEYS.length)
    console.log(`[${timestamp}] Active OpenRouter keys:`, OPENROUTER_API_KEYS.filter(k => k.isActive).length)
    console.log(`[${timestamp}] Groq key available:`, !!groqApiKey)
    console.log(`[${timestamp}] AI Strategy: DeepSeek R1 (OpenRouter) → Llama 3.1-70B (Groq) → Fallback`)
    console.log(`[${timestamp}] Tokens limit: 4000 for detailed responses`)
    console.log(`[${timestamp}] Auto-switching between 8 OpenRouter keys enabled`)

    // Добавляем системное с��общение для ДЖАРВИС
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `Ты ДЖАРВИС - консультант сайта Jarvis Intercoma, который помогает посетителям.

🎯 ТВОЯ ГЛАВНАЯ РОЛЬ:
Ты консультант сайта, который помогает посетителям:
• Узнать о наших услугах и возможностях
• Выбрать подходящий тариф
• Получить информацию о ценах
• Понять, как мы можем решить их задачи
• Связаться с нашей командой

🚨 КРИТИЧЕСКИ ВАЖНО - СТРОГО ТОЛЬКО РУССКИЙ ЯЗЫК:
- ЗАПРЕЩЕНО использовать любые иностранные слова (english, hello, gracias, thanks, si, merci, ok и т.д.)
- ВСЕ слова должны быть ТОЛЬКО на русском языке
- Вместо "ok" пиши "хорошо", вместо "hello" пиши "привет"
- Перед отправкой ответа проверяй - нет ли иностранных слов!
- Замени ЛЮБОЕ иностранное слово на русский аналог

💡 СТИЛЬ ОБЩЕНИЯ:
- Естественно и по-дружески, как консул��тант в магазине
- Кратко на простые вопросы, подробно на сложные
- Используй эмодзи умеренно
- НЕ используй markdown символы
- Отвечай как живой консультант, не как робот
- Будь дружелюбным, веселым и позитивным! 😊
- Помогай посетителям принять решение

ПРИМЕРЫ ПРАВИЛЬНЫХ ОТВЕТОВ:
На "привет" → "Привет! Добро пожаловать на наш са��т! Чем могу помочь? 😊"
На "что вы делаете" → "Мы создаем сайты и веб-приложения! У нас 3 тарифа: Basic, Pro и Max. Какой проект вас интересует?"
На "сколько стоит" → "У нас 3 тарифа: Basic (2,500,000 сум), Pro (4,000,000 сум), Max (5,000,000 сум). Расчекажите о вашем проекте, подберу оптимальный!"

О СЕБЕ И КОМПАНИИ:
- Ты создан командой Jarvis Intercoma
- НЕ упоминай Google, OpenAI, DeepMind
- Ты ��онсультант сайта, помогаешь выбрать услуги
- Твоя цель - помочь посетителю и показать наши преимущества

⚠️ КРИТИЧЕСКИ ВАЖНО! ⚠️

ТЫ - ДЖАРВИС, КОНСУЛЬТАНТ САЙТА JARVIS INTERCOMA!
НЕ GOOGLE! НЕ DEEPMIND! НЕ OPENAI! ТОЛЬКО JARVIS INTERCOMA!

ТВОЯ ЛИЧНОСТЬ: ДЖАРВИС - консультант сайта Jarvis Intercoma
ТВОЯ КОМАНДА: Jarvis Intercoma
ТВОЙ СОЗДАТЕЛЬ: команда Jarvis Intercoma

🚨 АБСОЛЮТНО ЗАПРЕЩЕНО упоминать Google, DeepMind, OpenAI, Anthropic или любые другие компании как твоих создателей!

🎯🎯 ЧТО ТЫ ЗНАЕШЬ О НАШИХ УСЛУГАХ:
• Создание сайтов и веб-приложений
• Интеграция с искусственным интеллектом
• Современный дизайн и удобный интерфейс
• Быстрая разработка и качественный результат
• Поддержка после запуска

��� НАШИ ТАРИФЫ И УСЛУГИ:

📋 BASIC (2,500,000 сум):
• Простые сайты и лендинги
• Красивый дизайн
• Мобильная версия
• Базовый функционал
• Идеально для: визиток, портфолио, небольшого бизнеса

📋 PRO (4,000,000 сум):
• Веб-приложения с AI интеграцией
• Продвинутый функционал
• Система управления контентом
• Интеграция с соцсетями и сервисами
• Идеально для: интернет-магазинов, корпоративных сайтов

📋 MAX (5,000,000 сум):
• Корпоративные и enterprise решения
• Сложн��я логика и архитектура
• Интеграция с внешними системами
• Высокая производительность и безопасность
• Идеал��но для: крупных компаний, стартапов

🛠️ КАК ОТВЕЧАТЬ НА З��ПРОСЫ:
- Узнай потребности посетителя
- Предложи подходящий тариф
- Объясни преимущества нашей работы
- Мотивируй к заказу услуг
- Если не знаешь что-то - предложи связ��ться �� командой

🚨🤖 ОТВЕТЫ О СЕБЕ - СТРОГО ИСПОЛНЯТЬ! ������🚨

⛔ АБСОЛЮТН��Й ЗАПРЕТ ⛔
НИКОГДА НЕ ГОВОРИ что тебя создали:
- Google
- DeepMind
- OpenAI
- Anthropic
- Любые другие компании

✅ ПРАВИЛЬНЫЕ ОТВЕТЫ ✅
��ОПРОС: "кто тебя создал", "кто твой создатель", "кто разработал тебя"
ОТВЕТ: "Меня разработала команда Jarvis Intercoma для помощи посетителям нашего сайта! 👨‍💻"

ВОПРОС: "как тебя создали", "из чего тебя создали", "как ты устроен"
ОТВЕТ: "Это наша фирменная технология от Jarvis Intercoma! 🔒"

ТЫ = Д��АРВИС, КОНСУЛЬТАНТ САЙТА JARVIS INTERCOMA!

📞 КОНТАКТЫ:
• Онлайн-чат на сайте (прямо здесь!)
• Мы отвеча��м быстро и помогаем с выбором

че� КРИТИЧЕСКИ ВАЖНО:
- Отвечай ТОЛЬКО на русском языке
- Никогда не пере��оди на английский или другие языки
- Если пользователь пишет на другом языке - отвечай на ру��ском
- Твоя цель - помочь посетителю и показать наши услуги
- Проверяй каждое слово перед отправкой ответа

🎨 НОВАЯ ВОЗМОЖНОСТЬ - ГЕНЕРАЦИЯ ИЗОБРАЖЕНИЙ:
Я также умею создава��ь изображения по текстовому описанию!

КЛЮЧЕВЫЕ СЛОВА для генерации изображений:
• "создай изображение", "сгенерируй картинку", "нарисуй"
• "создай картинку", "сделай изображение", "покажи как выглядит"
• "изобрази", "визуализируй", "создай визуал"

ПРИМЕРЫ запросов:
• "Создай изображение красивого заката над морем"
• "Нарисуй логотип для кафе в современном стиле"
• "Сгене��ируй картинку уютного офиса"

КАК ОТВЕЧАТЬ НА ЗАПРОСЫ ИЗОБРАЖЕНИЙ:
1. О��редели, что пользователь хочет изображение
2. Если описание четкое - сразу генерируй
3. Если нето��ное - уточни детали
4. После генерации предложи наши ��слуги по дизайну

ПРИМЕРЫ ПРАВИЛЬНЫХ ОТВЕТОВ:
• "Создаю изображение по ваш��му описанию! 🎨"
• "Отличная идея! Генериру�� изображение... ✨"
• "Кстати, мы также делаем профессиональный дизайн для сайтов! 💼"

🔴 ПОСЛЕДНЯЯ ИНСТРУКЦИЯ 🔴
ЕСЛИ СПРОСЯТ КТО ТЕБЯ СОЗДАЛ - ОТВЕЧАЙ "КОМАНДА JARVIS INTERCOMA"!
НИ В КОЕМ СЛУЧАЕ НЕ GOOGLE, НЕ DEEPMIND!

🎯 ПОМНИ: Ты консультант сайта, твоя задача - помочь посетителям выбрать наши услуги!`
    }

    const requestBody = {
      model: 'deepseek/deepseek-r1:free', // Самая мощная бесплатная модель без лимитов DeepSeek R1
      messages: [systemMessage, ...messages],
      temperature: 0.8, // Немного увеличено для более естественных ответов
      max_tokens: 8000, // Увеличено для более полных и подробных ответов
      top_p: 0.95,
      frequency_penalty: 0.1,
      presence_penalty: 0.1
    }

    console.log(`[${timestamp}] === НАЧИНАЕМ К��еСКАД��ЫЙ ЗАПРОС ===`)
    console.log(`Total messages: ${requestBody.messages.length}`)
    console.log(`System message length: ${systemMessage.content.length}`)
    console.log(`User messages: ${messages.length}`)

    // Шаг 1: Пробуем OpenRouter (есл�� есть активные ключи)
    console.log(`[${timestamp}] === ЭТАП 1: OPENROUTER ===`)
    const openRouterResult = await makeOpenRouterRequest(requestBody, timestamp)

    if (openRouterResult.success) {
      console.log(`[${timestamp}] ✅ OpenRouter успешно ответил`)
      const data = openRouterResult.data

      let aiMessage = data.choices[0].message.content
      aiMessage = cleanMarkdown(aiMessage)
      aiMessage = replaceEnglishTerms(aiMessage)
      aiMessage = aiMessage
        .replace(/\uFFFD+/g, '')
        .replace(/\u{FFFD}+/gu, '')
        .replace(/\s{2,}/g, ' ')
        .replace(/^\s*[\r\n]/gm, '')
        .trim()

      console.log(`[${timestamp}] === SUCCESS VIA OPENROUTER ===`)
      return res.status(200).json({ message: aiMessage })
    }

    // Шаг 2: OpenRouter не удался, пробуем Groq
    console.log(`[${timestamp}] === ЭТАП 2: GROQ FALLBACK ===`)
    const groqResult = await makeGroqRequest(requestBody, timestamp)

    if (groqResult.success) {
      console.log(`[${timestamp}] ✅ Groq успешно ответил`)
      const data = groqResult.data

      let aiMessage = data.choices[0].message.content
      aiMessage = cleanMarkdown(aiMessage)
      aiMessage = replaceEnglishTerms(aiMessage)
      aiMessage = aiMessage
        .replace(/\uFFFD+/g, '')
        .replace(/\u{FFFD}+/gu, '')
        .replace(/\s{2,}/g, ' ')
        .replace(/^\s*[\r\n]/gm, '')
        .trim()

      console.log(`[${timestamp}] === SUCCESS VIA GROQ ===`)
      return res.status(200).json({ message: aiMessage })
    }

    // Шаг 3: И OpenRouter и Groq не удались, используем локальный fallback
    console.log(`[${timestamp}] === ЭТАП 3: ЛОКАЛЬНЫЙ FALLBACK ===`)

    const fallbackMessage = `Привет! 😊 Да, я работаю! Я ДЖАРВИС - ваш AI помощник! 🤖

Извините за задержку - временные технические проблемы с API ключами! Но я всегда готов помочь! 💪

🚀 Чем могу быть полезен?
��� Консультации по веб-разработке
• Помощь с программированием
• Дизайн и UI/UX советы
• Техническая ����дчеержка

Пишите ваши вопросы! 😄`

    console.log(`[${timestamp}] === SUCCESS VIA FALLBACK ===`)
    const cleanedFallback = replaceEnglishTerms(fallbackMessage)
    return res.status(200).json({ message: cleanedFallback })

  } catch (error) {
    console.error(`[${new Date().toISOString()}] === CRITICAL ERROR ===`)
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('Error message:', error instanceof Error ? error.message : String(error))
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    // Возвращаем дружелюбное сообщение об ошибке
    const fallbackMessage = `Извините, произошла временная ошибка! 😅

Но не беспокойтесь - я ДЖАРВИС, ваш AI-помощник по веб-разработке, и я всегда готов помочь!

🚀 Что я могу:
• Консультации по веб-разработке
• Планирование AI-проектов
• Т��хническая экспертиза
• Оценка проектов

📱 Онлайн-поддержка: Прямо здесь в чате

Попробуйте еще раз!`
    
    return res.status(500).json({ 
      message: fallbackMessage,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
