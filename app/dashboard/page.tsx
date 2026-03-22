'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { mockXiaohongshuData } from '@/lib/mockData'
import { useCollectionsStats } from '@/lib/useCollectionsStats'
import AIAssistant from '@/components/AIAssistant'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Collection {
  id: number
  title: string
  content: string
  category: string
  tags: string[]
  link: string
  collected: boolean
  likes?: number
  views?: number
  timestamp?: string
  author?: string
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#6366f1']

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [collections, setCollections] = useState<Collection[]>([])
  const [aiTrigger, setAiTrigger] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
    } else {
      setUser(JSON.parse(userData))
      const stored = localStorage.getItem('collections')
      if (stored) {
        setCollections(JSON.parse(stored))
      } else {
        setCollections(mockXiaohongshuData as Collection[])
        localStorage.setItem('collections', JSON.stringify(mockXiaohongshuData))
      }
    }
  }, [router])

  const stats = useCollectionsStats(collections)
  const recentCollections = collections.slice(0, 8)

  // 饼状图数据
  const pieData = [
    { name: '已分类', value: stats.categorizedCount },
    { name: '未分类', value: stats.uncategorizedCount }
  ]

  const handleAutoClassify = (id: number, category: string, tags: string[]) => {
    const updated = collections.map(c =>
      c.id === id ? { ...c, category, tags: [...(c.tags || []), ...tags] } : c
    )
    setCollections(updated)
    localStorage.setItem('collections', JSON.stringify(updated))
  }

  if (!user) {
    return <div>加载中...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* 页面标题 */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">📊 收藏中心</h1>
              <p className="text-gray-600">实时查看你的收藏统计、分析和优化建议</p>
            </div>

            {/* ===== 区块 A：4 个指标卡片 ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">总收藏数</p>
                    <p className="text-4xl font-bold text-blue-600 mt-2">{stats.totalCount}</p>
                  </div>
                  <div className="text-5xl">📚</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">已分类</p>
                    <p className="text-4xl font-bold text-green-600 mt-2">{stats.categorizedCount}</p>
                  </div>
                  <div className="text-5xl">✅</div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  占比 {stats.totalCount > 0 ? Math.round((stats.categorizedCount / stats.totalCount) * 100) : 0}%
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">未分类</p>
                    <p className="text-4xl font-bold text-orange-600 mt-2">{stats.uncategorizedCount}</p>
                  </div>
                  <div className="text-5xl">❓</div>
                </div>
                {stats.uncategorizedCount > 0 && (
                  <button
                    onClick={() => setAiTrigger('classify')}
                    className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    👉 让灰灰来分类
                  </button>
                )}
              </div>

              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">分类数</p>
                    <p className="text-4xl font-bold text-purple-600 mt-2">{stats.categoryCount}</p>
                  </div>
                  <div className="text-5xl">🏷️</div>
                </div>
              </div>
            </div>
            {/* ===== 区块 E：优化建议 ===== */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200 mb-8">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold">🎯 优化建议</h2>
                <button
                  onClick={() => setAiTrigger('optimize')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
                >
                  🤖 与灰灰讨论
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.suggestions.map((suggestion, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                    <div className="flex gap-3">
                      <span className="text-2xl flex-shrink-0">💡</span>
                      <p className="text-sm text-gray-700">{suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ===== 区块 B：数据可视化（饼状图 + 折线图）===== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* 饼状图 */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">分类统计占比</h2>
                <div className="h-64 flex items-center justify-center">
                  {stats.totalCount > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value, percent }) => `${name} ${value} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="#3b82f6" />
                          <Cell fill="#f59e0b" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-500">暂无数据</p>
                  )}
                </div>
              </div>

              {/* 折线图 */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">最近 30 天收藏趋势</h2>
                <div className="h-64">
                  {stats.dailyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats.dailyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-500">暂无数据</p>
                  )}
                </div>
              </div>
            </div>

            {/* ===== 区块 C：分类分布卡片 ===== */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">分类分布</h2>
              {Object.keys(stats.categories).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(stats.categories)
                    .sort((a, b) => b[1] - a[1])
                    .map(([category, count], idx) => {
                      const percentage = Math.round((count / stats.totalCount) * 100)
                      return (
                        <Link
                          key={category}
                          href={`/collections?category=${encodeURIComponent(category)}`}
                          className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-all cursor-pointer border-l-4"
                          style={{ borderLeftColor: COLORS[idx % COLORS.length] }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-lg">{category}</h3>
                            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm font-bold">
                              {count}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                              className="h-2 rounded-full transition-all"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: COLORS[idx % COLORS.length]
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600">占比 {percentage}% • 点击查看详情 →</p>
                        </Link>
                      )
                    })}
                </div>
              ) : (
                <div className="bg-gray-100 p-6 rounded-lg text-center">
                  <p className="text-gray-600">暂无分类数据</p>
                </div>
              )}
            </div>

            {/* ===== 区块 D：最近收藏 ===== */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">最近收藏</h2>
                <Link href="/collections" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                  查看全部 →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentCollections.map(item => (
                  <a
                    key={item.id}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-all"
                  >
                    <h3 className="font-bold text-blue-600 hover:underline line-clamp-2 mb-2">{item.title}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">{item.content}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{item.category || '未分类'}</span>
                      <span>
                        {item.likes ? `❤️ ${(item.likes / 1000).toFixed(0)}k` : ''}
                        {item.views ? ` 👁️ ${(item.views / 1000).toFixed(0)}k` : ''}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>


            {/* ===== 热门标签 ===== */}
            {stats.topTags.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">热门标签 TOP 5</h2>
                <div className="flex flex-wrap gap-3">
                  {stats.topTags.map((item, idx) => (
                    <div
                      key={item.tag}
                      className="px-4 py-2 rounded-full text-white text-sm font-semibold"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    >
                      #{idx + 1} {item.tag} ({item.count})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <AIAssistant
        collections={collections}
        onAutoClassify={handleAutoClassify}
        trigger={aiTrigger}
        onTriggerComplete={() => setAiTrigger(null)}
      />
    </div>
  )
}