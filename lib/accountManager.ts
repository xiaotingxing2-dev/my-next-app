// 账号管理和平台集成

export type Platform = 'xiaohongshu' | 'douyin' | 'manual'

export interface Account {
  id: string
  platform: Platform
  username: string
  nickname: string
  avatar?: string
  accessToken?: string
  refreshToken?: string
  connectedAt: string
  expiresAt?: string
  isActive: boolean
}

export interface ImportJob {
  id: string
  accountId: string
  platform: Platform
  status: 'pending' | 'importing' | 'completed' | 'failed'
  itemsCount: number
  importedCount: number
  startTime: string
  endTime?: string
  error?: string
}

/**
 * 账号管理器 - 管理多个平台的账号连接
 */
export class AccountManager {
  // 获取所有账号
  static getAccounts(): Account[] {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem('accounts')
    return data ? JSON.parse(data) : []
  }

  // 添加账号
  static addAccount(account: Account): void {
    const accounts = this.getAccounts()
    const exists = accounts.find(a => a.id === account.id)
    if (!exists) {
      accounts.push(account)
      localStorage.setItem('accounts', JSON.stringify(accounts))
    }
  }

  // 移除账号
  static removeAccount(accountId: string): void {
    const accounts = this.getAccounts().filter(a => a.id !== accountId)
    localStorage.setItem('accounts', JSON.stringify(accounts))
  }

  // 更新账号token（用于刷新过期token）
  static updateAccount(accountId: string, updates: Partial<Account>): void {
    const accounts = this.getAccounts()
    const idx = accounts.findIndex(a => a.id === accountId)
    if (idx !== -1) {
      accounts[idx] = { ...accounts[idx], ...updates }
      localStorage.setItem('accounts', JSON.stringify(accounts))
    }
  }

  // 获取活跃账号
  static getActiveAccounts(): Account[] {
    return this.getAccounts().filter(a => a.isActive)
  }

  // 按平台获取账号
  static getAccountsByPlatform(platform: Platform): Account[] {
    return this.getAccounts().filter(a => a.platform === platform)
  }
}

/**
 * 平台API集成类
 */
export class PlatformAPI {
  /**
   * 小红书API - 获取用户收藏笔记
   * 实际环境需要配置OAuth和API密钥
   */
  static async fetchXiaohongshuNotes(
    accountId: string,
    cursor?: string
  ): Promise<any[]> {
    // 实际环境中这里应该调用真实API
    // const account = AccountManager.getAccounts().find(a => a.id === accountId)
    // const response = await fetch('https://api.xiaohongshu.com/v1/user/bookmarks', {
    //   headers: {
    //     'Authorization': `Bearer ${account?.accessToken}`
    //   },
    //   params: { cursor }
    // })

    // 目前返回mock数据，模拟实时获取
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'xhs_' + Date.now() + '_1',
            platform: 'xiaohongshu',
            title: '实时小红书笔记 - 春季穿搭',
            content: '最新的春季穿搭趋势分享...',
            author: '时尚博主Lily',
            link: 'https://www.xiaohongshu.com/explore/new1',
            likes: 3500,
            views: 89000,
            timestamp: new Date().toISOString().split('T')[0],
          },
          {
            id: 'xhs_' + Date.now() + '_2',
            platform: 'xiaohongshu',
            title: '平价美妆5件套推荐',
            content: '100块钱以内的护肤品组合推荐...',
            author: '美妆博主',
            link: 'https://www.xiaohongshu.com/explore/new2',
            likes: 2800,
            views: 67000,
            timestamp: new Date().toISOString().split('T')[0],
          }
        ])
      }, 1500)
    })
  }

  /**
   * 抖音API - 获取用户收藏视频
   */
  static async fetchDouyinNotes(
    accountId: string,
    cursor?: string
  ): Promise<any[]> {
    // 实际环境中调用真实API
    // const account = AccountManager.getAccounts().find(a => a.id === accountId)
    // const response = await fetch('https://open.douyin.com/api/user/collection', {...})

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'dy_' + Date.now() + '_1',
            platform: 'douyin',
            title: '抖音好物分享 - 家居收纳',
            content: '宿舍小空间收纳技巧，不到200元改造...',
            author: '生活UP主',
            link: 'https://www.douyin.com/video/xyz123',
            likes: 5200,
            views: 120000,
            timestamp: new Date().toISOString().split('T')[0],
          },
          {
            id: 'dy_' + Date.now() + '_2',
            platform: 'douyin',
            title: '美食制作 - 懒人早餐',
            content: '5分钟快手早餐做法...',
            author: '美食博主',
            link: 'https://www.douyin.com/video/xyz456',
            likes: 8900,
            views: 250000,
            timestamp: new Date().toISOString().split('T')[0],
          }
        ])
      }, 1500)
    })
  }

  /**
   * 通用导入方法 - 支持所有平台
   */
  static async importFromPlatform(
    accountId: string,
    platform: Platform,
    onProgress?: (count: number) => void
  ): Promise<any[]> {
    try {
      if (platform === 'xiaohongshu') {
        return await this.fetchXiaohongshuNotes(accountId)
      } else if (platform === 'douyin') {
        return await this.fetchDouyinNotes(accountId)
      }
      return []
    } catch (error) {
      console.error(`Failed to import from ${platform}:`, error)
      throw error
    }
  }
}

/**
 * OAuth授权管理
 */
export class OAuthManager {
  // 生成小红书OAuth授权URL
  static getXiaohongshuAuthURL(): string {
    const clientId = process.env.NEXT_PUBLIC_XIAOHONGSHU_CLIENT_ID || 'your-client-id'
    const redirectUri = `${window.location.origin}/auth/callback`
    return `https://auth.xiaohongshu.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`
  }

  // 生成抖音OAuth授权URL
  static getDouyinAuthURL(): string {
    const clientId = process.env.NEXT_PUBLIC_DOUYIN_CLIENT_ID || 'your-client-id'
    const redirectUri = `${window.location.origin}/auth/callback`
    return `https://open.douyin.com/platform/oauth/connect?client_key=${clientId}&response_type=code&redirect_uri=${redirectUri}`
  }

  // 处理授权回调
  static async handleAuthCallback(code: string, platform: Platform): Promise<Account> {
    // 实际环境中这里的调用真实后端API来交换token
    // const response = await fetch('/api/auth/exchange-token', {
    //   method: 'POST',
    //   body: JSON.stringify({ code, platform })
    // })
    // const data = await response.json()

    // Mock 处理
    const account: Account = {
      id: `${platform}_${Date.now()}`,
      platform,
      username: code.slice(0, 10),
      nickname: platform === 'xiaohongshu' ? '小红书用户' : '抖音用户',
      accessToken: 'mock_token_' + Date.now(),
      refreshToken: 'mock_refresh_token',
      connectedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true
    }

    AccountManager.addAccount(account)
    return account
  }
}