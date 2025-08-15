import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useOrders } from '../contexts/OrderContext'
import { useTheme } from '../contexts/ThemeContext'
import AuthForms from './AuthForms'
import ProfileModal from './ProfileModal'
import Checkout from './Checkout'
import { useRouter } from 'next/router'

// Данные для поиска
const searchData = [
  { title: 'Главная', description: 'Главная страница с общей информацией о компании', url: '/', section: 'Страницы' },
  { title: 'Админ панель', description: 'Панель администратора для управления заказами', url: '/admin', section: 'Страницы' },
  { title: 'Революционный ИИ-ассистент', description: 'Революционный ИИ-ассистент, который понимает ваши потребности и превращает идеи в реальность. Будущее взаимодействия с технологиями уже здесь.', url: '/', section: 'Заголовки' },
  { title: 'Процесс договора', description: 'Подробная информация о процессе работы с нами', url: '/', section: 'Услуги' },
  { title: 'ДЖАРВИС ИИ ассистент', description: 'Умный помощник для разработки, который понимает контекст', url: '/', section: 'Возможности' },
  { title: 'Автоматизация', description: 'Автоматические процессы разработки и развертывания для ускорения работы', url: '/', section: 'Возможности' },
  { title: 'Аналитика', description: 'Глубокий анализ пользовательского поведения и оптимизация конверсии', url: '/', section: 'Возможности' },
  { title: 'Basic план', description: 'Стартовое решение - идеально для небольших проектов и стартапов', url: '/', section: 'Тарифы' },
  { title: 'Pro план', description: 'Лучший выбор - лучший выбор для растущего бизнеса', url: '/', section: 'Тарифы' },
  { title: 'Max план', description: 'Премиум решение - максимум возможностей для крупного бизнеса', url: '/', section: 'Тарифы' },
  { title: 'Современный дизайн', description: 'Создание красивых и функциональных интерфейсов', url: '/', section: 'Функции' },
  { title: 'Высокая производительность', description: 'Оптимизация скорости и производительности веб-сайтов', url: '/', section: 'Функции' },
  { title: 'ИИ интеграция', description: 'Интеграция искусственного интеллекта в ваши проекты', url: '/', section: 'Функции' },
  { title: 'Техподдержка', description: 'Профессиональная техническая поддержка 24 часа в сутки', url: '/', section: 'Услуги' },
  { title: 'SEO оптимизация', description: 'Оптимизация сайта для поисковых систем', url: '/', section: 'Услуги' },
  { title: 'Адаптивная верстка', description: 'Создание сайтов, работающих на всех устройствах', url: '/', section: 'Услуги' },
  { title: 'Корзина', description: 'Просмотр добавленных товаров и оформление заказа', url: '/', section: 'Покупки' },
  { title: 'Профиль', description: 'Личный кабинет пользователя', url: '/', section: 'Аккаунт' },
  { title: 'Войти', description: 'Авторизация в системе', url: '/', section: 'Аккаунт' },
  { title: 'Регистрация', description: 'Создание нового аккаунта', url: '/', section: 'Аккаунт' }
]

