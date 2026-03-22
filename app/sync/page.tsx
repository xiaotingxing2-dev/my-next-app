'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Sync() {
  const [isSyncing, setIsSyncing] = useState(false)
  const router = useRouter()

  const handleSync = async () => {
    setIsSyncing(true)
    // 模拟同步过程
    setTimeout(() => {
      setIsSyncing(false)
      // 模拟添加一些收藏数据到 localStorage
      const mockCollections = [
        { id: 1, title: '美妆教程', content: '小红书美妆内容', category: '美妆', tags: ['教程', '护肤'] },
        { id: 2, title: '旅行攻略', content: '小红书旅行内容', category: '旅行', tags: ['攻略', '景点'] },
      ]
      localStorage.setItem('collections', JSON.stringify(mockCollections))
      router.push('/dashboard')
    }, 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            同步小红书收藏
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            连接你的小红书账号，同步收藏内容
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {isSyncing ? '同步中...' : '开始同步'}
          </button>
          {isSyncing && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">正在同步收藏内容...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}