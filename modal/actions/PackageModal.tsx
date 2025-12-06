'use client'

import React, { useState, useEffect } from 'react'
import { Users, Star, Check, Loader2, X, IndianRupee } from 'lucide-react'
import Modal from '../Modal'
import toast from 'react-hot-toast'

interface PackageFormData {
  eventId?: string
  name: string
  description: string
  basePrice: number
  maxTravelers: number
  features: string[]
  tier: 'Premium' | 'Standard' | 'Basic' | 'Economy'
}

interface Event {
  _id: string
  name: string
}

interface Package {
  _id: string
  eventId: string | { _id: string }
  tier: 'Premium' | 'Standard' | 'Basic' | 'Economy'
}

interface PackageModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: PackageFormData) => void | Promise<void>
  packageData?: PackageFormData & { id?: string | number; _id?: string }
  events?: Event[]
  packages?: Package[]
  mode?: 'create' | 'edit'
}

export default function PackageModal({
  isOpen,
  onClose,
  onSave,
  packageData,
  events = [],
  packages = [],
  mode = 'create'
}: PackageModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const tiers: Array<'Premium' | 'Standard' | 'Basic' | 'Economy'> = ['Premium', 'Standard', 'Basic', 'Economy']

  // Get tiers already used for the selected event
  const getUsedTiers = (eventId: string) => {
    if (!eventId) return []
    return packages
      .filter(pkg => {
        const pkgEventId = typeof pkg.eventId === 'string' ? pkg.eventId : pkg.eventId._id
        // Exclude current package when editing
        const isCurrentPackage = mode === 'edit' && packageData?._id && pkg._id === packageData._id
        return pkgEventId === eventId && !isCurrentPackage
      })
      .map(pkg => pkg.tier)
  }

  // Get first available tier for an event
  const getFirstAvailableTier = (eventId: string) => {
    const used = getUsedTiers(eventId)
    const available = tiers.find(tier => !used.includes(tier))
    return available || 'Standard'
  }

  const [formData, setFormData] = useState<PackageFormData>({
    eventId: packageData?.eventId || '',
    name: packageData?.name || '',
    description: packageData?.description || '',
    basePrice: packageData?.basePrice || 0,
    maxTravelers: packageData?.maxTravelers || 1,
    features: packageData?.features || [],
    tier: packageData?.tier || (packageData?.eventId ? getFirstAvailableTier(packageData.eventId) : 'Standard')
  })
  const [newFeature, setNewFeature] = useState('')

  // Update form data when packageData prop changes (for edit mode or pre-selected event)
  useEffect(() => {
    if (packageData && mode === 'edit') {
      setFormData({
        eventId: packageData.eventId || '',
        name: packageData.name || '',
        description: packageData.description || '',
        basePrice: packageData.basePrice || 0,
        maxTravelers: packageData.maxTravelers || 1,
        features: packageData.features || [],
        tier: packageData.tier || 'Standard'
      })
    } else if (packageData?.eventId && mode === 'create') {
      // Pre-selected event for new package
      const firstTier = getFirstAvailableTier(packageData.eventId)
      setFormData({
        eventId: packageData.eventId,
        name: '',
        description: '',
        basePrice: 0,
        maxTravelers: 1,
        features: [],
        tier: firstTier
      })
      setNewFeature('')
    } else if (mode === 'create') {
      setFormData({
        eventId: '',
        name: '',
        description: '',
        basePrice: 0,
        maxTravelers: 1,
        features: [],
        tier: 'Standard'
      })
      setNewFeature('')
    }
  }, [packageData, mode])

  const usedTiers = getUsedTiers(formData.eventId || '')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // If event is changed, update tier to first available
    if (name === 'eventId') {
      const firstAvailable = getFirstAvailableTier(value)
      setFormData(prev => ({ 
        ...prev, 
        eventId: value,
        tier: firstAvailable
      }))
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: name === 'basePrice' || name === 'maxTravelers' ? parseFloat(value) || 0 : value 
      }))
    }
  }

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({ ...prev, features: [...prev.features, newFeature.trim()] }))
      setNewFeature('')
    }
  }

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.eventId) {
      toast.error('Please select an event')
      return
    }

    if (!formData.name || !formData.description || formData.basePrice <= 0 || formData.maxTravelers <= 0) {
      toast.error('Please fill in all required fields with valid values')
      return
    }

    if (formData.features.length === 0) {
      toast.error('Please add at least one feature')
      return
    }

    setIsLoading(true)
    try {
      await onSave(formData)
      
      // Reset form if creating new package
      if (mode === 'create') {
        setFormData({
          eventId: '',
          name: '',
          description: '',
          basePrice: 0,
          maxTravelers: 1,
          features: [],
          tier: 'Standard'
        })
        setNewFeature('')
      }
      
      onClose()
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={mode === 'create' ? 'Create New Package' : 'Edit Package'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Event Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event <span className="text-red-500">*</span>
          </label>
          <select
            name="eventId"
            value={formData.eventId}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent bg-white"
            required
          >
            <option value="">Select an event...</option>
            {events.map(event => (
              <option key={event._id} value={event._id}>{event.name}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Each event can have max 4 packages (one per tier)</p>
        </div>

        {/* Package Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Package Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent"
            placeholder="e.g., VIP Premium Package"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent resize-none"
            placeholder="Brief description of the package..."
            required
          />
        </div>

        {/* Price, Travelers, and Tier */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <IndianRupee className="w-4 h-4 inline mr-1 text-gray-400" />
              Base Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="basePrice"
              value={formData.basePrice || ''}
              onChange={handleChange}
              min="0"
              step="1"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent"
              placeholder="Enter price"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1 text-gray-400" />
              Max Travelers <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="maxTravelers"
              value={formData.maxTravelers || ''}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent"
              placeholder="Enter number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Star className="w-4 h-4 inline mr-1 text-gray-400" />
              Tier <span className="text-red-500">*</span>
            </label>
            <select
              name="tier"
              value={formData.tier}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent bg-white"
              required
            >
              {tiers.filter(tier => !usedTiers.includes(tier)).map(tier => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Features <span className="text-red-500">*</span>
          </label>
          
          {/* Add Feature Input */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent"
              placeholder="Add a feature..."
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Add
            </button>
          </div>

          {/* Features List */}
          {formData.features.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-start justify-between gap-2 p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-2 flex-1">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="p-1 hover:bg-red-100 rounded text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-3 border border-dashed border-gray-300 rounded-lg">
              No features added yet. Add features to describe what's included.
            </p>
          )}
        </div>

        {/* Actions */}
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
              mode === 'create' ? 'Create Package' : 'Update Package'
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}
