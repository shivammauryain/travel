'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Download, 
  Plus,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  User,
  Tag,
  Eye,
  Edit,
  Trash2,
  Loader2,
  Users
} from 'lucide-react'
import { leadsApi, eventsApi, packagesApi } from '@/src/lib/api'
import toast from 'react-hot-toast'
import LeadModal from '@/modal/actions/LeadModal'
import LeadViewModal from '@/modal/view/LeadView'
import ConfirmModal from '@/modal/ConfirmModal'

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [leads, setLeads] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [packages, setPackages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentLead, setCurrentLead] = useState<any>(null)
  const [leadModalMode, setLeadModalMode] = useState<'create' | 'edit'>('create')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalLeads: 0,
    limit: 10
  })

  useEffect(() => {
    fetchLeads()
    fetchEvents()
    fetchPackages()
  }, [statusFilter, pagination.currentPage])

  const fetchLeads = async () => {
    setIsLoading(true)
    try {
      const params: any = {
        page: pagination.currentPage,
        limit: pagination.limit
      }
      if (statusFilter !== 'all') {
        params.status = statusFilter.split('-').map((word: string) => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
      }
      const response = await leadsApi.getAll(params)
      if (response.success) {
        setLeads(response.data.leads)
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.pagination.pages,
          totalLeads: response.data.pagination.total
        }))
      }
    } catch (error: any) {
      console.error('Fetch leads error:', error)
      toast.error('Failed to fetch leads')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchEvents = async () => {
    try {
      const response = await eventsApi.getAll()
      if (response.success) {
        setEvents(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
    }
  }

  const fetchPackages = async () => {
    try {
      const response = await packagesApi.getAll()
      if (response.success) {
        setPackages(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error)
    }
  }

  const handleCreateLead = () => {
    setCurrentLead(null)
    setLeadModalMode('create')
    setShowLeadModal(true)
  }

  const handleEditLead = (lead: any) => {
    setCurrentLead({
      ...lead,
      eventId: typeof lead.eventId === 'string' ? lead.eventId : lead.eventId?._id,
      packageId: typeof lead.packageId === 'string' ? lead.packageId : lead.packageId?._id
    })
    setLeadModalMode('edit')
    setShowLeadModal(true)
  }

  const handleViewLead = (lead: any) => {
    setCurrentLead(lead)
    setShowViewModal(true)
  }

  const handleEditFromView = (lead: any) => {
    setCurrentLead({
      ...lead,
      eventId: typeof lead.eventId === 'string' ? lead.eventId : lead.eventId?._id,
      packageId: typeof lead.packageId === 'string' ? lead.packageId : lead.packageId?._id
    })
    setLeadModalMode('edit')
    setShowViewModal(false)
    setShowLeadModal(true)
  }

  const handleSaveLead = async (data: any) => {
    try {
      if (leadModalMode === 'create') {
        const response = await leadsApi.create(data)
        if (response.success) {
          toast.success('Lead created successfully')
          fetchLeads()
        }
      } else if (leadModalMode === 'edit') {
        const response = await leadsApi.update(currentLead._id, data)
        if (response.success) {
          toast.success('Lead updated successfully')
          fetchLeads()
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save lead')
      throw error
    }
  }

  const handleDeleteLead = (leadId: string) => {
    setLeadToDelete(leadId)
    setShowDeleteModal(true)
  }

  const confirmDeleteLead = async () => {
    if (!leadToDelete) return

    setIsDeleting(true)
    try {
      const response = await leadsApi.delete(leadToDelete)
      if (response.success) {
        toast.success('Lead deleted successfully')
        setShowDeleteModal(false)
        setLeadToDelete(null)
        fetchLeads()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete lead')
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredLeads = leads.filter(lead => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      lead.name?.toLowerCase().includes(search) ||
      lead.email?.toLowerCase().includes(search) ||
      lead.eventId?.name?.toLowerCase().includes(search) ||
      lead.packageId?.name?.toLowerCase().includes(search)
    )
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Contacted': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'Quote Sent': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'Interested': return 'bg-green-100 text-green-700 border-green-200'
      case 'Closed Won': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'Closed Lost': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const statuses = ['All', 'New', 'Contacted', 'Quote Sent', 'Interested', 'Closed Won', 'Closed Lost']

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  const handleExportLeads = () => {
    try {
      // Get the leads to export (filtered or all)
      const leadsToExport = filteredLeads.length > 0 ? filteredLeads : leads

      if (leadsToExport.length === 0) {
        toast.error('No leads to export')
        return
      }

      // Prepare CSV headers
      const headers = ['Name', 'Email', 'Phone', 'Event', 'Package', 'Travelers', 'Travel Date', 'Status', 'Notes', 'Created Date']
      
      // Prepare CSV rows
      const rows = leadsToExport.map(lead => [
        lead.name || '',
        lead.email || '',
        lead.phone || '',
        lead.eventId?.name || 'N/A',
        lead.packageId?.name || 'N/A',
        lead.numberOfTravelers || 0,
        lead.travelDate ? new Date(lead.travelDate).toLocaleDateString('en-IN') : '',
        lead.status || '',
        lead.notes || '',
        lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-IN') : ''
      ])

      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n')

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success(`Exported ${leadsToExport.length} leads successfully`)
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export leads')
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leads Management</h1>
            <p className="text-gray-600 mt-1">Manage and track all your customer leads</p>
          </div>
          <button 
            onClick={handleCreateLead}
            className="px-4 py-2.5 bg-linear-to-r from-[#FF4D00] to-[#FF6B00] text-white rounded-lg font-medium hover:from-[#E64500] hover:to-[#E65F00] transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Lead
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent bg-white"
              >
                {statuses.map(status => (
                  <option key={status} value={status.toLowerCase().replace(' ', '-')}>{status}</option>
                ))}
              </select>
              <button 
                onClick={handleExportLeads}
                className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#FF4D00]" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-semibold">No leads found</p>
              <p className="text-gray-400 mt-2 mb-6">Try adjusting your search or filters</p>
              <button 
                onClick={handleCreateLead}
                className="px-6 py-3 bg-linear-to-r from-[#FF4D00] to-[#FF6B00] text-white rounded-lg font-medium hover:from-[#E64500] hover:to-[#E65F00] transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add New Lead
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Event</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Package</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Travelers</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Travel Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredLeads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-linear-to-r from-[#FF4D00] to-[#FF6B00] flex items-center justify-center text-white font-semibold">
                              {lead.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Mail className="w-3 h-3 text-gray-400" />
                                <p className="text-xs text-gray-500">{lead.email}</p>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Phone className="w-3 h-3 text-gray-400" />
                                <p className="text-xs text-gray-500">{lead.phone}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{lead.eventId?.name || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-700">{lead.packageId?.name || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-gray-700">
                            <User className="w-4 h-4 text-gray-400" />
                            {lead.numberOfTravelers}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-gray-700">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(lead.travelDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleViewLead(lead)}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" 
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            <button 
                              onClick={() => handleEditLead(lead)}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" 
                              title="Edit Lead"
                            >
                              <Edit className="w-4 h-4 text-gray-600" />
                            </button>
                            <button 
                              onClick={() => handleDeleteLead(lead._id)}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" 
                              title="Delete Lead"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalLeads)} of {pagination.totalLeads} leads
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const page = index + 1
                    if (page === 1 || page === pagination.totalPages || (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${
                            pagination.currentPage === page
                              ? 'bg-[#FF4D00] text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    } else if (page === pagination.currentPage - 2 || page === pagination.currentPage + 2) {
                      return <span key={page} className="px-2">...</span>
                    }
                    return null
                  })}
                  <button 
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Lead Modal */}
      <LeadModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        onSave={handleSaveLead}
        leadData={currentLead}
        events={events}
        packages={packages}
        mode={leadModalMode}
      />

      {/* Lead View Modal */}
      <LeadViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        onEdit={handleEditFromView}
        leadData={currentLead}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteLead}
        title="Delete Lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}
