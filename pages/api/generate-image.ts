import { NextApiRequest, NextApiResponse } from 'next'

interface ImageRequest {
  prompt: string
  size?: '1024x1024' | '1792x1024' | '1024x1792'
  quality?: 'standard' | 'hd'
  style?: 'vivid' | 'natural'
}

interface ImageResponse {
  success: boolean
  imageUrl?: string
  error?: string
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ImageResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { prompt, size = '1024x1024', quality = 'standard', style = 'vivid' }: ImageRequest = req.body

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ 
      success: false, 
      error: 'Prompt is required and must be a string' 
    })
  }

  const openaiApiKey = process.env.OPENAI_API_KEY

  if (!openaiApiKey) {
    console.error('❌ OpenAI API key not found')
    return res.status(500).json({ 
      success: false, 
      error: 'OpenAI API key not configured' 
    })
  }

  try {
    console.log(`🎨 Генерация изображения: "${prompt.substring(0, 50)}..."`)
    console.log(`📐 Параметры: ${size}, ${quality}, ${style}`)

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: size,
        quality: quality,
        style: style
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error(`❌ OpenAI API Error: ${response.status} - ${errorData}`)
      
      if (response.status === 401) {
        return res.status(401).json({
          success: false,
          error: 'Invalid OpenAI API key'
        })
      } else if (response.status === 429) {
        return res.status(429).json({
          success: false,
          error: 'Rate limit exceeded. Please try again later.'
        })
      } else if (response.status === 400) {
        // Проверяем специфичные ошибки биллинга
        try {
          const errorData = await response.json()
          if (errorData.error?.code === 'billing_hard_limit_reached') {
            return res.status(400).json({
              success: false,
              error: 'Лимит генерации изображений исчерпан. Обратитесь к администратору для пополнения баланса.'
            })
          }
        } catch (e) {
          // Игнорируем ошибки парсинга JSON
        }

        return res.status(400).json({
          success: false,
          error: 'Некорректный запрос или параметры генерации'
        })
      }
      
      return res.status(500).json({ 
        success: false, 
        error: `OpenAI API error: ${response.status}` 
      })
    }

    const data = await response.json()
    
    if (data.data && data.data.length > 0) {
      const imageUrl = data.data[0].url
      console.log('✅ Изображение успешно сгенерировано')
      
      return res.status(200).json({ 
        success: true, 
        imageUrl: imageUrl,
        message: 'Изображение успешно сгенерировано!'
      })
    } else {
      console.error('❌ No image data returned from OpenAI')
      return res.status(500).json({ 
        success: false, 
        error: 'No image generated' 
      })
    }

  } catch (error) {
    console.error('💥 Error generating image:', error)
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error while generating image' 
    })
  }
}
