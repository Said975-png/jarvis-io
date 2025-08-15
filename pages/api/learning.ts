import type { NextApiRequest, NextApiResponse } from 'next'
import { saveInteraction, saveFeedback, findSimilarQuestions, getLearningStats, analyzeAndCreatePatterns, LearningInteraction, UserFeedback } from '../../lib/learningDatabase'

interface LearningApiResponse {
  success: boolean
  message?: string
  data?: any
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LearningApiResponse>
) {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] === LEARNING API REQUEST ===`)
  console.log(`Method: ${req.method}`)
  console.log(`Action: ${req.query.action || req.body?.action}`)

  try {
    switch (req.method) {
      case 'POST':
        return await handlePost(req, res)
      case 'GET':
        return await handleGet(req, res)
      default:
        return res.status(405).json({
          success: false,
          error: 'Method not allowed'
        })
    }
  } catch (error) {
    console.error(`[${timestamp}] Learning API Error:`, error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse<LearningApiResponse>) {
  const { action } = req.body

  switch (action) {
    case 'save_interaction':
      return await saveInteractionHandler(req, res)
    case 'save_feedback':
      return await saveFeedbackHandler(req, res)
    case 'analyze_patterns':
      return await analyzePatternsHandler(req, res)
    default:
      return res.status(400).json({
        success: false,
        error: 'Invalid action'
      })
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse<LearningApiResponse>) {
  const { action } = req.query

  switch (action) {
    case 'similar_questions':
      return await findSimilarHandler(req, res)
    case 'stats':
      return await getStatsHandler(req, res)
    default:
      return res.status(400).json({
        success: false,
        error: 'Invalid action'
      })
  }
}

async function saveInteractionHandler(req: NextApiRequest, res: NextApiResponse<LearningApiResponse>) {
  try {
    console.log('=== SAVE INTERACTION DEBUG ===')
    console.log('Request body:', JSON.stringify(req.body, null, 2))

    const { userMessage, botResponse, sessionId, context = [], tags = [] } = req.body

    console.log('Extracted fields:')
    console.log('- userMessage:', userMessage)
    console.log('- botResponse:', botResponse)
    console.log('- sessionId:', sessionId)

    // Более детальная валидация
    const isValidString = (str: any) => typeof str === 'string' && str.trim().length > 0

    if (!isValidString(userMessage) || !isValidString(botResponse) || !isValidString(sessionId)) {
      console.log('VALIDATION FAILED: Missing or invalid required fields')
      console.log('- userMessage valid:', isValidString(userMessage), typeof userMessage, userMessage)
      console.log('- botResponse valid:', isValidString(botResponse), typeof botResponse, botResponse)
      console.log('- sessionId valid:', isValidString(sessionId), typeof sessionId, sessionId)

      return res.status(400).json({
        success: false,
        error: `Missing or invalid required fields. userMessage: ${isValidString(userMessage)}, botResponse: ${isValidString(botResponse)}, sessionId: ${isValidString(sessionId)}`
      })
    }

    const interaction: LearningInteraction = {
      id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      userMessage: userMessage.trim(),
      botResponse: botResponse.trim(),
      userFeedback: null,
      context: Array.isArray(context) ? context : [],
      sessionId,
      tags: Array.isArray(tags) ? tags : [],
      isUseful: null
    }

    await saveInteraction(interaction)

    console.log(`Saved interaction: ${interaction.id}`)

    return res.status(200).json({
      success: true,
      message: 'Interaction saved successfully',
      data: { interactionId: interaction.id }
    })
  } catch (error) {
    console.error('Error saving interaction:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to save interaction'
    })
  }
}

async function saveFeedbackHandler(req: NextApiRequest, res: NextApiResponse<LearningApiResponse>) {
  try {
    const { interactionId, rating, comment } = req.body

    if (!interactionId || !rating) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: interactionId, rating'
      })
    }

    if (!['positive', 'negative'].includes(rating)) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be "positive" or "negative"'
      })
    }

    const feedback: UserFeedback = {
      interactionId,
      rating,
      comment: comment || '',
      timestamp: new Date()
    }

    await saveFeedback(feedback)

    console.log(`Saved feedback for interaction: ${interactionId} - ${rating}`)

    // Периодически анализируем паттерны
    if (Math.random() < 0.1) { // 10% вероятность
      console.log('Triggering pattern analysis...')
      await analyzeAndCreatePatterns()
    }

    return res.status(200).json({
      success: true,
      message: 'Feedback saved successfully'
    })
  } catch (error) {
    console.error('Error saving feedback:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to save feedback'
    })
  }
}

async function findSimilarHandler(req: NextApiRequest, res: NextApiResponse<LearningApiResponse>) {
  try {
    const { message, limit = 5 } = req.query

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message parameter is required'
      })
    }

    const similarQuestions = await findSimilarQuestions(message, Number(limit))

    return res.status(200).json({
      success: true,
      data: {
        similar: similarQuestions.map(interaction => ({
          id: interaction.id,
          question: interaction.userMessage,
          response: interaction.botResponse,
          timestamp: interaction.timestamp,
          feedback: interaction.userFeedback
        }))
      }
    })
  } catch (error) {
    console.error('Error finding similar questions:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to find similar questions'
    })
  }
}

async function getStatsHandler(req: NextApiRequest, res: NextApiResponse<LearningApiResponse>) {
  try {
    const stats = await getLearningStats()

    return res.status(200).json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Error getting learning stats:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to get learning stats'
    })
  }
}

async function analyzePatternsHandler(req: NextApiRequest, res: NextApiResponse<LearningApiResponse>) {
  try {
    await analyzeAndCreatePatterns()

    return res.status(200).json({
      success: true,
      message: 'Pattern analysis completed'
    })
  } catch (error) {
    console.error('Error analyzing patterns:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to analyze patterns'
    })
  }
}
