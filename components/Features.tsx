import { useState } from 'react'

const features = [
  {
    id: 'ai-assistant',
    title: 'ДЖАРВИС ИИ ассистент',
    description: 'Умный помощник для разработки, который понимает контекст и помогает решать задачи',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    stats: '99.8% точность'
  },
  {
    id: 'automation',
    title: 'Автоматизация',
    description: 'Автоматические процессы разработки и развертывания для ускорения работы',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2"/>
        <polyline points="3.27,6.96 12,12.01 20.73,6.96" stroke="currentColor" strokeWidth="2"/>
        <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    stats: '10x быстрее'
  },
  {
    id: 'analytics',
    title: 'Аналитика',
    description: 'Глубокий анализ пользовательского поведения и оптимизация конверсии',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 17V7C3 5.9 3.9 5 5 5H19C20.1 5 21 5.9 21 7V17C21 18.1 20.1 19 19 19H5C3.9 19 3 18.1 3 17Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M7 13L10 10L13 13L17 9" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    stats: '3x рост продаж'
  }
]

export default function Features() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)

  return (
    <section className="features-section-chatgpt">
      <div className="features-container-chatgpt">
        {/* Header */}
        <div className="features-header-chatgpt">
          <h2 className="features-title-chatgpt">
            Возможности нашей платформы
          </h2>
          
          <p className="features-description-chatgpt">
            Используйте мощь искусственного интеллекта для создания веб-решений нового поколения
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-grid-chatgpt">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`feature-card-chatgpt ${selectedFeature === feature.id ? 'selected' : ''}`}
              onClick={() => setSelectedFeature(selectedFeature === feature.id ? null : feature.id)}
            >
              <div className="feature-icon-chatgpt">
                {feature.icon}
              </div>
              
              <div className="feature-content-chatgpt">
                <h3 className="feature-title-chatgpt">{feature.title}</h3>
                <p className="feature-description-chatgpt">{feature.description}</p>
                
                <div className="feature-stats-chatgpt">
                  {feature.stats}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="stats-section-chatgpt">
          <div className="stats-grid-chatgpt">
            <div className="stat-item-chatgpt">
              <div className="stat-number-chatgpt">95%</div>
              <div className="stat-label-chatgpt">Удовлетворенность клиентов</div>
            </div>
            <div className="stat-item-chatgpt">
              <div className="stat-number-chatgpt">430+</div>
              <div className="stat-label-chatgpt">Активных пользователей</div>
            </div>
            <div className="stat-item-chatgpt">
              <div className="stat-number-chatgpt">24 часа</div>
              <div className="stat-label-chatgpt">Техподдержка</div>
            </div>
            <div className="stat-item-chatgpt">
              <div className="stat-number-chatgpt">0.3s</div>
              <div className="stat-label-chatgpt">Время отклика ИИ</div>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        .features-section-chatgpt {
          background: #ffffff;
          padding: 80px 24px;
        }

        .features-container-chatgpt {
          max-width: 1200px;
          margin: 0 auto;
        }

        .features-header-chatgpt {
          text-align: center;
          margin-bottom: 64px;
        }

        .features-title-chatgpt {
          font-size: 48px;
          font-weight: 600;
          color: #000000;
          margin-bottom: 16px;
          line-height: 1.2;
        }

        .features-description-chatgpt {
          font-size: 18px;
          color: #666666;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .features-grid-chatgpt {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 80px;
        }

        .feature-card-chatgpt {
          background: #ffffff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 32px;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .feature-card-chatgpt:hover {
          border-color: #000000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .feature-card-chatgpt.selected {
          border-color: #000000;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .feature-icon-chatgpt {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f8f8;
          border-radius: 12px;
          margin-bottom: 20px;
          color: #000000;
        }

        .feature-content-chatgpt {
          flex: 1;
        }

        .feature-title-chatgpt {
          font-size: 20px;
          font-weight: 600;
          color: #000000;
          margin-bottom: 12px;
        }

        .feature-description-chatgpt {
          color: #666666;
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .feature-stats-chatgpt {
          color: #000000;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stats-section-chatgpt {
          padding: 48px 0;
          border-top: 1px solid #e5e5e5;
          border-bottom: 1px solid #e5e5e5;
          margin-bottom: 80px;
        }

        .stats-grid-chatgpt {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 32px;
        }

        .stat-item-chatgpt {
          text-align: center;
        }

        .stat-number-chatgpt {
          font-size: 32px;
          font-weight: 700;
          color: #000000;
          margin-bottom: 8px;
        }

        .stat-label-chatgpt {
          color: #666666;
          font-size: 14px;
        }


        @media (max-width: 768px) {
          .features-section-chatgpt {
            padding: 60px 16px;
          }

          .features-title-chatgpt {
            font-size: 32px;
          }

          .features-description-chatgpt {
            font-size: 16px;
          }

          .features-grid-chatgpt {
            grid-template-columns: 1fr;
            gap: 20px;
            margin-bottom: 60px;
          }

          .feature-card-chatgpt {
            padding: 24px;
          }

          .stats-grid-chatgpt {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }

        }
      `}</style>
    </section>
  )
}
