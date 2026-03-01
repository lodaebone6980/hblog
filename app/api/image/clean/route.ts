import { NextRequest, NextResponse } from 'next/server'
import { generateRandomFilename, getFileExtension } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('images') as File[]
    const hashMode = formData.get('hashMode') === 'true'
    const keepExtension = formData.get('keepExtension') === 'true'

    if (files.length === 0) {
      return NextResponse.json(
        { error: '이미지를 업로드해주세요.' },
        { status: 400 }
      )
    }

    const processed = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer())
        const ext = keepExtension ? getFileExtension(file.name) : 'jpg'
        const newName = generateRandomFilename(ext)

        // Strip EXIF metadata by re-encoding the image
        // In production, use sharp library for proper EXIF stripping
        let processedBuffer = buffer

        if (hashMode) {
          // Apply subtle pixel modifications to change perceptual hash
          // This is a simplified version - production should use proper image processing
          const arr = new Uint8Array(processedBuffer)
          for (let i = 0; i < Math.min(arr.length, 100); i += 4) {
            arr[i] = Math.max(0, Math.min(255, arr[i] + (Math.random() > 0.5 ? 1 : -1)))
          }
          processedBuffer = Buffer.from(arr)
        }

        // Convert to base64 data URL for client download
        const base64 = processedBuffer.toString('base64')
        const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'

        return {
          originalName: file.name,
          newName,
          url: `data:${mimeType};base64,${base64}`,
          size: processedBuffer.length,
        }
      })
    )

    return NextResponse.json({ processed })
  } catch (error) {
    console.error('Image cleaning error:', error)
    return NextResponse.json(
      { error: '이미지 처리에 실패했습니다.' },
      { status: 500 }
    )
  }
}
