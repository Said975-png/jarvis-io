import { NextApiRequest, NextApiResponse } from 'next'

// In-memory storage for Vercel (since filesystem is read-only)
// Используем глобальную переменную чтобы избежать сброса при hot-reload
declare global {
  var ordersStore: any[] | undefined
}

if (!global.ordersStore) {
  global.ordersStore = [
  {
    "id": "order_1754780662642_ft12ewwcs",
    "userId": "0fc713f7-b5fd-4cb0-bbdd-326383c53a8f",
    "items": [
      {
        "id": "pro",
        "name": "Pro",
        "subtitle": "Лучший выбор",
        "price": "4000000",
        "period": "сумм в месяц",
        "features": [
          "Все из Basic",
          "До 15 страниц сайта",
          "ИИ ассистен�� интеграция",
          "Продвинутая аналитика",
          "Приоритетная поддержка"
        ],
        "quantity": 1
      }
    ],
    "formData": {
      "fullName": "Хусаинов Саид Румильевич",
      "phone": "+9989129391737",
      "description": "ЫФВЫФОВФДЛ",
      "referenceUrl": ""
    },
    "totalPrice": 4000000,
    "status": "rejected",
    "createdAt": "2025-08-09T23:04:22.642Z",
    "updatedAt": "2025-08-11T05:52:42.924Z"
  },
  {
    "id": "order_1754869364078_x045gfvmg",
    "userId": "1b8ceb20-8a83-42f1-b9ab-f20b36385bf0",
    "items": [
      {
        "id": "pro",
        "name": "Pro",
        "subtitle": "Лучший выбор",
        "price": "4000000",
        "period": "сумм",
        "features": [
          "Все из Basic",
          "До 15 страниц сайта",
          "ИИ ассистент интеграция",
          "Продвинутая аналитика",
          "Приоритетная поддержка"
        ],
        "quantity": 1
      }
    ],
    "formData": {
      "fullName": "said",
      "phone": "+9989129391737",
      "description": "шшш",
      "referenceUrl": ""
    },
    "totalPrice": 4000000,
    "status": "rejected",
    "createdAt": "2025-08-10T23:42:44.078Z",
    "updatedAt": "2025-08-11T05:52:47.738Z"
  },
  {
    "id": "order_1754869451776_bu8uoqmd7",
    "userId": "1b8ceb20-8a83-42f1-b9ab-f20b36385bf0",
    "items": [
      {
        "id": "max",
        "name": "Max",
        "subtitle": "Премиум решение",
        "price": "5000000",
        "period": "сумм",
        "features": [
          "Все из Pro",
          "Безлимитные страницы",
          "ДЖАРВИС ИИ полная версия",
          "Индивидуальные решения",
          "VIP поддержка 24/7"
        ],
        "quantity": 1
      }
    ],
    "formData": {
      "fullName": "лолвадлво лаоплавоп лватплвао",
      "phone": "+9989129391737",
      "description": "ввв",
      "referenceUrl": ""
    },
    "totalPrice": 5000000,
    "status": "confirmed",
    "createdAt": "2025-08-10T23:44:11.776Z",
    "updatedAt": "2025-08-11T05:53:55.706Z"
  },
  {
    "id": "order_1754882154606_o7h480fa8",
    "userId": "f5c92e59-d734-4399-b03f-3a00c6ce2398",
    "items": [
      {
        "id": "basic",
        "name": "Basic",
        "subtitle": "Стартовое решение",
        "price": "2500000",
        "period": "сумм",
        "features": [
          "До 5 страниц сайта",
          "Современный дизайн",
          "Адаптивная верстка",
          "SEO оптимизация",
          "Техподдержка email"
        ],
        "quantity": 1
      }
    ],
    "formData": {
      "fullName": "said",
      "phone": "+9989129391737",
      "description": "kjkjl",
      "referenceUrl": ""
    },
    "totalPrice": 2500000,
    "status": "pending",
    "createdAt": "2025-08-11T03:15:54.606Z",
    "updatedAt": "2025-08-11T03:15:54.607Z"
  }
  ]
}

let ordersStore: any[] = global.ordersStore

function getOrders() {
  return ordersStore
}

function saveOrders(orders: any[]) {
  ordersStore = [...orders] // Создаем новую копию массива
  global.ordersStore = ordersStore // Обновляем глобальное хранилище
  console.log('Заказы сохранены. Всего в хранилище:', ordersStore.length)
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const orders = getOrders()
      console.log('GET запрос: возвращаем', orders.length, 'заказов')
      console.log('ID заказов:', orders.map(o => o.id.slice(-8)))
      res.status(200).json(orders)
    } catch (error) {
      console.error('Error getting orders:', error)
      res.status(500).json({ error: 'Failed to get orders' })
    }
  } else if (req.method === 'POST') {
    try {
      const orders = getOrders()
      console.log('Текущее количество заказов до добавления:', orders.length)
      const newOrder = req.body
      const updatedOrders = [...orders, newOrder] // Создаем новый массив
      saveOrders(updatedOrders)
      console.log('Заказ добавлен. Новое количество:', updatedOrders.length)
      console.log('Order created successfully:', newOrder.id)
      res.status(201).json(newOrder)
    } catch (error) {
      console.error('Error creating order:', error)
      res.status(500).json({ error: 'Failed to create order' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { orderId, status } = req.body
      const orders = getOrders()
      const orderIndex = orders.findIndex((order: any) => order.id === orderId)

      if (orderIndex === -1) {
        return res.status(404).json({ error: 'Order not found' })
      }

      orders[orderIndex].status = status
      orders[orderIndex].updatedAt = new Date().toISOString()
      saveOrders(orders)

      console.log('Order status updated:', orderId, status)
      res.status(200).json(orders[orderIndex])
    } catch (error) {
      console.error('Error updating order:', error)
      res.status(500).json({ error: 'Failed to update order' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
