'use client'

import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, Calendar, Users, Package, MapPin, FileText, Clock, Edit, X, Loader2 } from 'lucide-react'
import Modal from '../Modal'
import { leadsApi } from '@/src/lib/api'
import toast from 'react-hot-toast'

interface LeadData {
  _id: string
  name: string
  email: string
  phone: string
  eventId: any
  packageId: any
  numberOfTravelers: number
  travelDate: string
  status: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface StatusHistory {
  _id: string
  fromStatus: string
  toStatus: string
  notes?: string
  createdAt: string
}

interface LeadViewModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit?: (lead: LeadData) => void
  leadData: LeadData | null
}

export default function LeadViewModal({
  isOpen,
  onClose,
  onEdit,
  leadData
}: LeadViewModalProps) {
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  useEffect(() => {
    if (isOpen && leadData?._id) {
      fetchStatusHistory()
    }
  }, [isOpen, leadData?._id])

  const fetchStatusHistory = async () => {
    if (!leadData?._id) return
    
    setLoadingHistory(true)
    try {
      const response = await leadsApi.getHistory(leadData._id)
      console.log('History API Response:', response)
      if (response.success) {
        const historyData = Array.isArray(response.data) 
          ? response.data 
          : Array.isArray(response.data?.history) 
            ? response.data.history 
            : []
        console.log('Extracted history data:', historyData)
        setStatusHistory(historyData)
      }
    } catch (error: any) {
      console.error('Failed to fetch status history:', error)
      toast.error('Failed to load status history')
      setStatusHistory([])
    } finally {
      setLoadingHistory(false)
    }
  }

  if (!leadData) return null

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Lead Details"
      size="xl"
    >
      <div className="space-y-6">
        {/* Header with Edit Button */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-linear-to-r from-[#FF4D00] to-[#FF6B00] flex items-center justify-center text-white text-2xl font-bold">
              {leadData.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{leadData.name}</h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mt-2 ${getStatusColor(leadData.status)}`}>
                {leadData.status}
              </span>
            </div>
          </div>
          {onEdit && (
            <button
              onClick={() => {
                onEdit(leadData)
                onClose()
              }}
              className="px-4 py-2 bg-[#FF4D00] text-white rounded-lg hover:bg-[#E64500] transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Lead
            </button>
          )}
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1 text-gray-400" />
              Email Address
            </label>
            <p className="text-gray-900">{leadData.email}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1 text-gray-400" />
              Phone Number
            </label>
            <p className="text-gray-900">{leadData.phone}</p>
          </div>
        </div>

        {/* Event & Package Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <label className="block text-sm font-semibold text-blue-900 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Event
            </label>
            <p className="text-blue-900 font-medium">{leadData.eventId?.name || 'N/A'}</p>
            {leadData.eventId?.location && (
              <p className="text-sm text-blue-700 mt-1">{leadData.eventId.location}</p>
            )}
          </div>

          <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <label className="block text-sm font-semibold text-purple-900 mb-2">
              <Package className="w-4 h-4 inline mr-1" />
              Package
            </label>
            <p className="text-purple-900 font-medium">{leadData.packageId?.name || 'N/A'}</p>
            {leadData.packageId?.tier && (
              <p className="text-sm text-purple-700 mt-1">{leadData.packageId.tier} Tier</p>
            )}
          </div>
        </div>

        {/* Travel Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1 text-gray-400" />
              Number of Travelers
            </label>
            <p className="text-gray-900 text-2xl font-bold">{leadData.numberOfTravelers}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1 text-gray-400" />
              Travel Date
            </label>
            <p className="text-gray-900 font-medium">{formatDate(leadData.travelDate)}</p>
          </div>
        </div>

        {/* Notes */}
        {leadData.notes && (
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <label className="block text-sm font-semibold text-amber-900 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Notes
            </label>
            <p className="text-amber-900 whitespace-pre-wrap">{leadData.notes}</p>
          </div>
        )}

        {/* Status History */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Status History
          </h4>
          
          {loadingHistory ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-[#FF4D00] mx-auto" />
              <p className="text-gray-600 mt-2 text-sm">Loading history...</p>
            </div>
          ) : Array.isArray(statusHistory) && statusHistory.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {statusHistory.map((history, index) => (
                <div key={history._id} className="flex gap-4 relative">
                  {/* Timeline line */}
                  {index !== statusHistory.length - 1 && (
                    <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200"></div>
                  )}
                  
                  {/* Timeline dot */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    index === 0 ? 'bg-[#FF4D00]' : 'bg-gray-300'
                  }`}>
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(history.fromStatus)}`}>
                          {history.fromStatus}
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(history.toStatus)}`}>
                          {history.toStatus}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDateTime(history.createdAt)}
                      </span>
                    </div>
                    {history.notes && (
                      <p className="text-sm text-gray-600 mt-2">{history.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600">No status history available</p>
            </div>
          )}
        </div>

        {/* Timestamps */}
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Created:</span>
              <span className="ml-2 text-gray-900 font-medium">{formatDateTime(leadData.createdAt)}</span>
            </div>
            <div>
              <span className="text-gray-500">Last Updated:</span>
              <span className="ml-2 text-gray-900 font-medium">{formatDateTime(leadData.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  )
}
