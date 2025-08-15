import type { NextApiRequest, NextApiResponse } from 'next'
import multer from 'multer'
import pdfParse from 'pdf-parse'

interface AnalyzePdfResponse {
  message: string
  error?: string
}

// Настройка multer для хранения файлов в памяти
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB лимит
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Только PDF файлы разрешены'))
    }
  }
})

// Функция для анализа PDF через GROQ API
async function analyzePdfContent(pdfText: string): Promise<string> {
  const groqApiKey = process.env.GROQ_API_KEY
  
  if (!groqApiKey) {
    throw new Error('GROQ API ключ не настроен')
  }

  const systemMessage = {
    role: 'system' as const,
    content: `Ты ДЖАРВИС - эксперт по анализу документов. Твоя задача - внимательно прочитать содержимое PDF файла и дать подробный анализ на русском языке.

📋 ЗАДАЧИ АНАЛИЗА:
- Определи тип документа (договор, отчет, инструкция, книга, статья и т.д.)
- Выдели основные разделы и темы
- Найди ключевую информацию (даты, числа, имена, суммы)
- Опиши главную идею или цель документа
- Отметь важные моменты и детали
- Если есть таблицы или списки - структурируй их
- Проверь на наличие контактной информации

💡 ФОРМАТ ОТВЕТА:
- Используй четкую структуру с эмодзи
- Пиши подробно но по существу
- Выделяй важную информацию
- НЕ используй markdown форматирование
- Отвечай ТОЛЬКО на русском языке

🎯 БУДЬ МАКСИМАЛЬНО ТОЧНЫМ И ПОЛЕЗНЫМ!`
  }

  const userMessage = {
    role: 'user' as const,
    content: `Проанализируй этот PDF документ и расскажи что в нем содержится:

${pdfText}`
  }

  const requestBody = {
    model: 'llama-3.1-8b-instant',
    messages: [systemMessage, userMessage],
    temperature: 0.2,
    max_tokens: 3000,
    top_p: 0.9
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })

  if (!response.ok) {
    throw new Error(`GROQ API ошибка: ${response.status}`)
  }

  const data = await response.json()
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Неверный ответ от GROQ API')
  }

  return data.choices[0].message.content
}

// Middleware для обработки файлов
function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnalyzePdfResponse>
) {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] === PDF ANALYSIS REQUEST ===`)

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      message: 'Метод не поддерживается', 
      error: 'Method not allowed' 
    })
  }

  try {
    // Обрабатываем загрузку файла
    await runMiddleware(req as any, res, upload.single('pdf'))
    
    const file = (req as any).file
    
    if (!file) {
      return res.status(400).json({ 
        message: 'PDF файл не найден', 
        error: 'No file uploaded' 
      })
    }

    console.log(`[${timestamp}] PDF file received:`, {
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    })

    // Извлекаем текст из PDF
    const pdfData = await pdfParse(file.buffer)
    const pdfText = pdfData.text

    console.log(`[${timestamp}] PDF text extracted:`, {
      pages: pdfData.numpages,
      textLength: pdfText.length,
      preview: pdfText.substring(0, 200) + '...'
    })

    if (!pdfText || pdfText.trim().length === 0) {
      return res.status(400).json({ 
        message: 'PDF файл пустой или не содержит текста', 
        error: 'Empty PDF content' 
      })
    }

    // Ограничиваем размер текста для API
    const maxTextLength = 15000 // Примерно 3000 токенов
    const truncatedText = pdfText.length > maxTextLength 
      ? pdfText.substring(0, maxTextLength) + '\n\n[Текст обрезан из-за ограничений размера...]'
      : pdfText

    // Анализируем через GROQ API
    const analysis = await analyzePdfContent(truncatedText)

    console.log(`[${timestamp}] PDF analysis completed:`, {
      analysisLength: analysis.length,
      preview: analysis.substring(0, 200) + '...'
    })

    const finalResponse = `📄 АНАЛИЗ PDF ДОКУМЕНТА "${file.originalname}"

${analysis}

📊 ИНФОРМАЦИЯ О ФАЙЛЕ:
• Страниц: ${pdfData.numpages}
• Размер: ${Math.round(file.size / 1024)} КБ
• Символов текста: ${pdfText.length.toLocaleString()}

✅ Анализ завершен! Задавайте дополнительные вопросы по содержимому.`

    return res.status(200).json({ message: finalResponse })

  } catch (error) {
    console.error(`[${timestamp}] PDF analysis error:`, error)
    
    const errorMessage = `Извините, произошла ошибка при анализе PDF файла! 😅

🔧 ВОЗМОЖНЫЕ ПРИЧИНЫ:
• Файл поврежден или защищен паролем
• PDF содержит только изображения без текста
• Размер файла слишком большой (лимит 10MB)
• Временная ошибка сервиса

💡 ПОПРОБУЙТЕ:
• Загрузить другой PDF файл
• Убедиться что файл не защищен
• Проверить что PDF содержит текст

Или задайте мне любые другие вопросы!`

    return res.status(500).json({ 
      message: errorMessage,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

// Отключаем стандартный парсер body для multer
export const config = {
  api: {
    bodyParser: false,
  },
}
