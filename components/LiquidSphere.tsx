import { useEffect, useRef, useState } from 'react'

interface LiquidSphereProps {
  className?: string
}

export default function LiquidSphere({ className = '' }: LiquidSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    // Animation variables
    let time = 0

    const animate = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      const centerX = width / 2
      const centerY = height / 2
      const sphereRadius = Math.min(width, height) / 3 // Made bigger: was /5, now /3

      // Clear canvas with transparent background
      ctx.clearRect(0, 0, width, height)

      // Create main liquid sphere (more circular)
      const sphereWave = Math.sin(time * 2) * 12 + Math.cos(time * 1.5) * 8 // Increased wave amplitude
      const actualRadius = sphereRadius + sphereWave

      // Draw main sphere with liquid gradient
      const sphereGradient = ctx.createRadialGradient(
        centerX - sphereRadius * 0.3,
        centerY - sphereRadius * 0.3,
        0,
        centerX,
        centerY,
        actualRadius * 1.2
      )

      const hueShift = time * 20
      sphereGradient.addColorStop(0, `hsl(${220 + hueShift}, 85%, 75%)`)
      sphereGradient.addColorStop(0.4, `hsl(${240 + hueShift}, 75%, 65%)`)
      sphereGradient.addColorStop(0.8, `hsl(${260 + hueShift}, 65%, 55%)`)
      sphereGradient.addColorStop(1, `hsl(${280 + hueShift}, 55%, 45%)`)

      // Draw sphere with subtle distortion for liquid effect
      ctx.beginPath()
      for (let i = 0; i <= 360; i += 3) { // Smoother curve: was i+=5, now i+=3
        const angle = (i * Math.PI) / 180
        const distortion = Math.sin(angle * 4 + time * 3) * 4 + Math.cos(angle * 6 + time * 2) * 3 // Increased distortion
        const radius = actualRadius + distortion
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.closePath()

      // Apply gradient and glow
      ctx.fillStyle = sphereGradient
      ctx.shadowBlur = 35 // Increased glow
      ctx.shadowColor = `hsl(${240 + hueShift}, 70%, 60%)`
      ctx.fill()

      // Add highlight on sphere
      ctx.shadowBlur = 0
      const highlightGradient = ctx.createRadialGradient(
        centerX - sphereRadius * 0.4,
        centerY - sphereRadius * 0.4,
        0,
        centerX - sphereRadius * 0.2,
        centerY - sphereRadius * 0.2,
        sphereRadius * 0.8
      )
      highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
      highlightGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.4)')
      highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

      ctx.fillStyle = highlightGradient
      ctx.fill()

      time += 0.03
      requestAnimationFrame(animate)
    }

    // Start animation after a short delay
    setTimeout(() => {
      setIsLoaded(true)
      animate()
    }, 200)

    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  return (
    <div className={`liquid-sphere-container ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="liquid-sphere-canvas"
        style={{ 
          width: '100%', 
          height: '100%',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 1s ease'
        }} 
      />
      
      {!isLoaded && (
        <div className="liquid-sphere-loading">
          <div className="loading-orb">
            <div className="orb-inner"></div>
          </div>
          <p>Создание жидкой сферы</p>
        </div>
      )}

      <style jsx>{`
        .liquid-sphere-container {
          position: relative;
          width: 100%;
          height: 100%;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .liquid-sphere-canvas {
          background: transparent;
        }

        .liquid-sphere-loading {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: transparent;
        }

        .loading-orb {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(45deg, #6366f1, #8b5cf6, #ec4899);
          background-size: 200% 200%;
          animation: liquidPulse 2s ease-in-out infinite, gradientShift 3s ease-in-out infinite;
          margin-bottom: 12px;
          position: relative;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.6);
        }

        .orb-inner {
          position: absolute;
          top: 20%;
          left: 25%;
          width: 25%;
          height: 25%;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          filter: blur(1px);
        }

        .liquid-sphere-loading p {
          margin: 0;
          font-size: 14px;
          color: #666666;
          font-weight: 500;
          text-align: center;
        }

        @keyframes liquidPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
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

        /* Dark theme support */
        :global(body.dark-theme) .liquid-sphere-loading p {
          color: #ffffff;
        }
      `}</style>
    </div>
  )
}
