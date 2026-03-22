'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import GrayGraySidebar from '@/components/GrayGraySidebar'
import { mockXiaohongshuData } from '@/lib/mockData'

interface Collection {
  id: number
  title: string
  content: string
  category: string
  tags: string[]
  link: string
  author: string
  likes: number
  views: number
  timestamp?: string
}

export default function Collections() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('collections')
    if (stored) {
      setCollections(JSON.parse(stored))
    } else {
      setCollections(mockXiaohongshuData as Collection[])
      localStorage.setItem('collections', JSON.stringify(mockXiaohongshuData))
    }
  }, [])

  const categories = [...new Set(collections.map(c => c.category).filter(Boolean))]
  const filteredCollections = selectedCategory
    ? collections.filter(c => c.category === selectedCategory)
    : collections

  const updateCategory = (id: number, category: string) => {
    const updated = collections.map(c => c.id === id ? { ...c, category } : c)
    setCollections(updated)
    localStorage.setItem('collections', JSON.stringify(updated))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        
        {/* 主内容区 - 左右分屏 */}
        <main className="flex-1 flex overflow-hidden">
          
          {/* 左侧：收藏卡片 */}
          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="text-3xl font-bold mb-4">我的收藏（{filteredCollections.length}）</h2>
            
            {/* 筛选工具栏 */}
            <div className="mb-6 flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === '' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                全部 ({collections.length})
              </button>
              {categories.map(cat => {
                const count = collections.filter(c => c.category === cat).length
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      selectedCategory === cat 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                )
              })}
            </div>

            {/* 收藏卡片网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCollections.map(collection => (
                <a
                  key={collection.id}
                  href={collection.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-all hover:scale-105 overflow-hidden"
                >
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-blue-600 hover:underline line-clamp-2 mb-2">
                      {collection.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {collection.content}
                    </p>
                  </div>

                  {/* 分类与标签 */}
                  <div className="mb-3 space-y-2">
                    <div>
                      <select
                        onClick={(e) => e.preventDefault()}
                        onChange={(e) => updateCategory(collection.id, e.target.value)}
                        defaultValue={collection.category}
                        className="w-full border p-1 text-xs text-sm rounded"
                      >
                        <option value="">未分类</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {collection.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 作者与统计 */}
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>作者：{collection.author}</p>
                    <div className="flex justify-between">
                      <span>👍 {(collection.likes / 1000).toFixed(1)}K</span>
                      <span>👁️ {(collection.views / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* 右侧：灰灰聊天框 - 桌面版显示 */}
          <div className="hidden lg:block">
            <GrayGraySidebar 
              collections={filteredCollections}
              onAction={(action, data) => {
                console.log('执行操作:', action, data)
              }}
            />
          </div>

        </main>
      </div>
    </div>
  )
}