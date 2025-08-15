import { useRouter } from 'next/router'

export default function Footer() {
  const router = useRouter()

  const scrollToSection = (sectionClass: string) => {
    if (router.pathname !== '/') {
      router.push('/')
      setTimeout(() => {
        const element = document.querySelector(sectionClass)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } else {
      const element = document.querySelector(sectionClass)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  const scrollToTop = () => {
    if (router.pathname !== '/') {
      router.push('/')
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      <div className="footer-overlay-chatgpt"></div>
      <footer className="footer-chatgpt">
      <div className="footer-container-chatgpt">
        {/* Main Footer Content */}
        <div className="footer-main-chatgpt">
          {/* Logo and Description */}
          <div className="footer-brand-chatgpt">
            <div className="footer-logo-chatgpt">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fb3f5046887d8470c82b60bfa8668fc6d%2F344c594fabe14ed7b0083952ee013ca1?format=webp&width=800"
                alt="JARVIS Logo"
                width="32"
                height="32"
              />
              <span className="footer-logo-text-chatgpt">JARVIS</span>
            </div>
            <p className="footer-description-chatgpt">
              Революционный ИИ-ассистент, который понимает ваши потребности и превращает идеи в реальность. Будущее взаимодействия с технологиями уже здесь.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="footer-nav-chatgpt">
            <div className="footer-column-chatgpt">
              <h3 className="footer-heading-chatgpt">Продукт</h3>
              <ul className="footer-links-chatgpt">
                <li>
                  <button 
                    onClick={() => scrollToSection('.hero-section-chatgpt')}
                    className="footer-link-chatgpt"
                  >
                    Главная
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('.features-section-chatgpt')}
                    className="footer-link-chatgpt"
                  >
                    Возможности
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('.pricing-section-chatgpt')}
                    className="footer-link-chatgpt"
                  >
                    Тарифы
                  </button>
                </li>
              </ul>
            </div>


            <div className="footer-column-chatgpt">
              <h3 className="footer-heading-chatgpt">Компания</h3>
              <ul className="footer-links-chatgpt">
                <li>
                  <button 
                    onClick={() => scrollToSection('.hero-features-chatgpt')}
                    className="footer-link-chatgpt"
                  >
                    О проекте
                  </button>
                </li>
                <li>
                  <span className="footer-tech-chatgpt">Команда</span>
                </li>
                <li>
                  <span className="footer-tech-chatgpt">Карьера</span>
                </li>
                <li>
                  <span className="footer-tech-chatgpt">Блог</span>
                </li>
              </ul>
            </div>

            <div className="footer-column-chatgpt">
              <h3 className="footer-heading-chatgpt">Поддержка</h3>
              <ul className="footer-links-chatgpt">
                <li>
                  <span className="footer-tech-chatgpt">Документация</span>
                </li>
                <li>
                  <span className="footer-tech-chatgpt">API</span>
                </li>
                <li>
                  <span className="footer-tech-chatgpt">Статус</span>
                </li>
                <li>
                  <span className="footer-tech-chatgpt">Безопасность</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom-chatgpt">
          <div className="footer-bottom-left-chatgpt">
            <p className="footer-copyright-chatgpt">
              © 2025 JARVIS AI. Все права защищены.
            </p>
          </div>

          <div className="footer-bottom-right-chatgpt">
            <button 
              onClick={scrollToTop}
              className="back-to-top-chatgpt"
              aria-label="Вернуться наверх"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Наверх
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-chatgpt {
          background: #ffffff;
          border-top: 1px solid #e5e5e5;
          margin-top: 80px;
          position: relative;
          z-index: 1;
        }

        .footer-container-chatgpt {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 24px 32px;
        }

        .footer-main-chatgpt {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 80px;
          margin-bottom: 48px;
        }

        .footer-brand-chatgpt {
          max-width: 320px;
        }

        .footer-logo-chatgpt {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .footer-logo-text-chatgpt {
          font-size: 20px;
          font-weight: 600;
          color: #000000;
        }

        .footer-description-chatgpt {
          color: #666666;
          line-height: 1.6;
          font-size: 14px;
        }

        .footer-nav-chatgpt {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }

        .footer-column-chatgpt {
          display: flex;
          flex-direction: column;
        }

        .footer-heading-chatgpt {
          font-size: 14px;
          font-weight: 600;
          color: #000000;
          margin-bottom: 16px;
        }

        .footer-links-chatgpt {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-link-chatgpt {
          background: none;
          border: none;
          color: #666666;
          font-size: 14px;
          text-align: left;
          cursor: pointer;
          transition: color 0.2s ease;
          padding: 0;
        }

        .footer-link-chatgpt:hover {
          color: #000000;
        }

        .footer-tech-chatgpt {
          color: #666666;
          font-size: 14px;
          transition: color 0.2s ease;
        }

        .footer-bottom-chatgpt {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 32px;
          border-top: 1px solid #f0f0f0;
        }

        .footer-copyright-chatgpt {
          color: #999999;
          font-size: 12px;
          margin: 0;
        }

        .back-to-top-chatgpt {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: 1px solid #e5e5e5;
          color: #666666;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .back-to-top-chatgpt:hover {
          background: #f8f8f8;
          border-color: #d0d0d0;
          color: #000000;
        }

        @media (max-width: 768px) {
          .footer-container-chatgpt {
            padding: 40px 16px 24px;
          }

          .footer-main-chatgpt {
            grid-template-columns: 1fr;
            gap: 40px;
            margin-bottom: 32px;
          }

          .footer-nav-chatgpt {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px;
          }

          .footer-bottom-chatgpt {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .footer-nav-chatgpt {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
        .footer-overlay-chatgpt {
          position: relative;
          background: #ffffff;
          height: 40px;
          margin-top: -40px;
          z-index: 1;
        }
      `}</style>
    </footer>
    </>
  )
}
