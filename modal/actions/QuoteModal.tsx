'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface QuoteModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => Promise<void>
  quoteData?: any
  leads: any[]
  mode: 'create' | 'edit'
}

export default function QuoteModal({
  isOpen,
  onClose,
  onSave,
  quoteData,
  leads,
  mode
}: QuoteModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    leadId: '',
    status: 'Draft',
    notes: '',
    validUntil: ''
  })
  const [selectedLead, setSelectedLead] = useState<any>(null)

  useEffect(() => {
    if (isOpen && quoteData && mode === 'edit') {
      setFormData({
        leadId: quoteData.leadId?._id || quoteData.leadId || '',
        status: quoteData.status || 'Draft',
        notes: quoteData.notes || '',
        validUntil: quoteData.validUntil ? new Date(quoteData.validUntil).toISOString().split('T')[0] : ''
      })
    } else if (isOpen && mode === 'create') {
      const defaultValidUntil = new Date()
      defaultValidUntil.setDate(defaultValidUntil.getDate() + 30)
      setFormData({
        leadId: '',
        status: 'Draft',
        notes: '',
        validUntil: defaultValidUntil.toISOString().split('T')[0]
      })
    }
  }, [isOpen, quoteData, mode])

  useEffect(() => {
    if (formData.leadId) {
      const lead = leads.find((l: any) => l._id === formData.leadId)
      setSelectedLead(lead)
    } else {
      setSelectedLead(null)
    }
  }, [formData.leadId, leads])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.leadId || !formData.validUntil) {
      return
    }

    setIsLoading(true)
    try {
      await onSave(formData)
      onClose()
      setFormData({
        leadId: '',
        status: 'Draft',
        notes: '',
        validUntil: ''
      })
    } catch (error) {
      console.error('Save quote error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Generate Quote' : 'Edit Quote'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {mode === 'create' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Quote will be automatically generated based on the lead's event, package, and travel details.
              </p>
            </div>
          )}

          {/* Lead Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Lead *
            </label>
            <select
              name="leadId"
              value={formData.leadId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
              disabled={mode === 'edit'}
            >
              <option value="">Select a lead...</option>
              {leads.map((lead: any) => (
                <option key={lead._id} value={lead._id}>
                  {lead.name} - {lead.email} - {lead.eventId?.name || 'No Event'}
                </option>
              ))}
            </select>
          </div>

          {/* Lead Details Preview */}
          {selectedLead && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-gray-900">Lead Details:</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Event:</span>
                  <span className="ml-2 font-medium">{selectedLead.eventId?.name || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Package:</span>
                  <span className="ml-2 font-medium">{selectedLead.packageId?.name || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Travelers:</span>
                  <span className="ml-2 font-medium">{selectedLead.numberOfTravelers || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Travel Date:</span>
                  <span className="ml-2 font-medium">
                    {selectedLead.travelDate ? new Date(selectedLead.travelDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Valid Until */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valid Until *
            </label>
            <input
              type="date"
              name="validUntil"
              value={formData.validUntil}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Status (for edit mode) */}
          {mode === 'edit' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="Add any additional notes or special instructions..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !formData.leadId || !formData.validUntil}
            >
              {isLoading ? 'Processing...' : mode === 'create' ? 'Generate Quote' : 'Update Quote'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
