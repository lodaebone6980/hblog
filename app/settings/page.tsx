'use client'

import { useState, useEffect } from 'react'
import { Settings, User, BarChart3, Clock, KeyRound, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { formatRelativeTime } from '@/lib/utils'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const blogUsage = 0
  const blogLimit = 50
  const imageUsage = 0
  const imageLimit = 15

  const activities = [
    { action: '로그인', time: new Date() },
  ]

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.')
      return
    }
    if (newPassword.length < 6) {
      setPasswordError('비밀번호는 6자 이상이어야 합니다.')
      return
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setPasswordError('비밀번호 변경에 실패했습니다.')
    } else {
      setPasswordSuccess('비밀번호가 변경되었습니다.')
      setNewPassword('')
      setConfirmPassword('')
      setShowPasswordChange(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const handleDeleteAccount = async () => {
    if (!confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return
    // Account deletion logic
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">설정</h1>
      <p className="text-gray-500 text-sm mb-6">계정 및 사용량 정보를 확인하세요</p>

      <div className="space-y-6">
        {/* Profile */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-1">
            <User size={18} className="text-teal-500" />
            <h2 className="font-bold text-gray-900">프로필</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">프로필 정보를 관리하세요</p>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-lg">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.email || '로딩 중...'}</p>
              <p className="text-xs text-gray-400">가입일: {user?.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR') : '-'}</p>
            </div>
          </div>
        </div>

        {/* Usage */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={18} className="text-teal-500" />
            <h2 className="font-bold text-gray-900">사용량 현황</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">블로그 및 이미지 생성 사용량을 확인하세요</p>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700">블로그 작성</span>
                <span className="text-sm text-gray-500">{blogUsage} / {blogLimit} /월</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${(blogUsage / blogLimit) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700">이미지 생성</span>
                <span className="text-sm text-gray-500">{imageUsage} / {imageLimit} /일</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${(imageUsage / imageLimit) * 100}%` }} />
              </div>
            </div>

            <p className="text-xs text-gray-400">다음 리셋: 23시간 51분 후</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={18} className="text-teal-500" />
            <h2 className="font-bold text-gray-900">최근 활동</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">최근 계정 활동 내역</p>

          <div className="space-y-3">
            {activities.map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm bg-teal-50 text-teal-600 px-2.5 py-0.5 rounded-full">{activity.action}</span>
                <span className="text-xs text-gray-400">{formatRelativeTime(activity.time)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Account Management */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-1">계정 관리</h2>
          <p className="text-sm text-gray-500 mb-4">비밀번호 변경 및 데이터 관리</p>

          <div className="flex gap-3">
            <button
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <KeyRound size={16} /> 비밀번호 변경
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              로그아웃
            </button>
            <button
              onClick={handleDeleteAccount}
              className="flex items-center gap-2 border border-red-200 rounded-lg px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={16} /> 계정 삭제
            </button>
          </div>

          {showPasswordChange && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg space-y-3">
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호 확인" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
              {passwordSuccess && <p className="text-xs text-green-500">{passwordSuccess}</p>}
              <button onClick={handlePasswordChange}
                className="bg-teal-500 hover:bg-teal-600 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                변경하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
