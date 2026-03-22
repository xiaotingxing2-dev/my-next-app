'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { AccountManager, OAuthManager, PlatformAPI, type Account } from '@/lib/accountManager'

export default function AccountsPage() {
  const [user, setUser] = useState<any>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
    } else {
      setUser(JSON.parse(userData))
      setAccounts(AccountManager.getAccounts())
    }
  }, [router])

  // 连接小红书
  const connectXiaohongshu = () => {
    // 在实际应用中，应该跳转到小红书OAuth页面
    // window.location.href = OAuthManager.getXiaohongshuAuthURL()
    
    // 目前模拟连接
    setLoading(true)
    setTimeout(() => {
      const account: Account = {
        id: 'xhs_' + Date.now(),
        platform: 'xiaohongshu',
        username: 'xiaohongshu_' + Math.random().toString(36).slice(2, 7),
        nickname: '我的小红书',
        avatar: '🔴',
        accessToken: 'token_' + Date.now(),
        connectedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
      }
      AccountManager.addAccount(account)
      setAccounts(AccountManager.getAccounts())
      setLoading(false)
    }, 1500)
  }

  // 连接抖音
  const connectDouyin = () => {
    // window.location.href = OAuthManager.getDouyinAuthURL()
    
    setLoading(true)
    setTimeout(() => {
      const account: Account = {
        id: 'dy_' + Date.now(),
        platform: 'douyin',
        username: 'douyin_' + Math.random().toString(36).slice(2, 7),
        nickname: '我的抖音',
        avatar: '🎵',
        accessToken: 'token_' + Date.now(),
        connectedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
      }
      AccountManager.addAccount(account)
      setAccounts(AccountManager.getAccounts())
      setLoading(false)
    }, 1500)
  }

  // 移除账号
  const removeAccount = (accountId: string) => {
    if (confirm('确定要断开连接吗？')) {
      AccountManager.removeAccount(accountId)
      setAccounts(AccountManager.getAccounts())
    }
  }

  // 从账号导入笔记
  const importFromAccount = async (account: Account) => {
    setLoading(true)
    try {
      const notes = await PlatformAPI.importFromPlatform(account.id, account.platform)
      
      // 保存到importCache以供import页面使用
      localStorage.setItem('importCache', JSON.stringify({
        accountId: account.id,
        platform: account.platform,
        notes,
        importedAt: new Date().toISOString()
      }))

      router.push('/import?fromAccount=true')
    } catch (error) {
      alert('导入失败：' + String(error))
    } finally {
      setLoading(false)
    }
  }

  const getPlatformIcon = (platform: string) => {
    return platform === 'xiaohongshu' ? '🔴' : '🎵'
  }

  const getPlatformName = (platform: string) => {
    return platform === 'xiaohongshu' ? '小红书' : platform === 'douyin' ? '抖音' : '其他'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">🔗 账号管理</h1>
            <p className="text-gray-600 mb-8">连接你的小红书、抖音账号，实时导入你的笔记</p>

            {/* 连接新账号 */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <h2 className="text-xl font-bold mb-4">连接新平台</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={connectXiaohongshu}
                  disabled={loading}
                  className="p-6 border-2 border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <div className="text-4xl mb-2">🔴</div>
                  <h3 className="font-bold text-lg">小红书</h3>
                  <p className="text-sm text-gray-600">连接小红书账号导入笔记</p>
                </button>
                <button
                  onClick={connectDouyin}
                  disabled={loading}
                  className="p-6 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
                >
                  <div className="text-4xl mb-2">🎵</div>
                  <h3 className="font-bold text-lg">抖音</h3>
                  <p className="text-sm text-gray-600">连接抖音账号导入视频笔记</p>
                </button>
              </div>
            </div>

            {/* 已连接的账号 */}
            {accounts.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">已连接的账号</h2>
                <div className="space-y-4">
                  {accounts.map(account => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl">{getPlatformIcon(account.platform)}</div>
                        <div>
                          <h3 className="font-bold">{account.nickname}</h3>
                          <p className="text-sm text-gray-600">
                            {getPlatformName(account.platform)} • {account.username}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            连接于 {new Date(account.connectedAt).toLocaleDateString('zh-CN')}
                          </p>
                          {account.expiresAt && (
                            <p className="text-xs text-orange-600">
                              有效期至 {new Date(account.expiresAt).toLocaleDateString('zh-CN')}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => importFromAccount(account)}
                          disabled={loading}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50"
                        >
                          {loading ? '导入中...' : '📥 导入笔记'}
                        </button>
                        <button
                          onClick={() => removeAccount(account.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600"
                        >
                          断开连接
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {accounts.length === 0 && (
              <div className="bg-blue-50 p-6 rounded-lg text-center border-2 border-blue-200">
                <p className="text-gray-600 mb-4">还没有连接任何账号</p>
                <p className="text-sm text-gray-500">连接你的社交账号，一键导入笔记和灵感</p>
              </div>
            )}

            {/* 安全提示 */}
            <div className="mt-8 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <p className="font-semibold text-yellow-900 mb-2">🔒 隐私和安全</p>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• 您的账号凭证仅用于导入笔记，不会被存储或共享</li>
                <li>• 我们遵守所有平台的服务条款</li>
                <li>• 您可以随时断开连接并撤销授权</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}