'use client'

interface StyleSelectorProps {
  value: 'standard' | 'friendly' | 'casual'
  onChange: (style: 'standard' | 'friendly' | 'casual') => void
}

const styles = [
  { value: 'standard' as const, label: '표준 (Standard)', desc: '전문적이고 명확한 설명' },
  { value: 'friendly' as const, label: '친근함 (Friendly)', desc: '따뜻하고 친근한 톤' },
  { value: 'casual' as const, label: '캐주얼 (Casual)', desc: '대화하듯 부드럽게 이어지는 문장 스타일' },
]

export default function StyleSelector({ value, onChange }: StyleSelectorProps) {
  return (
    <div className="space-y-2">
      {styles.map((style) => (
        <button
          key={style.value}
          onClick={() => onChange(style.value)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-left transition-colors ${
            value === style.value
              ? 'border-teal-500 bg-teal-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {value === style.value && (
              <span className="w-2 h-2 rounded-full bg-teal-500" />
            )}
            <span className={`text-sm font-medium ${value === style.value ? 'text-teal-700' : 'text-gray-700'}`}>
              {style.label}
            </span>
            <span className="text-sm text-gray-400">- {style.desc}</span>
          </div>
          {value === style.value && (
            <span className="text-xs bg-teal-500 text-white px-2 py-0.5 rounded-full">추천</span>
          )}
        </button>
      ))}
    </div>
  )
}
