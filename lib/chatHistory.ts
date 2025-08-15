export interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  isThinking?: boolean
  isThinkingHeader?: boolean
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

const STORAGE_KEY = 'jarvis_chat_history'

export class ChatHistoryManager {
  private static instance: ChatHistoryManager
  private sessions: ChatSession[] = []

  private constructor() {
    this.loadFromStorage()
  }

  public static getInstance(): ChatHistoryManager {
    if (!ChatHistoryManager.instance) {
      ChatHistoryManager.instance = new ChatHistoryManager()
    }
    return ChatHistoryManager.instance
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          this.sessions = parsed.map((session: any) => ({
            ...session,
            createdAt: new Date(session.createdAt),
            updatedAt: new Date(session.updatedAt),
            messages: session.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          }))
        }
      } catch (error) {
        console.error('Error loading chat history:', error)
        this.sessions = []
      }
    }
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.sessions))
      } catch (error) {
        console.error('Error saving chat history:', error)
      }
    }
  }

  public createNewSession(): ChatSession {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'Новый чат',
      messages: [{
        id: '1',
        text: 'Привет! Я ДЖАРВИС, ваш AI-помощник в мире веб-разработки. Чем могу помочь?',
        isUser: false,
        timestamp: new Date()
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.sessions.unshift(newSession)
    this.saveToStorage()
    return newSession
  }

  public getAllSessions(): ChatSession[] {
    return [...this.sessions].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  public getSession(sessionId: string): ChatSession | undefined {
    return this.sessions.find(session => session.id === sessionId)
  }

  public updateSession(sessionId: string, messages: Message[]): void {
    const sessionIndex = this.sessions.findIndex(session => session.id === sessionId)
    if (sessionIndex !== -1) {
      this.sessions[sessionIndex].messages = messages
      this.sessions[sessionIndex].updatedAt = new Date()

      // Auto-generate title from first user message
      if (this.sessions[sessionIndex].title === 'Новый чат' && messages.length > 1) {
        const firstUserMessage = messages.find(msg => msg.isUser)
        if (firstUserMessage) {
          this.sessions[sessionIndex].title = this.generateChatTitle(firstUserMessage.text)
        }
      }

      this.saveToStorage()
    }
  }

  public deleteSession(sessionId: string): void {
    this.sessions = this.sessions.filter(session => session.id !== sessionId)
    this.saveToStorage()
  }

  public clearAllHistory(): void {
    this.sessions = []
    this.saveToStorage()
  }

  private generateChatTitle(text: string): string {
    const words = text.trim().split(' ').slice(0, 6)
    let title = words.join(' ')
    if (text.length > 40) {
      title += '...'
    }
    return title || 'Новый чат'
  }

  public getOrCreateDefaultSession(): ChatSession {
    if (this.sessions.length === 0) {
      return this.createNewSession()
    }
    return this.sessions[0]
  }
}
