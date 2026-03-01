'use client'

import { useState } from 'react'
import { Search, FileText } from 'lucide-react'

interface Post {
  id: string
  title: string
  content: string
  keywords: string[]
  status: string
  created_at: string
}

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [posts] = useState<Post[]>([])

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">내 작성 글</h1>
      <p className="text-gray-500 text-sm mb-6">작성한 블로그 글을 관리하세요</p>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex items-center gap-2">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="제목 또는 내용으로 검색..."
            className="flex-1 text-sm focus:outline-none bg-transparent"
          />
          <button className="bg-teal-500 hover:bg-teal-600 text-white text-sm px-4 py-2 rounded-lg transition-colors">
            검색
          </button>
        </div>
      </div>

      {/* Post List */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-gray-500" />
            <h2 className="font-bold text-gray-900">포스트 목록</h2>
          </div>
          <span className="text-sm text-gray-400">총 {filteredPosts.length}개</span>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="space-y-3">
            {filteredPosts.map((post) => (
              <div key={post.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{post.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    post.status === 'published' ? 'bg-green-100 text-green-700' :
                    post.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {post.status === 'published' ? '발행됨' : post.status === 'scheduled' ? '예약됨' : '초안'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{post.content.replace(/<[^>]*>/g, '')}</p>
                <div className="flex items-center gap-2 mt-2">
                  {post.keywords.map((kw, i) => (
                    <span key={i} className="text-xs bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full">{kw}</span>
                  ))}
                  <span className="text-xs text-gray-400 ml-auto">{new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <FileText size={48} className="mb-3 opacity-40" />
            <p className="text-sm font-medium text-gray-500">아직 작성한 글이 없습니다</p>
            <p className="text-xs text-gray-400 mt-1">블로그 작성 페이지에서 첫 글을 작성해보세요</p>
          </div>
        )}
      </div>
    </div>
  )
}
