'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.push('/login')
  }

  return (
    <header className="h-16 bg-gradient-to-r from-blue-600 to-blue-500 shadow-md flex items-center justify-between px-6">
      <h1 className="text-2xl font-bold text-white">🎯 清灰灰</h1>
      <div>
        {user ? (
          <div className="flex items-center space-x-4 text-white">
            <span>欢迎, {user.email}</span>
            <button onClick={handleLogout} className="hover:text-blue-100 transition-colors">
              登出
            </button>
          </div>
        ) : (
          <a href="/login" className="text-white hover:text-blue-100 transition-colors">登录</a>
        )}
      </div>
    </header>
  )
}