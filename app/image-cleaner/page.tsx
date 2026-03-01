'use client'

import { useState, useRef } from 'react'
import { ShieldCheck, Upload, Download, Info, X, ImageIcon } from 'lucide-react'

interface ProcessedImage {
  originalName: string
  newName: string
  url: string
  size: number
}

export default function ImageCleanerPage() {
  const [images, setImages] = useState<File[]>([])
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([])
  const [hashMode, setHashMode] = useState(true)
  const [keepExtension, setKeepExtension] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [usageCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(
      (f) => f.size <= 5 * 1024 * 1024 && ['image/jpeg', 'image/png', 'image/webp'].includes(f.type)
    )
    setImages((prev) => [...prev, ...validFiles].slice(0, 10))
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleProcess = async () => {
    if (images.length === 0) return
    setProcessing(true)

    try {
      const formData = new FormData()
      images.forEach((img) => formData.append('images', img))
      formData.append('hashMode', String(hashMode))
      formData.append('keepExtension', String(keepExtension))

      const res = await fetch('/api/image/clean', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.processed) {
        setProcessedImages(data.processed)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">이미지 워싱</h1>
          <p className="text-gray-500 text-sm">이미지 메타데이터 제거, 파일명 무작위화, 해시 분산으로 프라이버시를 보호하세요.</p>
        </div>
        <span className="text-sm text-gray-400">사용량: {usageCount}/50장</span>
      </div>

      {/* Info Banner */}
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-2">
          <Info size={18} className="text-teal-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-teal-700">이미지 워싱이란?</p>
            <p className="text-xs text-teal-600 mt-0.5">
              이미지에서 EXIF 메타데이터(GPS, 카메라 정보, 촬영 시간 등)를 완전히 제거하고, 파일명을 무작위화하여 프라이버시를 보호합니다. 해시 분산 모드를 사용하면 플랫폼의 중복 이미지 감지도 회피할 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">이미지 업로드</h2>

        <label
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg py-12 cursor-pointer hover:border-gray-400 transition-colors mb-4"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
            setImages(prev => [...prev, ...files].slice(0, 10))
          }}
        >
          <Upload size={32} className="text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">클릭하거나 파일을 드래그하여 업로드</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (최대 5MB)</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>

        {images.length > 0 ? (
          <div className="grid grid-cols-5 gap-3 mb-4">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                <img
                  src={URL.createObjectURL(img)}
                  alt={img.name}
                  className="w-full aspect-square object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
                <p className="text-xs text-gray-500 truncate mt-1">{img.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-6 text-gray-400">
            <ImageIcon size={32} className="mb-2 opacity-50" />
            <p className="text-sm">아직 업로드된 이미지가 없습니다</p>
          </div>
        )}

        <p className="text-xs text-gray-400">최대 10장, 파일당 5MB까지 업로드 가능 (JPG, PNG, WebP)</p>
      </div>

      {/* Options */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">처리 옵션</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">해시 분산 모드</p>
              <p className="text-xs text-gray-400">미세한 리샘플링으로 시각적 동일성을 유지하면서 perceptual hash를 변경합니다.</p>
            </div>
            <button
              onClick={() => setHashMode(!hashMode)}
              className={`relative w-11 h-6 rounded-full transition-colors ${hashMode ? 'bg-teal-500' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${hashMode ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">원본 확장자 유지</p>
              <p className="text-xs text-gray-400">원본 이미지의 확장자(JPG, PNG, WebP)를 그대로 유지합니다.</p>
            </div>
            <button
              onClick={() => setKeepExtension(!keepExtension)}
              className={`relative w-11 h-6 rounded-full transition-colors ${keepExtension ? 'bg-teal-500' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${keepExtension ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-4 p-3 bg-gray-50 rounded-lg">
          주의: 이 도구는 개인정보 보호를 위한 합법적인 목적(블로그, 개인용 포스팅)에 사용되며, 타인의 콘텐츠를 무단으로 도용하는 목적으로는 사용되어서는 안됩니다.
        </p>
      </div>

      {/* Process Button */}
      <button
        onClick={handleProcess}
        disabled={processing || images.length === 0}
        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3.5 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <ShieldCheck size={20} />
        {processing ? '처리 중...' : `이미지 워싱 시작 (${images.length}장)`}
      </button>

      {/* Processed Results */}
      {processedImages.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
          <h2 className="font-bold text-gray-900 mb-4">처리 완료</h2>
          <div className="space-y-3">
            {processedImages.map((img, i) => (
              <div key={i} className="flex items-center justify-between border border-gray-100 rounded-lg p-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">{img.newName}</p>
                  <p className="text-xs text-gray-400">원본: {img.originalName}</p>
                </div>
                <a href={img.url} download={img.newName}
                  className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700">
                  <Download size={16} /> 다운로드
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
