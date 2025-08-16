import { useEffect } from 'react'

export default function AdvancedProtection() {
  useEffect(() => {
    // Немедленная защита при загрузке страницы
    (function() {
      'use strict';
      
      // Блокируем правую кнопку мыши
      document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }, true);
      
      // Блокируем горячие клавиши
      document.addEventListener('keydown', function(e) {
        // F12
        if (e.keyCode === 123) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
        
        // Ctrl+Shift+I (DevTools)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
        
        // Ctrl+Shift+C (Inspect Element)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
        
        // Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
        
        // Ctrl+U (View Source)
        if (e.ctrlKey && e.keyCode === 85) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
        
        // Ctrl+S (Save Page)
        if (e.ctrlKey && e.keyCode === 83) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
        
        // Ctrl+A (Select All)
        if (e.ctrlKey && e.keyCode === 65) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
        
        // Ctrl+P (Print)
        if (e.ctrlKey && e.keyCode === 80) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }, true);
      
      // Блокируем выделение
      document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
      }, true);
      
      // Блокируем копирование
      document.addEventListener('copy', function(e) {
        e.preventDefault();
        return false;
      }, true);
      
      // Блокируем вставку
      document.addEventListener('paste', function(e) {
        e.preventDefault();
        return false;
      }, true);
      
      // Блокируем вырезание
      document.addEventListener('cut', function(e) {
        e.preventDefault();
        return false;
      }, true);
      
      // Блокируем перетаскивание
      document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
      }, true);
      
      // Отключаем выделение
      document.onselectstart = function() { return false; };
      document.oncontextmenu = function() { return false; };
      document.ondragstart = function() { return false; };
      
      // ВРЕМЕННО ОТКЛЮЧЕНА детекция DevTools по размеру окна
      // Оставляем только блокировку горячих клавиш для базовой защиты
      console.log('🛡️ AdvancedProtection: только горячие клавиши');
      
      // Переопределяем console
      if (typeof console !== 'undefined') {
        console.log = function() {};
        console.warn = function() {};
        console.error = function() {};
        console.info = function() {};
        console.debug = function() {};
        console.trace = function() {};
      }
      
      // Оставляем alert для уведомлений о защите
      // window.alert = function() {};
      window.prompt = function() { return null; };
      window.confirm = function() { return false; };
      
      // Отключаем печать
      window.print = function() {};
      
      // Отключаем сохранение страницы
      const beforeUnloadHandler = function(e: BeforeUnloadEvent) {
        e.preventDefault();
        e.returnValue = '';
      };
      window.addEventListener('beforeunload', beforeUnloadHandler);
      
      // Дополнительн��я защита для мобильных (убрано - мешало использованию)
      // document.addEventListener('touchstart', function(e) {
      //   if (e.touches.length > 1) {
      //     e.preventDefault();
      //   }
      // }, { passive: false });
      //
      // document.addEventListener('gesturestart', function(e) {
      //   e.preventDefault();
      // });
      
      // Cleanup function
      return () => {
        clearInterval(devtoolsInterval);
        window.removeEventListener('beforeunload', beforeUnloadHandler);
      };
    })();
  }, []);

  return (
    <>
      <style jsx global>{`
        * {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
          -webkit-tap-highlight-color: transparent !important;
          -webkit-user-drag: none !important;
          -moz-user-drag: none !important;
          user-drag: none !important;
        }
        
        body {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          overflow-x: hidden;
        }
        
        img, video {
          -webkit-user-drag: none !important;
          -moz-user-drag: none !important;
          user-drag: none !important;
          pointer-events: none !important;
        }
        
        ::selection {
          background: transparent !important;
        }
        
        ::-moz-selection {
          background: transparent !important;
        }
        
        /* Скрываем скроллбары */
        ::-webkit-scrollbar {
          display: none;
        }
        
        /* Блокируем zoom */
        body {
          zoom: normal !important;
          -webkit-text-size-adjust: 100% !important;
        }
      `}</style>
    </>
  )
}
