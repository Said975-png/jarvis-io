import type { NextApiRequest, NextApiResponse } from 'next'
import { findUserById, getUserStats } from '../../../lib/database'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен' })
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    // Get user data
    const user = findUserById(decoded.userId)
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    // Get user stats
    const stats = getUserStats(user.id)

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      },
      stats
    })
  } catch (error: any) {
    res.status(401).json({ message: 'Неверный токен' })
  }
}
