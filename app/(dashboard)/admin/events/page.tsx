'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, Plus, Calendar, MapPin, Edit, Trash2, Eye, Trophy, Star } from 'lucide-react'
import { EventModal, EventViewModal, ConfirmModal, PackageModal } from '@/modal'
import { eventsApi, packagesApi } from '@/src/lib/api'
import toast from 'react-hot-toast'

interface Event {
  _id: string
  name: string
  description: string
  location: string
  startDate: string
  endDate: string
  category: string
  featured?: boolean
  imageUrl?: string
}

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showEventModal, setShowEventModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showPackageModal, setShowPackageModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [preSelectedEventId, setPreSelectedEventId] = useState<string>('')
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [events, setEvents] = useState<Event[]>([])
  const [packages, setPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchEvents()
    fetchPackages()
  }, [categoryFilter, searchTerm])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await eventsApi.getAll({
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        search: searchTerm || undefined
      })
      if (response.success) {
        setEvents(response.data || [])
      } else {
        toast.error(response.message || 'Failed to fetch events')
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      toast.error('Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvent = () => {
    setSelectedEvent(null)
    setModalMode('create')
    setShowEventModal(true)
  }

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event)
    setShowViewModal(true)
  }

  const handleAddPackageFromEvent = (eventId: string) => {
    // Close view modal and open package modal with event pre-selected
    setShowViewModal(false)
    setPreSelectedEventId(eventId)
    setShowPackageModal(true)
  }

  const handleSavePackage = async (data: any) => {
    try {
      const response = await packagesApi.create(data)
      if (response.success) {
        toast.success(response.message || 'Package created successfully')
        setShowPackageModal(false)
        setPreSelectedEventId('')
        // Optionally refresh packages list
        fetchPackages()
      } else {
        toast.error(response.message || 'Failed to create package')
      }
    } catch (error) {
      console.error('Error saving package:', error)
      toast.error('Failed to save package')
    }
  }

  const fetchPackages = async () => {
    try {
      const response = await packagesApi.getAll()
      if (response.success) {
        setPackages(response.data || [])
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
    }
  }

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event)
    setModalMode('edit')
    setShowEventModal(true)
  }

  const handleDeleteEvent = (event: Event) => {
    setSelectedEvent(event)
    setShowDeleteModal(true)
  }

  const handleSaveEvent = async (data: any) => {
    try {
      let response
      if (modalMode === 'create') {
        response = await eventsApi.create(data)
      } else {
        response = await eventsApi.update(selectedEvent!._id, data)
      }
      if (response.success) {
        toast.success(response.message)
        fetchEvents()
        setShowEventModal(false)
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error('Failed to save event')
    }
  }

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await eventsApi.delete(selectedEvent!._id)
      if (response.success) {
        toast.success('Event deleted successfully')
        fetchEvents()
        setShowDeleteModal(false)
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error('Failed to delete event')
    } finally {
      setIsDeleting(false)
    }
  }

  const categories = ['All', 'Cricket', 'Football', 'Tennis', 'F1', 'Other']
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Cricket': return 'bg-blue-100 text-blue-700'
      case 'Football': return 'bg-green-100 text-green-700'
      case 'Tennis': return 'bg-yellow-100 text-yellow-700'
      case 'F1': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
            <p className="text-gray-600 mt-1">Manage all sports events and tournaments</p>
          </div>
          <button onClick={handleCreateEvent} className="px-4 py-2.5 bg-linear-to-r from-[#FF4D00] to-[#FF6B00] text-white rounded-lg font-medium hover:from-[#E64500] hover:to-[#E65F00] transition-all shadow-md hover:shadow-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />Add New Event
          </button>
        </div>
        
        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00]" />
            </div>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white">
              {categories.map(cat => <option key={cat} value={cat.toLowerCase()}>{cat}</option>)}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4D00] mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading...</p>
            </div>
          ) : events.length > 0 ? events.map(event => (
            <div key={event._id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-linear-to-br from-[#FF4D00] to-[#FF6B00] relative flex items-center justify-center">
                <Trophy className="w-16 h-16 text-white opacity-50" />
                {event.featured && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-amber-400 text-amber-900 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />Featured
                  </span>
                )}
                <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>{event.category}</span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold mb-2">{event.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />{event.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />{formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </div>
                </div>
                <div className="flex gap-2 pt-4 border-t">
                  <button onClick={() => handleViewEvent(event)} className="flex-1 px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />View
                  </button>
                  <button onClick={() => handleEditEvent(event)} className="flex-1 px-3 py-2 bg-linear-to-r from-[#FF4D00] to-[#FF6B00] text-white rounded-lg text-sm flex items-center justify-center gap-2">
                    <Edit className="w-4 h-4" />Edit
                  </button>
                  <button onClick={() => handleDeleteEvent(event)} className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No events found</h3>
              <p className="text-gray-600 mb-6">{searchTerm || categoryFilter !== 'all' ? 'Try adjusting filters' : 'Create your first event'}</p>
              {!searchTerm && categoryFilter === 'all' && (
                <button onClick={handleCreateEvent} className="px-6 py-2.5 bg-linear-to-r from-[#FF4D00] to-[#FF6B00] text-white rounded-lg inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" />Add Event
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <EventModal 
        isOpen={showEventModal} 
        onClose={() => setShowEventModal(false)} 
        onSave={handleSaveEvent} 
        event={selectedEvent ? { ...selectedEvent, id: selectedEvent._id } : undefined} 
        mode={modalMode} 
      />
      <EventViewModal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)} 
        event={selectedEvent}
        onAddPackage={handleAddPackageFromEvent}
      />
      <PackageModal
        isOpen={showPackageModal}
        onClose={() => {
          setShowPackageModal(false)
          setPreSelectedEventId('')
        }}
        onSave={handleSavePackage}
        packageData={preSelectedEventId ? { eventId: preSelectedEventId } as any : undefined}
        events={events}
        packages={packages}
        mode="create"
      />
      <ConfirmModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleConfirmDelete} title="Delete Event" message={`Delete "${selectedEvent?.name}"?`} confirmText="Delete" variant="danger" isLoading={isDeleting} />
    </div>
  )
}
