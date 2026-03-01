import { NextRequest, NextResponse } from 'next/server'
import { generateQuickBlog } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { hospitalName, keywords, style = 'casual', youtubeUrl, useWebSearch } = body

    if (!hospitalName || !keywords || keywords.length === 0) {
      return NextResponse.json(
        { error: '병원명과 키워드는 필수입니다.' },
        { status: 400 }
      )
    }

    let webSearchResults: string | undefined
    let youtubeSummary: string | undefined

    if (useWebSearch) {
      webSearchResults = `웹 검색 결과: ${keywords.join(', ')} 관련 최신 의학 정보`
    }

    if (youtubeUrl) {
      youtubeSummary = `YouTube 영상 요약: ${youtubeUrl}`
    }

    const content = await generateQuickBlog({
      hospitalName,
      keywords,
      style,
      webSearchResults,
      youtubeSummary,
    })

    return NextResponse.json({ content })
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error)
    console.error('Quick blog generation error:', errMsg, error)
    return NextResponse.json(
      { error: `빠른 블로그 생성에 실패했습니다: ${errMsg}` },
      { status: 500 }
    )
  }
}
