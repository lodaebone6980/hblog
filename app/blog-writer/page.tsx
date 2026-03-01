'use client'

import { useState } from 'react'
import { PenSquare, Sparkles, Search, Youtube } from 'lucide-react'
import KeywordInput from '@/components/KeywordInput'
import StyleSelector from '@/components/StyleSelector'
import FileUpload from '@/components/FileUpload'

export default function BlogWriterPage() {
  const [hospitalName, setHospitalName] = useState('')
  const [doctorName, setDoctorName] = useState('')
  const [persona, setPersona] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])
  const [topic, setTopic] = useState('')
  const [referenceText, setReferenceText] = useState('')
  const [academicText, setAcademicText] = useState('')
  const [style, setStyle] = useState<'standard' | 'friendly' | 'casual'>('casual')
  const [targetLength, setTargetLength] = useState(1500)
  const [useWebSearch, setUseWebSearch] = useState(false)
  const [loading, setLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [showYoutube, setShowYoutube] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')

  const handleGenerate = async () => {
    if (!hospitalName || keywords.length === 0) return
    setLoading(true)
    try {
      const res = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospitalName, doctorName, persona, keywords, topic,
          referenceText, academicText, style, targetLength,
          useWebSearch, youtubeUrl,
        }),
      })
      const data = await res.json()
      if (data.content) {
        setGeneratedContent(data.content)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestTopics = async () => {
    if (keywords.length === 0) return
    try {
      const res = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'suggest', keywords }),
      })
      const data = await res.json()
      if (data.topics && data.topics.length > 0) {
        setTopic(data.topics[0])
      }
    } catch {}
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <PenSquare size={24} className="text-gray-700" />
        <h1 className="text-2xl font-bold text-gray-900">AI 블로그 작성</h1>
      </div>
      <p className="text-gray-500 text-sm mb-6">의료법을 준수하는 전문 블로그 콘텐츠를 AI로 자동 생성합니다.</p>

      <div className="grid grid-cols-[1fr_1fr] gap-6">
        {/* Left: Form */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 mb-1">기본 정보</h2>
            <p className="text-xs text-gray-500 mb-4">병원과 의사 정보를 입력하세요</p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">병원명 <span className="text-red-500">*</span></label>
                <input type="text" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)}
                  placeholder="예: 연세피부과의원"
                  className="w-full border-b border-gray-300 py-2 px-1 text-sm focus:outline-none focus:border-teal-500 bg-transparent mt-1" />
              </div>
              <div>
                <label className="text-sm text-gray-500">의사명 (선택사항)</label>
                <input type="text" value={doctorName} onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="예: 김연세 (입력 시 AI 글에 포함됩니다)"
                  className="w-full border-b border-gray-300 py-2 px-1 text-sm focus:outline-none focus:border-teal-500 bg-transparent mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">특징 (페르소나) (선택사항)</label>
                <textarea value={persona} onChange={(e) => setPersona(e.target.value)}
                  placeholder="예: 15년 경력 의료진, 레이저 및 리프팅 시술 경험 풍부, 편안하고 친근한 상담 스타일"
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-transparent mt-1 resize-none" />
                <p className="text-xs text-gray-400 mt-1">병원/의료진의 특징, 시술 경험, 경력, 선호하는 업무 등 (0/500)</p>
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 mb-1">키워드 설정</h2>
            <p className="text-xs text-gray-500 mb-4">블로그의 주요 키워드와 전체 주제를 입력하세요</p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">주요 키워드 <span className="text-red-500">*</span></label>
                <KeywordInput keywords={keywords} onChange={setKeywords} />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-500">전체 주제 (선택사항)</label>
                  <button onClick={handleSuggestTopics} className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700">
                    <Sparkles size={12} /> AI 주제 추천
                  </button>
                </div>
                <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)}
                  placeholder="예: 리프팅 시술의 종류와 선택 기준 (전체적인 글의 방향성)"
                  className="w-full border-b border-gray-300 py-2 px-1 text-sm focus:outline-none focus:border-teal-500 bg-transparent mt-1" />
                <p className="text-xs text-gray-400 mt-1">글 전체를 관통하는 주제나 논지를 입력하면 더 일관된 내용이 생성됩니다</p>
              </div>
            </div>
          </div>

          {/* Reference Text */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 mb-1">참고 텍스트</h2>
            <p className="text-xs text-gray-500 mb-4">블로그 작성을 위한 참고 자료를 입력하세요</p>

            <div className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={useWebSearch} onChange={(e) => setUseWebSearch(e.target.checked)}
                  className="w-4 h-4 text-teal-500 rounded focus:ring-teal-500" />
                <div>
                  <span className="text-sm font-medium text-gray-700">웹 검색으로 최신 정보 추가</span>
                  <p className="text-xs text-gray-400">메인 키워드를 기반으로 최신 의학 정보를 자동 검색합니다. 참고 텍스트와 병행 가능합니다.</p>
                </div>
              </label>

              <button onClick={() => setShowYoutube(!showYoutube)}
                className="w-full border border-gray-200 rounded-lg py-2.5 flex items-center justify-center gap-2 text-sm text-gray-600 hover:bg-gray-50">
                <Youtube size={16} /> YouTube 영상 요약
              </button>
              {showYoutube && (
                <input type="url" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">참고 텍스트 <span className="text-red-500">*</span></label>
                <FileUpload onFileSelect={(file) => console.log(file)} />
                <p className="text-xs text-gray-400 mt-2">업로드된 파일의 내용이 참고 텍스트로 자동 입력됩니다. 기존 내용은 대체됩니다.</p>
                <textarea value={referenceText} onChange={(e) => setReferenceText(e.target.value)}
                  placeholder="블로그 작성을 위한 참고 텍스트를 입력하거나 파일을 업로드하세요..."
                  rows={5}
                  className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-transparent mt-2 resize-none" />
              </div>
            </div>
          </div>

          {/* Academic */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 mb-1">학술 자료</h2>
            <p className="text-xs text-gray-500 mb-4">논문이나 학술 자료를 입력하세요</p>

            <div>
              <label className="text-sm text-gray-500">논문 텍스트 (선택사항)</label>
              <textarea value={academicText} onChange={(e) => setAcademicText(e.target.value)}
                placeholder="의학 논문이나 학술 자료를 입력하세요..."
                rows={5}
                className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-transparent mt-1 resize-none" />
              <p className="text-xs text-gray-400 mt-1">의학 논문이나 학술 자료를 입력하면 더 전문적인 내용이 생성됩니다</p>
              <button className="w-full border border-gray-200 rounded-lg py-2.5 flex items-center justify-center gap-2 text-sm text-gray-600 hover:bg-gray-50 mt-2">
                <Search size={16} /> 논문 검색
              </button>
            </div>
          </div>

          {/* Style */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 mb-1">스타일 설정</h2>
            <p className="text-xs text-gray-500 mb-4">콘텐츠 스타일과 글자수를 설정하세요</p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">콘텐츠 스타일 <span className="text-red-500">*</span></label>
                <StyleSelector value={style} onChange={setStyle} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">목표 글자수</label>
                  <span className="text-sm font-semibold text-gray-900">{targetLength}자</span>
                </div>
                <input type="range" min={500} max={5000} step={100}
                  value={targetLength} onChange={(e) => setTargetLength(Number(e.target.value))}
                  className="w-full accent-teal-500" />
                <p className="text-xs text-gray-400 mt-1">권장: {targetLength}자 (±10% 범위 내에서 생성됩니다)</p>
              </div>
            </div>
          </div>

          <button onClick={handleGenerate}
            disabled={loading || !hospitalName || keywords.length === 0}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3.5 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-base">
            <Sparkles size={20} />
            {loading ? '블로그 생성 중...' : '블로그 생성'}
          </button>
        </div>

        {/* Right: Preview */}
        <div className="sticky top-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 min-h-[400px]">
            {generatedContent ? (
              <div className="blog-content" dangerouslySetInnerHTML={{ __html: generatedContent }} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
                <Sparkles size={48} className="mb-4 opacity-30" />
                <p className="text-lg font-medium text-gray-500">블로그를 생성해보세요</p>
                <p className="text-sm text-gray-400 mt-1 text-center">좌측 폼을 작성하고 &apos;블로그 생성&apos; 버튼을 클릭하면 AI가 전문적인 블로그 글을 작성해드립니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
