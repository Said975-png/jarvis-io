import { useState } from 'react'

export default function Benefits() {
  const [activeTab, setActiveTab] = useState('conversation')

  return (
    <section className="benefits-section-chatgpt">
      <div className="benefits-container-chatgpt">
        {/* Main Content */}
        <div className="benefits-main-chatgpt">
          <div className="benefits-content-chatgpt">
            <h2 className="benefits-title-chatgpt">
              ДЖАРВИС заменяет целую команду продавцов-консультантов
            </h2>

            <p className="benefits-description-chatgpt">
              Один умный ассистент выполняет работу десятков сотрудников. ДЖАРВИС 
              ведет естественные диалоги с клиентами, предлагает товары, консультирует 
              и находит лучшие предложения 24 часа в сутки без перерывов и выходных.
            </p>

            <div className="benefits-list-chatgpt">
              <div className="benefit-item-chatgpt">
                <div className="benefit-icon-chatgpt">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="m22 21-3-3m0 0a5 5 0 1 0-7 0l3 3a5 5 0 0 0 7 0z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <h4>Замена штата продавцов</h4>
                  <p>Один ИИ = 20+ консультантов</p>
                </div>
              </div>
              <div className="benefit-item-chatgpt">
                <div className="benefit-icon-chatgpt">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <h4>Умный подбор товаров</h4>
                  <p>Анализирует потребности клиента</p>
                </div>
              </div>
              <div className="benefit-item-chatgpt">
                <div className="benefit-icon-chatgpt">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H6L10 22L14 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <h4>Живое общение</h4>
                  <p>Общается как человек</p>
                </div>
              </div>
              <div className="benefit-item-chatgpt">
                <div className="benefit-icon-chatgpt">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2v6m6 2-6 6-6-6" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="21" r="1" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <h4>Поиск выгодных аналогов</h4>
                  <p>Находит дешевые альтернативы</p>
                </div>
              </div>
            </div>

            <div className="benefits-stats-chatgpt">
              <div className="stat-chatgpt">
                <div className="stat-number-chatgpt">1 ИИ</div>
                <div className="stat-label-chatgpt">заменяет 20+ сотрудников</div>
              </div>
              <div className="stat-chatgpt">
                <div className="stat-number-chatgpt">24 часа</div>
                <div className="stat-label-chatgpt">без перерывов</div>
              </div>
              <div className="stat-chatgpt">
                <div className="stat-number-chatgpt">90%</div>
                <div className="stat-label-chatgpt">экономия на зарплатах</div>
              </div>
            </div>
          </div>

          <div className="benefits-visual-chatgpt">
            <div className="tabs-chatgpt">
              <button 
                className={`tab-button-chatgpt ${activeTab === 'conversation' ? 'active' : ''}`}
                onClick={() => setActiveTab('conversation')}
              >
                Диалог с клиентом
              </button>
            </div>

            {activeTab === 'conversation' && (
              <div className="ai-conversation-chatgpt">
                <div className="conversation-header-chatgpt">
                  <div className="user-info-chatgpt">
                    <div className="user-avatar-chatgpt">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 14c-6 0-8 4-8 6v2h16v-2c0-2-2-6-8-6z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                    <div className="conversation-info-chatgpt">
                      <div className="user-name-chatgpt">Клиент</div>
                      <div className="online-status-chatgpt">
                        <div className="status-dot-chatgpt"></div>
                        онлайн
                      </div>
                    </div>
                  </div>
                  <div className="jarvis-badge-chatgpt">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                    JARVIS
                  </div>
                </div>
                
                <div className="conversation-messages-chatgpt">
                  <div className="message-chatgpt user-message">
                    <div className="message-content-chatgpt">
                      <div className="message-text-chatgpt">Мне нужен хороший смартфон до 300$</div>
                      <div className="message-time-chatgpt">14:32</div>
                    </div>
                  </div>
                  
                  <div className="message-chatgpt jarvis-message">
                    <div className="jarvis-avatar-chatgpt">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                      </svg>
                    </div>
                    <div className="message-content-chatgpt">
                      <div className="message-text-chatgpt">
                        Отличный выбор! Рекомендую Samsung Galaxy A54 5G. 
                        Отличная камера, быстрая работа, цена $280. 
                        Хотите подробнее о характеристиках?
                      </div>
                      <div className="message-time-chatgpt">14:32</div>
                    </div>
                  </div>
                  
                  <div className="message-chatgpt user-message">
                    <div className="message-content-chatgpt">
                      <div className="message-text-chatgpt">А есть что-то похожее, но дешевле?</div>
                      <div className="message-time-chatgpt">14:33</div>
                    </div>
                  </div>
                  
                  <div className="message-chatgpt jarvis-message">
                    <div className="jarvis-avatar-chatgpt">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                      </svg>
                    </div>
                    <div className="message-content-chatgpt">
                      <div className="message-text-chatgpt">
                        Конечно! Galaxy A34 5G за $240 - практически те же возможности, 
                        немного слабее процессор. Сэкономите $40 при схожем качестве.
                        Добавить в корзину?
                      </div>
                      <div className="message-time-chatgpt">14:33</div>
                      <div className="message-actions-chatgpt">
                        <button className="action-btn-chatgpt">Galaxy A34</button>
                        <button className="action-btn-chatgpt">В корзину</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="typing-indicator-chatgpt">
                    <div className="jarvis-avatar-chatgpt">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                      </svg>
                    </div>
                    <div className="typing-content-chatgpt">
                      <div className="typing-dots-chatgpt">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <span className="typing-text-chatgpt">JARVIS печатает</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <style jsx>{`
        .benefits-section-chatgpt {
          background: #ffffff;
          padding: 80px 24px;
        }

        .benefits-container-chatgpt {
          max-width: 1200px;
          margin: 0 auto;
        }

        .benefits-main-chatgpt {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .benefits-content-chatgpt {
          max-width: 500px;
        }

        .benefits-title-chatgpt {
          font-size: 48px;
          font-weight: 600;
          line-height: 1.1;
          color: #000000;
          margin-bottom: 24px;
        }

        .benefits-description-chatgpt {
          font-size: 18px;
          line-height: 1.6;
          color: #666666;
          margin-bottom: 48px;
        }

        .benefits-list-chatgpt {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-bottom: 48px;
        }

        .benefit-item-chatgpt {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .benefit-item-chatgpt:hover {
          border-color: #000000;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .benefit-icon-chatgpt {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f8f8;
          border-radius: 8px;
          color: #000000;
          flex-shrink: 0;
        }

        .benefit-item-chatgpt h4 {
          font-size: 16px;
          font-weight: 600;
          color: #000000;
          margin: 0 0 4px 0;
        }

        .benefit-item-chatgpt p {
          font-size: 14px;
          color: #666666;
          margin: 0;
        }

        .benefits-stats-chatgpt {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          padding: 32px 0;
          border-top: 1px solid #e5e5e5;
        }

        .stat-chatgpt {
          text-align: center;
        }

        .stat-number-chatgpt {
          font-size: 24px;
          font-weight: 700;
          color: #000000;
          margin-bottom: 8px;
        }

        .stat-label-chatgpt {
          color: #666666;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .benefits-visual-chatgpt {
          display: flex;
          flex-direction: column;
        }

        .tabs-chatgpt {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
        }

        .tab-button-chatgpt {
          padding: 12px 20px;
          background: none;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          color: #666666;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .tab-button-chatgpt.active {
          background: #000000;
          color: #ffffff;
          border-color: #000000;
        }

        .tab-button-chatgpt:hover:not(.active) {
          border-color: #000000;
          color: #000000;
        }

        .ai-conversation-chatgpt {
          background: #ffffff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          overflow: hidden;
        }

        .conversation-header-chatgpt {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #e5e5e5;
          background: #f8f8f8;
        }

        .user-info-chatgpt {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar-chatgpt {
          width: 32px;
          height: 32px;
          background: #e5e5e5;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666666;
        }

        .user-name-chatgpt {
          font-weight: 600;
          color: #000000;
          font-size: 14px;
        }

        .online-status-chatgpt {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #666666;
        }

        .status-dot-chatgpt {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
        }

        .jarvis-badge-chatgpt {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #000000;
          color: #ffffff;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
        }

        .conversation-messages-chatgpt {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-height: 350px;
          overflow-y: auto;
        }

        .message-chatgpt {
          display: flex;
          gap: 8px;
          align-items: flex-start;
        }

        .user-message {
          justify-content: flex-end;
        }

        .user-message .message-content-chatgpt {
          background: #000000;
          color: #ffffff;
          max-width: 70%;
        }

        .jarvis-message {
          justify-content: flex-start;
        }

        .jarvis-message .message-content-chatgpt {
          background: #f5f5f5;
          color: #000000;
          max-width: 70%;
        }

        .jarvis-avatar-chatgpt {
          width: 24px;
          height: 24px;
          background: #000000;
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .message-content-chatgpt {
          padding: 12px 16px;
          border-radius: 18px;
        }

        .message-text-chatgpt {
          font-size: 14px;
          line-height: 1.4;
          margin-bottom: 4px;
        }

        .message-time-chatgpt {
          font-size: 12px;
          opacity: 0.7;
        }

        .message-actions-chatgpt {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }

        .action-btn-chatgpt {
          background: #ffffff;
          color: #000000;
          border: 1px solid #e5e5e5;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn-chatgpt:hover {
          border-color: #000000;
        }

        .typing-indicator-chatgpt {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .typing-content-chatgpt {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f5f5f5;
          padding: 12px 16px;
          border-radius: 18px;
        }

        .typing-dots-chatgpt {
          display: flex;
          gap: 4px;
        }

        .typing-dots-chatgpt span {
          width: 6px;
          height: 6px;
          background: #999999;
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }

        .typing-dots-chatgpt span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dots-chatgpt span:nth-child(3) {
          animation-delay: 0.4s;
        }

        .typing-text-chatgpt {
          font-size: 12px;
          color: #666666;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        .savings-calculator-chatgpt {
          background: #ffffff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          overflow: hidden;
        }

        .calculator-header-chatgpt {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid #e5e5e5;
          background: #f8f8f8;
          font-weight: 600;
          color: #000000;
        }

        .calculator-icon-chatgpt {
          color: #000000;
        }

        .calculator-content-chatgpt {
          padding: 20px;
        }

        .calculation-row-chatgpt {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          font-size: 14px;
        }

        .calc-label-chatgpt {
          color: #000000;
        }

        .calc-value-chatgpt {
          font-weight: 600;
        }

        .calc-value-chatgpt.negative {
          color: #ef4444;
        }

        .calc-value-chatgpt.positive {
          color: #10b981;
        }

        .calc-value-chatgpt.savings {
          color: #000000;
          font-size: 18px;
          font-weight: 700;
        }

        .calculation-divider-chatgpt {
          height: 1px;
          background: #e5e5e5;
          margin: 16px 0;
        }

        .calculation-row-chatgpt.total {
          font-weight: 600;
          padding: 16px 0 8px 0;
        }

        .savings-percent-chatgpt {
          text-align: center;
          background: #f0f9ff;
          color: #0369a1;
          padding: 12px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          margin-top: 16px;
        }

        @media (max-width: 768px) {
          .benefits-section-chatgpt {
            padding: 60px 16px;
          }

          .benefits-main-chatgpt {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .benefits-title-chatgpt {
            font-size: 32px;
          }

          .benefits-description-chatgpt {
            font-size: 16px;
          }

          .benefits-stats-chatgpt {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .tabs-chatgpt {
            flex-direction: column;
          }

          .message-content-chatgpt {
            max-width: 85%;
          }

          .conversation-messages-chatgpt {
            max-height: 250px;
          }
        }
      `}</style>
    </section>
  )
}
