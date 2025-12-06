'use client'

import React, { useState } from 'react'
import Sidebar from '@/layout/Sidebar'
import Header from '@/layout/AdminHeader'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      <Header 
        onMenuClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        isCollapsed={isSidebarCollapsed}
      />
      <main 
        className="pt-16 transition-all duration-300"
        style={{ marginLeft: isSidebarCollapsed ? '5rem' : '16rem' }}
      >
        {children}
      </main>
    </div>
  )
}

