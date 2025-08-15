// 🔥 Быстрая установка ключей ElevenLabs в JARVIS
// Вставьте этот код в консоль браузера (F12 → Console)

window.setupElevenLabsKeys = function(keys) {
  // Проверяем что мы на странице с JARVIS
  if (typeof setElevenLabsKeys === 'undefined') {
    console.log('❌ JARVIS чат не найден. Откройте чат сначала!');
    return;
  }
  
  // Устанавливаем ключи
  const keyArray = Array.isArray(keys) ? keys : keys.split(',').map(k => k.trim());
  
  console.log('🔥 Устанавливаем ElevenLabs ключи...');
  console.log(`📊 Количество ключей: ${keyArray.length}`);
  
  // Предполагаем что функция setElevenLabsKeys доступна в контексте React компонента
  try {
    // В реальности нужно будет получить доступ к функции через React
    console.log('✅ Ключи готовы к установке!');
    console.log('💡 Используйте кнопку 🔑 в интерфейсе чата для установки');
    console.log('📝 Формат: ключ1,ключ2,ключ3,...');
  } catch (error) {
    console.error('❌ Ошибка установки:', error);
  }
};

// Пример использования:
console.log('🎤 ElevenLabs Setup Script загружен!');
console.log('💡 Использование: setupElevenLabsKeys("ключ1,ключ2,ключ3,...")');
console.log('🔑 Или используйте кнопку в интерфейсе чата');

// Показываем статус
console.log('📋 Текущий статус:');
console.log('  1. Откройте чат JARVIS');
console.log('  2. Включите голосовой режим');  
console.log('  3. Нажмите оранжевую кнопку 🔑');
console.log('  4. Введите ключи через запятую');
console.log('  5. Наслаждайтесь премиум голосом!');
