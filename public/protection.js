// Максимальная защита от открытия консоли и DevTools
(function() {
  'use strict';
  
  // Множественная блокировка правой кнопки мыши
  const blockRightClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    return false;
  };

  // Несколько способов блокировки контекстного меню
  document.addEventListener('contextmenu', blockRightClick, { capture: true, passive: false });
  document.addEventListener('contextmenu', blockRightClick, true);
  document.oncontextmenu = blockRightClick;
  window.oncontextmenu = blockRightClick;

  // Блокировка ��ерез mousedown для правой кнопки
  document.addEventListener('mousedown', function(e) {
    if (e.button === 2) { // Правая кнопка
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
  }, { capture: true, passive: false });

  // Блокировка через mouseup для правой кнопки
  document.addEventListener('mouseup', function(e) {
    if (e.button === 2) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
  }, { capture: true, passive: false });

  // Расширенная блокировка горячих клавиш DevTools
  const blockKeyboard = (e) => {
    // F12 - DevTools
    if (e.keyCode === 123 || e.key === 'F12') {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
    
    // Ctrl+Shift+I - DevTools
    if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.key === 'I' || e.key === 'i')) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
    
    // Ctrl+Shift+C - Elements
    if (e.ctrlKey && e.shiftKey && (e.keyCode === 67 || e.key === 'C' || e.key === 'c')) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
    
    // Ctrl+Shift+J - Console
    if (e.ctrlKey && e.shiftKey && (e.keyCode === 74 || e.key === 'J' || e.key === 'j')) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
    
    // Ctrl+Shift+K - Console (Firefox)
    if (e.ctrlKey && e.shiftKey && (e.keyCode === 75 || e.key === 'K' || e.key === 'k')) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
    
    // Ctrl+U - View Source
    if (e.ctrlKey && (e.keyCode === 85 || e.key === 'U' || e.key === 'u')) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }

    // F5 и Ctrl+R - Обновление страницы
    if (e.keyCode === 116 || (e.ctrlKey && (e.keyCode === 82 || e.key === 'R' || e.key === 'r'))) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }

    // Ctrl+S - Сохранение страницы
    if (e.ctrlKey && (e.keyCode === 83 || e.key === 'S' || e.key === 's')) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }

    // Ctrl+A - Выделить все
    if (e.ctrlKey && (e.keyCode === 65 || e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }

    // Ctrl+P - Печать
    if (e.ctrlKey && (e.keyCode === 80 || e.key === 'P' || e.key === 'p')) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }

    // Ctrl+C, Ctrl+V, Ctrl+X - Копирование/Вставка/Вырезание
    if (e.ctrlKey && (
      e.keyCode === 67 || e.key === 'c' || e.key === 'C' ||
      e.keyCode === 86 || e.key === 'v' || e.key === 'V' ||
      e.keyCode === 88 || e.key === 'x' || e.key === 'X'
    )) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
  };

  // Множественная регистрация обработчиков клавиатуры
  document.addEventListener('keydown', blockKeyboard, { capture: true, passive: false });
  document.addEventListener('keyup', blockKeyboard, { capture: true, passive: false });
  window.addEventListener('keydown', blockKeyboard, { capture: true, passive: false });
  window.addEventListener('keyup', blockKeyboard, { capture: true, passive: false });

  // Блокировка выделения текста
  const blockSelection = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  document.onselectstart = blockSelection;
  document.ondragstart = blockSelection;
  document.addEventListener('selectstart', blockSelection, { capture: true, passive: false });
  document.addEventListener('dragstart', blockSelection, { capture: true, passive: false });

  // Блокировка копирования, вставки, вырезания
  const blockClipboard = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    return false;
  };

  document.addEventListener('copy', blockClipboard, { capture: true, passive: false });
  document.addEventListener('paste', blockClipboard, { capture: true, passive: false });
  document.addEventListener('cut', blockClipboard, { capture: true, passive: false });

  // Обход попыток переопределения функций
  Object.defineProperty(document, 'oncontextmenu', {
    value: blockRightClick,
    writable: false,
    configurable: false
  });

  // Блокировка печати
  window.print = function() {
    return false;
  };

  // Мониторинг DevTools по размеру окна
  let devtoolsOpen = false;
  const checkDevTools = () => {
    const threshold = 160;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    
    if ((heightThreshold || widthThreshold) && !devtoolsOpen) {
      devtoolsOpen = true;
      alert('Доступ к инструментам разработчика запрещен!');
      window.location.href = 'about:blank';
    }
  };

  // Проверка каждую секунду
  setInterval(checkDevTools, 1000);

  // Блокировка через console API
  if (typeof console !== 'undefined') {
    const originalConsole = console;
    Object.defineProperty(window, 'console', {
      value: {
        log: () => {},
        warn: () => {},
        error: () => {},
        info: () => {},
        debug: () => {},
        trace: () => {},
        dir: () => {},
        dirxml: () => {},
        table: () => {},
        group: () => {},
        groupEnd: () => {},
        clear: () => {},
        assert: () => {},
        time: () => {},
        timeEnd: () => {},
        profile: () => {},
        profileEnd: () => {},
        count: () => {},
        exception: () => {},
        groupCollapsed: () => {}
      },
      writable: false,
      configurable: false
    });
  }

  // CSS стили для полной блокировки
  const style = document.createElement('style');
  style.textContent = `
    * {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
      -webkit-touch-callout: none !important;
      -webkit-user-drag: none !important;
      -moz-user-drag: none !important;
      user-drag: none !important;
      -webkit-tap-highlight-color: transparent !important;
    }
    
    body {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
      -webkit-touch-callout: none !important;
    }

    @media print {
      * { display: none !important; }
    }
  `;
  
  // Добавление стилей немедленно или после загрузки DOM
  if (document.head) {
    document.head.appendChild(style);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      if (document.head) {
        document.head.appendChild(style);
      }
    });
  }

  // Защита от по��ыток удаления стилей
  Object.defineProperty(style, 'remove', {
    value: function() { return false; },
    writable: false,
    configurable: false
  });

  // Блокировка beforeunload для предотвращения сохранения страницы
  window.addEventListener('beforeunload', function(e) {
    e.preventDefault();
    e.returnValue = '';
    return '';
  });

  // Дополнительная защита через мутации DOM
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            node.addEventListener('contextmenu', blockRightClick, { capture: true, passive: false });
          }
        });
      }
    });
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
      }
    });
  }

})();
