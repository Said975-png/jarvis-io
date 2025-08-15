import { useEffect, useState } from 'react'

interface LoadingAnimationProps {
  onLoadingComplete: () => void
}

export default function LoadingAnimation({ onLoadingComplete }: LoadingAnimationProps) {
  const [progress, setProgress] = useState(0)
  const [dots, setDots] = useState('')

  useEffect(() => {
    // Анимация прогресса
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => onLoadingComplete(), 500) // Задержка перед скрытием
          return 100
        }
        return Math.min(prev + Math.random() * 15 + 5, 100) // Рандомный прогресс как в ChatGPT
      })
    }, 100)

    // Анимация точек
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return ''
        return prev + '.'
      })
    }, 400)

    return () => {
      clearInterval(progressInterval)
      clearInterval(dotsInterval)
    }
  }, [onLoadingComplete])

  return (
    <div className="loading-overlay">
      <div className="loading-container">
        {/* Фоновые эффекты */}
        <div className="loading-bg-effects">
          <div className="bg-orb bg-orb-1"></div>
          <div className="bg-orb bg-orb-2"></div>
          <div className="bg-orb bg-orb-3"></div>
        </div>

        {/* Главный контент */}
        <div className="loading-content">
          {/* Логотип с анимированной обводкой */}
          <div className="logo-container">
            <div className="logo-glow"></div>
            <div className="logo-border-animation">
              <img 
                src="https://cdn.builder.io/api/v1/image/assets%2Fb9756cc334164143a08add8073145880%2Ff677b712e9264dbf9c624260059e0bc2?format=webp&width=800"
                alt="JARVIS Logo"
                className="loading-logo"
              />
            </div>
          </div>

          {/* Текст */}
          <div className="loading-text">
            <h1 className="loading-title">JARVIS AI</h1>
            <p className="loading-subtitle">Инициализация системы{dots}</p>
          </div>

          {/* Прогресс бар */}
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="progress-text">{Math.round(progress)}%</div>
          </div>

          {/* Анимированные элементы */}
          <div className="loading-elements">
            <div className="element element-1"></div>
            <div className="element element-2"></div>
            <div className="element element-3"></div>
            <div className="element element-4"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          overflow: hidden;
        }

        .loading-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-bg-effects {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.3;
          animation: float 8s ease-in-out infinite;
        }

        .bg-orb-1 {
          width: 300px;
          height: 300px;
          background: linear-gradient(45deg, #6366f1, #8b5cf6);
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .bg-orb-2 {
          width: 250px;
          height: 250px;
          background: linear-gradient(45deg, #ec4899, #f97316);
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }

        .bg-orb-3 {
          width: 200px;
          height: 200px;
          background: linear-gradient(45deg, #10b981, #06b6d4);
          bottom: 30%;
          left: 60%;
          animation-delay: 4s;
        }

        .loading-content {
          text-align: center;
          z-index: 2;
          animation: fadeInUp 1s ease-out;
        }

        .logo-container {
          position: relative;
          display: inline-block;
          margin-bottom: 32px;
        }

        .logo-glow {
          position: absolute;
          top: -20px;
          left: -20px;
          right: -20px;
          bottom: -20px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.4), transparent 70%);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        .logo-border-animation {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(45deg, #6366f1, #8b5cf6, #ec4899, #f97316);
          background-size: 400% 400%;
          animation: gradientShift 3s ease-in-out infinite;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-logo {
          width: 112px;
          height: 112px;
          border-radius: 50%;
          background: #0f0f0f;
          object-fit: cover;
          animation: logoSpin 4s linear infinite;
        }

        .loading-text {
          margin-bottom: 40px;
        }

        .loading-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
          background: linear-gradient(45deg, #6366f1, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: titleGlow 2s ease-in-out infinite alternate;
        }

        .loading-subtitle {
          font-size: 1.1rem;
          color: #a1a1aa;
          margin: 0;
          min-height: 1.5rem;
        }

        .progress-container {
          width: 300px;
          margin: 0 auto 32px auto;
        }

        .progress-bar {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899);
          background-size: 200% 100%;
          animation: progressShine 1.5s ease-in-out infinite;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 0.9rem;
          color: #a1a1aa;
          text-align: center;
        }

        .loading-elements {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 24px;
        }

        .element {
          width: 8px;
          height: 8px;
          background: #6366f1;
          border-radius: 50%;
          animation: elementBounce 1.4s ease-in-out infinite;
        }

        .element-1 { animation-delay: 0s; }
        .element-2 { animation-delay: 0.2s; }
        .element-3 { animation-delay: 0.4s; }
        .element-4 { animation-delay: 0.6s; }

        /* Анимации */
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes logoSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes titleGlow {
          from {
            text-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
          }
          to {
            text-shadow: 0 0 30px rgba(139, 92, 246, 0.8);
          }
        }

        @keyframes progressShine {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes elementBounce {
          0%, 80%, 100% {
            transform: scale(1) translateY(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1.2) translateY(-10px);
            opacity: 1;
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .loading-title {
            font-size: 2rem;
          }
          
          .loading-subtitle {
            font-size: 1rem;
          }
          
          .progress-container {
            width: 250px;
          }
          
          .logo-border-animation {
            width: 100px;
            height: 100px;
          }
          
          .loading-logo {
            width: 92px;
            height: 92px;
          }
        }
      `}</style>
    </div>
  )
}
