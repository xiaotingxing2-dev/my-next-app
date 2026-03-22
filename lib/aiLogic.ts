// AI 智能分类和标签推荐逻辑
export interface AISuggestion {
  suggestedCategory: string
  confidence: number
  suggestedTags: string[]
  reason: string
}

export interface DuplicateWarning {
  similarItems: number[]
  reason: string
  action: 'merge' | 'delete' | 'resync'
}

// 关键词映射到分类
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  '穿搭': ['穿搭', '衣服', '服装', '搭配', '衣着', '穿着', '风格', '衣柜'],
  '美食': ['美食', '食物', '菜谱', '料理', '做饭', '吃', '早餐', '晚餐', '午餐', '餐厅'],
  '美妆': ['美妆', '护肤', '化妆', '彩妆', '面膜', '口红', '眼影', '粉底'],
  '旅行': ['旅行', '旅游', '攻略', '景点', '城市', '出游', '度假', '自由行'],
  '健身': ['健身', '瑜伽', '运动', '锻炼', '减肥', '健身房', '健身课'],
  '旅行美食': ['咖啡', '甜品', '下午茶', '美食街', '餐厅', '咖啡厅'],
  '设计': ['设计', '配色', '灵感', '色系', '配方案', 'UI', 'UX'],
  '家居': ['家居', '装修', '收纳', '宿舍', '房间', '改造', '布置'],
  '读书': ['读书', '书籍', '笔记', '思考', '著作', '小说', '哲学'],
}

// Tag 关键词映射
const TAG_KEYWORDS: Record<string, string[]> = {
  '春季': ['春', '春天', '清爽', '樱花'],
  '平价': ['平价', '便宜', '百元', '低价'],
  '懒人': ['懒人', '简单', '快手', '5分钟'],
  '护肤': ['护肤品', '护肤', '皮肤'],
  '智能': ['智能', 'AI', '算法'],
  '初学者': ['初学者', '入门', '新手'],
  '自由行': ['自由行', '攻略', '行程'],
  '小众': ['小众', '隐藏', '冷门'],
  '高效': ['高效', '效率', '快速'],
  '数据': ['数据', '分析', '统计'],
}

/**
 * AI 智能分类函数
 * 根据笔记标题和内容，推荐合适的分类
 */
export function smartCategorize(title: string, content: string): AISuggestion {
  const text = (title + ' ' + content).toLowerCase()

  // 计算每个分类的匹配度
  let bestCategory = '未分类'
  let bestConfidence = 0

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let matches = 0
    keywords.forEach(keyword => {
      if (text.includes(keyword)) matches++
    })

    const confidence = matches / keywords.length
    if (confidence > bestConfidence) {
      bestConfidence = confidence
      bestCategory = category
    }
  }

  // 推荐标签
  const suggestedTags: string[] = []
  for (const [tag, keywords] of Object.entries(TAG_KEYWORDS)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      suggestedTags.push(tag)
    }
  }

  const confidence = bestConfidence > 0.5 ? bestConfidence : 0.6
  const reason = 
    confidence > 0.8 ? '我很确定这是关于' + bestCategory + '的内容' :
    confidence > 0.6 ? '根据内容推断，这应该是' + bestCategory :
    '无法确定分类，建议手动分类'

  return {
    suggestedCategory: bestCategory,
    confidence,
    suggestedTags: [...new Set(suggestedTags)],
    reason
  }
}

/**
 * 检测重复或相似内容
 */
export function findDuplicates(
  collections: any[],
  currentId: number
): DuplicateWarning[] {
  const warnings: DuplicateWarning[] = []
  const current = collections.find(c => c.id === currentId)

  if (!current) return warnings

  const currentTitle = current.title.toLowerCase()
  const currentTags = current.tags.map((t: string) => t.toLowerCase())

  const similarItems: number[] = []

  collections.forEach(item => {
    if (item.id === currentId) return

    const itemTitle = item.title.toLowerCase()
    const itemTags = item.tags.map((t: string) => t.toLowerCase())

    // 检查标题相似度
    const titleSimilarity = 
      (itemTitle.includes(currentTitle) || currentTitle.includes(itemTitle)) ? 0.8 : 0

    // 检查标签重叠度
    const commonTags = itemTags.filter((t: string) => currentTags.includes(t))
    const tagSimilarity = commonTags.length > 0 ? commonTags.length / Math.max(itemTags.length, 1) : 0

    if (titleSimilarity > 0.7 || tagSimilarity > 0.5) {
      similarItems.push(item.id)
    }
  })

  if (similarItems.length > 0) {
    warnings.push({
      similarItems,
      reason: `发现 ${similarItems.length} 条相似或相关的内容`,
      action: 'merge'
    })
  }

  return warnings
}

/**
 * 获取优化建议
 */
export function getOptimizationSuggestions(collections: any[]): string[] {
  const suggestions: string[] = []

  // 分类统计
  const categoryStats = collections.reduce((acc, c) => {
    acc[c.category || '未分类'] = (acc[c.category || '未分类'] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const categoryCount = Object.keys(categoryStats).length

  // 生成建议
  if (categoryCount > 10) {
    suggestions.push(`你有 ${categoryCount} 个分类，有些可能重复了。建议优化为 5-8 个核心分类`)
  }

  const uncategorized = collections.filter(c => !c.category).length
  if (uncategorized > 0) {
    suggestions.push(`你还有 ${uncategorized} 条未分类的笔记，我可以帮你一键智能分类！`)
  }

  const avgTags = collections.reduce((sum, c) => sum + (c.tags?.length || 0), 0) / collections.length
  if (avgTags < 2) {
    suggestions.push(`平均每条笔记的标签较少，建议增加标签以便更好地分类查找`)
  }

  if (suggestions.length === 0) {
    suggestions.push(`你的收藏管理得很好！继续保持 🎉`)
  }

  return suggestions
}

/**
 * 生成搜索建议
 */
export function getSearchSuggestions(query: string, collections: any[]): string[] {
  const suggestions = new Set<string>()

  const lowerQuery = query.toLowerCase()

  // 从标签中提取相关建议
  collections.forEach(c => {
    c.tags?.forEach((tag: string) => {
      if (tag.toLowerCase().includes(lowerQuery)) {
        suggestions.add(tag)
      }
    })

    // 从标题中提取相关建议
    if (c.title.toLowerCase().includes(lowerQuery)) {
      const words = c.title.split(/\s|[|：、，]/).filter(w => w.length > 1)
      words.forEach(word => suggestions.add(word))
    }
  })

  return Array.from(suggestions).slice(0, 5)
}