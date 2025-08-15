import { useState } from 'react'
import LiquidSphere from './LiquidSphere'

export default function Hero() {
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false)
  const [isJarvisModalOpen, setIsJarvisModalOpen] = useState(false)

  return (
    <section className="hero-section-chatgpt">
      <div className="hero-container-chatgpt">
        {/* Main Content */}
        <div className="hero-main-chatgpt">
          <div className="hero-content-chatgpt">
            <h1 className="hero-title-chatgpt">
              Создаем современные веб сайты с внедрением JARVIS
            </h1>

            <p className="hero-description-chatgpt">
              Революционный ИИ-ассистент, который понимает ваши потребности и превращает идеи в реальность. Будущее взаимодействия с технологиями уже здесь.
            </p>

            <div className="hero-cta-chatgpt">
              <button
                className="primary-button-chatgpt"
                onClick={() => setIsProcessModalOpen(true)}
              >
                Процесс договора
              </button>
              <button
                className="secondary-button-chatgpt"
                onClick={() => setIsJarvisModalOpen(true)}
              >
                Узнать больше
              </button>
            </div>

            <div className="hero-features-chatgpt">
              <div className="feature-item-chatgpt">
                <div className="feature-icon-chatgpt">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Современный дизайн</span>
              </div>
              <div className="feature-item-chatgpt">
                <div className="feature-icon-chatgpt">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Высокая производительность</span>
              </div>
              <div className="feature-item-chatgpt">
                <div className="feature-icon-chatgpt">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>ИИ интеграция</span>
              </div>
            </div>
          </div>

          <div className="hero-visual-chatgpt">
            <div className="model-viewer-chatgpt">
              <LiquidSphere className="hero-liquid-sphere" />
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно процесса договора */}
      {isProcessModalOpen && (
        <div className="modal-overlay-chatgpt" onClick={() => setIsProcessModalOpen(false)}>
          <div className="modal-content-chatgpt" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-chatgpt">
              <h2>Процесс работы с нами</h2>
              <button
                className="modal-close-chatgpt"
                onClick={() => setIsProcessModalOpen(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="modal-body-chatgpt">
              <div className="process-step-chatgpt">
                <div className="step-number-chatgpt">1</div>
                <div className="step-content-chatgpt">
                  <h3>Создание макета</h3>
                  <p>Сначала мы создаем детальный макет вашего проекта. Это включает в себя дизайн всех страниц, структуру сайта и техническое задание. На этом этапе вы видите как будет выглядеть конечный результат.</p>
                </div>
              </div>

              <div className="process-step-chatgpt">
                <div className="step-number-chatgpt">2</div>
                <div className="step-content-chatgpt">
                  <h3>Согласование и предоплата</h3>
                  <p>Если макет и техническое решение вас устраивает, мы заключаем договор и получаем предоплату 50 процентов от стоимости проекта. Это позволяет нам приступить к разработке с полной уверенностью.</p>
                </div>
              </div>

              <div className="process-step-chatgpt">
                <div className="step-number-chatgpt">3</div>
                <div className="step-content-chatgpt">
                  <h3>Разработка проекта</h3>
                  <p>Приступаем к программированию и созданию вашего проекта. Макет корректируется и дорабатывается в процессе работы для достижения наилучшего результата. Мы не меняем макет по несколько раз без весомых оснований.</p>
                </div>
              </div>

              <div className="process-step-chatgpt">
                <div className="step-number-chatgpt">4</div>
                <div className="step-content-chatgpt">
                  <h3>Тестирование и доработки</h3>
                  <p>Проводим полное тестирование функционала, проверяем адаптивность на всех устройствах, оптимизируем скорость загрузки. Исправляем выявленные ошибки и дорабатываем детали по вашим пожеланиям.</p>
                </div>
              </div>

              <div className="process-step-chatgpt">
                <div className="step-number-chatgpt">5</div>
                <div className="step-content-chatgpt">
                  <h3>Сдача проекта</h3>
                  <p>После завершения разработки и получения окончательного платежа мы передаем вам готовый проект. Предоставляем инструкции по использованию, помогаем с размещением на хостинге и даем гарантию на исправление ошибок.</p>
                </div>
              </div>

              <div className="process-step-chatgpt">
                <div className="step-number-chatgpt">6</div>
                <div className="step-content-chatgpt">
                  <h3>Поддержка и развитие</h3>
                  <p>Предлагаем техническую поддержку проекта, обновления и добавление новых функций. Помогаем масштабировать ваш бизнес с помощью дополнительных ИИ решений и интеграций.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Модальное окно возможностей ДЖАРВИС */}
      {isJarvisModalOpen && (
        <div className="modal-overlay-chatgpt" onClick={() => setIsJarvisModalOpen(false)}>
          <div className="modal-content-chatgpt" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-chatgpt">
              <h2>ДЖАРВИС - Революционный ИИ для вашего бизнеса</h2>
              <button
                className="modal-close-chatgpt"
                onClick={() => setIsJarvisModalOpen(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="modal-body-chatgpt">
              <div className="process-step-chatgpt">
                <div className="step-number-chatgpt">🧠</div>
                <div className="step-content-chatgpt">
                  <h3>Умный помощник продаж</h3>
                  <p>ДЖАРВИС анализирует поведение каждого клиента в реальном времени и предлагает именно те товары, которые им нужны. Он понимает предпочтения покупателей лучше, чем они сами, изучая их историю покупок и поисковые запросы.</p>
                </div>
              </div>

              <div className="process-step-chatgpt">
                <div className="step-number-chatgpt">💬</div>
                <div className="step-content-chatgpt">
                  <h3>Общение как с живым консультантом</h3>
                  <p>Наш ИИ общается с клиентами естественно и дружелюбно, отвечает на любые вопросы о товарах, помогает с выбором размера, цвета, характеристик. Клиенты даже не замечают, что говорят с роботом - настолько живое и понятное общение.</p>
                </div>
              </div>

              <div className="process-step-chatgpt">
                <div className="step-number-chatgpt">🎯</div>
                <div className="step-content-chatgpt">
                  <h3>Персональные рекомендации</h3>
                  <p>ДЖАРВИС создает уникальный профиль каждого покупателя и предлагает товары, которые идеально подходят именно ему. Система учитывает сезон, праздники, предыдущие покупки и даже настроение клиента по его сообщениям.</p>
                </div>
              </div>

              <div className="process-step-chatgpt">
                <div className="step-number-chatgpt">📈</div>
                <div className="step-content-chatgpt">
                  <h3>Увеличение продаж в 3 раза</h3>
                  <p>Магазины с ДЖАРВИС показывают фантастические результаты. Продажи вырастают в среднем на 300 процентов. Клиенты покупают больше, возвращаются чаще и рекомендуют магазин друзьям. Средний чек увеличивается в 2 или 4 раза.</p>
                </div>
              </div>

              <div className="process-step-chatgpt">
                <div className="step-number-chatgpt">⚡</div>
                <div className="step-content-chatgpt">
                  <h3>Мгновенная поддержка 24 часа в сутки</h3>
                  <p>ДЖАРВИС никогда не спит, не устает и не берет выходные. Он отвечает клиентам мгновенно в любое время дня и ночи, обрабатывает сотни обращений одновременно и никогда не теряет терпение даже с самыми сложными покупателями.</p>
                </div>
              </div>

              <div className="process-step-chatgpt">
                <div className="step-number-chatgpt">🚀</div>
                <div className="step-content-chatgpt">
                  <h3>Простая интеграция и быстрый запуск</h3>
                  <p>Подключение ДЖАРВИС к вашему магазину занимает всего несколько дней. Никаких сложных настроек. Система сама изучает ваш ассортимент, цены и особенности бизнеса. Через неделю вы уже видите первые результаты роста продаж.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .hero-section-chatgpt {
          background: #ffffff;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding-top: 100px; /* Добавляем отступ для fixed navbar */
        }

        .hero-container-chatgpt {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          width: 100%;
        }

        .hero-main-chatgpt {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
          padding: 80px 0;
        }

        .hero-content-chatgpt {
          max-width: 500px;
        }

        .hero-title-chatgpt {
          font-size: 48px;
          font-weight: 600;
          line-height: 1.1;
          color: #000000;
          margin-bottom: 24px;
          position: relative;
        }

        .hero-description-chatgpt {
          font-size: 18px;
          line-height: 1.6;
          color: #666666;
          margin-bottom: 32px;
        }

        .hero-cta-chatgpt {
          display: flex;
          gap: 16px;
          margin-bottom: 48px;
        }

        .primary-button-chatgpt {
          background: #000000;
          color: #ffffff;
          border: none;
          padding: 14px 28px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .primary-button-chatgpt:hover {
          background: #333333;
        }

        .secondary-button-chatgpt {
          background: none;
          color: #000000;
          border: 1px solid #e5e5e5;
          padding: 14px 28px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .secondary-button-chatgpt:hover {
          background: #f5f5f5;
        }

        .hero-features-chatgpt {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .feature-item-chatgpt {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #666666;
          font-size: 14px;
        }

        .feature-icon-chatgpt {
          width: 20px;
          height: 20px;
          color: #000000;
        }

        /* Темная тема для Hero секции */
        body.dark-theme .hero-section-chatgpt {
          background: #000000;
        }

        body.dark-theme .hero-title-chatgpt {
          color: #ffffff;
        }

        body.dark-theme .hero-description-chatgpt {
          color: #cccccc;
        }

        body.dark-theme .feature-item-chatgpt {
          color: #cccccc;
        }

        body.dark-theme .feature-icon-chatgpt {
          color: #ffffff;
        }

        body.dark-theme .primary-button-chatgpt {
          background: #ffffff;
          color: #000000;
        }

        body.dark-theme .primary-button-chatgpt:hover {
          background: #f0f0f0;
        }

        body.dark-theme .secondary-button-chatgpt {
          background: none;
          color: #ffffff;
          border-color: #555555;
        }

        body.dark-theme .secondary-button-chatgpt:hover {
          background: #333333;
        }

        body.dark-theme .model-viewer-chatgpt {
          background: transparent;
          border: none;
        }

        body.dark-theme .placeholder-text-chatgpt {
          color: #ffffff;
        }

        body.dark-theme .placeholder-icon-chatgpt {
          color: #ffffff;
        }

        body.dark-theme .loading-dots-chatgpt span {
          background: #ffffff;
        }

        .placeholder-description-chatgpt {
          font-size: 12px;
          color: #999999;
          margin: 8px 0 0 0;
          line-height: 1.4;
        }

        body.dark-theme .placeholder-description-chatgpt {
          color: #cccccc;
        }

        body.dark-theme .modal-content-chatgpt {
          background: #111111;
          color: #ffffff;
        }

        body.dark-theme .modal-header-chatgpt {
          border-bottom: 1px solid #333333;
        }

        body.dark-theme .modal-header-chatgpt h2 {
          color: #ffffff;
        }

        body.dark-theme .modal-close-chatgpt {
          color: #cccccc;
        }

        body.dark-theme .modal-close-chatgpt:hover {
          background: #333333;
          color: #ffffff;
        }

        body.dark-theme .step-number-chatgpt {
          background: #ffffff;
          color: #000000;
        }

        body.dark-theme .step-content-chatgpt h3 {
          color: #ffffff;
        }

        body.dark-theme .step-content-chatgpt p {
          color: #cccccc;
        }

        .hero-visual-chatgpt {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .model-viewer-chatgpt {
          background: transparent;
          border: none;
          border-radius: 20px;
          width: 100%;
          max-width: 500px;
          height: 400px;
          box-shadow: none;
          overflow: hidden;
          position: relative;
        }

        .model-container-chatgpt {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .model-placeholder-chatgpt {
          text-align: center;
          color: #666666;
        }

        .placeholder-icon-chatgpt {
          margin-bottom: 16px;
          color: #cccccc;
          opacity: 0.8;
        }

        .placeholder-text-chatgpt {
          font-size: 16px;
          font-weight: 500;
          margin: 0 0 16px 0;
          color: #999999;
        }

        .loading-dots-chatgpt {
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .loading-dots-chatgpt span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #cccccc;
          animation: loadingDots 1.4s ease-in-out infinite;
        }

        .loading-dots-chatgpt span:nth-child(1) {
          animation-delay: 0s;
        }

        .loading-dots-chatgpt span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .loading-dots-chatgpt span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes loadingDots {
          0%, 60%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          30% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        /* 3D Model styles when loaded */
        .model-canvas-chatgpt {
          width: 100%;
          height: 100%;
          border-radius: 20px;
        }

        .model-controls-chatgpt {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          background: rgba(0, 0, 0, 0.7);
          padding: 8px 16px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }

        .model-control-btn-chatgpt {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.2s ease;
        }

        .model-control-btn-chatgpt:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        /* Модальное окно */
        .modal-overlay-chatgpt {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          backdrop-filter: blur(4px);
        }

        .modal-content-chatgpt {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .modal-header-chatgpt {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 32px;
          border-bottom: 1px solid #e5e5e5;
        }

        .modal-header-chatgpt h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          color: #000000;
        }

        .modal-close-chatgpt {
          background: none;
          border: none;
          color: #666666;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .modal-close-chatgpt:hover {
          background: #f5f5f5;
          color: #000000;
        }

        .modal-body-chatgpt {
          padding: 32px;
        }

        .process-step-chatgpt {
          display: flex;
          gap: 20px;
          margin-bottom: 32px;
          align-items: flex-start;
        }

        .step-number-chatgpt {
          width: 40px;
          height: 40px;
          background: #000000;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 16px;
          flex-shrink: 0;
        }

        .step-content-chatgpt {
          flex: 1;
        }

        .step-content-chatgpt h3 {
          margin: 0 0 12px 0;
          font-size: 18px;
          font-weight: 600;
          color: #000000;
        }

        .step-content-chatgpt p {
          margin: 0;
          font-size: 15px;
          line-height: 1.6;
          color: #666666;
        }


        @media (max-width: 768px) {
          .hero-section-chatgpt {
            padding-top: 80px;
          }

          .hero-main-chatgpt {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 40px 0;
          }

          .hero-title-chatgpt {
            font-size: 32px;
          }

          .hero-cta-chatgpt {
            flex-direction: column;
          }

          .model-viewer-chatgpt {
            max-width: 100%;
            height: 320px;
          }

          .placeholder-icon-chatgpt svg {
            width: 48px;
            height: 48px;
          }

          .placeholder-text-chatgpt {
            font-size: 14px;
          }

          .modal-content-chatgpt {
            margin: 10px;
            max-height: 95vh;
          }

          .modal-header-chatgpt {
            padding: 20px;
          }

          .modal-body-chatgpt {
            padding: 20px;
          }

          .process-step-chatgpt {
            gap: 16px;
            margin-bottom: 24px;
          }

          .step-number-chatgpt {
            width: 32px;
            height: 32px;
            font-size: 14px;
          }

        }
      `}</style>
    </section>
  )
}
