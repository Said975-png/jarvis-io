import { NextApiRequest, NextApiResponse } from 'next'

interface ImageRequest {
  prompt: string
  size?: string
  quality?: string
  style?: string
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

  const { prompt }: ImageRequest = req.body

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ 
      success: false, 
      error: 'Prompt is required and must be a string' 
    })
  }

  const deepaiApiKey = process.env.DEEPAI_API_KEY

  if (!deepaiApiKey) {
    console.error('❌ DeepAI API key not found')
    return res.status(500).json({ 
      success: false, 
      error: 'DeepAI API key not configured' 
    })
  }

  try {
    console.log(`🎨 Генерация изображения через DeepAI: "${prompt.substring(0, 50)}..."`)

    // Используем URLSearchParams для правильной отправки form data
    const formParams = new URLSearchParams()
    formParams.append('text', prompt)

    const response = await fetch('https://api.deepai.org/api/text2img', {
      method: 'POST',
      headers: {
        'api-key': deepaiApiKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formParams.toString()
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ DeepAI API Error: ${response.status} - ${errorText}`)

      if (response.status === 401) {
        if (errorText.includes('Out of API credits')) {
          return res.status(401).json({
            success: false,
            error: 'Лимит генерации изображений DeepAI исчерпан'
          })
        }
        return res.status(401).json({
          success: false,
          error: 'Invalid DeepAI API key'
        })
      } else if (response.status === 429) {
        return res.status(429).json({
          success: false,
          error: 'Rate limit exceeded. Please try again later.'
        })
      }

      return res.status(500).json({
        success: false,
        error: `DeepAI API error: ${response.status}`
      })
    }

    const data = await response.json()
    console.log('DeepAI Response:', data)
    
    if (data.output_url) {
      console.log('✅ Изображение успешно сгенерировано через DeepAI')
      
      return res.status(200).json({ 
        success: true, 
        imageUrl: data.output_url,
        message: 'Изображение успешно сгенерировано через DeepAI!'
      })
    } else {
      console.error('❌ No image data returned from DeepAI')
      return res.status(500).json({ 
        success: false, 
        error: 'No image generated' 
      })
    }

  } catch (error) {
    console.error('💥 Error generating image with DeepAI:', error)
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error while generating image' 
    })
  }
}
