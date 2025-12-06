'use client'

import React, { useState } from 'react'
import { Menu, Bell, Search, ChevronDown, User, Settings, LogOut, CheckCircle2, AlertCircle, TrendingUp, UserPlus, FileText } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface HeaderProps {
  onMenuClick: () => void
  isCollapsed: boolean
}

export default function Header({ onMenuClick, isCollapsed }: HeaderProps) {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  // Demo notifications
  const notifications = [
    {
      id: 1,
      type: 'success',
      icon: CheckCircle2,
      title: 'Quote Accepted',
      message: 'John Doe accepted the quote for Cricket World Cup package',
      time: '5 minutes ago',
      unread: true
    },
    {
      id: 2,
      type: 'info',
      icon: UserPlus,
      title: 'New Lead',
      message: 'Sarah Williams submitted inquiry for F1 Grand Prix',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      type: 'warning',
      icon: AlertCircle,
      title: 'Quote Expiring Soon',
      message: '3 quotes will expire in the next 24 hours',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 4,
      type: 'success',
      icon: TrendingUp,
      title: 'Revenue Milestone',
      message: 'You have reached ₹5,00,000 in total revenue',
      time: '1 day ago',
      unread: false
    }
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  const getNotificationColor = (type: string) => {
    switch(type) {
      case 'success': return 'bg-green-100 text-green-600'
      case 'warning': return 'bg-yellow-100 text-yellow-600'
      case 'info': return 'bg-blue-100 text-blue-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    router.push('/')
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 z-30"
      style={{ left: isCollapsed ? '5rem' : '16rem' }}
    >
      <div className="h-full flex items-center justify-between px-6">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg w-80">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 flex-1"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsNotificationsOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-[32rem] overflow-hidden flex flex-col">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-600 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>

                  {/* Notifications List */}
                  <div className="overflow-y-auto flex-1">
                    {notifications.map((notification) => {
                      const Icon = notification.icon
                      return (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                            notification.unread ? 'bg-blue-50/30' : ''
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                                {notification.unread && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <button className="text-sm text-orange-600 hover:text-orange-700 font-medium w-full text-center">
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Admin Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-r from-[#FF4D00] to-[#FF6B00] flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600 hidden md:block" />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsProfileOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">{user?.name || 'Admin'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                  </div>
                  <Link href="/admin/profile" className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link href="/admin/settings" className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
