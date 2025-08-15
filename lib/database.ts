import crypto from 'crypto'

// Типы для глобального хранилища
declare global {
  var usersStore: User[] | undefined
}

export interface User {
  id: string
  email: string
  name: string
  password: string
  createdAt: string
  lastLogin?: string
}

export interface PublicUser {
  id: string
  email: string
  name: string
  createdAt: string
  lastLogin?: string
}

// In-memory storage for Vercel (since filesystem is read-only)
// Используем глобальную переменную чтобы избежать сброса при hot-reload
if (!global.usersStore) {
  global.usersStore = [
    // Default admin user
    {
      id: 'admin-001',
      email: 'admin@jarvis.ai',
      name: 'JARVIS Admin',
      password: hashPassword('jarvis2024'),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    },
    // Main admin user
    {
      id: 'admin-002',
      email: 'saidhusainov415@gmail.com',
      name: 'Said Husainov',
      password: hashPassword('Laky06451'),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    },
    // User lakywar
    {
      id: 'user-003',
      email: 'lakywar@gmail.com',
      name: 'Lakywar',
      password: hashPassword('Laky06451'),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }
  ]
}

let usersStore: User[] = global.usersStore

// Hash password
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// Generate user ID
function generateUserId(): string {
  return crypto.randomUUID()
}

// Create new user
export function createUser(email: string, name: string, password: string): PublicUser {
  // Check if user already exists
  if (usersStore.find(user => user.email === email.toLowerCase())) {
    throw new Error('Пользователь с таким email уже существует')
  }

  const newUser: User = {
    id: generateUserId(),
    email: email.toLowerCase(),
    name,
    password: hashPassword(password),
    createdAt: new Date().toISOString()
  }

  usersStore.push(newUser)
  global.usersStore = usersStore // Обновляем глобальное хранилище
  console.log('Пользователь создан:', email, 'Всего пользователей:', usersStore.length)

  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser
  return userWithoutPassword as PublicUser
}

// Find user by email
export function findUserByEmail(email: string): User | null {
  return usersStore.find(user => user.email === email.toLowerCase()) || null
}

// Find user by ID
export function findUserById(id: string): PublicUser | null {
  const user = usersStore.find(user => user.id === id)
  if (user) {
    // Return user without password
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword as PublicUser
  }
  return null
}

// Verify user credentials
export function verifyUser(email: string, password: string): PublicUser | null {
  console.log('Попытка входа для:', email, 'Всего пользователей в базе:', usersStore.length)
  console.log('Список email в базе:', usersStore.map(u => u.email))

  const user = findUserByEmail(email)

  if (!user) {
    console.log('Пользователь не найден:', email)
    return null
  }

  const hashedPassword = hashPassword(password)
  console.log('Пароль введен правильно:', user.password === hashedPassword)

  if (user.password === hashedPassword) {
    // Update last login
    updateUserLastLogin(user.id)

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword as PublicUser
  }

  return null
}

// Update user last login
function updateUserLastLogin(userId: string): void {
  const userIndex = usersStore.findIndex(user => user.id === userId)

  if (userIndex !== -1) {
    usersStore[userIndex].lastLogin = new Date().toISOString()
    global.usersStore = usersStore // Обновляем глобальное хранилище
  }
}

// Get all users (admin function)
export function getAllUsers(): PublicUser[] {
  return usersStore.map(({ password, ...user }) => user)
}

// Get user stats
export function getUserStats(userId: string) {
  const user = usersStore.find(u => u.id === userId)
  
  if (!user) {
    return null
  }
  
  return {
    memberSince: user.createdAt,
    lastLogin: user.lastLogin,
    totalUsers: usersStore.length,
    userRank: usersStore.findIndex(u => u.id === userId) + 1
  }
}
