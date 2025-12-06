'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Package as PackageIcon,
  DollarSign,
  Users,
  Star,
  Check
} from 'lucide-react'
import { PackageModal, PackageViewModal, ConfirmModal } from '@/modal'
import { packagesApi, eventsApi } from '@/src/lib/api'
import toast from 'react-hot-toast'

export default function PackagesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [tierFilter, setTierFilter] = useState('all')
  const [showPackageModal, setShowPackageModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<any>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [packages, setPackages] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchPackages()
    fetchEvents()
  }, [tierFilter, searchTerm])

  const fetchPackages = async () => {
    try {
      setLoading(true)
      const response = await packagesApi.getAll({
        tier: tierFilter !== 'all' ? tierFilter : undefined,
        search: searchTerm || undefined
      })
      
      if (response.success) {
        setPackages(response.data || [])
      } else {
        toast.error(response.message || 'Failed to fetch packages')
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
      toast.error('Failed to fetch packages')
    } finally {
      setLoading(false)
    }
  }

  const fetchEvents = async () => {
    try {
      const response = await eventsApi.getAll()
      if (response.success) {
        setEvents(response.data || [])
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  const handleCreatePackage = () => {
    setSelectedPackage(null)
    setModalMode('create')
    setShowPackageModal(true)
  }

  const handleViewPackage = (pkg: any) => {
    setSelectedPackage(pkg)
    setShowViewModal(true)
  }

  const handleEditPackage = (pkg: any) => {
    // Extract eventId properly
    const eventId = typeof pkg.eventId === 'string' ? pkg.eventId : pkg.eventId?._id
    setSelectedPackage({
      _id: pkg._id,
      eventId: eventId,
      name: pkg.name,
      description: pkg.description,
      basePrice: pkg.basePrice,
      maxTravelers: pkg.maxTravelers,
      features: pkg.features,
      tier: pkg.tier
    })
    setModalMode('edit')
    setShowPackageModal(true)
  }

  const handleDeletePackage = (pkg: any) => {
    setSelectedPackage(pkg)
    setShowDeleteModal(true)
  }

  const handleSavePackage = async (data: any) => {
    try {
      let response;
      if (modalMode === 'create') {
        response = await packagesApi.create(data);
      } else {
        response = await packagesApi.update(selectedPackage._id, data);
      }

      if (response.success) {
        toast.success(response.message || `Package ${modalMode === 'create' ? 'created' : 'updated'} successfully`)
        fetchPackages()
        setShowPackageModal(false)
      } else {
        toast.error(response.message || 'Operation failed')
      }
    } catch (error) {
      console.error('Error saving package:', error)
      toast.error('Failed to save package')
    }
  }

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await packagesApi.delete(selectedPackage._id)
      
      if (response.success) {
        toast.success('Package deleted successfully')
        fetchPackages()
        setShowDeleteModal(false)
      } else {
        toast.error(response.message || 'Failed to delete package')
      }
    } catch (error) {
      console.error('Error deleting package:', error)
      toast.error('Failed to delete package')
    } finally {
      setIsDeleting(false)
    }
  }

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

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Packages Management</h1>
            <p className="text-gray-600 mt-1">Create and manage travel packages for events</p>
          </div>
          <button 
            onClick={handleCreatePackage}
            className="px-4 py-2.5 bg-linear-to-r from-[#FF4D00] to-[#FF6B00] text-white rounded-lg font-medium hover:from-[#E64500] hover:to-[#E65F00] transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Package
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search packages by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent"
              />
            </div>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent bg-white"
            >
              <option value="all">All Tiers</option>
              <option value="Premium">Premium</option>
              <option value="Standard">Standard</option>
              <option value="Basic">Basic</option>
              <option value="Economy">Economy</option>
            </select>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4D00] mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading packages...</p>
            </div>
          ) : packages.length > 0 ? (
            packages.map((pkg) => (
              <div key={pkg._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
              {/* Package Header */}
              <div className={`bg-linear-to-r ${getTierColor(pkg.tier)} p-6 text-white relative`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getTierBadgeColor(pkg.tier)} bg-white/90`}>
                      {pkg.tier}
                    </span>
                  </div>
                  <PackageIcon className="w-8 h-8 opacity-50" />
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">₹{pkg.basePrice.toLocaleString('en-IN')}</span>
                    <span className="text-sm opacity-90">/ person</span>
                  </div>
                </div>
              </div>

              {/* Package Details */}
              <div className="p-6">
                {/* Event Badge - Always required */}
                <div className="mb-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-[#FF4D00]" />
                    <span className="font-medium text-gray-700">Event:</span>
                    <span className="text-gray-600">{pkg.eventId?.name || 'Unknown Event'}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>

                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>Max {pkg.maxTravelers} travelers</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4" />
                  </div>
                </div>

                {/* Features */}
                <div className="mb-5">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Package Includes:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {pkg.features && pkg.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button onClick={() => handleViewPackage(pkg)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button 
                    onClick={() => handleEditPackage(pkg)}
                    className="flex-1 px-3 py-2 bg-linear-to-r from-[#FF4D00] to-[#FF6B00] text-white rounded-lg hover:from-[#E64500] hover:to-[#E65F00] transition-all text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeletePackage(pkg)}
                    className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )))
          : (
            <div className="col-span-full p-12 text-center">
              <PackageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No packages found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || tierFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Get started by creating your first package'}
              </p>
              {!searchTerm && tierFilter === 'all' && (
                <button
                  onClick={handleCreatePackage}
                  className="px-6 py-2.5 bg-linear-to-r from-[#FF4D00] to-[#FF6B00] text-white rounded-lg font-medium hover:from-[#E64500] hover:to-[#E65F00] transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add New Package
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <PackageModal
        isOpen={showPackageModal}
        onClose={() => setShowPackageModal(false)}
        onSave={handleSavePackage}
        packageData={selectedPackage}
        events={events}
        packages={packages}
        mode={modalMode}
      />

      <PackageViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        packageData={selectedPackage}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Package"
        message={`Are you sure you want to delete "${selectedPackage?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}
