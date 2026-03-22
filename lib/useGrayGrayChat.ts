import { useState, useCallback, useEffect } from 'react'

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

export function useGrayGrayChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])

  // 从 localStorage 加载聊天历史
  useEffect(() => {
    const saved = localStorage.getItem('grayGrayChat')
    if (saved) {
      try {
        setMessages(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load chat history:', e)
      }
    }
  }, [])

  // 保存聊天历史到 localStorage
  const saveMessages = useCallback((newMessages: ChatMessage[]) => {
    localStorage.setItem('grayGrayChat', JSON.stringify(newMessages))
  }, [])

  // 添加用户消息
  const addUserMessage = useCallback((text: string) => {
    const newMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now()
    }
    const updated = [...messages, newMessage]
    setMessages(updated)
    saveMessages(updated)
    return newMessage
  }, [messages, saveMessages])

  // 添加灰灰回复
  const addGrayMessage = useCallback((text: string, action?: ChatMessage['action']) => {
    const newMessage: ChatMessage = {
      id: `gray-${Date.now()}`,
      sender: 'gray',
      text,
      timestamp: Date.now(),
      action
    }
    const updated = [...messages, newMessage]
    setMessages(updated)
    saveMessages(updated)
    return newMessage
  }, [messages, saveMessages])

  // 清空聊天历史
  const clearChat = useCallback(() => {
    setMessages([])
    localStorage.removeItem('grayGrayChat')
  }, [])

  return {
    messages,
    addUserMessage,
    addGrayMessage,
    clearChat
  }
}