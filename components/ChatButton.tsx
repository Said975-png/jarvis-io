import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

interface ChatButtonProps {
  onClick: () => void
}

export default function ChatButton({ onClick }: ChatButtonProps) {
  const { isDarkTheme } = useTheme()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      <div className="chat-button-container">
        <div className="chat-button-label">
          Чат с Джарвисом 👋
        </div>
        <button
          className="chat-button"
          onClick={onClick}
        >
          <div className="chat-button-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>
      </div>

      <style jsx>{`
        .chat-button-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 999;
        }

        .chat-button {
          position: relative;
          width: 56px;
          height: 56px;
          background: #19c37d;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
        }

        .chat-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .chat-button-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-button-label {
          position: absolute;
          bottom: 68px;
          right: 0;
          background: rgba(0, 0, 0, 0.9);
          color: #ffffff;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
          white-space: nowrap;
          font-weight: 500;
        }

        .chat-button-label::after {
          content: '';
          position: absolute;
          top: 100%;
          right: 20px;
          border: 6px solid transparent;
          border-top-color: rgba(0, 0, 0, 0.9);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .chat-button-container {
            bottom: 20px;
            right: 20px;
          }

          .chat-button {
            width: 52px;
            height: 52px;
          }

          .chat-button-label {
            bottom: 64px;
            font-size: 12px;
          }
        }
      `}</style>
    </>
  )
}
