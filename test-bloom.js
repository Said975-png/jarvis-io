// Тест модели BLOOM
const testBLOOM = async () => {
  try {
    console.log('Тестируем модель BLOOM...')
    
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: 'Привет! Как дела?'
          }
        ]
      })
    })

    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ BLOOM РАБОТАЕТ!')
      console.log('Ответ:', data.message)
      
      // Проверяем что это не fallback
      if (data.message.includes('врем��нные технические проблемы')) {
        console.log('❌ Это fallback, не BLOOM')
      } else {
        console.log('✅ Это ответ от AI!')
      }
    } else {
      console.log('❌ Ошибка:', data)
    }
    
  } catch (error) {
    console.log('❌ Ошибка сети:', error.message)
  }
}

testBLOOM()
