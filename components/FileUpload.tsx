'use client'

import { useState, useCallback } from 'react'
import { Upload, FileText, X } from 'lucide-react'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number // MB
  label?: string
  description?: string
}

export default function FileUpload({
  onFileSelect,
  accept = '.docx,.pdf,.txt',
  maxSize = 10,
  label = '파일을 드래그하거나 클릭하여 업로드',
  description = `DOCX, PDF, TXT (최대 ${maxSize}MB)`,
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const f = e.dataTransfer.files[0]
      if (f && f.size <= maxSize * 1024 * 1024) {
        setFile(f)
        onFileSelect(f)
      }
    },
    [maxSize, onFileSelect]
  )

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      onFileSelect(f)
    }
  }

  const removeFile = () => setFile(null)

  return (
    <div>
      {!file ? (
        <label
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg py-8 px-4 cursor-pointer transition-colors ${
            dragOver ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <Upload size={24} className="text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-xs text-gray-400 mt-1">{description}</p>
          <input type="file" accept={accept} onChange={handleSelect} className="hidden" />
          <button
            type="button"
            className="mt-3 flex items-center gap-1 text-sm text-gray-500 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50"
          >
            <FileText size={14} /> 파일 선택
          </button>
        </label>
      ) : (
        <div className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-teal-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">{file.name}</p>
              <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <button onClick={removeFile} className="text-gray-400 hover:text-red-500">
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
