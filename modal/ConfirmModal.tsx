'use client'

import React from 'react'
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react'
import Modal from './Modal'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false
}: ConfirmModalProps) {
  
  const handleConfirm = async () => {
    await onConfirm()
    if (!isLoading) {
      onClose()
    }
  }

  const variantStyles = {
    danger: {
      icon: <Trash2 className="w-12 h-12 text-red-600" />,
      iconBg: 'bg-red-100',
      confirmBtn: 'bg-red-600 hover:bg-red-700 text-white'
    },
    warning: {
      icon: <AlertTriangle className="w-12 h-12 text-yellow-600" />,
      iconBg: 'bg-yellow-100',
      confirmBtn: 'bg-yellow-600 hover:bg-yellow-700 text-white'
    },
    info: {
      icon: <AlertTriangle className="w-12 h-12 text-blue-600" />,
      iconBg: 'bg-blue-100',
      confirmBtn: 'bg-blue-600 hover:bg-blue-700 text-white'
    }
  }

  const currentVariant = variantStyles[variant]

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="text-center">
        {/* Icon */}
        <div className={`mx-auto w-16 h-16 ${currentVariant.iconBg} rounded-full flex items-center justify-center mb-4`}>
          {currentVariant.icon}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>

        {/* Message */}
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${currentVariant.confirmBtn}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}
