const fs = require('fs');
const path = require('path');

// Основные файлы для очистки
const filesToFix = [
  'components/ChatGPT.tsx',
  'pages/api/chat.ts'
];

function fixCorruptedSymbols(content) {
  return content
    // Убираем все символы замещения Unicode
    .replace(/\uFFFD/g, '')
    .replace(/[�]/g, '')
    // Дополнительная очистка проблемных символов
    .replace(/\u{FFFD}/gu, '')
    // Исправляем общие проблемы
    .replace(/тари��ах/g, 'тарифах')
    .replace(/г��лосов/g, 'голосов')
    .replace(/кл��ча/g, 'ключа')
    .replace(/О��ищаем/g, 'Очищаем')
    .replace(/��апускаем/g, 'запускаем')
    .replace(/подключени��м/g, 'подключением')
    .replace(/��ырезание/g, 'вырезание')
    .replace(/Дополнительн��я/g, 'Дополнительная')
    .replace(/проблем��й/g, 'проблемный')
    .replace(/систем��/g, 'системы')
    .replace(/сообщени��/g, 'сообщение')
    .replace(/функци��/g, 'функция')
    .replace(/анализиру��/g, 'анализирую')
    .replace(/формиру��/g, 'формирую')
    .replace(/использовани��/g, 'использование')
    .replace(/обработ��/g, 'обработку');
}

filesToFix.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = fixCorruptedSymbols(content);
    
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`✅ Исправлены символы в: ${filePath}`);
    } else {
      console.log(`⭐ Символы в порядке: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Ошибка обработки ${filePath}:`, error.message);
  }
});

console.log('🎉 Очистка символов завершена!');
