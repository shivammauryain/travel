'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Download,
  Plus,
  FileText,
  Calendar,
  DollarSign,
  User,
  Send,
  Eye,
  Printer,
  Edit,
  Trash2,
  Loader2,
  IndianRupee
} from 'lucide-react'
import { quotesApi, leadsApi } from '@/src/lib/api'
import toast from 'react-hot-toast'
import QuoteModal from '@/modal/actions/QuoteModal'
import QuoteViewModal from '@/modal/view/QuoteView'
import ConfirmModal from '@/modal/ConfirmModal'

export default function QuotesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [quotes, setQuotes] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [quoteToDelete, setQuoteToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentQuote, setCurrentQuote] = useState<any>(null)
  const [quoteModalMode, setQuoteModalMode] = useState<'create' | 'edit'>('create')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalQuotes: 0,
    limit: 10
  })

  useEffect(() => {
    fetchQuotes()
    fetchLeads()
  }, [statusFilter, pagination.currentPage])

  const fetchQuotes = async () => {
    setIsLoading(true)
    try {
      const params: any = {
        page: pagination.currentPage,
        limit: pagination.limit
      }
      if (statusFilter !== 'all') {
        params.status = statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)
      }
      const response = await quotesApi.getAll(params)
      if (response.success) {
        setQuotes(response.data.quotes)
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.pagination.pages,
          totalQuotes: response.data.pagination.total
        }))
      }
    } catch (error: any) {
      console.error('Fetch quotes error:', error)
      toast.error('Failed to fetch quotes')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchLeads = async () => {
    try {
      const response = await leadsApi.getAll({ limit: 1000 })
      if (response.success) {
        setLeads(response.data.leads)
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error)
    }
  }



  const handleCreateQuote = () => {
    setCurrentQuote(null)
    setQuoteModalMode('create')
    setShowQuoteModal(true)
  }

  const handleEditQuote = (quote: any) => {
    setCurrentQuote(quote)
    setQuoteModalMode('edit')
    setShowQuoteModal(true)
  }

  const handleViewQuote = (quote: any) => {
    setCurrentQuote(quote)
    setShowViewModal(true)
  }

  const handleEditFromView = (quote: any) => {
    setCurrentQuote(quote)
    setQuoteModalMode('edit')
    setShowViewModal(false)
    setShowQuoteModal(true)
  }

  const handleSaveQuote = async (data: any) => {
    try {
      if (quoteModalMode === 'create') {
        const response = await quotesApi.generate(data)
        if (response.success) {
          toast.success('Quote generated successfully')
          fetchQuotes()
          fetchLeads() // Refresh leads as status might have changed
        }
      } else if (quoteModalMode === 'edit') {
        const response = await quotesApi.update(currentQuote._id, data)
        if (response.success) {
          toast.success('Quote updated successfully')
          fetchQuotes()
          fetchLeads() // Refresh leads as status might have changed
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save quote')
      throw error
    }
  }

  const handleDeleteQuote = (quoteId: string) => {
    setQuoteToDelete(quoteId)
    setShowDeleteModal(true)
  }

  const confirmDeleteQuote = async () => {
    if (!quoteToDelete) return

    setIsDeleting(true)
    try {
      const response = await quotesApi.delete(quoteToDelete)
      if (response.success) {
        toast.success('Quote deleted successfully')
        setShowDeleteModal(false)
        setQuoteToDelete(null)
        fetchQuotes()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete quote')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleExportQuotes = () => {
    try {
      const quotesToExport = filteredQuotes.length > 0 ? filteredQuotes : quotes

      if (quotesToExport.length === 0) {
        toast.error('No quotes to export')
        return
      }

      const headers = ['Quote ID', 'Lead Name', 'Email', 'Event', 'Package', 'Travelers', 'Base Price', 'Final Price', 'Travel Date', 'Valid Until', 'Status', 'Notes', 'Created Date']
      
      const rows = quotesToExport.map(quote => [
        quote._id || '',
        quote.leadId?.name || 'N/A',
        quote.leadId?.email || 'N/A',
        quote.eventId?.name || 'N/A',
        quote.packageId?.name || 'N/A',
        quote.numberOfTravelers || 0,
        quote.basePrice || 0,
        quote.finalPrice || 0,
        quote.travelDate ? new Date(quote.travelDate).toLocaleDateString('en-IN') : '',
        quote.validUntil ? new Date(quote.validUntil).toLocaleDateString('en-IN') : '',
        quote.status || '',
        quote.notes || '',
        quote.createdAt ? new Date(quote.createdAt).toLocaleDateString('en-IN') : ''
      ])

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', `quotes_export_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success(`Exported ${quotesToExport.length} quotes successfully`)
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export quotes')
    }
  }

  const filteredQuotes = quotes.filter(quote => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      quote._id?.toLowerCase().includes(search) ||
      quote.leadId?.name?.toLowerCase().includes(search) ||
      quote.eventId?.name?.toLowerCase().includes(search) ||
      quote.packageId?.name?.toLowerCase().includes(search)
    )
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'Sent': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Accepted': return 'bg-green-100 text-green-700 border-green-200'
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200'
      case 'Expired': return 'bg-orange-100 text-orange-700 border-orange-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const statuses = ['All', 'Draft', 'Sent', 'Accepted', 'Rejected', 'Expired']

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quotes Management</h1>
            <p className="text-gray-600 mt-1">Create and manage customer quotes</p>
          </div>
          <button 
            onClick={handleCreateQuote}
            className="px-4 py-2.5 bg-linear-to-r from-[#FF4D00] to-[#FF6B00] text-white rounded-lg font-medium hover:from-[#E64500] hover:to-[#E65F00] transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Generate Quote
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
                placeholder="Search by quote ID, customer, or event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent bg-white"
              >
                {statuses.map(status => (
                  <option key={status} value={status.toLowerCase()}>{status}</option>
                ))}
              </select>
              <button 
                onClick={handleExportQuotes}
                className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quotes Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#FF4D00]" />
            </div>
          ) : filteredQuotes.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-semibold">No quotes found</p>
              <p className="text-gray-400 mt-2 mb-6">Try adjusting your search or filters</p>
              <button 
                onClick={handleCreateQuote}
                className="px-6 py-3 bg-linear-to-r from-[#FF4D00] to-[#FF6B00] text-white rounded-lg font-medium hover:from-[#E64500] hover:to-[#E65F00] transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Generate Quote
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quote ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Package</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Valid Until</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredQuotes.map((quote) => (
                  <tr key={quote._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#FF4D00]" />
                        <span className="text-sm font-medium text-gray-900">{quote._id?.slice(-8) || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-linear-to-r from-[#FF4D00] to-[#FF6B00] flex items-center justify-center text-white text-xs font-semibold">
                          {quote.leadId?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-sm text-gray-900">{quote.leadId?.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{quote.eventId?.name || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{quote.packageId?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <User className="w-3 h-3" />
                        {quote.numberOfTravelers} travelers
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                          <IndianRupee className="w-3 h-3" />
                          {quote.finalPrice?.toLocaleString('en-IN') || '0'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(quote.validUntil).toLocaleDateString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(quote.status)}`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleViewQuote(quote)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" 
                          title="View Quote"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button 
                          onClick={() => handleEditQuote(quote)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" 
                          title="Edit Quote"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button 
                          onClick={() => handleDeleteQuote(quote._id)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" 
                          title="Delete Quote"
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
              Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalQuotes)} of {pagination.totalQuotes} quotes
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

      {/* Quote Modal */}
      <QuoteModal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        onSave={handleSaveQuote}
        quoteData={currentQuote}
        leads={leads}
        mode={quoteModalMode}
      />

      {/* Quote View Modal */}
      <QuoteViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        onEdit={handleEditFromView}
        quoteData={currentQuote}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteQuote}
        title="Delete Quote"
        message="Are you sure you want to delete this quote? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}
