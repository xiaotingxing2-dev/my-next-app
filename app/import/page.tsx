'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { smartCategorize } from '@/lib/aiLogic'
import AIAssistant from '@/components/AIAssistant'

interface Account {
  id: string
  platform: 'xiaohongshu' | 'douyin'
  username: string
  connectedAt: string
  accessToken: string
}

interface AccountNote {
  id: string
  title: string
  content: string
  author: string
  likes: number
  views: number
  link: string
}

type ViewState = 'accountList' | 'accountDetail' | 'preview'

export default function ImportPage() {
  const [user, setUser] = useState<any>(null)
  const [viewState, setViewState] = useState<ViewState>('accountList')
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [accountNotes, setAccountNotes] = useState<AccountNote[]>([])
  const [selectedNoteIds, setSelectedNoteIds] = useState<Set<string>>(new Set())
  const [isImporting, setIsImporting] = useState(false)
  const [loadingNotes, setLoadingNotes] = useState(false)
  const router = useRouter()

  // 检查用户登录状态
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
    } else {
      setUser(JSON.parse(userData))
      loadAccounts()
    }
  }, [router])

  // 从 localStorage 读取已连接账号
  const loadAccounts = () => {
    const storedAccounts = localStorage.getItem('accounts')
    if (storedAccounts) {
      const parsed = JSON.parse(storedAccounts)
      setAccounts(parsed)
    }
  }

  // 获取账号的笔记列表（Mock 实现）
  const loadNotesForAccount = async (account: Account) => {
    setLoadingNotes(true)
    setSelectedAccount(account)

    // 模拟 API 调用延迟
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock 数据 - 根据平台返回不同的笔记
    const mockNotes: AccountNote[] = [
      {
        id: '1',
        title: '2024春日穿搭｜温柔气质显气场',
        content: '乳白色+米色+樱花粉，三个颜色搭配技巧让你轻松驾驭温柔风穿搭。今年春天最火的穿搭色系分享！',
        author: '时尚博主Lily',
        likes: 12500,
        views: 280000,
        link: 'https://www.xiaohongshu.com/explore/6557a2c90000c70013007e8c'
      },
      {
        id: '2',
        title: '懒人早餐5分钟搞定｜营养不打折',
        content: '三款超简单的营养早餐做法，不需要早起1小时！高蛋白+低卡，减肥期间也能吃的满足。',
        author: '营养师Amy',
        likes: 8300,
        views: 195000,
        link: 'https://www.xiaohongshu.com/explore/6557b1a90000e20013008f2b'
      },
      {
        id: '3',
        title: '日本护肤全功课｜精致女生的护肤秘密',
        content: '日本大火的护肤品都值得入吗？揭秘精致女生的护肤routine，从清洁到精华全面分享。',
        author: '美妆博主Snow',
        likes: 15800,
        views: 320000,
        link: 'https://www.xiaohongshu.com/explore/6557c3d90000c70013007f1a'
      },
      {
        id: '4',
        title: '秋日关西旅行｜私藏10家打卡地',
        content: '这次关西之旅发现10家超适合拍照的地方，每一个都不重样，妥妥的小红书同款出片地。',
        author: '旅游达人Jack',
        likes: 9200,
        views: 214000,
        link: 'https://www.xiaohongshu.com/explore/6557d4e90000c70013007f2c'
      },
      {
        id: '5',
        title: '居家健身计划｜30天蜕变计划',
        content: '不用去健身房，在家也能练出好身材！分享我30天的居家健身计划和食谱搭配。',
        author: '健身教练Tom',
        likes: 11400,
        views: 268000,
        link: 'https://www.xiaohongshu.com/explore/6557e5f90000c70013007f3d'
      },
      {
        id: '6',
        title: '2024年度好物清单｜每一个都值得买',
        content: '盘点过去一年用过最喜欢的好物，从护肤到家居，每件都经过真实体验。',
        author: '好物分享者Carol',
        likes: 13600,
        views: 295000,
        link: 'https://www.xiaohongshu.com/explore/6557f6g90000c70013007f4e'
      },
      {
        id: '7',
        title: '咖啡厅必点｜新手也能成为专业品鉴师',
        content: '不懂咖啡也没关系，教你如何在咖啡厅自信地点单，发现适合自己的味道。',
        author: '咖啡爱好者Mike',
        likes: 7800,
        views: 175000,
        link: 'https://www.xiaohongshu.com/explore/6558a7h90000c70013007f5f'
      },
      {
        id: '8',
        title: '小公寓改造｜20万打造温暖小窝',
        content: '分享我如何用有限预算把30平的小公寓改造成梦想之家，每一个角落都精心设计。',
        author: '家居设计师David',
        likes: 10500,
        views: 245000,
        link: 'https://www.xiaohongshu.com/explore/6558b8i90000c70013007f6g'
      }
    ]

    setAccountNotes(mockNotes)
    setViewState('accountDetail')
    setLoadingNotes(false)
  }

  // 切换笔记选择状态
  const toggleNoteSelection = (noteId: string) => {
    const newSelection = new Set(selectedNoteIds)
    if (newSelection.has(noteId)) {
      newSelection.delete(noteId)
    } else {
      newSelection.add(noteId)
    }
    setSelectedNoteIds(newSelection)
  }

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedNoteIds.size === accountNotes.length) {
      setSelectedNoteIds(new Set())
    } else {
      setSelectedNoteIds(new Set(accountNotes.map(note => note.id)))
    }
  }

  // 导入选中的笔记
  const handleImportSelectedNotes = async () => {
    if (selectedNoteIds.size === 0) {
      alert('请先选择要导入的笔记')
      return
    }

    setIsImporting(true)

    // 获取选中的笔记
    const selectedNotes = accountNotes.filter(note => selectedNoteIds.has(note.id))

    // 读取现有收藏
    const existing = JSON.parse(localStorage.getItem('collections') || '[]')

    // 转换为标准格式并进行 AI 分类
    const newItems = selectedNotes.map((note, idx) => {
      const suggestion = smartCategorize(note.title, note.content)
      return {
        id: existing.length + idx + 1,
        title: note.title,
        content: note.content,
        category: '', // 由灰灰决定
        tags: suggestion.suggestedTags,
        link: note.link,
        author: note.author,
        likes: note.likes,
        views: note.views,
        timestamp: new Date().toISOString().split('T')[0],
        collected: true,
        sourceAccount: selectedAccount?.id, // 记录导入来源账号
        aiSuggestion: suggestion
      }
    })

    // 保存到 localStorage
    const allCollections = [...existing, ...newItems]
    localStorage.setItem('collections', JSON.stringify(allCollections))

    setIsImporting(false)
    alert(`✅ 成功导入 ${newItems.length} 条笔记！灰灰已为您分析，请进入仪表盘查看`)

    // 重置状态并跳转
    setSelectedNoteIds(new Set())
    setViewState('accountList')
    router.push('/dashboard')
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
          <div className="max-w-6xl mx-auto">
            {/* 页面标题 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">📥 从账号导入笔记</h1>
              </div>
              <p className="text-gray-600">
                {viewState === 'accountList' ? '选择一个已连接的账号，实时导入你的笔记' : 
                 viewState === 'accountDetail' ? '选择要导入的笔记' : '预览即将导入的笔记'}
              </p>
            </div>

            {/* 账号列表视图 */}
            {viewState === 'accountList' && (
              <div>
                {accounts.length === 0 ? (
                  <div className="bg-white p-12 rounded-lg shadow text-center">
                    <div className="text-6xl mb-4">🔗</div>
                    <h2 className="text-2xl font-bold mb-3">暂无已连接账号</h2>
                    <p className="text-gray-600 mb-6">请先在账号管理页面连接你的小红书或抖音账号</p>
                    <button
                      onClick={() => router.push('/accounts')}
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
                    >
                      → 去账号管理
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accounts.map(account => (
                      <button
                        key={account.id}
                        onClick={() => loadNotesForAccount(account)}
                        disabled={loadingNotes}
                        className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-500 text-left"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="text-4xl">
                            {account.platform === 'xiaohongshu' ? '🔴' : '📱'}
                          </div>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {account.platform === 'xiaohongshu' ? '小红书' : '抖音'}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-1">{account.username}</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          连接于 {new Date(account.connectedAt).toLocaleDateString('zh-CN')}
                        </p>
                        <div className="text-blue-600 font-semibold text-sm">
                          点击导入笔记 →
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 账号详情 - 笔记选择视图 */}
            {viewState === 'accountDetail' && selectedAccount && (
              <div>
                {/* 返回按钮 + 账号信息 */}
                <div className="mb-6 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setViewState('accountList')
                      setSelectedAccount(null)
                      setAccountNotes([])
                      setSelectedNoteIds(new Set())
                    }}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                  >
                    ← 返回账号列表
                  </button>
                  <div className="text-right">
                    <p className="text-gray-600 text-sm">当前账号</p>
                    <p className="font-bold text-lg">
                      {selectedAccount.platform === 'xiaohongshu' ? '🔴' : '📱'} {selectedAccount.username}
                    </p>
                  </div>
                </div>

                {/* 加载状态 */}
                {loadingNotes ? (
                  <div className="bg-white p-12 rounded-lg shadow text-center">
                    <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
                    <p className="text-gray-600">正在加载笔记列表...</p>
                  </div>
                ) : (
                  <>
                    {/* 工具栏 - 全选/已选数量 */}
                    <div className="bg-white p-4 rounded-lg shadow mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedNoteIds.size === accountNotes.length && accountNotes.length > 0}
                          onChange={toggleSelectAll}
                          className="w-5 h-5 rounded cursor-pointer"
                        />
                        <span className="font-semibold">
                          {selectedNoteIds.size === 0 ? '全选' : `已选 ${selectedNoteIds.size} / ${accountNotes.length} 条`}
                        </span>
                      </div>
                      <button
                        onClick={toggleSelectAll}
                        className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                      >
                        {selectedNoteIds.size === 0 ? '全选' : '取消全选'}
                      </button>
                    </div>

                    {/* 笔记网格 */}
                    {accountNotes.length === 0 ? (
                      <div className="bg-white p-12 rounded-lg shadow text-center">
                        <p className="text-gray-600">暂无笔记</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {accountNotes.map(note => (
                          <div
                            key={note.id}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              selectedNoteIds.has(note.id)
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                            onClick={() => toggleNoteSelection(note.id)}
                          >
                            <div className="flex gap-3">
                              <input
                                type="checkbox"
                                checked={selectedNoteIds.has(note.id)}
                                onChange={() => toggleNoteSelection(note.id)}
                                className="w-5 h-5 rounded cursor-pointer mt-1 flex-shrink-0"
                                onClick={e => e.stopPropagation()}
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-base mb-1 line-clamp-2">{note.title}</h3>
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{note.content}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>👤 {note.author}</span>
                                  <span>❤️ {note.likes.toLocaleString()} • 👁️ {(note.views / 1000).toFixed(0)}k</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 底部操作按钮 */}
                    <div className="flex gap-3 sticky bottom-4">
                      <button
                        onClick={() => {
                          setViewState('accountList')
                          setSelectedAccount(null)
                          setAccountNotes([])
                          setSelectedNoteIds(new Set())
                        }}
                        className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-400"
                      >
                        ⊘ 取消
                      </button>
                      <button
                        onClick={handleImportSelectedNotes}
                        disabled={selectedNoteIds.size === 0 || isImporting}
                        className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isImporting ? '导入中...' : `✓ 导入 (${selectedNoteIds.size})`}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 使用帮助 */}
            {viewState === 'accountList' && accounts.length > 0 && (
              <div className="mt-12 bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4">💡 使用提示</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>✓ 每个账号的笔记会实时从平台获取</p>
                  <p>✓ 支持批量选择多条笔记一起导入</p>
                  <p>✓ 灰灰会自动为导入的笔记进行智能分类和标签推荐</p>
                  <p>✓ 导入后的笔记可以在"我的收藏"中编辑和整理</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <AIAssistant />
    </div>
  )
}