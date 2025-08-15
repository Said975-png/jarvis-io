import { useState } from 'react'
import { useCart } from '../contexts/CartContext'

const pricingPlans = [
  {
    id: 'basic',
    name: 'Basic',
    subtitle: 'Стартовое решение',
    price: '2500000',
    period: 'сумм',
    description: 'Идеально для небольших проектов и стартапов',
    popular: false,
    features: [
      'До 5 страниц сайта',
      'Современный дизайн',
      'Адаптивная верстка',
      'SEO оптимизация',
      'Техподдержка email'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    subtitle: 'Лучший выбор',
    price: '4000000',
    period: 'сумм',
    description: 'Лучший выбор для растущего бизнеса',
    popular: true,
    features: [
      'Все из Basic',
      'До 15 страниц сайта',
      'ИИ ассистент интеграция',
      'Продвинутая аналитика',
      'Приоритетная поддержка'
    ]
  },
  {
    id: 'max',
    name: 'Max',
    subtitle: 'Премиум решение',
    price: '5000000',
    period: 'сумм',
    description: 'Максимум возможностей для крупного бизнеса',
    popular: false,
    features: [
      'Все из Pro',
      'Безлимитные страницы',
      'ДЖАРВИС ИИ полная версия',
      'Индивидуальные решения',
      'VIP поддержка 24 часа в сутки'
    ]
  }
]

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const { addToCart } = useCart()

  const handleAddToCart = (plan: typeof pricingPlans[0]) => {
    addToCart({
      id: plan.id,
      name: plan.name,
      subtitle: plan.subtitle,
      price: plan.price,
      period: plan.period,
      features: plan.features
    })
  }

  return (
    <section className="pricing-section-chatgpt">
      <div className="pricing-container-chatgpt">
        {/* Header */}
        <div className="pricing-header-chatgpt">
          <h2 className="pricing-title-chatgpt">
            Выберите подходящий план
          </h2>
          
          <p className="pricing-description-chatgpt">
            Прозрачные цены для проектов любого размера. Начните бесплатно и масштабируйтесь по мере роста.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-grid-chatgpt">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card-chatgpt ${plan.popular ? 'popular-card' : ''} ${selectedPlan === plan.id ? 'selected' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="popular-badge-chatgpt">
                  Популярный
                </div>
              )}

              {/* Card Content */}
              <div className="card-content-chatgpt">
                {/* Plan Header */}
                <div className="plan-header-chatgpt">
                  <h3 className="plan-name-chatgpt">{plan.name}</h3>
                  <p className="plan-subtitle-chatgpt">{plan.subtitle}</p>
                </div>

                {/* Pricing */}
                <div className="plan-pricing-chatgpt">
                  <div className="price-display-chatgpt">
                    <span className="price-amount-chatgpt">{plan.price}</span>
                  </div>
                  <p className="price-period-chatgpt">{plan.period}</p>
                  <p className="price-description-chatgpt">{plan.description}</p>
                </div>

                {/* Features */}
                <div className="plan-features-chatgpt">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="feature-item-chatgpt">
                      <div className="feature-icon-chatgpt">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="feature-text-chatgpt">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <button
                  className="plan-button-chatgpt"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddToCart(plan)
                  }}
                >
                  Выбрать {plan.name}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      <style jsx>{`
        .pricing-section-chatgpt {
          background: #ffffff;
          padding: 80px 24px;
        }

        .pricing-container-chatgpt {
          max-width: 1200px;
          margin: 0 auto;
        }

        .pricing-header-chatgpt {
          text-align: center;
          margin-bottom: 64px;
        }

        .pricing-title-chatgpt {
          font-size: 48px;
          font-weight: 600;
          color: #000000;
          margin-bottom: 16px;
          line-height: 1.2;
        }

        .pricing-description-chatgpt {
          font-size: 18px;
          color: #666666;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .pricing-grid-chatgpt {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          margin-bottom: 64px;
        }

        .pricing-card-chatgpt {
          background: #ffffff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 32px;
          transition: all 0.2s ease;
          cursor: pointer;
          position: relative;
        }

        .pricing-card-chatgpt:hover {
          border-color: #000000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .popular-card {
          border-color: #000000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .selected {
          border-color: #000000;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .popular-badge-chatgpt {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #000000;
          color: #ffffff;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .card-content-chatgpt {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 100%;
        }

        .plan-header-chatgpt {
          text-align: center;
          margin-bottom: 24px;
        }

        .plan-name-chatgpt {
          font-size: 24px;
          font-weight: 600;
          color: #000000;
          margin-bottom: 8px;
        }

        .plan-subtitle-chatgpt {
          color: #666666;
          font-size: 14px;
          font-weight: 500;
        }

        .plan-pricing-chatgpt {
          text-align: center;
          margin-bottom: 32px;
        }

        .price-display-chatgpt {
          margin-bottom: 8px;
        }

        .price-amount-chatgpt {
          font-size: 32px;
          font-weight: 700;
          color: #000000;
          line-height: 1;
        }

        .price-period-chatgpt {
          color: #666666;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .price-description-chatgpt {
          color: #666666;
          font-size: 14px;
          line-height: 1.5;
        }

        .plan-features-chatgpt {
          margin-bottom: 32px;
        }

        .feature-item-chatgpt {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          padding: 12px 0;
        }

        .feature-icon-chatgpt {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000000;
        }

        .feature-text-chatgpt {
          color: #000000;
          font-size: 14px;
          line-height: 1.4;
        }

        .plan-button-chatgpt {
          width: 100%;
          padding: 14px 24px;
          background: #000000;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .plan-button-chatgpt:hover {
          background: #333333;
        }

        .popular-card .plan-button-chatgpt {
          background: #000000;
        }

        .popular-card .plan-button-chatgpt:hover {
          background: #333333;
        }

        .pricing-cta-chatgpt {
          text-align: center;
          padding-top: 48px;
          border-top: 1px solid #e5e5e5;
        }

        .cta-text-chatgpt {
          color: #666666;
          margin-bottom: 24px;
          font-size: 16px;
          line-height: 1.5;
        }

        .cta-button-chatgpt {
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

        .cta-button-chatgpt:hover {
          background: #f5f5f5;
          border-color: #000000;
        }

        @media (max-width: 768px) {
          .pricing-section-chatgpt {
            padding: 60px 16px;
          }

          .pricing-title-chatgpt {
            font-size: 32px;
          }

          .pricing-description-chatgpt {
            font-size: 16px;
          }

          .pricing-grid-chatgpt {
            grid-template-columns: 1fr;
            gap: 20px;
            margin-bottom: 48px;
          }

          .pricing-card-chatgpt {
            padding: 24px 20px 50px 20px;
            margin: 0 4px 16px 4px;
            min-height: 500px;
          }

          .popular-card {
            min-height: 680px !important;
            padding-bottom: 40px !important;
          }

          .popular-badge-chatgpt {
            position: static;
            transform: none;
            display: inline-block;
            margin-bottom: 16px;
          }

          .plan-header-chatgpt {
            margin-bottom: 20px;
          }

          .plan-pricing-chatgpt {
            margin-bottom: 24px;
          }

          .plan-features-chatgpt {
            margin-bottom: 16px;
          }

          .popular-card .plan-features-chatgpt {
            margin-bottom: 12px;
          }

          .plan-button-chatgpt {
            padding: 16px 20px;
            font-size: 15px;
            width: 100%;
            box-sizing: border-box;
            position: relative;
          }

          .pricing-cta-chatgpt {
            padding-top: 32px;
          }

          .cta-text-chatgpt {
            margin-bottom: 20px;
          }
        }
      `}</style>
    </section>
  )
}
