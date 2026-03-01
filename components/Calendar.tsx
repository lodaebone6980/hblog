'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react'

interface CalendarProps {
  posts?: { id: string; title: string; scheduled_at: string; status: string }[]
}

export default function Calendar({ posts = [] }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const [selectedDate, setSelectedDate] = useState(today.getDate())

  const days = []
  // Previous month padding
  const prevMonthDays = new Date(year, month, 0).getDate()
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, current: false })
  }
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, current: true })
  }
  // Next month padding
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, current: false })
  }

  const isToday = (day: number, isCurrent: boolean) =>
    isCurrent &&
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear()

  const selectedDay = selectedDate
  const monthStr = `${year}년 ${month + 1}월`

  const dayNames = ['일', '월', '화', '수', '목', '금', '토']

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-1">
        <CalendarIcon size={20} className="text-gray-700" />
        <h2 className="text-lg font-bold text-gray-900">콘텐츠 캘린더</h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">블로그 발행 일정을 한눈에 관리하세요</p>

      <div className="flex gap-4">
        {/* Calendar Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
              <ChevronLeft size={20} />
            </button>
            <span className="font-semibold text-gray-900">{monthStr}</span>
            <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0">
            {dayNames.map((name) => (
              <div key={name} className="text-center text-xs font-medium text-gray-400 py-2">
                {name}
              </div>
            ))}
            {days.map((d, idx) => (
              <button
                key={idx}
                onClick={() => d.current && setSelectedDate(d.day)}
                className={`text-center py-2.5 text-sm rounded-lg transition-colors ${
                  !d.current
                    ? 'text-gray-300'
                    : isToday(d.day, d.current)
                    ? 'bg-teal-500 text-white font-bold'
                    : d.day === selectedDay && d.current
                    ? 'bg-teal-100 text-teal-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {d.day}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-500" /> 발행됨
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> 예약됨
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-gray-400" /> 초안
            </span>
          </div>
        </div>

        {/* Selected Date Detail */}
        <div className="w-[220px] border-l pl-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-sm text-gray-900">
              {month + 1}월 {selectedDay}일 {dayNames[new Date(year, month, selectedDay).getDay()]}요일
            </span>
            <button className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700">
              <Plus size={14} /> 추가
            </button>
          </div>

          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <CalendarIcon size={32} className="mb-2 opacity-50" />
            <p className="text-sm">예정된 포스트가 없습니다</p>
            <button className="text-sm text-teal-600 hover:text-teal-700 mt-1">
              새 포스트 작성하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
