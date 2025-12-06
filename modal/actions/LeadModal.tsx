'use client'

import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, Calendar, Users, Loader2 } from 'lucide-react'
import Modal from '../Modal'
import toast from 'react-hot-toast'

interface LeadFormData {
  name: string
  email: string
  phone: string
  eventId: string
  packageId: string
  numberOfTravelers: number
  travelDate: string
  status: string
  notes?: string
}

interface LeadModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: LeadFormData) => void | Promise<void>
  leadData?: LeadFormData & { _id?: string }
  events?: any[]
  packages?: any[]
  mode?: 'create' | 'edit' | 'view'
}

export default function LeadModal({
  isOpen,
  onClose,
  onSave,
  leadData,
  events = [],
  packages = [],
  mode = 'create'
}: LeadModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<LeadFormData>({
    name: leadData?.name || '',
    email: leadData?.email || '',
    phone: leadData?.phone || '',
    eventId: leadData?.eventId || '',
    packageId: leadData?.packageId || '',
    numberOfTravelers: leadData?.numberOfTravelers || 1,
    travelDate: leadData?.travelDate || '',
    status: leadData?.status || 'New',
    notes: leadData?.notes || ''
  })

  const [filteredPackages, setFilteredPackages] = useState(packages)

  useEffect(() => {
    if (leadData && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: leadData.name || '',
        email: leadData.email || '',
        phone: leadData.phone || '',
        eventId: leadData.eventId || '',
        packageId: leadData.packageId || '',
        numberOfTravelers: leadData.numberOfTravelers || 1,
        travelDate: leadData.travelDate ? leadData.travelDate.split('T')[0] : '',
        status: leadData.status || 'New',
        notes: leadData.notes || ''
      })
    } else if (mode === 'create') {
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventId: '',
        packageId: '',
        numberOfTravelers: 1,
        travelDate: '',
        status: 'New',
        notes: ''
      })
    }
  }, [leadData, mode])

  useEffect(() => {
    if (formData.eventId) {
      const pkgs = packages.filter((pkg: any) => {
        const pkgEventId = typeof pkg.eventId === 'string' ? pkg.eventId : pkg.eventId?._id
        return pkgEventId === formData.eventId
      })
      setFilteredPackages(pkgs)
    } else {
      setFilteredPackages(packages)
    }
  }, [formData.eventId, packages])

  const statuses = ['New', 'Contacted', 'Quote Sent', 'Interested', 'Closed Won', 'Closed Lost']

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'numberOfTravelers') {
      // Allow empty string for editing, will be validated on blur
      if (value === '') {
        setFormData(prev => ({ ...prev, numberOfTravelers: '' as any }))
      } else {
        const numValue = parseInt(value)
        if (!isNaN(numValue) && numValue >= 1) {
          setFormData(prev => ({ ...prev, numberOfTravelers: numValue }))
        }
      }
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value 
      }))
    }
  }

  const handleTravelersBlur = () => {
    // On blur, ensure we have a valid number
    if (!formData.numberOfTravelers || formData.numberOfTravelers < 1) {
      setFormData(prev => ({ ...prev, numberOfTravelers: 1 }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Ensure numberOfTravelers has a valid value before submitting
    if (!formData.numberOfTravelers || formData.numberOfTravelers < 1) {
      setFormData(prev => ({ ...prev, numberOfTravelers: 1 }))
    }
    
    if (!formData.name || !formData.email || !formData.phone || !formData.eventId || !formData.packageId || !formData.travelDate) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const isViewMode = mode === 'view'

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={mode === 'create' ? 'Create New Lead' : mode === 'edit' ? 'Edit Lead' : 'Lead Details'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1 text-gray-400" />
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isViewMode}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent disabled:bg-gray-100"
              placeholder="Enter full name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1 text-gray-400" />
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isViewMode}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent disabled:bg-gray-100"
              placeholder="email@example.com"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1 text-gray-400" />
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isViewMode}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent disabled:bg-gray-100"
              placeholder="+91 98765 43210"
              required
            />
          </div>

          {/* Number of Travelers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1 text-gray-400" />
              Travelers <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="numberOfTravelers"
              value={formData.numberOfTravelers}
              onChange={handleChange}
              onBlur={handleTravelersBlur}
              disabled={isViewMode}
              min="1"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent disabled:bg-gray-100"
              placeholder="Number of travelers"
              required
            />
          </div>
        </div>

        {/* Event Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event <span className="text-red-500">*</span>
          </label>
          <select
            name="eventId"
            value={formData.eventId}
            onChange={handleChange}
            disabled={isViewMode}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent bg-white disabled:bg-gray-100"
            required
          >
            <option value="">Select an event...</option>
            {events.map(event => (
              <option key={event._id} value={event._id}>{event.name}</option>
            ))}
          </select>
        </div>

        {/* Package Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Package <span className="text-red-500">*</span>
          </label>
          <select
            name="packageId"
            value={formData.packageId}
            onChange={handleChange}
            disabled={isViewMode || !formData.eventId}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent bg-white disabled:bg-gray-100"
            required
          >
            <option value="">Select a package...</option>
            {filteredPackages.map((pkg: any) => (
              <option key={pkg._id} value={pkg._id}>{pkg.name} - {pkg.tier}</option>
            ))}
          </select>
          {!formData.eventId && <p className="text-xs text-gray-500 mt-1">Select an event first</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Travel Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1 text-gray-400" />
              Travel Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="travelDate"
              value={formData.travelDate}
              onChange={handleChange}
              disabled={isViewMode}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent disabled:bg-gray-100"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={isViewMode}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent bg-white disabled:bg-gray-100"
              required
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            disabled={isViewMode}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent resize-none disabled:bg-gray-100"
            placeholder="Additional notes or comments..."
          />
        </div>

        {/* Actions */}
        {!isViewMode && (
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-linear-to-r from-[#FF4D00] to-[#FF6B00] text-white rounded-lg font-medium hover:from-[#E64500] hover:to-[#E65F00] transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                mode === 'create' ? 'Create Lead' : 'Update Lead'
              )}
            </button>
          </div>
        )}
        {isViewMode && (
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </form>
    </Modal>
  )
}
