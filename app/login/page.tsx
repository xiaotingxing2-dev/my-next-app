'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  // 检查用户是否已登入
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
      // 已登入用户自动跳转到仪表板
      router.push('/dashboard')
    }
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      alert('请输入邮箱')
      return
    }

    if (!password.trim()) {
      alert('请输入密码')
      return
    }

    setIsLoading(true)

    // 模拟登录延迟
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({ email, password }))
      setIsLoading(false)
      router.push('/dashboard')
    }, 800)
  }

  if (user) {
    return <div></div>
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 核心修改：把 grid-cols-2 改成 grid-cols-10，分别控制左右占 3/10 和 7/10 */}
      <div className="grid grid-cols-1 lg:grid-cols-10 min-h-screen">
        {/* ===== 左侧：应用介绍 - 占 3 份 ===== */}
        <div className="lg:col-span-3 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8 md:p-16 flex flex-col justify-center">
          <div className="max-w-md">
            {/* Logo + 产品名 */}
            <div className="mb-8">
              <div className="inline-block">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-3xl font-bold text-white mb-4">
                  灰
                </div>
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-3">清灰灰</h1>
              <p className="text-xl text-gray-600">AI助手，让你的收藏夹焕然一新！</p>
            </div>

            {/* 功能卡片 */}
            <div className="space-y-4 mb-12">
              <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl flex-shrink-0">🤖</div>
                <div>
                  <h3 className="font-bold text-gray-900">AI 智能分类</h3>
                  <p className="text-sm text-gray-600">灰灰助手一键自动分类，再也不用手动整理</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl flex-shrink-0">📱</div>
                <div>
                  <h3 className="font-bold text-gray-900">多平台导入</h3>
                  <p className="text-sm text-gray-600">支持小红书、抖音等多账号实时导入笔记</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl flex-shrink-0">📊</div>
                <div>
                  <h3 className="font-bold text-gray-900">数据可视化</h3>
                  <p className="text-sm text-gray-600">图表展示收藏分布、热门标签、增长趋势</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl flex-shrink-0">✨</div>
                <div>
                  <h3 className="font-bold text-gray-900">优化建议</h3>
                  <p className="text-sm text-gray-600">个性化建议帮你持续优化内容管理</p>
                </div>
              </div>
            </div>

            {/* 社交证明 */}
            <div className="flex items-center gap-3 text-sm">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-lg">⭐</span>
                ))}
              </div>
              <span className="text-gray-600"><strong>10K+</strong> 用户信任</span>
            </div>
          </div>
        </div>

        {/* ===== 右侧：登入表单 - 占 7 份 ===== */}
        <div className="lg:col-span-7 bg-white p-8 md:p-16 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">欢迎回来</h2>
            <p className="text-gray-600 mb-8">登入你的账户继续管理收藏</p>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* 邮箱输入框 */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  📧 邮箱
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="你的邮箱地址"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
              </div>

              {/* 密码输入框 */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  🔐 密码
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="输入你的密码"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-600 hover:text-gray-900"
                    disabled={isLoading}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* 登入按钮 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span> 登入中...
                  </span>
                ) : (
                  '✓ 登入'
                )}
              </button>
            </form>

            {/* 分割线 */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="text-sm text-gray-600">或</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* 试用按钮 */}
            <button
              onClick={() => {
                localStorage.setItem('user', JSON.stringify({ email: 'demo@qinghhuihui.com', isDemo: true }))
                router.push('/dashboard')
              }}
              className="w-full border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-bold hover:bg-gray-50 transition-all"
            >
              🎯 快速试用
            </button>

            {/* 页脚文字 */}
            <div className="mt-8 text-center text-sm text-gray-600">
              <p>
                这是演示账户。
                <br />
                无需真实邮箱和密码，随意输入即可登入。
              </p>
            </div>

            {/* 法律条款 */}
            <div className="mt-6 text-center text-xs text-gray-500">
              <p>继续使用即表示您同意我们的<br />
                <Link href="#" className="text-blue-600 hover:underline">
                  隐私政策
                </Link>
                {' '}和{' '}
                <Link href="#" className="text-blue-600 hover:underline">
                  服务条款
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 移动端提示 */}
      <div className="lg:hidden hidden">
        在小屏幕上适配。
      </div>
    </div>
  )
}