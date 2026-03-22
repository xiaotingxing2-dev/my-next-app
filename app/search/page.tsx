'use client'

import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'

interface Collection {
  id: number
  title: string
  content: string
  category: string
  tags: string[]
}

export default function Search() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  useEffect(() => {
    const collectionsData = localStorage.getItem('collections')
    if (collectionsData) {
      setCollections(JSON.parse(collectionsData))
    }
  }, [])

  const categories = [...new Set(collections.map(c => c.category).filter(Boolean))]
  const allTags = [...new Set(collections.flatMap(c => c.tags))]

  const filteredCollections = collections.filter(collection => {
    const matchesSearch = collection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collection.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || collection.category === selectedCategory
    const matchesTag = !selectedTag || collection.tags.includes(selectedTag)
    return matchesSearch && matchesCategory && matchesTag
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <h2 className="text-3xl font-bold mb-4">搜索收藏</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="搜索关键词..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 w-full mb-2"
            />
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border p-2"
              >
                <option value="">所有分类</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="border p-2"
              >
                <option value="">所有标签</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCollections.map(collection => (
              <div key={collection.id} className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold">{collection.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{collection.content}</p>
                <p className="text-sm text-gray-500">分类: {collection.category || '未分类'}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {collection.tags.map(tag => (
                    <span key={tag} className="bg-blue-200 px-2 py-1 text-xs rounded">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}