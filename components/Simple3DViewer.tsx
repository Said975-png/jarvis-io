import { useEffect, useRef, useState } from 'react'

interface Simple3DViewerProps {
  className?: string
}

export default function Simple3DViewer({ className = '' }: Simple3DViewerProps) {
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

    // Create a simple animated 3D-like cube
    let rotation = 0
    const animate = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height)
      
      // Draw background gradient
      const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2)
      gradient.addColorStop(0, '#f8f9fa')
      gradient.addColorStop(1, '#e9ecef')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
      
      // Draw animated 3D cube illusion
      const centerX = width / 2
      const centerY = height / 2
      const size = Math.min(width, height) / 4
      
      // Calculate 3D projection points
      const cos = Math.cos(rotation)
      const sin = Math.sin(rotation)
      
      // Front face
      ctx.fillStyle = '#6366f1'
      ctx.beginPath()
      ctx.moveTo(centerX - size * cos, centerY - size * sin)
      ctx.lineTo(centerX + size * cos, centerY - size * sin)
      ctx.lineTo(centerX + size * cos, centerY + size * sin)
      ctx.lineTo(centerX - size * cos, centerY + size * sin)
      ctx.closePath()
      ctx.fill()
      
      // Right face (darker)
      ctx.fillStyle = '#4f46e5'
      ctx.beginPath()
      ctx.moveTo(centerX + size * cos, centerY - size * sin)
      ctx.lineTo(centerX + size * cos + size * 0.3, centerY - size * sin - size * 0.3)
      ctx.lineTo(centerX + size * cos + size * 0.3, centerY + size * sin - size * 0.3)
      ctx.lineTo(centerX + size * cos, centerY + size * sin)
      ctx.closePath()
      ctx.fill()
      
      // Top face (lighter)
      ctx.fillStyle = '#818cf8'
      ctx.beginPath()
      ctx.moveTo(centerX - size * cos, centerY - size * sin)
      ctx.lineTo(centerX + size * cos, centerY - size * sin)
      ctx.lineTo(centerX + size * cos + size * 0.3, centerY - size * sin - size * 0.3)
      ctx.lineTo(centerX - size * cos + size * 0.3, centerY - size * sin - size * 0.3)
      ctx.closePath()
      ctx.fill()
      
      // Add some glow effect
      ctx.shadowBlur = 20
      ctx.shadowColor = '#6366f1'
      
      rotation += 0.02
      requestAnimationFrame(animate)
    }

    // Start animation after a short delay
    setTimeout(() => {
      setIsLoaded(true)
      animate()
    }, 500)

    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  return (
    <div className={`simple-3d-viewer-container ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="simple-3d-canvas"
        style={{ 
          width: '100%', 
          height: '100%',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease'
        }} 
      />
      
      {!isLoaded && (
        <div className="simple-3d-loading">
          <div className="loading-spinner">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p>Инициализация 3D</p>
        </div>
      )}

      <div className="model-info-overlay">
        <div className="info-content">
          <h4>3D Модель готова</h4>
          <p>Добавьте ваш .glb файл для отображения</p>
        </div>
      </div>

      <style jsx>{`
        .simple-3d-viewer-container {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 20px;
          overflow: hidden;
          background: #f8f9fa;
        }

        .simple-3d-canvas {
          border-radius: 20px;
        }

        .simple-3d-loading {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(4px);
        }

        .loading-spinner {
          color: #6366f1;
          margin-bottom: 12px;
          animation: spin 2s linear infinite;
        }

        .simple-3d-loading p {
          margin: 0;
          font-size: 14px;
          color: #666666;
          font-weight: 500;
        }

        .model-info-overlay {
          position: absolute;
          bottom: 16px;
          left: 16px;
          right: 16px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 12px 16px;
          color: white;
        }

        .info-content h4 {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 600;
        }

        .info-content p {
          margin: 0;
          font-size: 12px;
          opacity: 0.9;
        }

        @keyframes spin {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(360deg);
          }
        }

        /* Dark theme support */
        :global(body.dark-theme) .simple-3d-viewer-container {
          background: #111111;
        }

        :global(body.dark-theme) .simple-3d-loading {
          background: rgba(17, 17, 17, 0.95);
        }

        :global(body.dark-theme) .simple-3d-loading p {
          color: #ffffff;
        }
      `}</style>
    </div>
  )
}
