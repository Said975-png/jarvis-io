import fs from 'fs'
import path from 'path'

// Структура данных для обучения
export interface LearningInteraction {
  id: string
  timestamp: Date
  userMessage: string
  botResponse: string
  userFeedback: 'positive' | 'negative' | null
  context: string[]
  userId?: string
  sessionId: string
  tags: string[]
  isUseful: boolean | null
}

export interface LearningPattern {
  id: string
  pattern: string
  preferredResponse: string
  confidence: number
  usageCount: number
  successRate: number
  lastUsed: Date
  tags: string[]
}

export interface UserFeedback {
  interactionId: string
  rating: 'positive' | 'negative'
  comment?: string
  timestamp: Date
}

class LearningDatabase {
  private dataPath: string

  constructor() {
    this.dataPath = path.join(process.cwd(), 'data')
    this.ensureDataDirectory()
  }

  private ensureDataDirectory() {
    try {
      if (!fs.existsSync(this.dataPath)) {
        fs.mkdirSync(this.dataPath, { recursive: true })
      }
    } catch (error) {
      console.warn('Warning: Could not create data directory:', error)
      // Use a fallback temporary directory
      this.dataPath = path.join(process.cwd(), '.tmp')
      try {
        if (!fs.existsSync(this.dataPath)) {
          fs.mkdirSync(this.dataPath, { recursive: true })
        }
      } catch (fallbackError) {
        console.error('Critical: Cannot create any data directory')
        // Continue operation without file persistence
      }
    }
  }

  private getFilePath(filename: string): string {
    return path.join(this.dataPath, filename)
  }

  // Сохранение взаимодействия
  async saveInteraction(interaction: LearningInteraction): Promise<void> {
    try {
      console.log('=== SAVING TO FILE ===')
      console.log('Interaction object:', JSON.stringify(interaction, null, 2))

      const filePath = this.getFilePath('interactions.json')
      console.log('File path:', filePath)
      let interactions: LearningInteraction[] = []

      if (fs.existsSync(filePath)) {
        try {
          const data = fs.readFileSync(filePath, 'utf8')
          interactions = JSON.parse(data)
          console.log('Loaded existing interactions:', interactions.length)
        } catch (parseError) {
          console.error('Error parsing interactions.json, starting fresh:', parseError)
          interactions = []
        }
      } else {
        console.log('interactions.json does not exist, creating new')
      }

      // Убеждаемся что timestamp правильного типа
      const interactionToSave = {
        ...interaction,
        timestamp: interaction.timestamp instanceof Date ? interaction.timestamp : new Date(interaction.timestamp)
      }

      interactions.push(interactionToSave)
      console.log('Added interaction, total:', interactions.length)

      // Ограничиваем размер файла (последние 1000 взаимодействий)
      if (interactions.length > 1000) {
        interactions = interactions.slice(-1000)
      }

      fs.writeFileSync(filePath, JSON.stringify(interactions, null, 2))
      console.log('Successfully saved interactions to file')
    } catch (error) {
      console.error('Error saving interaction:', error)
      // Don't throw error - just log it so the application continues to work
    }
  }

