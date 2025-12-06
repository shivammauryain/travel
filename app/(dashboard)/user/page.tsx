'use client'

import React, { useState } from 'react'
import { ShieldAlert, Copy, Check, Trophy, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import ProtectedRoute from '@/components/routes/ProtectedRoute'

function UserDashboard() {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const demoCredentials = {
    email: 'admin@sportstravel.com',
    password: 'Admin@123'
  }

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      toast.success(`${field} copied to clipboard!`)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      toast.error('Failed to copy')
    }
  }

  return (
    <ProtectedRoute requiredRole="user">
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with Icon */}
          <div className="bg-linear-to-r from-[#FF4D00] to-[#FF6B00] px-6 sm:px-8 py-8 sm:py-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Account Pending Approval</h1>
            <p className="text-white/90 text-sm sm:text-base max-w-md mx-auto">
              Your account is waiting for admin activation
            </p>
          </div>

          {/* Content */}
          <div className="px-6 sm:px-8 py-8 sm:py-10">
            {/* Status Message */}
            <div className="mb-8">
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900 mb-1">Access Restricted</h3>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Your account has been created successfully, but you don't have admin access yet. 
                    Please contact the super admin to activate your account. Once activated, you'll have 
                    full access to all features.
                  </p>
                </div>
              </div>
            </div>

            {/* Demo Credentials Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-[#FF4D00]" />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Demo Admin Credentials</h2>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">
                Use these credentials to explore the admin dashboard with full access:
              </p>

              {/* Email Credential */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <div className="flex gap-2">
                  <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm text-gray-900">
                    {demoCredentials.email}
                  </div>
                  <button
                    onClick={() => handleCopy(demoCredentials.email, 'Email')}
                    className="px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 group"
                    title="Copy email"
                  >
                    {copiedField === 'Email' ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-600 group-hover:text-[#FF4D00]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Credential */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="flex gap-2">
                  <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm text-gray-900">
                    {demoCredentials.password}
                  </div>
                  <button
                    onClick={() => handleCopy(demoCredentials.password, 'Password')}
                    className="px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 group"
                    title="Copy password"
                  >
                    {copiedField === 'Password' ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-600 group-hover:text-[#FF4D00]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6">
                <a
                  href={`/login?email=${encodeURIComponent(demoCredentials.email)}&password=${encodeURIComponent(demoCredentials.password)}`}
                  className="w-full block text-center bg-linear-to-r from-[#FF4D00] to-[#FF6B00] text-white py-3 px-6 rounded-lg font-medium 
                           hover:from-[#E64500] hover:to-[#E65F00] focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:ring-offset-2
                           transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Login with Demo Account
                </a>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                Need help? Contact the administrator at{' '}
                <a href="mailto:admin@sportstravel.com" className="text-[#FF4D00] hover:underline">
                  admin@sportstravel.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  )
}

export default UserDashboard
