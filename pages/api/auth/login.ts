import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyUser } from '../../../lib/database'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email, password } = req.body

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email и пароль обязательны' })
  }

  try {
    // Verify user credentials
    const user = verifyUser(email, password)
    
    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' })
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(200).json({
      message: 'Успешный вход',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      },
      token
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Ошибка сервера' })
  }
}
