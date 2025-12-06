'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Trophy, Star, Plus, Package as PackageIcon, Users, IndianRupee } from 'lucide-react'
import Modal from '../Modal'
import { packagesApi } from '@/src/lib/api'
import toast from 'react-hot-toast'

interface Event {
  _id?: string
  name: string
  description: string
  location: string
  startDate: string
  endDate: string
  category: string
  featured?: boolean
  imageUrl?: string
}

interface Package {
  _id: string
  name: string
  tier: string
  basePrice: number
  maxTravelers: number
  features: string[]
}

interface EventViewModalProps {
  isOpen: boolean
  onClose: () => void
  event: Event | null
  onAddPackage?: (eventId: string) => void
}

export default function EventViewModal({
  isOpen,
  onClose,
  event,
  onAddPackage
}: EventViewModalProps) {
  const [packages, setPackages] = useState<Package[]>([])
  const [loadingPackages, setLoadingPackages] = useState(false)

  useEffect(() => {
    if (isOpen && event?._id) {
      fetchPackages()
    }
  }, [isOpen, event?._id])

  const fetchPackages = async () => {
    if (!event?._id) return
    try {
      setLoadingPackages(true)
      const response = await packagesApi.getAll({ eventId: event._id })
      if (response.success) {
        setPackages(response.data || [])
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
    } finally {
      setLoadingPackages(false)
    }
  }

  if (!event) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Cricket': return 'bg-blue-100 text-blue-700'
      case 'Football': return 'bg-green-100 text-green-700'
      case 'Tennis': return 'bg-yellow-100 text-yellow-700'
      case 'F1': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'Premium': return 'bg-purple-100 text-purple-700'
      case 'Standard': return 'bg-blue-100 text-blue-700'
      case 'Basic': return 'bg-green-100 text-green-700'
      case 'Economy': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const handleAddPackage = () => {
    if (event._id && onAddPackage) {
      onAddPackage(event._id)
      onClose()
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Event Details"
      size="xl"
    >
      <div className="space-y-6">
        {/* Header Image */}
        <div className="h-48 bg-linear-to-br from-[#FF4D00] to-[#FF6B00] relative flex items-center justify-center rounded-lg overflow-hidden">
          <Trophy className="w-20 h-20 text-white opacity-30" />
          {event.featured && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-amber-400 text-amber-900 rounded-full text-xs font-semibold flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />Featured
            </span>
          )}
          <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
            {event.category}
          </span>
        </div>

        {/* Event Name */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{event.name}</h3>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <p className="text-gray-600 leading-relaxed">{event.description || 'No description provided'}</p>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1 text-gray-400" />
            Location
          </label>
          <p className="text-gray-600">{event.location}</p>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1 text-gray-400" />
              Start Date
            </label>
            <p className="text-gray-600">{formatDate(event.startDate)}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1 text-gray-400" />
              End Date
            </label>
            <p className="text-gray-600">{formatDate(event.endDate)}</p>
          </div>
        </div>

        {/* Image URL */}
        {event.imageUrl && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
            <p className="text-gray-600 text-sm break-all">{event.imageUrl}</p>
          </div>
        )}

        {/* Packages Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <PackageIcon className="w-5 h-5" />
              Available Packages ({packages.length}/4)
            </h4>
            {packages.length < 4 && onAddPackage && (
              <button
                onClick={handleAddPackage}
                className="px-4 py-2 bg-linear-to-r from-[#FF4D00] to-[#FF6B00] text-white rounded-lg text-sm font-medium hover:from-[#E64500] hover:to-[#E65F00] transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Package
              </button>
            )}
          </div>

          {loadingPackages ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF4D00] mx-auto"></div>
              <p className="text-gray-600 mt-2 text-sm">Loading packages...</p>
            </div>
          ) : packages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packages.map((pkg) => (
                <div key={pkg._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-semibold text-gray-900">{pkg.name}</h5>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierBadgeColor(pkg.tier)}`}>
                      {pkg.tier}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-3">
                    <IndianRupee className="w-4 h-4 text-gray-600" />
                    <span className="text-xl font-bold text-gray-900">{pkg.basePrice.toLocaleString('en-IN')}</span>
                    <span className="text-sm text-gray-600">/ person</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Users className="w-4 h-4" />
                    <span>Max {pkg.maxTravelers} travelers</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{pkg.features.length}</span> features included
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <PackageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600 mb-3">No packages available for this event</p>
              {onAddPackage && (
                <button
                  onClick={handleAddPackage}
                  className="px-4 py-2 bg-linear-to-r from-[#FF4D00] to-[#FF6B00] text-white rounded-lg text-sm font-medium hover:from-[#E64500] hover:to-[#E65F00] transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create First Package
                </button>
              )}
            </div>
          )}
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
