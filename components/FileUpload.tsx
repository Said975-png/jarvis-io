import { useState, useRef } from 'react'

interface FileUploadProps {
  onFileAnalyzed: (analysis: string) => void
  disabled?: boolean
}

export default function FileUpload({ onFileAnalyzed, disabled = false }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    if (!file || file.type !== 'application/pdf') {
      alert('Пожалуйста, выберите PDF файл')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      alert('Размер файла не должен превышать 10MB')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('pdf', file)

      const response = await fetch('/api/analyze-pdf', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        onFileAnalyzed(data.message)
      } else {
        throw new Error(data.error || 'Ошибка анализа PDF')
      }
    } catch (error) {
      console.error('File upload error:', error)
      onFileAnalyzed(`Ошибка при загрузке файла: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled || isUploading) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled && !isUploading) {
      setDragActive(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
    // Очищаем input для возможности повторной загрузки того же файла
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFileDialog = () => {
    if (!disabled && !isUploading && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="file-upload-container">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />
      
      <div
        className={`file-upload-area ${dragActive ? 'drag-active' : ''} ${isUploading ? 'uploading' : ''} ${disabled ? 'disabled' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        {isUploading ? (
          <div className="upload-loading">
            <div className="loading-spinner"></div>
            <span>Анализирую PDF файл...</span>
          </div>
        ) : (
          <div className="upload-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="upload-icon">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="upload-text">
              <span className="upload-primary">Загрузить PDF файл</span>
              <span className="upload-secondary">Перетащите файл сюда или нажмите для выбора</span>
              <span className="upload-info">Максимум 10MB</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .file-upload-container {
          margin: 8px 0;
        }

        .file-upload-area {
          border: 2px dashed #d0d7de;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #f7f7f8;
          min-height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .file-upload-area:hover:not(.disabled):not(.uploading) {
          border-color: #0066cc;
          background: #f0f6ff;
        }

        .file-upload-area.drag-active {
          border-color: #0066cc;
          background: #e6f3ff;
          transform: scale(1.02);
        }

        .file-upload-area.uploading {
          border-color: #0066cc;
          background: #f0f6ff;
          cursor: not-allowed;
        }

        .file-upload-area.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #f1f3f4;
        }

        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .upload-icon {
          color: #666;
          margin-bottom: 4px;
        }

        .file-upload-area:hover:not(.disabled):not(.uploading) .upload-icon {
          color: #0066cc;
        }

        .upload-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .upload-primary {
          font-size: 14px;
          font-weight: 500;
          color: #0d1117;
        }

        .upload-secondary {
          font-size: 12px;
          color: #656d76;
        }

        .upload-info {
          font-size: 11px;
          color: #8c959f;
        }

        .upload-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #0066cc;
        }

        .upload-loading span {
          font-size: 14px;
          font-weight: 500;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #e6f3ff;
          border-top: 2px solid #0066cc;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .file-upload-area {
            padding: 12px;
            min-height: 70px;
          }

          .upload-primary {
            font-size: 13px;
          }

          .upload-secondary {
            font-size: 11px;
          }

          .upload-info {
            font-size: 10px;
          }

          .upload-icon {
            width: 20px;
            height: 20px;
          }
        }
      `}</style>
    </div>
  )
}
