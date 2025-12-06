'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/routes/ProtectedRoute'
import StatsCard from '@/components/admin/StatsCard'
import { dashboardApi } from '@/src/lib/api'
import { 
  Users, 
  Calendar, 
  Package, 
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  IndianRupee
} from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [recentLeads, setRecentLeads] = useState<any[]>([])
  const [revenueStats, setRevenueStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsRes, leadsRes, revenueRes] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getRecentLeads(5),
        dashboardApi.getRevenueStats()
      ])
      
      setStats(statsRes.data)
      setRecentLeads(leadsRes.data)
      setRevenueStats(revenueRes.data)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700'
      case 'Contacted': return 'bg-yellow-100 text-yellow-700'
      case 'Quote Sent': return 'bg-purple-100 text-purple-700'
      case 'Interested': return 'bg-green-100 text-green-700'
      case 'Closed Won': return 'bg-emerald-100 text-emerald-700'
      case 'Closed Lost': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
            </div>
            <button 
              onClick={() => router.push('/admin/events')}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              View Events
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Leads"
                  value={stats?.totalLeads || 0}
                  icon={Users}
                  trend={{ value: stats?.leadsTrend || 0, isPositive: (stats?.leadsTrend || 0) >= 0 }}
                  color="orange"
                />
                <StatsCard
                  title="Active Events"
                  value={stats?.activeEvents || 0}
                  icon={Calendar}
                  color="blue"
                />
                <StatsCard
                  title="Total Packages"
                  value={stats?.totalPackages || 0}
                  icon={Package}
                  color="purple"
                />
                <StatsCard
                  title="Conversion Rate"
                  value={`${stats?.conversionRate || 0}%`}
                  icon={TrendingUp}
                  color="green"
                />
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Leads Table */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">Recent Leads</h2>
                      <button 
                        onClick={() => router.push('/admin/leads')}
                        className="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center gap-1"
                      >
                        View All
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    {recentLeads.length > 0 ? (
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {recentLeads.map((lead: any) => (
                            <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                                  <p className="text-sm text-gray-500">{lead.email}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700">{lead.eventId?.name || 'N/A'}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                                  {lead.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {new Date(lead.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        No recent leads found
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-6">
                  {/* Revenue Overview with Chart */}
                  {revenueStats && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Overview</h3>
                      
                      {/* Revenue Bars Chart */}
                      <div className="space-y-4 mb-6">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Total Revenue</span>
                            <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                              <IndianRupee className="w-3 h-3" />
                              {revenueStats.totalRevenue?.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${Math.min(100, (revenueStats.totalRevenue / (revenueStats.totalRevenue + revenueStats.pendingRevenue)) * 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Pending Revenue</span>
                            <span className="text-sm font-semibold text-yellow-600 flex items-center gap-1">
                              <IndianRupee className="w-3 h-3" />
                              {revenueStats.pendingRevenue?.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2.5 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${Math.min(100, (revenueStats.pendingRevenue / (revenueStats.totalRevenue + revenueStats.pendingRevenue)) * 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Summary Stats */}
                      <div className="pt-4 border-t border-gray-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Accepted Quotes</span>
                          <span className="text-sm font-semibold text-gray-900">{revenueStats.acceptedQuotesCount || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Pending Quotes</span>
                          <span className="text-sm font-semibold text-gray-900">{revenueStats.pendingQuotesCount || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Avg Quote Value</span>
                          <span className="text-sm font-semibold text-purple-600 flex items-center gap-1">
                            <IndianRupee className="w-3 h-3" />
                            {parseFloat(revenueStats.averageQuoteValue).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status Overview */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Lead Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-600">New</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{stats?.statusBreakdown?.new || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-gray-600">Contacted</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{stats?.statusBreakdown?.contacted || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-purple-500" />
                          <span className="text-sm text-gray-600">Quote Sent</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{stats?.statusBreakdown?.quoteSent || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600">Closed Won</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{stats?.statusBreakdown?.closedWon || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-gray-600">Closed Lost</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{stats?.statusBreakdown?.closedLost || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      <button 
                        onClick={() => router.push('/admin/leads')}
                        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium text-sm transition-colors text-left"
                      >
                        Manage Leads
                      </button>
                      <button 
                        onClick={() => router.push('/admin/quotes')}
                        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium text-sm transition-colors text-left"
                      >
                        Manage Quotes
                      </button>
                      <button 
                        onClick={() => router.push('/admin/events')}
                        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium text-sm transition-colors text-left"
                      >
                        Manage Events
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

