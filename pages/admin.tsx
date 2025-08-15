import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Head from 'next/head'

// Тип�� для заказов
interface CartItem {
  id: string
  name: string
  subtitle: string
  price: string
  period: string
  features: string[]
  quantity: number
}

interface OrderFormData {
  fullName: string
  phone: string
  description: string
  referenceUrl?: string
}

interface Order {
  id: string
  userId: string
  items: CartItem[]
  formData: OrderFormData
  totalPrice: number
  status: 'pending' | 'confirmed' | 'rejected'
  createdAt: string
  updatedAt: string
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    // Проверяем сохраненный статус аутентификации
    const savedAuth = localStorage.getItem('admin_authenticated')
    if (savedAuth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    // Загружаем заказы если аутентифицированы
    if (isAuthenticated) {
      loadOrders()
    }
  }, [isAuthenticated])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'Saidik001') {
      setIsAuthenticated(true)
      localStorage.setItem('admin_authenticated', 'true')
      setPasswordError('')
    } else {
      setPasswordError('Неверный пароль')
    }
  }

  const loadOrders = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
        // Добавляем timestamp чтобы избежать кеширования
        cache: 'no-store'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const ordersData = await response.json()
      console.log('Загружено заказов:', ordersData.length)
      console.log('Данные заказов:', ordersData)
      setOrders(Array.isArray(ordersData) ? ordersData : [])

      if (isRefresh) {
        alert(`Данные обновлены! Заказов: ${ordersData.length}`)
      }
    } catch (error) {
      console.error('Error loading orders:', error)
      setOrders([])
      if (isRefresh) {
        alert('Ошибка загрузки заказов. Проверьте подключение к интернету.')
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Автообновление каждые 30 секунд
  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(() => {
      loadOrders()
    }, 30000)

    return () => clearInterval(interval)
  }, [isAuthenticated])

  const handleStatusUpdate = async (orderId: string, status: 'confirmed' | 'rejected') => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const updatedOrder = await response.json()

      setOrders(prev => prev.map(order =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      ))
      setSelectedOrder(null)

      alert(`Заказ ${status === 'confirmed' ? 'подтвержден' : 'отклонен'}`)
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Ошибка при обновлении статуса заказа')
    }
  }

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

  // Проверка пароля для админ панели
  if (!isAuthenticated) {
    return (
      <div className="admin-password-form">
        <div className="password-card">
          <h1>Вход в админ панель</h1>
          <p>Введите пароль для доступа</p>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              className="password-input"
              autoFocus
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
            <button type="submit" className="submit-btn">
              Войти
            </button>
          </form>
        </div>
        <style jsx>{`
          .admin-password-form {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #f8f9fa;
            padding: 20px;
          }
          .password-card {
            background: #ffffff;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 400px;
            width: 100%;
          }
          .password-card h1 {
            font-size: 24px;
            color: #000000;
            margin-bottom: 8px;
          }
          .password-card p {
            color: #666666;
            font-size: 16px;
            margin-bottom: 24px;
          }
          .password-input {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            font-size: 16px;
            margin-bottom: 16px;
            box-sizing: border-box;
          }
          .password-input:focus {
            outline: none;
            border-color: #000000;
          }
          .submit-btn {
            width: 100%;
            background: #000000;
            color: #ffffff;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .submit-btn:hover {
            background: #333333;
          }
          .error-message {
            color: #ef4444;
            font-size: 14px;
            margin-bottom: 16px;
            margin-top: -8px;
          }
        `}</style>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка заказов</p>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Админ панель - JARVIS</title>
      </Head>

      <div className="admin-panel">
        <div className="admin-header">
          <div className="header-content">
            <div>
              <h1>Панель администратора</h1>
              <p>Управление заказами</p>
            </div>
            <button
              onClick={() => {
                setIsAuthenticated(false)
                localStorage.removeItem('admin_authenticated')
              }}
              className="logout-btn"
            >
              Выйти
            </button>
          </div>
        </div>

        <div className="admin-content">
          <div className="orders-list">
            <div className="orders-header">
              <h2>Заказы ({orders.length})
                <small style={{fontSize: '12px', color: '#666', marginLeft: '10px'}}>
                  Обновлено: {new Date().toLocaleTimeString()}
                </small>
              </h2>
              <div className="admin-buttons">
                <button
                  onClick={() => {
                    console.log('Текущие заказы в админ панели:', orders)
                    console.log('User IDs заказов:', orders.map(o => `${o.id.slice(-8)}: ${o.userId}`))
                  }}
                  className="debug-btn"
                >
                  Debug заказы
                </button>
                <button
                  onClick={() => loadOrders(true)}
                  className="refresh-btn"
                  disabled={refreshing}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.39 0 4.56.94 6.16 2.46" stroke="currentColor" strokeWidth="2"/>
                    <path d="M17 8l4-4-4-4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  {refreshing ? 'Обновляем' : 'Обновить'}
                </button>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="no-orders">
                <p>Заказов пока нет</p>
              </div>
            ) : (
              <div className="orders-grid">
                {orders.map((order) => (
                  <div 
                    key={order.id} 
                    className={`order-card ${order.status}`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="order-header">
                      <div className="order-ids">
                        <span className="order-id">#{order.id.slice(-8)}</span>
                        <span className="user-id">User: {order.userId === 'guest' ? 'Гость' : order.userId.slice(-8)}</span>
                      </div>
                      <span
                        className="order-status"
                        style={{ color: getStatusColor(order.status) }}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    
                    <div className="order-info">
                      <p><strong>{order.formData.fullName}</strong></p>
                      <p>{order.formData.phone}</p>
                      <p className="order-total">₽{order.totalPrice.toLocaleString()}</p>
                    </div>

                    <div className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="order-modal-overlay">
            <div className="order-modal">
              <div className="modal-header">
                <h2>Заказ #{selectedOrder.id.slice(-8)}</h2>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedOrder(null)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              <div className="modal-content">
                <div className="customer-info">
                  <h3>Информация о клиенте</h3>
                  <div className="info-grid">
                    <div>
                      <label>ФИО:</label>
                      <p>{selectedOrder.formData.fullName}</p>
                    </div>
                    <div>
                      <label>Телеф��н:</label>
                      <p>{selectedOrder.formData.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="project-info">
                  <h3>Детали проекта</h3>
                  <div>
                    <label>Описание:</label>
                    <p>{selectedOrder.formData.description}</p>
                  </div>
                  {selectedOrder.formData.referenceUrl && (
                    <div>
                      <label>Ссылка на примерный сайт:</label>
                      <p>
                        <a href={selectedOrder.formData.referenceUrl} target="_blank" rel="noopener noreferrer">
                          {selectedOrder.formData.referenceUrl}
                        </a>
                      </p>
                    </div>
                  )}
                </div>

                <div className="order-items">
                  <h3>Заказанные услуги</h3>
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="item-row">
                      <span>{item.name} × {item.quantity}</span>
                      <span>₽{(parseInt(item.price) * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="total-row">
                    <strong>Итого: ₽{selectedOrder.totalPrice.toLocaleString()}</strong>
                  </div>
                </div>

                {selectedOrder.status === 'pending' && (
                  <div className="action-buttons">
                    <button 
                      className="confirm-btn"
                      onClick={() => handleStatusUpdate(selectedOrder.id, 'confirmed')}
                    >
                      Подтвердить заказ
                    </button>
                    <button 
                      className="reject-btn"
                      onClick={() => handleStatusUpdate(selectedOrder.id, 'rejected')}
                    >
                      Отклонить заказ
                    </button>
                  </div>
                )}

                {selectedOrder.status !== 'pending' && (
                  <div className="status-info">
                    <p style={{ color: getStatusColor(selectedOrder.status) }}>
                      Статус: {getStatusText(selectedOrder.status)}
                    </p>
                    <p className="updated-date">
                      О��новлено: {new Date(selectedOrder.updatedAt).toLocaleString('ru-RU')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-panel {
          min-height: 100vh;
          background: #f8f9fa;
          padding: 40px 20px;
        }

        .admin-header {
          max-width: 1200px;
          margin: 0 auto 40px;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: left;
        }

        .admin-header h1 {
          font-size: 32px;
          font-weight: 600;
          color: #000000;
          margin-bottom: 8px;
        }

        .admin-header p {
          color: #666666;
          font-size: 16px;
        }

        .admin-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .orders-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .admin-buttons {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .debug-btn {
          background: #6366f1;
          color: #ffffff;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .debug-btn:hover {
          background: #4f46e5;
        }

        .orders-header h2 {
          font-size: 24px;
          font-weight: 600;
          color: #000000;
        }

        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #000000;
          color: #ffffff;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .refresh-btn:hover:not(:disabled) {
          background: #333333;
        }

        .refresh-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .logout-btn {
          background: #ef4444;
          color: #ffffff;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          background: #dc2626;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .order-card {
          background: #ffffff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .order-card:hover {
          border-color: #000000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .order-card.pending {
          border-left: 4px solid #f59e0b;
        }

        .order-card.confirmed {
          border-left: 4px solid #10b981;
        }

        .order-card.rejected {
          border-left: 4px solid #ef4444;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .order-id {
          font-family: monospace;
          font-weight: 600;
          color: #000000;
        }

        .order-status {
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .order-info p {
          margin: 4px 0;
          color: #666666;
        }

        .order-total {
          font-weight: 600 !important;
          color: #000000 !important;
        }

        .order-date {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #f0f0f0;
          font-size: 12px;
          color: #999999;
        }

        .no-orders {
          text-align: center;
          padding: 60px 20px;
          color: #666666;
        }

        .order-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .order-modal {
          background: #ffffff;
          border-radius: 12px;
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 32px;
          border-bottom: 1px solid #e5e5e5;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #000000;
        }

        .close-btn {
          background: none;
          border: none;
          color: #666666;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: #f5f5f5;
          color: #000000;
        }

        .modal-content {
          padding: 32px;
          overflow-y: auto;
          flex: 1;
        }

        .customer-info,
        .project-info,
        .order-items {
          margin-bottom: 32px;
        }

        .customer-info h3,
        .project-info h3,
        .order-items h3 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #000000;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .info-grid label,
        .project-info label {
          display: block;
          font-weight: 500;
          color: #000000;
          margin-bottom: 4px;
        }

        .info-grid p,
        .project-info p {
          margin: 0;
          color: #666666;
          word-break: break-word;
        }

        .project-info a {
          color: #0066cc;
          text-decoration: none;
        }

        .project-info a:hover {
          text-decoration: underline;
        }

        .item-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .total-row {
          padding: 12px 0;
          border-top: 2px solid #000000;
          margin-top: 12px;
          text-align: right;
        }

        .action-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-top: 24px;
        }

        .confirm-btn {
          background: #10b981;
          color: #ffffff;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .confirm-btn:hover {
          background: #059669;
        }

        .reject-btn {
          background: #ef4444;
          color: #ffffff;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .reject-btn:hover {
          background: #dc2626;
        }

        .status-info {
          text-align: center;
          margin-top: 24px;
        }

        .updated-date {
          font-size: 12px;
          color: #999999;
          margin-top: 8px;
        }

        .admin-access-denied,
        .admin-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          text-align: center;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #000000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .admin-panel {
            padding: 20px 16px;
          }

          .orders-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .orders-grid {
            grid-template-columns: 1fr;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .modal-content {
            padding: 24px;
          }

          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  )
}

export async function getServerSideProps() {
  return {
    props: {}
  }
}
