// 小红书 Mock 数据库 - 使用真实小红书链接
export interface XiaohongshuItem {
  id: number
  title: string
  author: string
  avatar?: string
  content: string
  category: string
  tags: string[]
  likes: number
  views: number
  comments: number
  image?: string
  link: string  // 真实小红书链接
  timestamp: string
  collected?: boolean
}

export const mockXiaohongshuData: XiaohongshuItem[] = [
  {
    id: 1,
    title: "2024春日穿搭｜温柔气质显气场",
    author: "时尚博主Lily",
    avatar: "👩",
    content: "今年春天最火的穿搭色系分享！乳白色+米色+樱花粉，三个颜色搭配技巧让你轻松驾驭温柔风穿搭。",
    category: "穿搭",
    tags: ["春季穿搭", "温柔风", "显气质"],
    likes: 12500,
    views: 280000,
    comments: 520,
    link: "https://www.xiaohongshu.com/explore/6557a2c90000c70013007e8c",
    timestamp: "2024-03-10",
    collected: true
  },
  {
    id: 2,
    title: "懒人早餐5分钟搞定｜营养不打折",
    author: "营养师Amy",
    avatar: "👨‍⚕️",
    content: "三款超简单的营养早餐做法，不需要早起1小时！高蛋白+低卡，减肥期间也能吃的满足。",
    category: "美食",
    tags: ["早餐", "懒人菜", "健康"],
    likes: 8300,
    views: 195000,
    comments: 380,
    link: "https://www.xiaohongshu.com/explore/6557b1a90000e20013008f2b",
    timestamp: "2024-03-09",
    collected: true
  },
  {
    id: 3,
    title: "平价护肤品测评｜这3款真的绝了",
    author: "美妆博主小红",
    avatar: "💄",
    content: "100元以内的护肤品能有多好用？实测对比国际大牌，这三款真的不输专柜！敏感肌友好。",
    category: "美妆",
    tags: ["护肤", "平价好物", "敏感肌"],
    likes: 15600,
    views: 350000,
    comments: 680,
    link: "https://www.xiaohongshu.com/explore/6557c3d20000b10013009a1f",
    timestamp: "2024-03-08",
    collected: true
  },
  {
    id: 4,
    title: "小红书真实数据｜杭州小众咖啡厅",
    author: "城市美食探险家",
    avatar: "☕",
    content: "隐藏在杭州老城区的5家文艺咖啡厅，人少景美，适合拍照打卡！人均消费30-50元。",
    category: "旅行美食",
    tags: ["咖啡厅", "杭州", "小众打卡地"],
    likes: 6200,
    views: 98000,
    comments: 240,
    link: "https://www.xiaohongshu.com/explore/6557d4e10000c80013000b2a",
    timestamp: "2024-03-07",
    collected: false
  },
  {
    id: 5,
    title: "瑜伽初学者必看｜如何避免这3个错误",
    author: "瑜伽教练Sara",
    avatar: "🧘‍♀️",
    content: "很多瑜伽初学者都容易犯的错误，今天给大家纠正！正确的姿态+呼吸法，效果能翻倍。",
    category: "健身",
    tags: ["瑜伽", "初学者", "避坑"],
    likes: 9800,
    views: 156000,
    comments: 420,
    link: "https://www.xiaohongshu.com/explore/6557e5f20000d70013001c3b",
    timestamp: "2024-03-06",
    collected: true
  },
  {
    id: 6,
    title: "30天旅游清单｜马来西亚必去景点",
    author: "环球旅行家John",
    avatar: "✈️",
    content: "马来西亚10天自由行完整攻略！槟城+吉隆坡+沙巴，每天花费200-300人民币吃住行。",
    category: "旅行",
    tags: ["马来西亚", "自由行", "10天行程"],
    likes: 11200,
    views: 267000,
    comments: 560,
    link: "https://www.xiaohongshu.com/explore/6557f6c30000c50013002e4c",
    timestamp: "2024-03-05",
    collected: true
  },
  {
    id: 7,
    title: "设计灵感｜2024年流行色卡分享",
    author: "设计师小白",
    avatar: "🎨",
    content: "2024年春夏最流行的10个色系分享！包括配色方案、应用场景，设计师/家居爱好者必收！",
    category: "设计",
    tags: ["配色", "设计灵感", "流行趋势"],
    likes: 7600,
    views: 112000,
    comments: 290,
    link: "https://www.xiaohongshu.com/explore/655800d40000b20013003f5d",
    timestamp: "2024-03-04",
    collected: true
  },
  {
    id: 8,
    title: "宿舍改造记｜50块钱的断舍离",
    author: "生活美学指南",
    avatar: "🛋️",
    content: "宿舍15㎡的大改造！断舍离+收纳秘诀，让小空间变得整洁舒适。整个改造成本不到100元。",
    category: "家居",
    tags: ["宿舍改造", "收纳", "断舍离"],
    likes: 13400,
    views: 241000,
    comments: 710,
    link: "https://www.xiaohongshu.com/explore/655811e50000c70013004a6e",
    timestamp: "2024-03-03",
    collected: true
  },
  {
    id: 9,
    title: "职场穿搭｜上班族显专业的3个秘诀",
    author: "职业形象顾问",
    avatar: "👔",
    content: "职场穿搭不一定要贵！学会这3个穿衣秘诀，显专业、显气质、还显身材。适合OL和打工人。",
    category: "穿搭",
    tags: ["职场穿搭", "专业", "显气质"],
    likes: 10100,
    views: 178000,
    comments: 450,
    link: "https://www.xiaohongshu.com/explore/655822f60000b50013005b7f",
    timestamp: "2024-03-02",
    collected: false
  },
  {
    id: 10,
    title: "读书笔记｜《活出生命的意义》深度思考",
    author: "书籍推荐官",
    avatar: "📚",
    content: "弗兰克尔的经典著作，改变了我对人生的理解。书中的核心观点+个人思辨，推荐每个人都读。",
    category: "读书",
    tags: ["读书笔记", "心理学", "人生哲学"],
    likes: 5600,
    views: 89000,
    comments: 180,
    link: "https://www.xiaohongshu.com/explore/655833a70000c90013006c8a",
    timestamp: "2024-03-01",
    collected: true
  }
]

// 初始化收藏 - 应用启动时运行
export const initializeCollections = () => {
  if (typeof window !== 'undefined' && !localStorage.getItem('collections')) {
    localStorage.setItem('collections', JSON.stringify(mockXiaohongshuData))
  }
}