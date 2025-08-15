import { useEffect, useState } from 'react'

import { PublicUser } from '../lib/database'

type User = PublicUser

interface UserStats {
  memberSince: string
  lastLogin?: string
  totalUsers: number
  userRank: number
}

interface ProfileProps {
  user: User
  onLogout: () => void
}

export default function Profile({ user, onLogout }: ProfileProps) {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserStats()
  }, [])

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const calculateDaysActive = () => {
    if (!stats) return 0
    const memberSince = new Date(stats.memberSince)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - memberSince.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar-large">
          {getInitials(user.name)}
        </div>
        <h1 className="profile-name">{user.name}</h1>
        <p className="profile-email">{user.email}</p>
      </div>

      {loading ? (
        <div className="loading-stats">
          <p>Загрузка статистики</p>
        </div>
      ) : stats && (
        <div className="profile-stats">
          <div className="stat-card">
            <span className="stat-number">{calculateDaysActive()}</span>
            <span className="stat-label">Дней с нами</span>
          </div>
          
          <div className="stat-card">
            <span className="stat-number">#{stats.userRank}</span>
            <span className="stat-label">Пользователь</span>
          </div>
          
          <div className="stat-card">
            <span className="stat-number">{stats.totalUsers}</span>
            <span className="stat-label">Всего пользователей</span>
          </div>
        </div>
      )}

      <div className="profile-info">
        <div className="info-card">
          <h3>Информация об аккаунте</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Дата регистрации:</span>
              <span className="info-value">{formatDate(user.createdAt)}</span>
            </div>
            
            {user.lastLogin && (
              <div className="info-item">
                <span className="info-label">Последний вход:</span>
                <span className="info-value">{formatDate(user.lastLogin)}</span>
              </div>
            )}
            
            <div className="info-item">
              <span className="info-label">Статус:</span>
              <span className="info-value status-active">Активен</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <button className="logout-btn" onClick={onLogout}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M16 17L21 12L16 7M21 12H9M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Выйти из аккаунта
        </button>
      </div>
    </div>
  )
}
