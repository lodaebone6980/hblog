import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
export const geminiProModel = genAI.getGenerativeModel({ model: 'gemini-2.5-pro-preview-06-05' })

export async function generateBlogContent({
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
}: {
  hospitalName: string
  doctorName?: string
  persona?: string
  keywords: string[]
  topic?: string
  referenceText?: string
  academicText?: string
  style: 'standard' | 'friendly' | 'casual'
  targetLength: number
  webSearchResults?: string
  youtubeSummary?: string
}) {
  const styleDescriptions = {
    standard: '전문적이고 명확한 설명 톤',
    friendly: '따뜻하고 친근한 톤',
    casual: '대화하듯 부드럽게 이어지는 문장 스타일',
  }

  const prompt = `당신은 의료 블로그 전문 작성자입니다. 아래 정보를 바탕으로 전문적인 의료 블로그 글을 작성해주세요.

## 기본 정보
- 병원명: ${hospitalName}
${doctorName ? `- 의사명: ${doctorName}` : ''}
${persona ? `- 특징/페르소나: ${persona}` : ''}

## 키워드
${keywords.join(', ')}

${topic ? `## 전체 주제\n${topic}` : ''}

## 콘텐츠 스타일
${styleDescriptions[style]}

## 목표 글자수
약 ${targetLength}자 (±10% 범위)

${referenceText ? `## 참고 텍스트\n${referenceText}` : ''}
${academicText ? `## 학술 자료\n${academicText}` : ''}
${webSearchResults ? `## 웹 검색 결과\n${webSearchResults}` : ''}
${youtubeSummary ? `## YouTube 영상 요약\n${youtubeSummary}` : ''}

## 작성 지침
1. 의료법을 준수하여 과장 광고나 허위 정보를 포함하지 마세요
2. 환자에게 도움이 되는 정보 위주로 작성하세요
3. SEO에 최적화된 제목과 소제목을 포함하세요
4. HTML 형식으로 작성해주세요 (h2, h3, p, ul, li 태그 사용)
5. 자연스러운 키워드 배치를 해주세요

제목은 <h1> 태그로 시작해주세요.`

  const result = await geminiModel.generateContent(prompt)
  const response = result.response
  return response.text()
}

export async function generateQuickBlog({
  hospitalName,
  keywords,
  style,
  webSearchResults,
  youtubeSummary,
  referenceText,
}: {
  hospitalName: string
  keywords: string[]
  style: 'standard' | 'friendly' | 'casual'
  webSearchResults?: string
  youtubeSummary?: string
  referenceText?: string
}) {
  return generateBlogContent({
    hospitalName,
    keywords,
    style,
    targetLength: 1500,
    webSearchResults,
    youtubeSummary,
    referenceText,
  })
}

export async function suggestTopics(keywords: string[]) {
  const prompt = `다음 키워드와 관련된 의료 블로그 주제 5개를 추천해주세요. 각 주제는 한 줄로, 번호를 붙여 작성해주세요.

키워드: ${keywords.join(', ')}

JSON 배열 형식으로 반환해주세요: ["주제1", "주제2", ...]`

  const result = await geminiModel.generateContent(prompt)
  const text = result.response.text()
  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) return JSON.parse(jsonMatch[0])
  } catch {}
  return text.split('\n').filter(Boolean)
}

export async function summarizeYouTube(transcript: string) {
  const prompt = `다음 YouTube 영상 스크립트를 의료 블로그 작성에 활용할 수 있도록 핵심 내용을 요약해주세요:

${transcript}

요약은 다음 형식으로 작성해주세요:
1. 핵심 주제
2. 주요 포인트 (3-5개)
3. 블로그에 활용할 수 있는 인사이트`

  const result = await geminiModel.generateContent(prompt)
  return result.response.text()
}
