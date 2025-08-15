import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useOrders } from '../contexts/OrderContext'
import AuthForms from './AuthForms'
import ProfileModal from './ProfileModal'
import Checkout from './Checkout'

export default function Navbar() {
  const { user, logout, login } = useAuth()
  const { items, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart()
  const [showAuthForms, setShowAuthForms] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav className={`navbar-chatgpt ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container-chatgpt">
          <div className="logo-chatgpt">
            <div className="logo-icon-chatgpt">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fb3f5046887d8470c82b60bfa8668fc6d%2F344c594fabe14ed7b0083952ee013ca1?format=webp&width=800"
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
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="search-input-chatgpt"
              />
              {searchValue && (
                <button
                  onClick={() => setSearchValue('')}
                  className="search-clear-chatgpt"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="nav-links-wrapper-chatgpt">
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
                              <span className="cart-item-price-chatgpt">₽{parseInt(item.price).toLocaleString()}</span>
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
                          <span>Итого: ₽{getTotalPrice().toLocaleString()}</span>
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
        }

        .search-container-chatgpt {
          flex: 1;
          max-width: 600px;
          margin: 0 32px;
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

        .search-icon-chatgpt {
          color: #666666;
          margin-right: 12px;
        }

        .search-input-chatgpt {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-size: 14px;
          color: #000000;
          placeholder-color: #999999;
        }

        .search-input-chatgpt::placeholder {
          color: #999999;
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

        .nav-links-wrapper-chatgpt {
          display: flex;
          align-items: center;
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

        .cart-icon-wrapper-chatgpt {
          position: relative;
        }

        .cart-icon-chatgpt {
          color: #000000;
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
