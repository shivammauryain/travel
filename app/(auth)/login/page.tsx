'use client'

import { useState, FormEvent, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Trophy, Mail, Lock, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { validateEmail, validateRequired } from '@/lib/validation'
import toast from 'react-hot-toast'

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Pre-fill form with URL parameters
  useEffect(() => {
    const emailParam = searchParams.get('email')
    const passwordParam = searchParams.get('password')

    if (emailParam || passwordParam) {
      setFormData({
        email: emailParam || '',
        password: passwordParam || '',
      })

      if (emailParam && passwordParam) {
        toast.success('Demo credentials loaded!')
      }
    }
  }, [searchParams])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    const emailValidation = validateEmail(formData.email)
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error
    }

    const passwordValidation = validateRequired(formData.password, 'Password')
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
      const userData = await login(formData.email, formData.password)
      toast.success('Login successful!')

      // Redirect based on user role
      if (userData.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/user')
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Invalid email or password'
      setErrors({ general: errorMessage })
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleBackHome = () => {
    router.push('/')
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#FF4D00] via-[#FF6B00] to-[#FF8500] overflow-hidden fixed left-0 top-0 bottom-0">
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
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
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
            Your Gateway to Unforgettable Sports Experiences
          </p>

          {/* Feature List */}
          <div className="space-y-4 w-full max-w-md">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <div className="w-2 h-2 bg-white rounded-full mt-2" />
              <p className="text-white/90">
                Exclusive access to premium sports events worldwide
              </p>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <div className="w-2 h-2 bg-white rounded-full mt-2" />
              <p className="text-white/90">
                Curated travel packages for sports enthusiasts
              </p>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <div className="w-2 h-2 bg-white rounded-full mt-2" />
              <p className="text-white/90">
                VIP experiences and behind-the-scenes access
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 lg:ml-[50%] px-6 py-8 sm:py-10 bg-white overflow-y-auto">
        <div className="w-full max-w-md mx-auto min-h-full flex flex-col justify-center">
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
              <div className="px-4 py-2 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF4D00] to-[#FF6B00] shadow-lg">
                <Trophy className="w-5 h-5 text-white" />
                <h1 className="text-base sm:text-lg font-bold text-white">
                  SPORTS
                </h1>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900">
                TRAVEL
              </h1>
            </div>
          </div>

          {/* Desktop Logo already on left, so only show small logo if needed */}
          {/* Form Header */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Sign in to access your admin dashboard
            </p>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm text-red-800">{errors.general}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
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
                  placeholder="admin@example.com"
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
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
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#FF4D00] to-[#FF6B00] text-white py-3 px-4 rounded-lg font-medium 
                         hover:from-[#E64500] hover:to-[#E65F00] focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl
                         flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-[#FF4D00] hover:text-[#E64500] font-medium transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              Admin access only. Unauthorized access attempts will be logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF4D00] mx-auto mb-2" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
