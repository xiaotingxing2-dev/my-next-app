'use client'

import { useEffect, useState } from 'react'
import { 
  smartCategorize, 
  findDuplicates, 
  getOptimizationSuggestions,
  type AISuggestion,
  type DuplicateWarning 
} from '@/lib/aiLogic'

interface AIAssistantProps {
  collections?: any[]
  onAutoClassify?: (itemId: number, category: string, tags: string[]) => void
  onOpenCollections?: () => void
}

type AssistantMode = 'idle' | 'classify' | 'suggestions' | 'search' | 'review'

export default function AIAssistant({ 
  collections = [], 
  onAutoClassify,
  onOpenCollections 
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<AssistantMode>('idle')
  const [aiTip, setAiTip] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [currentClassification, setCurrentClassification] = useState<AISuggestion | null>(null)
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null)

  // 灰灰的欢迎语
  const greetings = [
    '嘿，我是灰灰！👋 需要帮你整理笔记吗？',
    '你好呀！有什么我可以帮助你的吗？🤖',
    '准备好让你的收藏焕然一新了吗？✨',
    '我可以帮你智能分类、推荐标签哦！💡',
  ]

  useEffect(() => {
    // 随机选择一个问候语
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)]
    setAiTip(randomGreeting)

    // 如果有未分类的笔记，主动推荐
    const uncategorized = collections.filter(c => !c.category).length
    if (uncategorized > 0) {
      setTimeout(() => {
        setAiTip(`我发现你有 ${uncategorized} 条未分类的笔记，要不要我来帮你一键分类？`)
      }, 3000)
    }
  }, [])

  // 一键智能分类
  const handleAutoClassify = () => {
    const uncat = collections.find(c => !c.category)
    if (uncat) {
      const suggestion = smartCategorize(uncat.title, uncat.content)
      setCurrentClassification(suggestion)
      setSelectedItemId(uncat.id)
      setMode('classify')
    } else {
      setAiTip('棒棒的！所有笔记都已分类 🎉')
    }
  }

  // 获取优化建议
  const handleGetSuggestions = () => {
    const suggestionsText = getOptimizationSuggestions(collections)
    setSuggestions(suggestionsText)
    setMode('suggestions')
    setAiTip('这是我为你生成的优化建议：')
  }

  // 确认分类
  const confirmClassification = () => {
    if (currentClassification && selectedItemId && onAutoClassify) {
      onAutoClassify(
        selectedItemId,
        currentClassification.suggestedCategory,
        currentClassification.suggestedTags
      )
      setAiTip('分类成功！继续加油 💪')
      setMode('idle')
      
      // 继续下一个未分类的笔记
      setTimeout(() => {
        handleAutoClassify()
      }, 1500)
    }
  }

  // 跳过当前分类
  const skipClassification = () => {
    setMode('idle')
    handleAutoClassify()
  }

  return (
    <>
      {/* 灰灰浮窗按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center text-3xl z-40 border-4 border-white"
        title="灰灰AI助手"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* 灰灰助手面板 */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 w-96 max-h-96 bg-white rounded-2xl shadow-2xl overflow-hidden z-40 border-2 border-blue-200">
          {/* 头部 */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">灰灰 AI助手</h3>
              <span className="text-sm opacity-90">让收藏更有序</span>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="p-4 overflow-y-auto max-h-64">
            {mode === 'idle' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">{aiTip}</p>
                
                {/* 快速操作按钮 */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    onClick={handleAutoClassify}
                    className="bg-blue-100 text-blue-700 rounded-lg p-2 text-sm font-semibold hover:bg-blue-200 transition-colors"
                  >
                    🔄 一键分类
                  </button>
                  <button
                    onClick={handleGetSuggestions}
                    className="bg-green-100 text-green-700 rounded-lg p-2 text-sm font-semibold hover:bg-green-200 transition-colors"
                  >
                    💡 优化建议
                  </button>
                  <button
                    onClick={onOpenCollections}
                    className="bg-purple-100 text-purple-700 rounded-lg p-2 text-sm font-semibold hover:bg-purple-200 transition-colors"
                  >
                    📁 查看收藏
                  </button>
                  <button
                    onClick={() => setAiTip('记得定期回顾你的笔记哦！📚')}
                    className="bg-orange-100 text-orange-700 rounded-lg p-2 text-sm font-semibold hover:bg-orange-200 transition-colors"
                  >
                    ⏰ 提醒我
                  </button>
                </div>
              </div>
            )}

            {mode === 'classify' && currentClassification && (
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700"><strong>分类建议：</strong></p>
                  <p className="text-lg font-bold text-blue-600 mt-1">{currentClassification.suggestedCategory}</p>
                  <p className="text-xs text-gray-600 mt-2">置信度: {Math.round(currentClassification.confidence * 100)}%</p>
                  <p className="text-xs text-gray-600 mt-1">{currentClassification.reason}</p>
                </div>

                {currentClassification.suggestedTags.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">推荐标签：</p>
                    <div className="flex flex-wrap gap-2">
                      {currentClassification.suggestedTags.map(tag => (
                        <span key={tag} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={confirmClassification}
                    className="flex-1 bg-green-500 text-white rounded-lg p-2 font-semibold hover:bg-green-600 transition-colors"
                  >
                    ✓ 确认
                  </button>
                  <button
                    onClick={skipClassification}
                    className="flex-1 bg-gray-300 text-gray-700 rounded-lg p-2 font-semibold hover:bg-gray-400 transition-colors"
                  >
                    ⊘ 跳过
                  </button>
                </div>
              </div>
            )}

            {mode === 'suggestions' && (
              <div className="space-y-2">
                {suggestions.map((suggestion, idx) => (
                  <div key={idx} className="bg-yellow-50 rounded-lg p-3 border-l-4 border-yellow-400">
                    <p className="text-sm text-gray-700">💡 {suggestion}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 底部 */}
          <div className="bg-gray-50 p-3 text-center text-xs text-gray-600 border-t">
            灰灰正在为你服务 • {collections.length} 条笔记
          </div>
        </div>
      )}
    </>
  )
}