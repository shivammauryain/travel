'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Loader2, Trophy } from 'lucide-react'
import Modal from '../Modal'
import toast from 'react-hot-toast'

interface EventFormData {
  name: string
  description: string
  location: string
  startDate: string
  endDate: string
  category: string
  featured?: boolean
  imageUrl?: string
}

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: EventFormData) => void | Promise<void>
  event?: EventFormData & { id?: string | number }
  mode?: 'create' | 'edit'
}

export default function EventModal({
  isOpen,
  onClose,
  onSave,
  event,
  mode = 'create'
}: EventModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<EventFormData>({
    name: event?.name || '',
    description: event?.description || '',
    location: event?.location || '',
    startDate: event?.startDate || '',
    endDate: event?.endDate || '',
    category: event?.category || 'Cricket',
    featured: event?.featured || false,
    imageUrl: event?.imageUrl || ''
  })

  // Update form data when event prop changes (for edit mode)
  useEffect(() => {
    if (event && mode === 'edit') {
      setFormData({
        name: event.name || '',
        description: event.description || '',
        location: event.location || '',
        startDate: event.startDate ? event.startDate.split('T')[0] : '',
        endDate: event.endDate ? event.endDate.split('T')[0] : '',
        category: event.category || 'Cricket',
        featured: event.featured || false,
        imageUrl: event.imageUrl || ''
      })
    } else if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        location: '',
        startDate: '',
        endDate: '',
        category: 'Cricket',
        featured: false,
        imageUrl: ''
      })
    }
  }, [event, mode])

  const categories = ['Cricket', 'Football', 'Tennis', 'F1', 'Other']

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.location || !formData.startDate || !formData.endDate) {
      toast.error('Please fill in all required fields')
      return
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast.error('End date must be after start date')
      return
    }

    setIsLoading(true)
    try {
      await onSave(formData)
      // Toast message will be shown by parent component
      
      // Reset form if creating new event
      if (mode === 'create') {
        setFormData({
          name: '',
          description: '',
          location: '',
          startDate: '',
          endDate: '',
          category: 'Cricket',
          featured: false,
          imageUrl: ''
        })
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
      title={mode === 'create' ? 'Create New Event' : 'Edit Event'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Event Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent"
            placeholder="e.g., Cricket World Cup 2024"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent resize-none"
            placeholder="Brief description of the event..."
          />
        </div>

        {/* Location and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1 text-gray-400" />
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent"
              placeholder="e.g., Mumbai, India"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Trophy className="w-4 h-4 inline mr-1 text-gray-400" />
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent bg-white"
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1 text-gray-400" />
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1 text-gray-400" />
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <input
            type="checkbox"
            name="featured"
            id="featured"
            checked={formData.featured || false}
            onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
            className="w-4 h-4 text-[#FF4D00] border-gray-300 rounded focus:ring-[#FF4D00]"
          />
          <label htmlFor="featured" className="flex-1 cursor-pointer">
            <span className="text-sm font-medium text-gray-900">Mark as Featured Event</span>
            <p className="text-xs text-gray-600 mt-0.5">Featured events will be highlighted on the homepage</p>
          </label>
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
              mode === 'create' ? 'Create Event' : 'Update Event'
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}
