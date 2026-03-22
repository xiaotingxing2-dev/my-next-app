import { useMemo } from 'react'

export interface SmartSummary {
  mainCategory: string
  topKeywords: string[]
  summary: string
  recommendedActions: Array<{
    id: string
    action: string
    description: string
    emoji: string
  }>
  recentItemsCount: number
}

interface Collection {
  id: number
  title: string
  content: string
  category: string
  tags: string[]
  likes?: number
  views?: number
  timestamp?: string
}

export function useSmartSummary(collections: Collection[]): SmartSummary {
  return useMemo(() => {
    if (!collections.length) {
      return {
        mainCategory: '',
        topKeywords: [],
        summary: '还没有收藏呢，开始添加你的第一条吧！',
        recommendedActions: [],
        recentItemsCount: 0
      }
    }

    const recentItems = collections.slice(0, 20)

    // 统计分类
    const categoryStats = recentItems.reduce((acc, c) => {
      const cat = c.category || '未分类'
      acc[cat] = (acc[cat] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const mainCategory = Object.entries(categoryStats).sort((a, b) => b[1] - a[1])[0]?.[0] || '综合'
    const mainCategoryCount = categoryStats[mainCategory] || 0

    // 提取关键词（从标题和标签）
    const keywordMap: Record<string, number> = {}
    recentItems.forEach(item => {
      const words = item.title.split(/[\s\-,，、]/).filter(w => w.length > 2)
      words.forEach(word => {
        keywordMap[word] = (keywordMap[word] || 0) + 1
      })
      item.tags?.forEach(tag => {
        keywordMap[tag] = (keywordMap[tag] || 0) + 3 // 标签权重更高
      })
    })

    const topKeywords = Object.entries(keywordMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word)

    // 生成总结
    const uncategorizedCount = recentItems.filter(c => !c.category).length
    let summary = `你最近收藏了 ${recentItems.length} 条内容`

    if (mainCategory && mainCategoryCount > 0) {
      summary += `，其中"${mainCategory}"有 ${mainCategoryCount} 条`
    }

    if (topKeywords.length > 0) {
      summary += `。热门关键词：${topKeywords.join('、')}`
    }

    // 生成建议操作
    const recommendedActions = []

    if (uncategorizedCount > 0) {
      recommendedActions.push({
        id: 'classify_all',
        action: '一键分类',
        description: `还有 ${uncategorizedCount} 条未分类的内容`,
        emoji: '🏷️'
      })
    }

    if (recentItems.filter(c => !c.category).length === 0 && recentItems.length > 0) {
      recommendedActions.push({
        id: 'organize',
        action: '优化整理',
        description: '所有内容已分类，继续保持秩序',
        emoji: '✨'
      })
    }

    if (topKeywords.length > 0) {
      recommendedActions.push({
        id: 'browse_keyword',
        action: '浏览热词',
        description: `点击深入了解"${topKeywords[0]}"相关内容`,
        emoji: '🔍'
      })
    }

    recommendedActions.push({
      id: 'generate_report',
      action: '生成报告',
      description: '获取收藏内容详细分析',
      emoji: '📊'
    })

    return {
      mainCategory,
      topKeywords,
      summary,
      recommendedActions: recommendedActions.slice(0, 4),
      recentItemsCount: recentItems.length
    }
  }, [collections])
}