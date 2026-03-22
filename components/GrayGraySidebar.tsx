'use client'

import { useState, useRef, useEffect } from 'react'
import { useSmartSummary } from '@/lib/useSmartSummary'
import { useGrayGrayChat } from '@/lib/useGrayGrayChat'
import { matchGrayGrayResponse } from '@/lib/grayGrayResponses'

interface GrayGraySidebarProps {
  collections: Array<{
    id: number
    title: string
    content: string
    category: string
    tags: string[]
    likes?: number
    views?: number
    timestamp?: string
  }>
  onAction?: (action: string, data?: any) => void
}

export default function GrayGraySidebar({ collections, onAction }: GrayGraySidebarProps) {
  const summary = useSmartSummary(collections)
  const { messages, addUserMessage, addGrayMessage } = useGrayGrayChat()
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showInitial, setShowInitial] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 处理用户输入
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    setIsLoading(true)
    setShowInitial(false)

    // 添加用户消息
    addUserMessage(inputValue)

    // 模拟延迟后获取灰灰回复
    setTimeout(() => {
      const response = matchGrayGrayResponse(inputValue)
      addGrayMessage(response)
      setIsLoading(false)
    }, 800)

    setInputValue('')
  }

  // 处理快捷操作
  const handleQuickAction = (actionId: string) => {
    setShowInitial(false)
    
    let userMessage = ''
    let grayMessage = ''

    switch (actionId) {
      case 'classify_all':
        userMessage = '灰灰，帮我把所有未分类的内容分类一下'
        grayMessage = '好的，我来帮你智能分类这些内容！🏷️ 可能需要几秒钟...'
        break
      case 'organize':
        userMessage = '我的收藏整理得怎么样？'
        grayMessage = '太棒了！👏 你的收藏已经很井井有条了，继续保持呢！'
        break
      case 'browse_keyword':
        userMessage = `给我推荐一些关于"${summary.topKeywords[0]}"的内容吧`
        grayMessage = `好的！我给你整理了所有关于"${summary.topKeywords[0]}"的收藏，一共 ${collections.filter(c => c.title.includes(summary.topKeywords[0]) || c.tags.some(t => t.includes(summary.topKeywords[0]))).length} 条。要我详细介绍一下吗？`
        break
      case 'generate_report':
        userMessage = '生成一份我的收藏分析报告'
        grayMessage = '📊 正在生成你的收藏分析报告...\n\n✓ 总收藏数: ' + collections.length + '\n✓ 主要分类: ' + summary.mainCategory + '\n✓ 未分类: ' + collections.filter(c => !c.category).length + '\n\n分析完成！你的收藏品味很不错呢～'
        break
    }

    if (userMessage) {
      addUserMessage(userMessage)
      setTimeout(() => {
        addGrayMessage(grayMessage)
        setIsLoading(false)
      }, 600)
      onAction?.(actionId)
    }
  }

  return (
    <div className="w-96 h-full border-l border-gray-200 bg-white flex flex-col shadow-lg">
      {/* 顶部 - 灰灰头部 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
            灰
          </div>
          <div>
            <h3 className="font-bold text-gray-900">灰灰助手</h3>
            <p className="text-xs text-gray-600">在线 • 随时帮你整理</p>
          </div>
        </div>
      </div>

      {/* 中间 - 聊天区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 初始化视图 - 智能总结 */}
        {showInitial && messages.length === 0 && (
          <>
            {/* 总结卡片 */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-bold text-gray-900 mb-2">📌 你的收藏总结</h4>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">{summary.summary}</p>

              {/* 建议操作按钮 */}
              {summary.recommendedActions.length > 0 && (
                <div className="space-y-2 mt-3">
                  {summary.recommendedActions.map(action => (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action.id)}
                      className="w-full text-left text-xs p-2 bg-white rounded border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <div className="font-semibold text-gray-900">
                        {action.emoji} {action.action}
                      </div>
                      <div className="text-gray-600 text-xs">{action.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 欢迎语 */}
            <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
              <p>👋 嗨！我是灰灰，你的智能收藏助手。</p>
              <p className="mt-2">我可以帮你：</p>
              <ul className="mt-1 text-xs space-y-1 text-gray-600">
                <li>🏷️ 智能分类你的收藏</li>
                <li>📊 分析你的收藏趋势</li>
                <li>✨ 提供优化建议</li>
                <li>🔍 推荐相似内容</li>
              </ul>
            </div>
          </>
        )}

        {/* 聊天历史 */}
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs rounded-lg p-3 text-sm ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 rounded-lg p-3 text-sm rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 底部 - 输入框 */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="问灰灰..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold text-sm transition-colors"
          >
            →
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2">💡 提示：输入任意问题，灰灰会为您解答</p>
      </div>
    </div>
  )
}