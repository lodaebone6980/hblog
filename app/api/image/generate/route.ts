import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { style, prompt, ratio } = body

    if (!prompt) {
      return NextResponse.json(
        { error: '이미지 설명을 입력해주세요.' },
        { status: 400 }
      )
    }

    const stylePrompts = {
      kbeauty: 'Professional K-beauty editorial style photo. Clean, bright, minimalist Korean beauty aesthetic.',
      sns: 'Casual SNS lifestyle snapshot style. Natural, authentic, Instagram-worthy.',
    }

    const ratioMap: Record<string, string> = {
      '4:5': 'portrait aspect ratio 4:5',
      '1:1': 'square aspect ratio 1:1',
      '16:9': 'landscape aspect ratio 16:9',
      '9:16': 'vertical aspect ratio 9:16',
    }

    const fullPrompt = `${stylePrompts[style as keyof typeof stylePrompts] || ''} ${prompt}. ${ratioMap[ratio] || ''}`

    // Use Gemini's image generation
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
    const result = await model.generateContent(fullPrompt)
    const response = result.response

    // For now, return a placeholder - actual image generation depends on Gemini Imagen availability
    return NextResponse.json({
      imageUrl: null,
      description: response.text(),
      message: '이미지 생성이 완료되었습니다. Gemini Imagen API가 활성화되면 실제 이미지가 생성됩니다.',
    })
  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json(
      { error: '이미지 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}