export default function SearchableNavbar() {
  const { user, logout, login } = useAuth()
  const { items, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart()
  const { isDarkTheme, toggleTheme } = useTheme()
  const router = useRouter()
  const [showAuthForms, setShowAuthForms] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchResults, setSearchResults] = useState<typeof searchData>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Поиск по контенту
  const handleSearch = (query: string) => {
    setSearchValue(query)
    
    if (query.length < 2) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    const filtered = searchData.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.section.toLowerCase().includes(query.toLowerCase())
    )
    
    setSearchResults(filtered)
    setShowSearchResults(true)
  }

  // Переход к выбранному элементу
  const handleSearchSelect = (item: typeof searchData[0]) => {
    if (item.url === '/' && router.pathname !== '/') {
      router.push('/')
    } else if (item.url === '/admin' && router.pathname !== '/admin') {
      router.push('/admin')
    }
    
    // Для элементов на главной странице - прокрутка к секции
    if (item.url === '/' && router.pathname === '/') {
      setTimeout(() => {
        let targetElement: Element | null = null
        
        // Определяем целевой элемент на основе секции
        switch (item.section) {
          case 'Заголовки':
            targetElement = document.querySelector('.hero-section-chatgpt')
            break
          case 'Возможности':
            targetElement = document.querySelector('.features-section-chatgpt')
            break
          case 'Тарифы':
            targetElement = document.querySelector('.pricing-section-chatgpt')
            break
          case 'Функции':
            targetElement = document.querySelector('.hero-features-chatgpt')
            break
          case 'Услуги':
            if (item.title === 'Процесс договора') {
              // Открываем модальное окно процесса
              const processButton = document.querySelector('.primary-button-chatgpt') as HTMLButtonElement
              if (processButton) {
                processButton.click()
              }
            } else {
              targetElement = document.querySelector('.features-section-chatgpt')
            }
            break
          case 'Покупки':
            setCartOpen(true)
            break
          case 'Аккаунт':
            if (item.title === 'Войти' || item.title === 'Регистрация') {
              setShowAuthForms(true)
            } else if (item.title === 'Профиль' && user) {
              setShowProfile(true)
            }
            break
        }
        
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
    
    setSearchValue('')
    setSearchResults([])
    setShowSearchResults(false)
    setSearchFocused(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const searchContainer = document.querySelector('.search-container-chatgpt')
      if (searchContainer && !searchContainer.contains(e.target as Node)) {
        setShowSearchResults(false)
        setSearchFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <nav className={`navbar-chatgpt ${isScrolled ? 'scrolled' : ''} ${isDarkTheme ? 'dark-theme' : ''}`}>
        <div className="navbar-container-chatgpt">
          <div className="logo-chatgpt">
            <div className="logo-icon-chatgpt">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F321030175d41423db42a978adc722c81%2F37b07a37d18e47b9a7c20f69c11e21f0?format=webp&width=800"
                alt="JARVIS Logo"
                width="32"
                height="32"
              />
            </div>
            <span className="logo-text-chatgpt">JARVIS</span>
          </div>

          {/* Search Bar */}
          <div className="search-container-chatgpt">
            <div className={`search-wrapper-chatgpt ${searchFocused ? 'focused' : ''}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="search-icon-chatgpt">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                placeholder="Поиск"
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="search-input-chatgpt"
              />
              {searchValue && (
                <button
                  onClick={() => {
                    setSearchValue('')
                    setSearchResults([])
                    setShowSearchResults(false)
                  }}
                  className="search-clear-chatgpt"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
            
            {/* Результаты поиска */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="search-results-chatgpt">
                {searchResults.map((item, index) => (
                  <div
                    key={index}
                    className="search-result-item-chatgpt"
                    onClick={() => handleSearchSelect(item)}
                  >
                    <div className="search-result-content-chatgpt">
                      <div className="search-result-title-chatgpt">{item.title}</div>
                      <div className="search-result-description-chatgpt">{item.description}</div>
                    </div>
                    <div className="search-result-section-chatgpt">{item.section}</div>
                  </div>
                ))}
              </div>
            )}
            
            {showSearchResults && searchResults.length === 0 && searchValue.length >= 2 && (
              <div className="search-results-chatgpt">
                <div className="search-no-results-chatgpt">
                  <div className="no-results-icon-chatgpt">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                      <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="no-results-text-chatgpt">Ничего не найдено</div>
                  <div className="no-results-hint-chatgpt">Попробуйте изменить запрос</div>
                </div>
              </div>
            )}
          </div>

          <div className="nav-links-wrapper-chatgpt">
            {/* Theme Toggle */}
            <div className="theme-toggle-container-chatgpt">
              <button
                className="theme-toggle-button-chatgpt disabled"
                onClick={() => {}}
                aria-label="Функция в разработке"
                title="Функция смены темы находится в разработке"
              >
                {isDarkTheme ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="theme-icon-chatgpt">
                    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="theme-icon-chatgpt">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Shopping Cart */}
            <div className="cart-container-chatgpt">
              <button
                className="cart-button-chatgpt"
                onClick={() => setCartOpen(!cartOpen)}
                aria-label="Корзина"
              >
                <div className="cart-icon-wrapper-chatgpt">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="cart-icon-chatgpt">
                    <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="20" r="1" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="20" cy="20" r="1" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  {getTotalItems() > 0 && (
                    <span className="cart-badge-chatgpt">{getTotalItems()}</span>
                  )}
                </div>
              </button>

              {cartOpen && (
                <div className="cart-dropdown-chatgpt">
                  <div className="cart-header-chatgpt">
                    <h3>Корзина</h3>
                    <span className="cart-count-chatgpt">
                      {getTotalItems() > 0 ? `${getTotalItems()} товар${getTotalItems() > 1 ? 'а' : ''}` : 'Пустая'}
                    </span>
                  </div>

                  {items.length === 0 ? (
                    <div className="cart-empty-chatgpt">
                      <div className="cart-empty-icon-chatgpt">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                          <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="9" cy="20" r="1" stroke="currentColor" strokeWidth="1.5"/>
                          <circle cx="20" cy="20" r="1" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                      </div>
                      <p className="cart-empty-text-chatgpt">Ваша корзина пуста</p>
                      <button className="cart-empty-button-chatgpt">
                        Начать покупки
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="cart-items-chatgpt">
                        {items.map((item) => (
                          <div key={item.id} className="cart-item-chatgpt">
                            <div className="cart-item-image-chatgpt">
                              <div className="placeholder-image-chatgpt">
                                <span className="plan-letter-chatgpt">{item.name[0]}</span>
                              </div>
                            </div>
                            <div className="cart-item-info-chatgpt">
                              <h4>{item.name}</h4>
                              <p>{item.subtitle}</p>
                              <div className="cart-item-quantity-chatgpt">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="quantity-btn-chatgpt"
                                >
                                  -
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="quantity-btn-chatgpt"
                                >
                                  +
                                </button>
                              </div>
                              <span className="cart-item-price-chatgpt">{parseInt(item.price).toLocaleString()} сумм</span>
                            </div>
                            <button
                              className="cart-item-remove-chatgpt"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="cart-footer-chatgpt">
                        <div className="cart-total-chatgpt">
                          <span>Итого: {getTotalPrice().toLocaleString()} сумм</span>
                        </div>
                        <button
                          className="cart-checkout-chatgpt"
                          onClick={() => {
                            if (!user) {
                              setShowAuthForms(true)
                              return
                            }
                            setShowCheckout(true)
                            setCartOpen(false)
                          }}
                        >
                          Оформить заказ
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              className="mobile-menu-toggle-chatgpt"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Открыть меню"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                ) : (
                  <>
                    <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </>
                )}
              </svg>
            </button>

            <div className={`nav-links-chatgpt ${mobileMenuOpen ? 'mobile-open' : ''}`}>
              {user ? (
                <div className="user-menu-chatgpt">
                  <button
                    className="user-button-chatgpt"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                  >
                    <div className="user-avatar-chatgpt">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <span>{user.name}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {showUserDropdown && (
                    <div className="user-dropdown-chatgpt">
                      <button
                        className="dropdown-item-chatgpt"
                        onClick={() => {
                          setShowProfile(true)
                          setShowUserDropdown(false)
                          setMobileMenuOpen(false)
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Личный кабинет
                      </button>
                      <div className="dropdown-divider-chatgpt"></div>
                      <button
                        className="dropdown-item-chatgpt"
                        onClick={() => {
                          logout()
                          setShowUserDropdown(false)
                          setMobileMenuOpen(false)
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M16 17L21 12L16 7M21 12H9M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Выйти
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className="auth-button-chatgpt"
                  onClick={() => {
                    setShowAuthForms(true)
                    setMobileMenuOpen(false)
                  }}
                >
                  Войти
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Forms Modal */}
      {showAuthForms && (
        <AuthForms
          onClose={() => setShowAuthForms(false)}
          onLogin={(userData) => {
            login(userData)
            setShowAuthForms(false)
          }}
        />
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <Checkout
          onClose={() => setShowCheckout(false)}
          onSuccess={() => {
            alert('Заказ успешно оформлен! Вы можете отслеживать его статус в личном кабинете.')
          }}
        />
      )}

      {/* Profile Modal */}
      {showProfile && user && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfile(false)}
          onLogout={() => {
            logout()
            setShowProfile(false)
          }}
        />
      )}

      <style jsx>{`
        .navbar-chatgpt {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #ffffff;
          z-index: 1000;
          transition: all 0.3s ease;
          border-bottom: 1px solid #e5e5e5;
          padding: 20px 0;
        }

        .navbar-chatgpt.dark-theme {
          background: #000000;
          border-bottom: 1px solid #333333;
        }

        .navbar-chatgpt.scrolled {
          padding: 16px 0;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .navbar-container-chatgpt {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-chatgpt {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon-chatgpt {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-icon-chatgpt img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .logo-text-chatgpt {
          font-size: 20px;
          font-weight: 600;
          color: #000000;
          transition: color 0.3s ease;
        }

        .navbar-chatgpt.dark-theme .logo-text-chatgpt {
          color: #ffffff;
        }

        .search-container-chatgpt {
          flex: 1;
          max-width: 600px;
          margin: 0 32px;
          position: relative;
        }

        .search-wrapper-chatgpt {
          position: relative;
          display: flex;
          align-items: center;
          background: #f8f8f8;
          border: 1px solid #e5e5e5;
          border-radius: 24px;
          padding: 12px 16px;
          transition: all 0.2s ease;
        }

        .search-wrapper-chatgpt.focused {
          background: #ffffff;
          border-color: #000000;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .navbar-chatgpt.dark-theme .search-wrapper-chatgpt {
          background: #333333;
          border-color: #555555;
        }

        .navbar-chatgpt.dark-theme .search-wrapper-chatgpt.focused {
          background: #444444;
          border-color: #666666;
          box-shadow: 0 2px 8px rgba(255, 255, 255, 0.05);
        }

        .search-icon-chatgpt {
          color: #666666;
          margin-right: 12px;
          transition: color 0.3s ease;
        }

        .navbar-chatgpt.dark-theme .search-icon-chatgpt {
          color: #cccccc;
        }

        .search-input-chatgpt {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-size: 14px;
          color: #000000;
          placeholder-color: #999999;
          transition: color 0.3s ease;
          box-shadow: none;
        }

        .search-input-chatgpt::placeholder {
          color: #999999;
          transition: color 0.3s ease;
        }

        .navbar-chatgpt.dark-theme .search-input-chatgpt {
          color: #ffffff;
          background: transparent;
          border: none;
          outline: none;
          box-shadow: none;
        }

        .navbar-chatgpt.dark-theme .search-input-chatgpt:focus {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
        }

        /* Дополнительные стили для убирания всех возможных рамок в темной теме */
        body.dark-theme .navbar-chatgpt .search-input-chatgpt {
          background: transparent !important;
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          color: #ffffff !important;
        }

        body.dark-theme .navbar-chatgpt .search-input-chatgpt:focus {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }

        .navbar-chatgpt.dark-theme .search-input-chatgpt::placeholder {
          color: #888888;
        }

        .search-clear-chatgpt {
          background: none;
          border: none;
          color: #666666;
          cursor: pointer;
          padding: 2px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 8px;
          transition: all 0.2s ease;
        }

        .search-clear-chatgpt:hover {
          background: #f0f0f0;
          color: #000000;
        }

        .navbar-chatgpt.dark-theme .search-clear-chatgpt {
          color: #cccccc;
        }

        .navbar-chatgpt.dark-theme .search-clear-chatgpt:hover {
          background: #555555;
          color: #ffffff;
        }

        .search-results-chatgpt {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          max-height: 400px;
          overflow-y: auto;
          z-index: 1100;
          margin-top: 8px;
        }

        .navbar-chatgpt.dark-theme .search-results-chatgpt {
          background: #222222;
          border: 1px solid #444444;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
        }

        .search-result-item-chatgpt {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          border-bottom: 1px solid #f0f0f0;
        }

        .search-result-item-chatgpt:last-child {
          border-bottom: none;
        }

        .search-result-item-chatgpt:hover {
          background: #f8f8f8;
        }

        .navbar-chatgpt.dark-theme .search-result-item-chatgpt {
          border-bottom: 1px solid #333333;
        }

        .navbar-chatgpt.dark-theme .search-result-item-chatgpt:hover {
          background: #333333;
        }

        .search-result-content-chatgpt {
          flex: 1;
          min-width: 0;
        }

        .search-result-title-chatgpt {
          font-size: 14px;
          font-weight: 600;
          color: #000000;
          margin-bottom: 4px;
          transition: color 0.3s ease;
        }

        .navbar-chatgpt.dark-theme .search-result-title-chatgpt {
          color: #ffffff;
        }

        .search-result-description-chatgpt {
          font-size: 12px;
          color: #666666;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          transition: color 0.3s ease;
        }

        .navbar-chatgpt.dark-theme .search-result-description-chatgpt {
          color: #cccccc;
        }

        .search-result-section-chatgpt {
          font-size: 10px;
          color: #999999;
          background: #f5f5f5;
          padding: 4px 8px;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
          flex-shrink: 0;
          margin-left: 12px;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .navbar-chatgpt.dark-theme .search-result-section-chatgpt {
          color: #888888;
          background: #444444;
        }

        .search-no-results-chatgpt {
          padding: 32px 20px;
          text-align: center;
        }

        .no-results-icon-chatgpt {
          color: #e5e5e5;
          margin-bottom: 12px;
          display: flex;
          justify-content: center;
        }

        .no-results-text-chatgpt {
          font-size: 14px;
          font-weight: 600;
          color: #666666;
          margin-bottom: 4px;
        }

        .no-results-hint-chatgpt {
          font-size: 12px;
          color: #999999;
        }

        .nav-links-wrapper-chatgpt {
          display: flex;
          align-items: center;
        }

        .theme-toggle-container-chatgpt {
          margin-right: 8px;
        }

        .theme-toggle-button-chatgpt {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .theme-toggle-button-chatgpt:hover {
          background: #f5f5f5;
        }

        .navbar-chatgpt.dark-theme .theme-toggle-button-chatgpt:hover {
          background: #333333;
        }

        .theme-toggle-button-chatgpt.disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .theme-toggle-button-chatgpt.disabled:hover {
          background: none;
          opacity: 0.7;
        }

        .navbar-chatgpt.dark-theme .theme-toggle-button-chatgpt.disabled:hover {
          background: none;
          opacity: 0.7;
        }

        .theme-icon-chatgpt {
          color: #000000;
          transition: color 0.3s ease;
        }

        .navbar-chatgpt.dark-theme .theme-icon-chatgpt {
          color: #ffffff;
        }

        .cart-container-chatgpt {
          position: relative;
          margin-right: 8px;
        }

        .cart-button-chatgpt {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cart-button-chatgpt:hover {
          background: #f5f5f5;
        }

        .navbar-chatgpt.dark-theme .cart-button-chatgpt:hover {
          background: #333333;
        }

        .cart-icon-wrapper-chatgpt {
          position: relative;
        }

        .cart-icon-chatgpt {
          color: #000000;
          transition: color 0.3s ease;
        }

        .navbar-chatgpt.dark-theme .cart-icon-chatgpt {
          color: #ffffff;
        }

        .cart-badge-chatgpt {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          font-weight: 600;
          min-width: 18px;
          height: 18px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        .cart-dropdown-chatgpt {
          position: absolute;
          top: 100%;
          right: 0;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          min-width: 320px;
          max-width: 400px;
          z-index: 1100;
          margin-top: 8px;
        }

        .navbar-chatgpt.dark-theme .cart-dropdown-chatgpt {
          background: #222222;
          border: 1px solid #444444;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
        }

        .cart-header-chatgpt {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #f0f0f0;
        }

        .cart-header-chatgpt h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #000000;
          transition: color 0.3s ease;
        }

        .navbar-chatgpt.dark-theme .cart-header-chatgpt h3 {
          color: #ffffff;
        }

        .cart-count-chatgpt {
          font-size: 12px;
          color: #666666;
          background: #f8f8f8;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .cart-empty-chatgpt {
          padding: 40px 20px;
          text-align: center;
        }

        .cart-empty-icon-chatgpt {
          color: #e5e5e5;
          margin-bottom: 16px;
          display: flex;
          justify-content: center;
        }

        .cart-empty-text-chatgpt {
          margin: 0 0 20px 0;
          color: #666666;
          font-size: 14px;
        }

        .cart-empty-button-chatgpt {
          background: #000000;
          color: #ffffff;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cart-empty-button-chatgpt:hover {
          background: #333333;
        }

        .plan-letter-chatgpt {
          color: #ffffff;
          font-weight: 600;
          font-size: 16px;
        }

        .cart-items-chatgpt {
          max-height: 300px;
          overflow-y: auto;
          padding: 12px 0;
        }

        .cart-item-chatgpt {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          transition: background-color 0.2s ease;
        }

        .cart-item-chatgpt:hover {
          background: #f9f9f9;
        }

        .cart-item-image-chatgpt {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
        }

        .placeholder-image-chatgpt {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cart-item-info-chatgpt {
          flex: 1;
          min-width: 0;
        }

        .cart-item-info-chatgpt h4 {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 600;
          color: #000000;
        }

        .cart-item-info-chatgpt p {
          margin: 0 0 8px 0;
          font-size: 12px;
          color: #666666;
        }

        .cart-item-quantity-chatgpt {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .quantity-btn-chatgpt {
          background: #f0f0f0;
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #666666;
          transition: all 0.2s ease;
        }

        .quantity-btn-chatgpt:hover {
          background: #e0e0e0;
          color: #000000;
        }

        .cart-item-price-chatgpt {
          font-size: 14px;
          font-weight: 600;
          color: #000000;
        }

        .cart-item-remove-chatgpt {
          background: none;
          border: none;
          color: #999999;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .cart-item-remove-chatgpt:hover {
          background: #f0f0f0;
          color: #ef4444;
        }

        .cart-footer-chatgpt {
          border-top: 1px solid #f0f0f0;
          padding: 16px 20px;
        }

        .cart-total-chatgpt {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .cart-total-chatgpt span {
          font-size: 16px;
          font-weight: 600;
          color: #000000;
        }

        .cart-checkout-chatgpt {
          width: 100%;
          background: #000000;
          color: #ffffff;
          border: none;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cart-checkout-chatgpt:hover {
          background: #333333;
        }

        .mobile-menu-toggle-chatgpt {
          display: none;
          background: none;
          border: none;
          color: #000000;
          cursor: pointer;
          padding: 8px;
          transition: color 0.3s ease;
        }

        .navbar-chatgpt.dark-theme .mobile-menu-toggle-chatgpt {
          color: #ffffff;
        }

        .nav-links-chatgpt {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .auth-button-chatgpt {
          background: #000000;
          color: #ffffff;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .auth-button-chatgpt:hover {
          background: #333333;
        }

        .navbar-chatgpt.dark-theme .auth-button-chatgpt {
          background: #ffffff;
          color: #000000;
        }

        .navbar-chatgpt.dark-theme .auth-button-chatgpt:hover {
          background: #f0f0f0;
        }

        .user-menu-chatgpt {
          position: relative;
        }

        .user-button-chatgpt {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: #000000;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }

        .user-button-chatgpt:hover {
          background: #f5f5f5;
        }

        .navbar-chatgpt.dark-theme .user-button-chatgpt {
          color: #ffffff;
        }

        .navbar-chatgpt.dark-theme .user-button-chatgpt:hover {
          background: #333333;
        }

        .user-avatar-chatgpt {
          width: 32px;
          height: 32px;
          background: #000000;
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 500;
        }

        .user-dropdown-chatgpt {
          position: absolute;
          top: 100%;
          right: 0;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          min-width: 200px;
          z-index: 1100;
        }

        .navbar-chatgpt.dark-theme .user-dropdown-chatgpt {
          background: #222222;
          border: 1px solid #444444;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .dropdown-item-chatgpt {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 12px 16px;
          background: none;
          border: none;
          color: #000000;
          cursor: pointer;
          text-align: left;
          transition: background-color 0.2s ease;
        }

        .dropdown-item-chatgpt:hover {
          background: #f5f5f5;
        }

        .navbar-chatgpt.dark-theme .dropdown-item-chatgpt {
          color: #ffffff;
        }

        .navbar-chatgpt.dark-theme .dropdown-item-chatgpt:hover {
          background: #333333;
        }

        .dropdown-divider-chatgpt {
          height: 1px;
          background: #e5e5e5;
          margin: 4px 0;
        }

        @media (max-width: 768px) {
          .mobile-menu-toggle-chatgpt {
            display: block;
          }

          .search-container-chatgpt {
            display: none;
          }

          .search-results-chatgpt {
            max-height: 300px;
          }

          .search-result-item-chatgpt {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .search-result-section-chatgpt {
            margin-left: 0;
            align-self: flex-end;
          }

          .cart-dropdown-chatgpt {
            right: -20px;
            min-width: 280px;
            max-width: calc(100vw - 40px);
          }

          .nav-links-chatgpt {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #ffffff;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            margin-top: 8px;
            padding: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            z-index: 1100;
          }

          .navbar-chatgpt.dark-theme .nav-links-chatgpt {
            background: #222222;
            border: 1px solid #444444;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          }

          .nav-links-chatgpt.mobile-open {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }
        }
      `}</style>
    </>
  )
}
