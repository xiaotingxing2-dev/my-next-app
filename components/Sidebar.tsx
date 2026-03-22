// components/Sidebar.tsx
export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r h-screen p-4">
      <nav>
        <ul className="space-y-2">
            <li>
  <a href="/import" className="block p-3 rounded-lg hover:bg-gray-100 transition-colors font-medium bg-blue-100 text-blue-700 border-l-4 border-blue-600">
    📥 导入笔记
  </a>
</li>
          <li>
            <a href="/dashboard" className="block p-3 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              📊 收藏中心
            </a>
          </li>
          <li>
            <a href="/collections" className="block p-3 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              📁 我的收藏
            </a>
          </li>
          <li>
            <a href="/search" className="block p-3 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              🔍 搜索收藏
            </a>
          </li>
       
          
        </ul>
      </nav>
    </aside>
  )
}