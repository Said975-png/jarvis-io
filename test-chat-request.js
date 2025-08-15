// Тест JARVIS API
async function testJarvis() {
  try {
    console.log('Тестируем JARVIS API...');
    
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: 'привет'
          }
        ]
      })
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Успех!');
      console.log('Ответ JARVIS:', data.message);
      
      // Проверяем что нет английских слов
      const hasEnglish = /[a-zA-Z]{2,}/.test(data.message);
      if (hasEnglish) {
        console.log('❌ Найдены английские слова в ответе!');
      } else {
        console.log('✅ Ответ полностью на русском языке');
      }
      
    } else {
      const error = await response.text();
      console.log('❌ Ошибка:', response.status, error);
    }
    
  } catch (error) {
    console.log('❌ Ошибка сети:', error.message);
  }
}

// Если запускается в Node.js
if (typeof require !== 'undefined') {
  const fetch = require('node-fetch');
  testJarvis();
}
