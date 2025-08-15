import { useEffect, useState } from 'react'
import { useOrders, Order } from '../contexts/OrderContext'

interface ProfileModalProps {
  user: any
  onClose: () => void
  onLogout: () => void
}

export default function ProfileModal({ user, onClose, onLogout }: ProfileModalProps) {
  const { getUserOrders, isLoading } = useOrders()
  const [activeTab, setActiveTab] = useState<'orders' | 'settings'>('orders')

  // Получаем заказы пользователя из контекста
  const userOrders = getUserOrders(user.id)

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидает подтверждения'
      case 'confirmed': return 'Подтвержден'
      case 'rejected': return 'Отклонен'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b'
      case 'confirmed': return '#10b981'
      case 'rejected': return '#ef4444'
      default: return '#666666'
    }
  }

  return (
    <div className="profile-overlay">
      <div className="profile-fullscreen">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-title-section">
              <h1 className="profile-main-title">Личный кабинет</h1>
              <p className="profile-subtitle">Добро пожаловать, {user.name}</p>
            </div>
            <button
              className="profile-close-btn"
              onClick={onClose}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <div className="profile-content">
            <div className="profile-info-section">
              <div className="profile-user-card">
                <div className="profile-avatar">
                  {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                </div>
                <div className="profile-user-details">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <div className="profile-status">
                    <div className="status-dot"></div>
                    Активен
                  </div>
                </div>
              </div>

              <div className="profile-stats">
                <div className="stat-item">
                  <div className="stat-number">{userOrders.length}</div>
                  <div className="stat-label">Заказов</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{userOrders.filter(o => o.status === 'confirmed').length}</div>
                  <div className="stat-label">Подтвержденных</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">24 часа</div>
                  <div className="stat-label">Поддержка</div>
                </div>
              </div>
            </div>

            <div className="profile-main-section">
              <div className="profile-tabs">
                <button 
                  className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                >
                  Мои заказы
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('settings')}
                >
                  Настройки
                </button>
              </div>

              {activeTab === 'orders' && (
                <div className="profile-section">
                  <h4 className="section-title">
                    Мои заказы {isLoading ? '(загрузка...)' : `(${userOrders.length})`}
                  </h4>

                  {isLoading ? (
                    <div className="loading-state">
                      <p>Загрузка заказов...</p>
                    </div>
                  ) : userOrders.length === 0 ? (
                    <div className="no-orders">
                      <div className="no-orders-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                          <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17" stroke="currentColor" strokeWidth="1.5"/>
                          <circle cx="9" cy="20" r="1" stroke="currentColor" strokeWidth="1.5"/>
                          <circle cx="20" cy="20" r="1" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                      </div>
                      <h5>Заказов пока нет</h5>
                      <p>Оформите ваш первый заказ, выбрав подходящий тариф</p>
                    </div>
                  ) : (
                    <div className="orders-list">
                      {userOrders.map((order) => (
                        <div key={order.id} className="order-card">
                          <div className="order-header">
                            <div className="order-info">
                              <span className="order-id">Заказ #{order.id.slice(-8)}</span>
                              <span className="order-date">
                                {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                              </span>
                            </div>
                            <span 
                              className="order-status"
                              style={{ color: getStatusColor(order.status) }}
                            >
                              {getStatusText(order.status)}
                            </span>
                          </div>
                          
                          <div className="order-items">
                            {order.items.map((item) => (
                              <div key={item.id} className="order-item">
                                <span>{item.name} × {item.quantity}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="order-total">
                            <strong>{order.totalPrice.toLocaleString()} сумм</strong>
                          </div>
                          
                          {order.formData.description && (
                            <div className="order-description">
                              <p><strong>Описание проекта:</strong></p>
                              <p>{order.formData.description}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="profile-section">
                  <h4 className="section-title">Настройки аккаунта</h4>
                  <div className="settings-list">
                    <div className="setting-item">
                      <div className="setting-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                          <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                      <span>Общие настройки</span>
                    </div>
                    <div className="setting-item">
                      <div className="setting-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                      <span>Безопасность</span>
                    </div>
                    <div className="setting-item">
                      <div className="setting-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                      <span>Уведомления</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="profile-actions">
                <button className="logout-btn" onClick={onLogout}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M16 17L21 12L16 7M21 12H9M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Выйти из аккаунта
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .profile-fullscreen {
          background: #ffffff;
          width: 100%;
          height: 100%;
          position: relative;
          overflow: auto;
        }

        .profile-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px;
          min-height: 100%;
          display: flex;
          flex-direction: column;
        }

        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e5e5e5;
        }

        .profile-main-title {
          font-size: 32px;
          font-weight: 600;
          color: #000000;
          margin-bottom: 8px;
        }

        .profile-subtitle {
          color: #666666;
          font-size: 16px;
        }

        .profile-close-btn {
          background: none;
          border: none;
          color: #666666;
          cursor: pointer;
          padding: 12px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .profile-close-btn:hover {
          background: #f5f5f5;
          color: #000000;
        }

        .profile-content {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 40px;
          flex: 1;
        }

        .profile-info-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .profile-user-card {
          background: #f8f8f8;
          padding: 24px;
          border-radius: 12px;
        }

        .profile-avatar {
          width: 64px;
          height: 64px;
          background: #000000;
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 20px;
          margin-bottom: 16px;
        }

        .profile-user-details h3 {
          margin: 0 0 8px 0;
          color: #000000;
          font-weight: 600;
          font-size: 18px;
        }

        .profile-user-details p {
          margin: 0 0 12px 0;
          color: #666666;
          font-size: 14px;
        }

        .profile-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #10b981;
          font-weight: 500;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
        }

        .profile-stats {
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 24px;
        }

        .stat-item {
          text-align: center;
          padding: 16px 0;
          border-bottom: 1px solid #f5f5f5;
        }

        .stat-item:last-child {
          border-bottom: none;
        }

        .stat-number {
          font-size: 20px;
          font-weight: 700;
          color: #000000;
          display: block;
          margin-bottom: 4px;
        }

        .stat-label {
          color: #666666;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .profile-main-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .profile-tabs {
          display: flex;
          border-bottom: 1px solid #e5e5e5;
          margin-bottom: 24px;
        }

        .tab-btn {
          background: none;
          border: none;
          padding: 12px 24px;
          cursor: pointer;
          color: #666666;
          font-weight: 500;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .tab-btn:hover {
          color: #000000;
        }

        .tab-btn.active {
          color: #000000;
          border-bottom-color: #000000;
        }

        .profile-section {
          background: #ffffff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 24px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #000000;
          margin: 0 0 20px 0;
        }

        .no-orders {
          text-align: center;
          padding: 60px 20px;
          color: #666666;
        }

        .no-orders-icon {
          color: #e5e5e5;
          margin-bottom: 16px;
        }

        .no-orders h5 {
          margin: 0 0 8px 0;
          color: #000000;
          font-size: 16px;
        }

        .no-orders p {
          margin: 0;
          font-size: 14px;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .order-card {
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 20px;
          transition: all 0.2s ease;
        }

        .order-card:hover {
          border-color: #000000;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .order-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .order-id {
          font-family: monospace;
          font-weight: 600;
          color: #000000;
        }

        .order-date {
          font-size: 12px;
          color: #666666;
        }

        .order-status {
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .order-items {
          margin: 12px 0;
        }

        .order-item {
          color: #666666;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .order-total {
          margin: 12px 0;
          text-align: right;
        }

        .order-description {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #f0f0f0;
        }

        .order-description p {
          margin: 4px 0;
          font-size: 14px;
          color: #666666;
        }

        .order-description p:first-child {
          color: #000000;
          font-weight: 500;
        }

        .settings-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .setting-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          font-size: 14px;
          color: #000000;
        }

        .setting-item:hover {
          background: #f5f5f5;
        }

        .setting-icon {
          color: #666666;
        }

        .profile-actions {
          margin-top: auto;
          padding-top: 24px;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: 1px solid #e5e5e5;
          color: #666666;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 500;
        }

        .logout-btn:hover {
          background: #f5f5f5;
          border-color: #000000;
          color: #000000;
        }

        @media (max-width: 768px) {
          .profile-container {
            padding: 20px 16px;
          }

          .profile-content {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .profile-main-title {
            font-size: 24px;
          }

          .profile-tabs {
            margin-bottom: 16px;
          }

          .tab-btn {
            flex: 1;
            text-align: center;
          }
        }
      `}</style>
    </div>
  )
}
