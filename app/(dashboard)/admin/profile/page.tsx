'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Camera,
  Save,
  Shield
} from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Banner */}
          <div className="h-32 bg-linear-to-r from-[#FF4D00] to-[#FF6B00] relative">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-white flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-linear-to-r from-[#FF4D00] to-[#FF6B00] flex items-center justify-center text-white text-4xl font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg border-2 border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Camera className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'Admin User'}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                    <Shield className="w-3 h-3 mr-1" />
                    Administrator
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                    Active
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2 text-gray-400" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    defaultValue={user?.email || 'admin@sportstravel.com'}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{user?.email || 'admin@sportstravel.com'}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2 text-gray-400" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    defaultValue="+1 234 567 8900"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">+1 234 567 8900</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2 text-gray-400" />
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    defaultValue="New York, USA"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">New York, USA</p>
                )}
              </div>

              {/* Join Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2 text-gray-400" />
                  Member Since
                </label>
                <p className="text-gray-900">December 2024</p>
              </div>

              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2 text-gray-400" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    defaultValue={user?.name || 'Admin User'}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{user?.name || 'Admin User'}</p>
                )}
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    rows={4}
                    defaultValue="Sports travel enthusiast and administrator with passion for creating memorable experiences."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent resize-none"
                  />
                ) : (
                  <p className="text-gray-900">Sports travel enthusiast and administrator with passion for creating memorable experiences.</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                <button className="px-6 py-2.5 bg-linear-to-r from-[#FF4D00] to-[#FF6B00] text-white rounded-lg font-medium hover:from-[#E64500] hover:to-[#E65F00] transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Leads</h3>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">156</p>
            <p className="text-sm text-green-600 mt-1">+12% from last month</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Quotes Sent</h3>
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">87</p>
            <p className="text-sm text-green-600 mt-1">+8% from last month</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Conversion Rate</h3>
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">32.5%</p>
            <p className="text-sm text-green-600 mt-1">+3% from last month</p>
          </div>
        </div>
      </div>
    </div>
  )
}
