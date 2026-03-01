'use client'

import { useState } from 'react'
import { Sparkles, Globe, Youtube, FileText, Plus } from 'lucide-react'
import KeywordInput from '@/components/KeywordInput'
import StyleSelector from '@/components/StyleSelector'
import FileUpload from '@/components/FileUpload'
import Calendar from '@/components/Calendar'

export default function Dashboard() {
  const [hospitalName, setHospitalName] = useState('')
  const [doctorName, setDoctorName] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])
  const [style, setStyle] = useState<'standard' | 'friendly' | 'casual'>('casual')
  const [loading, setLoading] = useState(false)
  const [showYoutubeInput, setShowYoutubeInput] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [useWebSearch, setUseWebSearch] = useState(false)

  const handleQuickGenerate = async () => {
    if (!hospitalName || keywords.length === 0) return
    setLoading(true)
    try {
      const res = await fetch('/api/blog/quick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hospitalName, keywords, style, youtubeUrl, useWebSearch }),
      })
      const data = await res.json()
      if (data.content) {
        window.location.href = '/posts'
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">대시보드</h1>
      <p className="text-gray-500 text-sm mb-6">AI 추천으로 빠르게 시작하고, 캘린더로 일정을 관리하세요</p>

      {/* Quick Blog Generation */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={20} className="text-gray-700" />
          <h2 className="text-lg font-bold text-gray-900">빠른 블로그 생성</h2>
        </div>
        <p className="text-sm text-gray-500 mb-5">최소한의 정보로 1분 안에 전문 블로그 글 작성하기</p>

        <div className="grid grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="space-y-5">
            <div>
              <h3 className="font-semibold text-sm text-gray-900 mb-3">필수 정보</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">병원명 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    placeholder="예: 연세피부과의원"
                    className="w-full border-b border-gray-300 py-2 px-1 text-sm focus:outline-none focus:border-teal-500 bg-transparent mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">의사명 (선택)</label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="예: 김연세"
                    className="w-full border-b border-gray-300 py-2 px-1 text-sm focus:outline-none focus:border-teal-500 bg-transparent mt-1"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">주요 키워드 <span className="text-red-500">*</span></label>
              <KeywordInput keywords={keywords} onChange={setKeywords} />
            </div>

            <div>
              <h3 className="font-semibold text-sm text-gray-900 mb-2">콘텐츠 스타일</h3>
              <p className="text-xs text-gray-400 mb-2">글의 톤앤매너를 선택하세요</p>
              <StyleSelector value={style} onChange={setStyle} />
            </div>

            <button
              onClick={handleQuickGenerate}
              disabled={loading || !hospitalName || keywords.length === 0}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Sparkles size={18} />
              {loading ? '생성 중...' : '빠른 블로그 작성'}
            </button>
            <p className="text-xs text-gray-400 text-center">최소 1개 이상의 콘텐츠 소스를 선택해주세요</p>
          </div>

          {/* Right: Data Sources */}
          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-1">어떤 자료를 활용할까요?</h3>
            <p className="text-xs text-gray-400 mb-4">최소 1개 이상 선택해주세요 (복수 선택 가능)</p>

            <div className="space-y-4">
              {/* Web Search */}
              <div
                onClick={() => setUseWebSearch(!useWebSearch)}
                className={`border rounded-xl p-4 cursor-pointer transition-colors ${
                  useWebSearch ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-gray-500" />
                  <div>
                    <p className="font-medium text-sm text-gray-900">웹 검색으로 최신 정보 추가</p>
                    <p className="text-xs text-gray-500">키워드 기반으로 최신 의학 정보를 자동 검색하여 블로그에 반영합니다</p>
                  </div>
                </div>
              </div>

              {/* YouTube */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Youtube size={20} className="text-gray-500" />
                  <div>
                    <p className="font-medium text-sm text-gray-900">YouTube 영상을 AI가 요약</p>
                    <p className="text-xs text-gray-500">YouTube 영상 URL을 입력하면 AI가 핵심 내용을 요약하여 블로그에 활용합니다</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowYoutubeInput(!showYoutubeInput)}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Youtube size={16} /> 영상 URL 입력하기
                </button>
                {showYoutubeInput && (
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                )}
              </div>

              {/* Document Upload */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <FileText size={20} className="text-gray-500" />
                  <div>
                    <p className="font-medium text-sm text-gray-900">참고 문서 업로드</p>
                    <p className="text-xs text-gray-500">참고 자료 파일을 업로드하면 AI가 내용을 분석하여 블로그에 반영합니다</p>
                  </div>
                </div>
                <FileUpload onFileSelect={(file) => console.log(file)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <Calendar />

      {/* Recent Posts */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-gray-500">🕐</span>
          <h2 className="text-lg font-bold text-gray-900">최근 작성 글</h2>
        </div>
        <p className="text-sm text-gray-500 mb-6">최근 작성한 블로그 포스트 목록입니다</p>

        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <FileText size={40} className="mb-3 opacity-50" />
          <p className="text-sm font-medium text-gray-500">아직 작성한 글이 없습니다</p>
          <p className="text-xs text-gray-400 mt-1">블로그 작성 페이지에서 첫 글을 작성해보세요</p>
        </div>
      </div>
    </div>
  )
}
