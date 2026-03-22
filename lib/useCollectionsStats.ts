import { useMemo } from 'react'

export interface CollectionsStats {
  totalCount: number
  categorizedCount: number
  uncategorizedCount: number
  categoryCount: number
  categories: Record<string, number>
  dailyData: Array<{ date: string; count: number }>
  topTags: Array<{ tag: string; count: number }>
  totalLikes: number
  totalViews: number
  avgLikes: number
  avgViews: number
  suggestions: string[]
}

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
}

export function useCollectionsStats(collections: Collection[]): CollectionsStats {
  return useMemo(() => {
    if (!collections.length) {
      return {
        totalCount: 0,
        categorizedCount: 0,
        uncategorizedCount: 0,
        categoryCount: 0,
        categories: {},
        dailyData: [],
        topTags: [],
        totalLikes: 0,
        totalViews: 0,
        avgLikes: 0,
        avgViews: 0,
        suggestions: []
      }
    }

    // 分类统计
    const categories = collections.reduce((acc, c) => {
      const cat = c.category || '未分类'
      acc[cat] = (acc[cat] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const uncategorizedCount = collections.filter(c => !c.category).length
    const categorizedCount = collections.length - uncategorizedCount

    // 标签统计
    const tagStats = collections.flatMap(c => c.tags || []).reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topTags = Object.entries(tagStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }))

    // 日期统计 - 最近 30 天累计
    const dailyData: Record<string, number> = {}
    const now = new Date()
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString('en-CA') // YYYY-MM-DD 格式
      dailyData[dateStr] = 0
    }

    // 根据 timestamp 计算每日累计
    let cumulative = 0
    Object.keys(dailyData).forEach(date => {
      const count = collections.filter(c => {
        if (!c.timestamp) return false
        return c.timestamp.startsWith(date)
      }).length
      cumulative += count
      dailyData[date] = cumulative
    })

    const dailyDataArray = Object.entries(dailyData).map(([date, count]) => ({
      date: date.slice(5), // 显示 MM-DD 格式
      count
    }))

    // 点赞和浏览统计
    const totalLikes = collections.reduce((sum, c) => sum + (c.likes || 0), 0)
    const totalViews = collections.reduce((sum, c) => sum + (c.views || 0), 0)
    const avgLikes = Math.round(totalLikes / collections.length)
    const avgViews = Math.round(totalViews / collections.length)

    // 生成建议
    const suggestions: string[] = []
    
    if (uncategorizedCount > 0) {
      suggestions.push(`有 ${uncategorizedCount} 条未分类笔记，建议进行分类整理`)
    }
    
    if (Object.keys(categories).length > 8) {
      suggestions.push(`分类数较多（${Object.keys(categories).length} 个），建议合并相似分类`)
    }
    
    if (topTags.length > 0) {
      suggestions.push(`最热门标签是"${topTags[0].tag}"，出现 ${topTags[0].count} 次`)
    }

    if (collections.filter(c => (c.likes || 0) > 10000).length > 0) {
      suggestions.push(`发现 ${collections.filter(c => (c.likes || 0) > 10000).length} 条热门收藏（10K+ 赞）`)
    }

    return {
      totalCount: collections.length,
      categorizedCount,
      uncategorizedCount,
      categoryCount: Object.keys(categories).length,
      categories,
      dailyData: dailyDataArray,
      topTags,
      totalLikes,
      totalViews,
      avgLikes,
      avgViews,
      suggestions: suggestions.length > 0 ? suggestions : ['收藏管理有序，希望继续保持！']
    }
  }, [collections])
}