import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'PathPost 블로그 에디터',
  description: 'AI 기반 의료 블로그 에디터',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <Sidebar />
        <main className="ml-[160px] min-h-screen bg-gray-50">
          <div className="max-w-[1100px] mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
