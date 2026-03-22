'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { OAuthManager } from '@/lib/accountManager'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const state = searchParams.get('state')
      const platform = (searchParams.get('platform') || 'xiaohongshu') as 'xiaohongshu' | 'douyin'

      if (!code) {
        router.push('/import?error=no_code')
        return
      }

      try {
        const account = await OAuthManager.handleAuthCallback(code, platform)
        router.push(`/import?success=true&accountId=${account.id}`)
      } catch (error) {
        console.error('Auth error:', error)
        router.push(`/import?error=${encodeURIComponent(String(error))}`)
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-5xl mb-4">🔄</div>
        <h1 className="text-2xl font-bold mb-2">授权中...</h1>
        <p className="text-gray-600">正在连接你的账号，请稍后</p>
      </div>
    </div>
  )
}