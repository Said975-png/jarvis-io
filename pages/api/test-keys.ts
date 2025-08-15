import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const keys = [
      process.env.OPENROUTER_API_KEY_1,
      process.env.OPENROUTER_API_KEY_2,
      process.env.OPENROUTER_API_KEY_3,
      process.env.OPENROUTER_API_KEY_4,
      process.env.OPENROUTER_API_KEY_5,
      process.env.OPENROUTER_API_KEY_6,
      process.env.OPENROUTER_API_KEY_7,
      process.env.OPENROUTER_API_KEY_8,
    ].filter(key => key && key.length > 0)

    const groqKey = process.env.GROQ_API_KEY

    // Test one OpenRouter key
    if (keys.length > 0) {
      const testResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${keys[0]}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://jarvis-ai-web.vercel.app',
          'X-Title': 'JARVIS AI Web Test'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [{ role: 'user', content: 'Привет! Ты работаешь?' }],
          max_tokens: 50
        })
      })

      const testResult = await testResponse.json()
      
      return res.status(200).json({
        success: true,
        openrouter_keys: keys.length,
        groq_key: !!groqKey,
        test_response: testResponse.ok,
        test_data: testResponse.ok ? 'Connection successful' : testResult
      })
    }

    return res.status(200).json({
      success: false,
      openrouter_keys: 0,
      groq_key: !!groqKey,
      error: 'No OpenRouter keys configured'
    })

  } catch (error) {
    console.error('Test keys error:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
