import { NextRequest, NextResponse } from 'next/server'
import { summarizeYouTube } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'YouTube URL을 입력해주세요.' },
        { status: 400 }
      )
    }

    // Extract video ID from URL
    const videoId = extractVideoId(url)
    if (!videoId) {
      return NextResponse.json(
        { error: '유효한 YouTube URL이 아닙니다.' },
        { status: 400 }
      )
    }

    // In production, use YouTube Data API or a transcript service
    // For now, use Gemini to generate a mock summary based on the URL
    const summary = await summarizeYouTube(
      `YouTube 영상 (${url})의 내용을 기반으로 의료 블로그에 활용할 수 있는 요약을 생성해주세요.`
    )

    return NextResponse.json({ summary, videoId })
  } catch (error) {
    console.error('YouTube summary error:', error)
    return NextResponse.json(
      { error: 'YouTube 요약에 실패했습니다.' },
      { status: 500 }
    )
  }
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtu\.be\/)([^\s]+)/,
    /(?:youtube\.com\/embed\/)([^?\s]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}
