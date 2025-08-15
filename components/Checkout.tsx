import { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { useOrders, OrderFormData } from '../contexts/OrderContext'
import { useAuth } from '../contexts/AuthContext'

interface CheckoutProps {
  onClose: () => void
  onSuccess: () => void
}

export default function Checkout({ onClose, onSuccess }: CheckoutProps) {
  const { items, getTotalPrice, clearCart } = useCart()
  const { createOrder } = useOrders()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<OrderFormData>({
    fullName: user?.name || '',
    phone: '',
    description: '',
    referenceUrl: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)
    try {
      console.log('=== СОЗДАНИЕ ЗАКАЗА ===')
      console.log('User:', user)
      console.log('User ID:', user?.id)
      console.log('Items:', items)
      console.log('Form data:', formData)

      // Создаем заказ с ID пользователя если есть, иначе как гостевой
      const order = await createOrder(items, formData, user?.id)
      console.log('Заказ успешно создан:', order)

      clearCart()
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Произошла ошибка при оформлении заказа. Попробуйте еще раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="checkout-overlay">
      <div className="checkout-modal">
        <div className="checkout-header">
          <h2>Оформление заказа</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="checkout-content">
          {/* Order Summary */}
          <div className="order-summary">
            <h3>Ваш заказ</h3>
            <div className="order-items">
              {items.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">× {item.quantity}</span>
                  </div>
                  <span className="item-price">{parseInt(item.price).toLocaleString()} сумм</span>
                </div>
              ))}
            </div>
            <div className="order-total">
              <span>Итого: {getTotalPrice().toLocaleString()} сумм</span>
            </div>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-section">
              <h3>Контактная информация</h3>
              
              <div className="form-group">
                <label htmlFor="fullName">ФИО *</label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required
                  placeholder="Введите ваше полное имя"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Номер телефона *</label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                  placeholder="+998 (XX) XXX-XX-XX"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Детали проекта</h3>
              
              <div className="form-group">
                <label htmlFor="description">Описан��е сайта *</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                  placeholder="Опишите, какой сайт вы хотите. Укажите функциональность, стиль, особые требования"
                  rows={5}
                />
              </div>

              <div className="form-group">
                <label htmlFor="referenceUrl">Ссылка на примерный сайт (опционально)</label>
                <input
                  type="url"
                  id="referenceUrl"
                  value={formData.referenceUrl}
                  onChange={(e) => handleInputChange('referenceUrl', e.target.value)}
                  placeholder="https://example.com - если есть сайт, который вам нравится"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Отмена
              </button>
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Оформляем' : 'Оформить заказ'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .checkout-overlay {
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
          padding: 20px;
        }

        .checkout-modal {
          background: #ffffff;
          border-radius: 12px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .checkout-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 32px;
          border-bottom: 1px solid #e5e5e5;
        }

        .checkout-header h2 {
          margin: 0;
          font-size: 24px;
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

        .checkout-content {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 32px;
          padding: 32px;
          overflow-y: auto;
          flex: 1;
        }

        .order-summary {
          background: #f8f8f8;
          padding: 24px;
          border-radius: 12px;
          height: fit-content;
        }

        .order-summary h3 {
          margin: 0 0 20px 0;
          font-size: 18px;
          font-weight: 600;
          color: #000000;
        }

        .order-items {
          margin-bottom: 20px;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #e5e5e5;
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .item-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .item-name {
          font-weight: 500;
          color: #000000;
        }

        .item-quantity {
          font-size: 12px;
          color: #666666;
        }

        .item-price {
          font-weight: 600;
          color: #000000;
        }

        .order-total {
          padding-top: 16px;
          border-top: 2px solid #000000;
          text-align: right;
        }

        .order-total span {
          font-size: 18px;
          font-weight: 700;
          color: #000000;
        }

        .checkout-form {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .form-section h3 {
          margin: 0 0 20px 0;
          font-size: 18px;
          font-weight: 600;
          color: #000000;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #000000;
          font-size: 14px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #000000;
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 120px;
        }

        .form-actions {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
          margin-top: auto;
          padding-top: 24px;
          border-top: 1px solid #e5e5e5;
        }

        .cancel-btn {
          background: none;
          color: #666666;
          border: 1px solid #e5e5e5;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .cancel-btn:hover {
          background: #f5f5f5;
          border-color: #000000;
          color: #000000;
        }

        .submit-btn {
          background: #000000;
          color: #ffffff;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .submit-btn:hover:not(:disabled) {
          background: #333333;
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .checkout-content {
            grid-template-columns: 1fr;
            gap: 24px;
            padding: 24px;
          }

          .checkout-header {
            padding: 20px 24px;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
