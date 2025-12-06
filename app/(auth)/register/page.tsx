'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trophy, Mail, Lock, User, AlertCircle, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import { validateEmail, validatePassword, validateName, getPasswordStrength } from '@/lib/validation'
import { authApi } from '@/lib/api'
import toast from 'react-hot-toast'

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  general?: string;
}

export default function RegisterPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak')

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    const nameValidation = validateName(formData.name)
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error
    }

    const emailValidation = validateEmail(formData.email)
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error
    }

    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await authApi.register(formData)
      toast.success('Account created successfully! Please login.')
      router.push('/login')
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create account'
      setErrors({ general: errorMessage })
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Update password strength indicator
    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value))
    }

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'strong': return 'bg-green-500'
    }
  }

  const getStrengthWidth = () => {
    switch (passwordStrength) {
      case 'weak': return 'w-1/3'
      case 'medium': return 'w-2/3'
      case 'strong': return 'w-full'
    }
  }

  const handleBackHome = () => {
    router.push('/')
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#FF4D00] via-[#FF6B00] to-[#FF8500] overflow-hidden fixed left-0 top-0 bottom-0">
        {/* Back to Home Button (Desktop) */}
        <div className="absolute top-6 left-6 z-50">
          <button
            type="button"
            onClick={handleBackHome}
            className="inline-flex items-center text-sm text-gray-800 bg-white/80 px-3 py-1.5 rounded-full hover:bg-white transition-all shadow-sm cursor-pointer hover:shadow-md"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </button>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-white">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="px-5 py-3 rounded-2xl flex items-center gap-2 bg-white/20 backdrop-blur-sm shadow-2xl">
              <Trophy className="w-10 h-10 text-white" />
              <h1 className="text-4xl font-bold tracking-tight">SPORTS</h1>
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">TRAVEL</h1>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-2xl font-light text-center mb-12 text-white/95 max-w-md">
            Join the Ultimate Sports Travel Community
          </p>

          {/* Feature List */}
          <div className="space-y-4 w-full max-w-md">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <CheckCircle2 className="w-6 h-6 text-white shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white mb-1">Exclusive Access</h3>
                <p className="text-white/80 text-sm">Premium sports events and VIP experiences worldwide</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <CheckCircle2 className="w-6 h-6 text-white shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white mb-1">Curated Packages</h3>
                <p className="text-white/80 text-sm">Tailored travel experiences for sports enthusiasts</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <CheckCircle2 className="w-6 h-6 text-white shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white mb-1">VIP Treatment</h3>
                <p className="text-white/80 text-sm">Behind-the-scenes access and luxury accommodations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 lg:ml-[50%] px-6 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md mx-auto my-auto min-h-full flex flex-col justify-center">

          {/* Mobile Back to Home + Logo */}
          <div className="lg:hidden mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBackHome}
              className="inline-flex items-center text-sm text-gray-700 hover:text-gray-900 cursor-pointer transition-colors"
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Home
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <div className="px-4 py-2 flex items-center gap-2 rounded-xl bg-linear-to-r from-[#FF4D00] to-[#FF6B00] shadow-lg">
                <Trophy className="w-6 h-6 text-white" />
                <h1 className="text-xl sm:text-2xl font-bold text-white">SPORTS</h1>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">TRAVEL</h1>
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-sm sm:text-base text-gray-600">Join us to access exclusive sports travel experiences</p>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm text-red-800">{errors.general}</p>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.name 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:border-[#FF4D00] focus:ring-orange-100'
                  }`}
                  placeholder="John Doe"
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:border-[#FF4D00] focus:ring-orange-100'
                  }`}
                  placeholder="john@example.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:border-[#FF4D00] focus:ring-orange-100'
                  }`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Password strength:</span>
                    <span className={`text-xs font-medium capitalize ${
                      passwordStrength === 'weak' ? 'text-red-600' :
                      passwordStrength === 'medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {passwordStrength}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${getStrengthColor()} ${getStrengthWidth()} transition-all duration-300`}></div>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}

              {/* Password Requirements */}
              {!errors.password && formData.password && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-500">Password must contain:</p>
                  <ul className="text-xs text-gray-500 space-y-0.5 ml-3">
                    <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>• At least 8 characters</li>
                    <li className={/(?=.*[a-z])/.test(formData.password) ? 'text-green-600' : ''}>• One lowercase letter</li>
                    <li className={/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : ''}>• One uppercase letter</li>
                    <li className={/(?=.*\d)/.test(formData.password) ? 'text-green-600' : ''}>• One number</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-[#FF4D00] to-[#FF6B00] text-white py-3 px-4 rounded-lg font-medium 
                         hover:from-[#E64500] hover:to-[#E65F00] focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl
                         flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="text-[#FF4D00] hover:text-[#E64500] font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Terms */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
