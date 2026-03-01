'use client'

import { useState } from 'react'
import { ImagePlus, Upload, Type } from 'lucide-react'

export default function ImageGeneratorPage() {
  const [imageStyle, setImageStyle] = useState<'kbeauty' | 'sns'>('kbeauty')
  const [inputMode, setInputMode] = useState<'upload' | 'text'>('upload')
  const [textPrompt, setTextPrompt] = useState('')
  const [ratio, setRatio] = useState('4:5')
  const [loading, setLoading] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ style: imageStyle, prompt: textPrompt, ratio }),
      })
      const data = await res.json()
      if (data.imageUrl) {
        setGeneratedImages([data.imageUrl, ...generatedImages])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">이미지 생성</h1>
      <p className="text-gray-500 text-sm mb-6">레퍼런스 이미지 또는 텍스트를 입력하여 AI 이미지를 생성합니다.</p>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Style Selection */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-900 mb-1">스타일 선택</h2>
          <p className="text-xs text-gray-500 mb-4">생성할 이미지의 스타일을 선택하세요.</p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setImageStyle('kbeauty')}
              className={`p-4 rounded-xl border-2 text-left transition-colors ${
                imageStyle === 'kbeauty' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>✨</span>
                <span className={`font-medium text-sm ${imageStyle === 'kbeauty' ? 'text-teal-700' : 'text-gray-700'}`}>
                  K-beauty Studio
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-6">프로페셔널 K-beauty 에디토리얼 스타일</p>
            </button>
            <button
              onClick={() => setImageStyle('sns')}
              className={`p-4 rounded-xl border-2 text-left transition-colors ${
                imageStyle === 'sns' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>📸</span>
                <span className={`font-medium text-sm ${imageStyle === 'sns' ? 'text-teal-700' : 'text-gray-700'}`}>
                  SNS Snapshot
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-6">캐주얼 SNS 라이프스타일 스타일</p>
            </button>
          </div>
        </div>

        {/* Input Mode */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-900 mb-1">입력 방식</h2>
          <p className="text-xs text-gray-500 mb-4">레퍼런스 이미지를 업로드하거나 텍스트로 설명하세요.</p>

          <div className="flex border border-gray-200 rounded-lg overflow-hidden mb-4">
            <button
              onClick={() => setInputMode('upload')}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                inputMode === 'upload' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              이미지 업로드
            </button>
            <button
              onClick={() => setInputMode('text')}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                inputMode === 'text' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              텍스트 입력
            </button>
          </div>

          {inputMode === 'upload' ? (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg py-12 cursor-pointer hover:border-gray-400 transition-colors">
              <Upload size={32} className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">이미지를 드래그하거나 클릭하여 업로드</p>
              <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP, HEIC (최대 7MB)</p>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          ) : (
            <textarea
              value={textPrompt}
              onChange={(e) => setTextPrompt(e.target.value)}
              placeholder="생성하고 싶은 이미지를 텍스트로 설명하세요..."
              rows={5}
              className="w-full border border-gray-200 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          )}
        </div>

        {/* Generation Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-900 mb-3">생성 설정</h2>
          <div>
            <label className="text-sm font-medium text-gray-700">비율</label>
            <select
              value={ratio}
              onChange={(e) => setRatio(e.target.value)}
              className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="4:5">4:5 - 인스타그램 피드 (기본)</option>
              <option value="1:1">1:1 - 정사각형</option>
              <option value="16:9">16:9 - 와이드</option>
              <option value="9:16">9:16 - 스토리/릴스</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || (inputMode === 'text' && !textPrompt)}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
          >
            <ImagePlus size={18} />
            {loading ? '이미지 생성 중...' : '이미지 생성'}
          </button>
        </div>

        {/* Generated Images */}
        {generatedImages.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 mb-3">생성된 이미지</h2>
            <div className="grid grid-cols-2 gap-3">
              {generatedImages.map((url, i) => (
                <div key={i} className="rounded-lg overflow-hidden border border-gray-200">
                  <img src={url} alt={`Generated ${i + 1}`} className="w-full h-auto" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
