import { useEffect, useState } from 'react'

export default function CodeProtection() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    // Множественная защита от правой кнопки мыши
    const disableRightClick = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
      return false
    }

    // Защита от контекстного меню
    const disableContextMenu = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    // Отключаем горячие клавиши
    const disableKeyboardShortcuts = (e: KeyboardEvent) => {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      
      // Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.key === 'I')) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      
      // Ctrl+Shift+C (Elements)
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 67 || e.key === 'C')) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 74 || e.key === 'J')) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      
      // Ctrl+U (View Source)
      if (e.ctrlKey && (e.keyCode === 85 || e.key === 'u' || e.key === 'U')) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      
      // Ctrl+S (Save page)
      if (e.ctrlKey && (e.keyCode === 83 || e.key === 's' || e.key === 'S')) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      
      // Ctrl+A (Select all)
      if (e.ctrlKey && (e.keyCode === 65 || e.key === 'a' || e.key === 'A')) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      
      // Ctrl+P (Print)
      if (e.ctrlKey && (e.keyCode === 80 || e.key === 'p' || e.key === 'P')) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // Ctrl+Shift+K (Console in Firefox)
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 75 || e.key === 'K')) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // F5 and Ctrl+R (Refresh)
      if (e.keyCode === 116 || (e.ctrlKey && (e.keyCode === 82 || e.key === 'r' || e.key === 'R'))) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }

    // Отключаем выделение текста
    const disableTextSelection = () => {
      const bodyStyle = document.body.style as any
      bodyStyle.userSelect = 'none'
      bodyStyle.webkitUserSelect = 'none'
      bodyStyle.mozUserSelect = 'none'
      bodyStyle.msUserSelect = 'none'
      bodyStyle.webkitTouchCallout = 'none'
    }

    // Защита от копирования
    const disableCopy = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    // Защита от перетаскивания
    const disableDrag = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    // Отключаем функции печати
    const disablePrint = () => {
      try {
        window.print = () => {
          return false
        }
      } catch (e) {
        // Игнорируем ошибку если свойство read-only
      }
    }

    // ВРЕМЕННО ОТКЛЮЧЕНА детекция DevTools по размеру окна
    const blockDevTools = () => {
      // Детекция по размеру окна отключена из-за ложных срабатываний
      console.log('🛡️ CodeProtection: детекция DevTools по размеру отключена')
    }

    // Множественное применение защитных мер
    const applyProtection = () => {
      // Отключаем контекстное меню через разные методы
      document.addEventListener('contextmenu', disableRightClick, true)
      document.addEventListener('contextmenu', disableContextMenu, true)

      // Безопасное присвоение oncontextmenu
      try {
        document.oncontextmenu = disableRightClick
      } catch (e) {
        // Игнорируем ошибку если свойство read-only
      }

      try {
        window.oncontextmenu = disableRightClick
      } catch (e) {
        // Игнорируем ошибку если свойство read-only
      }
      
      // Отключаем клавиатурные сокращения
      document.addEventListener('keydown', disableKeyboardShortcuts, true)
      window.addEventListener('keydown', disableKeyboardShortcuts, true)
      
      // Отключаем копирование/вставку/вырезание
      document.addEventListener('copy', disableCopy, true)
      document.addEventListener('paste', disableCopy, true)
      document.addEventListener('cut', disableCopy, true)
      document.addEventListener('selectstart', disableCopy, true)
      
      // Отключаем перетаскивание
      document.addEventListener('dragstart', disableDrag, true)
      document.addEventListener('drop', disableDrag, true)
      document.addEventListener('dragover', disableDrag, true)
      
      // Отключаем выделение
      try {
        document.onselectstart = () => false
      } catch (e) {
        // Игнорируем ошибку если свойство read-only
      }

      try {
        document.ondragstart = () => false
      } catch (e) {
        // Игнорируем ошибку если свойство read-only
      }

      try {
        document.ondrop = () => false
      } catch (e) {
        // Игнорируем ошибку если свойство read-only
      }
      
      // Применяем стили для отключения выделения
      disableTextSelection()
      
      // Отклю��аем печать
      disablePrint()
      
      // Запускаем детекцию DevTools
      blockDevTools()
    }

    // Применяем защиту сразу и с задержкой для надёжности
    applyProtection()
    setTimeout(applyProtection, 100)
    setTimeout(applyProtection, 500)
    setTimeout(applyProtection, 1000)

    // Блокируем сохранение страницы
    window.addEventListener('beforeunload', (e) => {
      e.preventDefault()
      e.returnValue = ''
    })

    // Перехватываем все возможные события мыши
    const blockAllMouseEvents = (e: Event) => {
      if ((e as MouseEvent).button === 2) { // Правая кнопка
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        return false
      }
    }

    document.addEventListener('mousedown', blockAllMouseEvents, true)
    document.addEventListener('mouseup', blockAllMouseEvents, true)
    document.addEventListener('click', blockAllMouseEvents, true)

    // Очистка при размонтировании
    return () => {
      document.removeEventListener('contextmenu', disableRightClick, true)
      document.removeEventListener('contextmenu', disableContextMenu, true)
      document.removeEventListener('keydown', disableKeyboardShortcuts, true)
      window.removeEventListener('keydown', disableKeyboardShortcuts, true)
      document.removeEventListener('copy', disableCopy, true)
      document.removeEventListener('paste', disableCopy, true)
      document.removeEventListener('cut', disableCopy, true)
      document.removeEventListener('selectstart', disableCopy, true)
      document.removeEventListener('dragstart', disableDrag, true)
      document.removeEventListener('drop', disableDrag, true)
      document.removeEventListener('dragover', disableDrag, true)
      document.removeEventListener('mousedown', blockAllMouseEvents, true)
      document.removeEventListener('mouseup', blockAllMouseEvents, true)
      document.removeEventListener('click', blockAllMouseEvents, true)
      
      const bodyStyle = document.body.style as any
      bodyStyle.userSelect = ''
      bodyStyle.webkitUserSelect = ''
      bodyStyle.mozUserSelect = ''
      bodyStyle.msUserSelect = ''
    }
  }, [isClient])

  if (!isClient) {
    return null
  }

  return null
}
