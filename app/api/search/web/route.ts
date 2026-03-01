import { NextRequest, NextResponse } from 'next/server'
import { geminiModel } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { keywords } = await request.json()

    if (!keywords || keywords.length === 0) {
      return NextResponse.json(
        { error: '검색 키워드를 입력해주세요.' },
        { status: 400 }
      )
    }

    // Use Gemini with grounding/search to get up-to-date information
    const prompt = `다음 키워드에 대한 최신 의학 정보를 검색하여 요약해주세요.
블로그 작성에 활용할 수 있는 형태로 정리해주세요.

키워드: ${keywords.join(', ')}

다음 형식으로 작성해주세요:
1. 최신 트렌드 및 동향
2. 주요 연구 결과 (있는 경우)
3. 환자들이 자주 궁금해하는 내용
4. 블로그에 활용할 수 있는 핵심 포인트`

    const result = await geminiModel.generateContent(prompt)
    const searchResults = result.response.text()

    return NextResponse.json({ results: searchResults })
  } catch (error) {
    console.error('Web search error:', error)
    return NextResponse.json(
      { error: '웹 검색에 실패했습니다.' },
      { status: 500 }
    )
  }
}
