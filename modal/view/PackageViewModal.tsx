'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Users, Star, Check, IndianRupee, Package as PackageIcon, Mail, Phone, User } from 'lucide-react'
import Modal from '../Modal'
import { leadsApi } from '@/src/lib/api'
import toast from 'react-hot-toast'

interface PackageData {
  _id?: string
  eventId?: any
  name: string
  description: string
  basePrice: number
  maxTravelers: number
  features: string[]
  tier: 'Premium' | 'Standard' | 'Basic' | 'Economy'
}

interface Lead {
  _id: string
  name: string
  email: string
  phone: string
  numberOfTravelers: number
  status: string
  createdAt: string
}

interface PackageViewModalProps {
  isOpen: boolean
  onClose: () => void
  packageData: PackageData | null
}

export default function PackageViewModal({
  isOpen,
  onClose,
  packageData
}: PackageViewModalProps) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loadingLeads, setLoadingLeads] = useState(false)
  const [showLeads, setShowLeads] = useState(false)

  useEffect(() => {
    if (isOpen && packageData?._id) {
      fetchLeads()
    }
  }, [isOpen, packageData?._id])

  const fetchLeads = async () => {
    if (!packageData?._id) return
    
    setLoadingLeads(true)
    try {
      // Fetch all leads and filter by package on client side
      const response = await leadsApi.getAll({ limit: 100 })
      if (response.success) {
        const packageLeads = response.data.leads.filter((lead: any) => {
          const leadPackageId = typeof lead.packageId === 'string' ? lead.packageId : lead.packageId?._id
          return leadPackageId === packageData._id
        })
        setLeads(packageLeads)
      }
    } catch (error: any) {
      console.error('Failed to fetch leads:', error)
      toast.error('Failed to load travelers')
    } finally {
      setLoadingLeads(false)
    }
  }

  if (!packageData) return null

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Premium': return 'from-purple-500 to-purple-600'
      case 'Standard': return 'from-blue-500 to-blue-600'
      case 'Basic': return 'from-green-500 to-green-600'
      case 'Economy': return 'from-gray-500 to-gray-600'
      default: return 'from-gray-500 to-gray-600'
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-700'
      case 'contacted': return 'bg-yellow-100 text-yellow-700'
      case 'qualified': return 'bg-green-100 text-green-700'
      case 'converted': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const totalTravelers = leads.reduce((sum, lead) => sum + lead.numberOfTravelers, 0)

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Package Details"
      size="xl"
    >
      <div className="space-y-6">
        {/* Package Header */}
        <div className={`bg-linear-to-r ${getTierColor(packageData.tier)} p-6 text-white rounded-lg relative`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">{packageData.name}</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTierBadgeColor(packageData.tier)} bg-white/90`}>
                {packageData.tier}
              </span>
            </div>
            <PackageIcon className="w-10 h-10 opacity-50" />
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <IndianRupee className="w-6 h-6" />
              <span className="text-4xl font-bold">{packageData.basePrice.toLocaleString('en-IN')}</span>
              <span className="text-sm opacity-90 ml-1">/ person</span>
            </div>
          </div>
        </div>

        {/* Event Info */}
        {packageData.eventId && (
          <div className="pb-4 border-b border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1 text-gray-400" />
              Event
            </label>
            <p className="text-gray-900 font-medium">{packageData.eventId?.name || 'Unknown Event'}</p>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <p className="text-gray-600 leading-relaxed">{packageData.description}</p>
        </div>

        {/* Max Travelers */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Users className="w-4 h-4 inline mr-1 text-gray-400" />
            Maximum Travelers
          </label>
          <p className="text-gray-600">{packageData.maxTravelers} travelers</p>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Package Includes
          </label>
          <div className="space-y-2 max-h-60 overflow-y-auto bg-gray-50 rounded-lg p-4">
            {packageData.features && packageData.features.length > 0 ? (
              packageData.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No features listed</p>
            )}
          </div>
        </div>

        {/* Leads/Travelers Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Interested Travelers
            </h4>
            <button
              onClick={() => setShowLeads(!showLeads)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              {showLeads ? 'Hide' : 'Show'} Details
            </button>
          </div>

          {loadingLeads ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF4D00] mx-auto"></div>
              <p className="text-gray-600 mt-2 text-sm">Loading travelers...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{leads.length}</p>
                  <p className="text-sm text-gray-600">Total Leads</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{totalTravelers}</p>
                  <p className="text-sm text-gray-600">Total Travelers</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {leads.filter(l => l.status.toLowerCase() === 'converted').length}
                  </p>
                  <p className="text-sm text-gray-600">Converted</p>
                </div>
              </div>

              {showLeads && (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {leads.length > 0 ? (
                    leads.map((lead) => (
                      <div key={lead._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-gray-400" />
                            <h5 className="font-semibold text-gray-900">{lead.name}</h5>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{lead.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{lead.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{lead.numberOfTravelers} travelers</span>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                          Submitted: {new Date(lead.createdAt).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-600">No travelers yet for this package</p>
                      <p className="text-sm text-gray-500 mt-1">Leads will appear here when customers show interest</p>
                    </div>
                  )}
                </div>
              )}
            </>
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
