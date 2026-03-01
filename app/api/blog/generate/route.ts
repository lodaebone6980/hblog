import { NextRequest, NextResponse } from 'next/server'
import { generateBlogContent, suggestTopics } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // AI Topic Suggestion
    if (body.action === 'suggest') {
      const topics = await suggestTopics(body.keywords)
      return NextResponse.json({ topics })
    }

    // Blog Generation
    const {
      hospitalName,
      doctorName,
      persona,
      keywords,
      topic,
      referenceText,
      academicText,
      style = 'casual',
      targetLength = 1500,
      useWebSearch,
      youtubeUrl,
    } = body

    if (!hospitalName || !keywords || keywords.length === 0) {
      return NextResponse.json(
        { error: '병원명과 키워드는 필수입니다.' },
        { status: 400 }
      )
    }

    let webSearchResults: string | undefined
    let youtubeSummary: string | undefined

    // Web search integration (placeholder)
    if (useWebSearch) {
      webSearchResults = `웹 검색 결과: ${keywords.join(', ')} 관련 최신 의학 정보`
    }

    // YouTube summary (placeholder)
    if (youtubeUrl) {
      youtubeSummary = `YouTube 영상 요약: ${youtubeUrl} 의 핵심 내용`
    }

    const content = await generateBlogContent({
      hospitalName,
      doctorName,
      persona,
      keywords,
      topic,
      referenceText,
      academicText,
      style,
      targetLength,
      webSearchResults,
      youtubeSummary,
    })

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Blog generation error:', error)
    return NextResponse.json(
      { error: '블로그 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}
