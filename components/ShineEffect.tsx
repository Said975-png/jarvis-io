import { useEffect, useState } from 'react'

export default function ShineEffect() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <>
      {/* Курсорное сияние */}
      <div
        className="cursor-shine"
        style={{
          left: mousePosition.x - 300,
          top: mousePosition.y - 300,
        }}
      />

      {/* Фоновые анимированные сияния */}
      <div className="shine-background">
        <div className="shine-orb shine-orb-1" />
        <div className="shine-orb shine-orb-2" />
        <div className="shine-orb shine-orb-3" />
        <div className="floating-particles">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .cursor-shine {
          position: fixed;
          width: 600px;
          height: 600px;
          background: radial-gradient(
            circle,
            rgba(147, 51, 234, 0.15) 0%,
            rgba(79, 70, 229, 0.1) 25%,
            rgba(236, 72, 153, 0.08) 50%,
            transparent 70%
          );
          border-radius: 50%;
          pointer-events: none;
          z-index: -1;
          transition: all 0.1s ease-out;
          filter: blur(40px);
          animation: pulse 4s ease-in-out infinite;
        }

        .shine-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: -2;
          overflow: hidden;
        }

        .shine-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.4;
        }

        .shine-orb-1 {
          width: 400px;
          height: 400px;
          background: linear-gradient(
            135deg,
            rgba(139, 92, 246, 0.3) 0%,
            rgba(236, 72, 153, 0.2) 50%,
            rgba(79, 70, 229, 0.3) 100%
          );
          top: 10%;
          right: 15%;
          animation: float 8s ease-in-out infinite, glow 6s ease-in-out infinite alternate;
        }

        .shine-orb-2 {
          width: 300px;
          height: 300px;
          background: linear-gradient(
            225deg,
            rgba(236, 72, 153, 0.25) 0%,
            rgba(147, 51, 234, 0.2) 50%,
            rgba(79, 70, 229, 0.25) 100%
          );
          bottom: 20%;
          left: 10%;
          animation: float 12s ease-in-out infinite reverse, glow 8s ease-in-out infinite alternate;
        }

        .shine-orb-3 {
          width: 250px;
          height: 250px;
          background: linear-gradient(
            45deg,
            rgba(79, 70, 229, 0.2) 0%,
            rgba(139, 92, 246, 0.15) 50%,
            rgba(236, 72, 153, 0.2) 100%
          );
          top: 60%;
          right: 40%;
          animation: float 10s ease-in-out infinite, glow 7s ease-in-out infinite alternate;
        }

        .floating-particles {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: rgba(147, 51, 234, 0.6);
          border-radius: 50%;
          animation: particleFloat 15s linear infinite;
        }

        .particle-1 { left: 10%; animation-delay: 0s; }
        .particle-2 { left: 20%; animation-delay: 2s; }
        .particle-3 { left: 30%; animation-delay: 4s; }
        .particle-4 { left: 40%; animation-delay: 6s; }
        .particle-5 { left: 60%; animation-delay: 8s; }
        .particle-6 { left: 70%; animation-delay: 10s; }
        .particle-7 { left: 80%; animation-delay: 12s; }
        .particle-8 { left: 90%; animation-delay: 14s; }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.15;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.25;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) translateX(10px) rotate(2deg);
          }
          66% {
            transform: translateY(10px) translateX(-15px) rotate(-1deg);
          }
        }

        @keyframes glow {
          0% {
            opacity: 0.3;
            filter: blur(60px) brightness(1);
          }
          100% {
            opacity: 0.6;
            filter: blur(80px) brightness(1.3);
          }
        }

        @keyframes particleFloat {
          0% {
            transform: translateY(100vh) translateX(0px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(50px);
            opacity: 0;
          }
        }

        /* Эффекты сияния для интерактивных элементов */
        :global(.hero-title-chatgpt) {
          background: linear-gradient(
            135deg,
            #000000 0%,
            #4338ca 50%,
            #000000 100%
          );
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 8s ease-in-out infinite;
        }

        :global(.primary-button-chatgpt) {
          position: relative;
          overflow: hidden;
        }

        :global(.primary-button-chatgpt::before) {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transform: translateX(-100%) translateY(-100%);
          transition: all 0.6s ease;
        }

        :global(.primary-button-chatgpt:hover::before) {
          transform: translateX(100%) translateY(100%);
        }

        :global(.chat-interface-chatgpt) {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 8px 32px rgba(147, 51, 234, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        :global(.pricing-card-chatgpt) {
          position: relative;
          overflow: hidden;
        }

        :global(.pricing-card-chatgpt::after) {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(147, 51, 234, 0.1),
            transparent
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          animation: cardShine 3s ease-in-out infinite;
        }

        :global(.pricing-card-chatgpt:hover::after) {
          opacity: 1;
        }

        @keyframes shimmer {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes cardShine {
          0%, 100% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          50% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
        }

        /* Адаптивность */
        @media (max-width: 768px) {
          .cursor-shine {
            width: 400px;
            height: 400px;
          }

          .shine-orb-1 {
            width: 250px;
            height: 250px;
          }

          .shine-orb-2 {
            width: 200px;
            height: 200px;
          }

          .shine-orb-3 {
            width: 150px;
            height: 150px;
          }
        }

        /* Уменьшаем эффекты на слабых устройствах */
        @media (prefers-reduced-motion: reduce) {
          .cursor-shine,
          .shine-orb,
          .particle {
            animation: none;
          }
        }
      `}</style>
    </>
  )
}