  // Получение взаимодействий
  async getInteractions(limit: number = 100): Promise<LearningInteraction[]> {
    try {
      const filePath = this.getFilePath('interactions.json')
      
      if (!fs.existsSync(filePath)) {
        return []
      }

      const data = fs.readFileSync(filePath, 'utf8')
      const interactions: LearningInteraction[] = JSON.parse(data)
      
      return interactions
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit)
    } catch (error) {
      console.error('Error getting interactions:', error)
      return []
    }
  }

  // Сохранение обратной связи
  async saveFeedback(feedback: UserFeedback): Promise<void> {
    try {
      // Обновляем взаимодействие с обратной связью
      const interactions = await this.getInteractions(1000)
      const interactionIndex = interactions.findIndex(i => i.id === feedback.interactionId)
      
      if (interactionIndex !== -1) {
        interactions[interactionIndex].userFeedback = feedback.rating
        interactions[interactionIndex].isUseful = feedback.rating === 'positive'
        
        const filePath = this.getFilePath('interactions.json')
        fs.writeFileSync(filePath, JSON.stringify(interactions, null, 2))
      }

      // Сохраняем отдельно feedbacks
      const feedbackPath = this.getFilePath('feedbacks.json')
      let feedbacks: UserFeedback[] = []

      if (fs.existsSync(feedbackPath)) {
        const data = fs.readFileSync(feedbackPath, 'utf8')
        feedbacks = JSON.parse(data)
      }

      feedbacks.push({
        ...feedback,
        timestamp: new Date()
      })

      fs.writeFileSync(feedbackPath, JSON.stringify(feedbacks, null, 2))
    } catch (error) {
      console.error('Error saving feedback:', error)
    }
  }

  // Поиск похожих вопросов
  async findSimilarQuestions(userMessage: string, limit: number = 5): Promise<LearningInteraction[]> {
    try {
      const interactions = await this.getInteractions(500)
      const positiveInteractions = interactions.filter(i => i.userFeedback === 'positive')
      
      // Простой поиск по ключевым словам (можно улучшить с помощью ML)
      const messageWords = userMessage.toLowerCase().split(' ')
      const scored = positiveInteractions.map(interaction => {
        const interactionWords = interaction.userMessage.toLowerCase().split(' ')
        const commonWords = messageWords.filter(word => 
          word.length > 3 && interactionWords.includes(word)
        )
        
        return {
          interaction,
          score: commonWords.length / messageWords.length
        }
      })

      return scored
        .filter(item => item.score > 0.2)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.interaction)
    } catch (error) {
      console.error('Error finding similar questions:', error)
      return []
    }
  }

  // Получение паттернов для улучшения ответов
  async getLearningPatterns(): Promise<LearningPattern[]> {
    try {
      const filePath = this.getFilePath('patterns.json')
      
      if (!fs.existsSync(filePath)) {
        return []
      }

      const data = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error getting learning patterns:', error)
      return []
    }
  }

  // Анализ и создание паттернов из успешных взаимодействий
  async analyzeAndCreatePatterns(): Promise<void> {
    try {
      const interactions = await this.getInteractions(1000)
      const positiveInteractions = interactions.filter(i => i.userFeedback === 'positive')
      
      // Группируем похожие вопросы
      const patterns: { [key: string]: LearningInteraction[] } = {}
      
      positiveInteractions.forEach(interaction => {
        const key = this.extractKey(interaction.userMessage)
        if (!patterns[key]) {
          patterns[key] = []
        }
        patterns[key].push(interaction)
      })

      // Создаем паттерны для групп с множественными успешными ответами
      const learningPatterns: LearningPattern[] = []
      
      Object.entries(patterns).forEach(([key, interactionGroup]) => {
        if (interactionGroup.length >= 2) {
          const mostCommonResponse = this.findMostCommonResponse(interactionGroup)
          
          learningPatterns.push({
            id: Date.now().toString() + Math.random(),
            pattern: key,
            preferredResponse: mostCommonResponse,
            confidence: interactionGroup.length / positiveInteractions.length,
            usageCount: interactionGroup.length,
            successRate: 1.0, // Все взаимодействия положительные
            lastUsed: new Date(),
            tags: this.extractTags(key)
          })
        }
      })

      const filePath = this.getFilePath('patterns.json')
      fs.writeFileSync(filePath, JSON.stringify(learningPatterns, null, 2))
    } catch (error) {
      console.error('Error analyzing patterns:', error)
    }
  }

  private extractKey(message: string): string {
    // Простое извлечение ключевых слов (можно улучшить)
    return message
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .filter(word => word.length > 3)
      .slice(0, 3)
      .join(' ')
  }

  private findMostCommonResponse(interactions: LearningInteraction[]): string {
    const responses = interactions.map(i => i.botResponse)
    const responseCount: { [key: string]: number } = {}
    
    responses.forEach(response => {
      const key = response.substring(0, 100) // Первые 100 символов как ключ
      responseCount[key] = (responseCount[key] || 0) + 1
    })

    const mostCommon = Object.entries(responseCount)
      .sort(([,a], [,b]) => b - a)[0]
    
    return interactions.find(i => i.botResponse.startsWith(mostCommon[0]))?.botResponse || interactions[0].botResponse
  }

  private extractTags(text: string): string[] {
    const commonTags = [
      'веб-разработка', 'дизайн', 'программирование', 'ai', 'технологии',
      'фронтенд', 'бэкенд', 'react', 'javascript', 'typescript', 'css',
      'html', 'api', 'база данных', 'сеть', 'безопасность'
    ]
    
    return commonTags.filter(tag => 
      text.toLowerCase().includes(tag.toLowerCase())
    )
  }

  // Получение статистики обучения
  async getLearningStats(): Promise<{
    totalInteractions: number
    positiveRate: number
    negativeRate: number
    topTags: string[]
    patternsCount: number
  }> {
    try {
      const interactions = await this.getInteractions(1000)
      const patterns = await getLearningPatterns()
      
      const withFeedback = interactions.filter(i => i.userFeedback !== null)
      const positive = interactions.filter(i => i.userFeedback === 'positive').length
      const negative = interactions.filter(i => i.userFeedback === 'negative').length
      
      // Подсчет тегов
      const tagCount: { [key: string]: number } = {}
      interactions.forEach(i => {
        i.tags.forEach(tag => {
          tagCount[tag] = (tagCount[tag] || 0) + 1
        })
      })
      
      const topTags = Object.entries(tagCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([tag]) => tag)

      return {
        totalInteractions: interactions.length,
        positiveRate: withFeedback.length > 0 ? positive / withFeedback.length : 0,
        negativeRate: withFeedback.length > 0 ? negative / withFeedback.length : 0,
        topTags,
        patternsCount: patterns.length
      }
    } catch (error) {
      console.error('Error getting learning stats:', error)
      return {
        totalInteractions: 0,
        positiveRate: 0,
        negativeRate: 0,
        topTags: [],
        patternsCount: 0
      }
    }
  }
}

export const learningDB = new LearningDatabase()

// Экс��ортируем функции для использования в API
export const saveInteraction = (interaction: LearningInteraction) => learningDB.saveInteraction(interaction)
export const getInteractions = (limit?: number) => learningDB.getInteractions(limit)
export const saveFeedback = (feedback: UserFeedback) => learningDB.saveFeedback(feedback)
export const findSimilarQuestions = (message: string, limit?: number) => learningDB.findSimilarQuestions(message, limit)
export const getLearningPatterns = () => learningDB.getLearningPatterns()
export const analyzeAndCreatePatterns = () => learningDB.analyzeAndCreatePatterns()
export const getLearningStats = () => learningDB.getLearningStats()
