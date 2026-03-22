'use client'

import { mockXiaohongshuData } from '@/lib/mockData';
import { useState } from 'react';

export default function ExampleShowcase() {
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const categories = [...new Set(mockXiaohongshuData.map(item => item.category))];
  const filteredData = selectedCategory 
    ? mockXiaohongshuData.filter(item => item.category === selectedCategory)
    : mockXiaohongshuData;

  return (
    <div className="bg-white py-12 px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-center">📌 示例收藏库</h2>
        <p className="text-center text-gray-600 mb-8">看看其他用户如何整理小红书灵感</p>
        
        {/* 分类筛选 */}
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedCategory === '' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            全部
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 收藏卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {filteredData.map(item => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all hover:scale-105"
            >
              {/* 图片 */}
              <div className="w-full h-32 bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center text-white font-bold text-4xl group-hover:scale-110 transition-transform overflow-hidden">
                {item.category[0]}
              </div>
              
              {/* 内容 */}
              <div className="p-3">
                <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-blue-600">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                  {item.content}
                </p>
                
                {/* 标签 */}
                <div className="flex gap-1 flex-wrap mb-2">
                  {item.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* 统计信息 */}
                <div className="flex justify-between text-xs text-gray-500">
                  <span>👍 {(item.likes / 1000).toFixed(1)}K</span>
                  <span>👁️ {(item.views / 1000).toFixed(0)}K</span>
                </div>
                
                {/* 作者 */}
                <div className="text-xs text-gray-500 mt-2 font-medium">
                  by {item.author}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">想像这样快速整理你的收藏吗？</p>
          <a 
            href="/sync"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            立即导入我的收藏 →
          </a>
        </div>
      </div>
    </div>
  );
}