'use client'

import { useState, KeyboardEvent } from 'react'
import { Plus, X } from 'lucide-react'

interface KeywordInputProps {
  keywords: string[]
  onChange: (keywords: string[]) => void
  maxKeywords?: number
  placeholder?: string
}

export default function KeywordInput({
  keywords,
  onChange,
  maxKeywords = 5,
  placeholder = '주요 키워드 입력 (예: 올세라, HIFU)',
}: KeywordInputProps) {
  const [input, setInput] = useState('')

  const addKeyword = () => {
    const trimmed = input.trim()
    if (trimmed && keywords.length < maxKeywords && !keywords.includes(trimmed)) {
      onChange([...keywords, trimmed])
      setInput('')
    }
  }

  const removeKeyword = (index: number) => {
    onChange(keywords.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addKeyword()
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 border-b border-gray-300 py-2 px-1 text-sm focus:outline-none focus:border-teal-500 bg-transparent"
        />
        <button
          onClick={addKeyword}
          disabled={keywords.length >= maxKeywords}
          className="p-1 text-gray-400 hover:text-teal-500 disabled:opacity-30"
        >
          <Plus size={20} />
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-1">
        {keywords.length}/{maxKeywords} 태그 · Enter 또는 쉼표(,)로 추가
      </p>

      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {keywords.map((kw, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full text-sm"
            >
              {kw}
              <button onClick={() => removeKeyword(i)} className="hover:text-teal-900">
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
