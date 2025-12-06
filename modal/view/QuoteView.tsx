'use client'

import React from 'react'
import { X, Edit, Mail, Phone, Users, Calendar, MapPin, Package as PackageIcon, IndianRupee, FileText, Clock, CheckCircle2 } from 'lucide-react'

interface QuoteViewModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit: (quote: any) => void
  quoteData: any
}

export default function QuoteViewModal({
  isOpen,
  onClose,
  onEdit,
  quoteData
}: QuoteViewModalProps) {
  if (!isOpen || !quoteData) return null

  const lead = quoteData.leadId
  const event = quoteData.eventId
  const pkg = quoteData.packageId

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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isExpired = new Date(quoteData.validUntil) < new Date()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Quote Details</h2>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(quoteData.status)}`}>
              {quoteData.status}
            </span>
            {isExpired && quoteData.status !== 'Accepted' && quoteData.status !== 'Rejected' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                Expired
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(quoteData)}
              className="px-4 py-2 bg-[#FF4D00] text-white rounded-lg font-medium hover:bg-[#E64500] transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Lead Information */}
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#FF4D00]" />
              Lead Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Name</p>
                <p className="text-base font-medium text-gray-900">{lead?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  Email
                </p>
                <p className="text-base font-medium text-gray-900">{lead?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  Phone
                </p>
                <p className="text-base font-medium text-gray-900">{lead?.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Number of Travelers</p>
                <p className="text-base font-medium text-gray-900">{quoteData.numberOfTravelers || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Event & Package Information */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Event */}
            <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Event
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Event Name</p>
                  <p className="text-base font-medium text-gray-900">{event?.name || 'N/A'}</p>
                </div>
                {event?.location && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Location
                    </p>
                    <p className="text-base font-medium text-gray-900">{event.location}</p>
                  </div>
                )}
                {event?.startDate && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Event Date</p>
                    <p className="text-base font-medium text-gray-900">
                      {formatDate(event.startDate)}
                      {event.endDate && event.endDate !== event.startDate && 
                        ` - ${formatDate(event.endDate)}`
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Package */}
            <div className="bg-orange-50 rounded-lg p-5 border border-orange-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <PackageIcon className="w-5 h-5 text-orange-600" />
                Package
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Package Name</p>
                  <p className="text-base font-medium text-gray-900">{pkg?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tier</p>
                  <p className="text-base font-medium text-gray-900">{pkg?.tier || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Base Price (per person)</p>
                  <p className="text-base font-medium text-[#FF4D00] flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    {pkg?.price?.toLocaleString('en-IN') || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-[#FF4D00]" />
              Pricing Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-orange-200">
                <span className="text-gray-700">Base Price</span>
                <span className="font-medium text-gray-900">
                  ₹{quoteData.basePrice?.toLocaleString('en-IN') || '0'}
                </span>
              </div>
              
              {/* Adjustments */}
              {quoteData.adjustments && Object.keys(quoteData.adjustments).length > 0 && (
                <div className="space-y-2 py-2 border-b border-orange-200">
                  {Object.entries(quoteData.adjustments).map(([key, value]: [string, any]) => {
                    if (value.value !== 0 || value.percentage !== 0) {
                      const displayValue = value.percentage !== 0 
                        ? `${value.percentage > 0 ? '+' : ''}${value.percentage}%`
                        : `${value.value > 0 ? '+' : ''}₹${Math.abs(value.value).toLocaleString('en-IN')}`
                      
                      return (
                        <div key={key} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className={value.value < 0 || value.percentage < 0 ? 'text-green-600' : 'text-gray-700'}>
                            {displayValue}
                          </span>
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
              )}
              
              <div className="flex justify-between items-center pt-3">
                <span className="text-lg font-semibold text-gray-900">Final Price</span>
                <span className="text-2xl font-bold text-[#FF4D00] flex items-center gap-1">
                  <IndianRupee className="w-5 h-5" />
                  {quoteData.finalPrice?.toLocaleString('en-IN') || '0'}
                </span>
              </div>
              <p className="text-xs text-gray-600 text-right">
                For {quoteData.numberOfTravelers} traveler(s)
              </p>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Travel Date
              </h3>
              <p className="text-base font-medium text-gray-900">
                {formatDate(quoteData.travelDate)}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Valid Until
              </h3>
              <p className={`text-base font-medium ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                {formatDate(quoteData.validUntil)}
                {isExpired && <span className="text-sm ml-2">(Expired)</span>}
              </p>
            </div>
          </div>

          {/* Notes */}
          {quoteData.notes && (
            <div className="bg-yellow-50 rounded-lg p-5 border border-yellow-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Notes
              </h3>
              <p className="text-base text-gray-900 whitespace-pre-wrap">{quoteData.notes}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <div>
                <span className="font-medium">Created:</span>{' '}
                {quoteData.createdAt ? new Date(quoteData.createdAt).toLocaleString('en-IN') : 'N/A'}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span>{' '}
                {quoteData.updatedAt ? new Date(quoteData.updatedAt).toLocaleString('en-IN') : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
