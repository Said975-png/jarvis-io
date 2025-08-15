import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem } from './CartContext'

export interface OrderFormData {
  fullName: string
  phone: string
  description: string
  referenceUrl?: string
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  formData: OrderFormData
  totalPrice: number
  status: 'pending' | 'confirmed' | 'rejected'
  createdAt: string
  updatedAt: string
}

interface OrderContextType {
  orders: Order[]
  isLoading: boolean
  createOrder: (items: CartItem[], formData: OrderFormData, userId: string) => Promise<Order>
  updateOrderStatus: (orderId: string, status: 'confirmed' | 'rejected') => Promise<void>
  getUserOrders: (userId: string) => Order[]
  getAllOrders: () => Order[]
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Загружаем заказы при инициализации
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetch('/api/orders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const ordersData = await response.json()
          setOrders(Array.isArray(ordersData) ? ordersData : [])
          console.log('Заказы загружены из API:', ordersData.length)
        } else {
          console.error('Ошибка загрузки заказов:', response.status)
          setOrders([])
        }
      } catch (error) {
        console.error('Ошибка при загрузке заказов:', error)
        setOrders([])
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [])

  const createOrder = async (items: CartItem[], formData: OrderFormData, userId?: string): Promise<Order> => {
    console.log('=== OrderContext: createOrder ===')
    console.log('Received userId:', userId)
    console.log('Items:', items)
    console.log('FormData:', formData)

    const totalPrice = items.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/\D/g, '')) || 0
      return total + (price * item.quantity)
    }, 0)

    const finalUserId = userId || 'guest'
    console.log('Final userId будет:', finalUserId)

    const newOrder: Order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: finalUserId,
      items,
      formData,
      totalPrice,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    console.log('Создаваемый заказ:', newOrder)

    try {
      // Отправляем заказ в API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOrder)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const savedOrder = await response.json()
      console.log('Заказ успешно создан:', savedOrder.id)

      // Сохраняем также локально
      setOrders(prev => [...prev, savedOrder])
      return savedOrder
    } catch (error) {
      console.error('Ошибка при создании заказа:', error)
      // Fallback - сохраняем локально если API недоступен
      setOrders(prev => [...prev, newOrder])
      return newOrder
    }
  }

  const updateOrderStatus = async (orderId: string, status: 'confirmed' | 'rejected'): Promise<void> => {
    try {
      // Обновляем через API
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const updatedOrder = await response.json()
      console.log('Статус заказа обновлен:', orderId, status)

      // Обновляем локально
      setOrders(prev => prev.map(order =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      ))
    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error)
      // Fallback - обновляем только локально
      setOrders(prev => prev.map(order =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      ))
    }
  }

  const getUserOrders = (userId: string): Order[] => {
    return orders.filter(order => order.userId === userId)
  }

  const getAllOrders = (): Order[] => {
    return orders
  }

  return (
    <OrderContext.Provider value={{
      orders,
      isLoading,
      createOrder,
      updateOrderStatus,
      getUserOrders,
      getAllOrders
    }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider')
  }
  return context
}
