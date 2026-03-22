export interface ChatMessage {
  id: string
  sender: 'user' | 'gray'
  text: string
  timestamp: number
  action?: {
    type: 'classify' | 'delete' | 'tag' | 'search' | 'export'
    data?: any
  }
}

export const grayGrayResponses: Record<string, string[]> = {
  greeting: [
    '嗨~我是灰灰！👋 很高兴认识你，有什么我能帮你的吗？',
    '你好呀~我是你的收藏助手灰灰 🤖 整理收藏我最擅长啦！'
  ],
  recentCollections: [
    '你最近收藏了很多有趣的内容呢！让我为你整理一下...',
    '我看到你最近很活跃~这些收藏都很不错！要我帮你分类吗？',
    '你最近的品味真不错！我正在分析这些内容的特点...'
  ],
  organize: [
    '好的，我来帮你整理这些收藏！🏷️',
    '整理收藏我最在行了，让我发挥一下...',
    '没问题，我这就给你组织好！'
  ],
  recommendation: [
    '基于你的收藏，我建议你看看类似的内容~',
    '根据你的品味，这些资源你可能会喜欢 ⭐',
    '我发现你对这个话题很感兴趣，有相关好内容推荐给你！'
  ],
  help: [
    '我可以帮你进行以下操作：\n• 🏷️ 一键智能分类\n• 📊 生成收藏报告\n• 🔍 搜索相关内容\n• ✨ 优化建议',
    '你可以告诉我：\n• 最近收藏了什么\n• 需要整理某个分类\n• 想要统计分析\n• 需要优化建议'
  ],
  confirmed: [
    '好的，已完成！✅ 你的收藏又整洁了一些~',
    '搞定了! 让我们继续保持这个棒的收藏状态吧 🎯',
    '完成咯！希望你现在更容易找到想要的内容了 📚'
  ],
  error: [
    '哎呀，出错了 😅 请重试一下...',
    '好像遇到了小问题，让我再试试...',
    '抱歉，暂时无法完成这个操作，要换个试试吗？'
  ]
}

// 关键词匹配函数
export function matchGrayGrayResponse(userInput: string): string {
  const input = userInput.toLowerCase()

  // 打招呼
  if (/你好|嗨|hello|hi/i.test(input)) {
    return randomResponse('greeting')
  }

  // 最近收藏
  if (/最近|最新|最好|推荐|有什么/i.test(input)) {
    return randomResponse('recentCollections')
  }

  // 整理/分类
  if (/整理|分类|整顿|收拾/i.test(input)) {
    return randomResponse('organize')
  }

  // 建议/推荐
  if (/建议|推荐|有什么好的|相似/i.test(input)) {
    return randomResponse('recommendation')
  }

  // 帮助
  if (/帮助|怎么样|怎么用|能做什么|你会什么/i.test(input)) {
    return randomResponse('help')
  }

  // 感谢
  if (/谢谢|感谢|非常好|很棒/i.test(input)) {
    return '😊 很高兴为你服务~有其他需要帮忙的吗？'
  }

  // 默认回复
  return '我理解你的意思~👂 让我帮你整理这些收藏吧！要我进行什么操作呢？'
}

function randomResponse(key: string): string {
  const responses = grayGrayResponses[key] || grayGrayResponses['help']
  return responses[Math.floor(Math.random() * responses.length)]
}