'use client'

import { useEffect, useState } from 'react'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { Notification as NotificationType } from '@/lib/notification-context'

interface NotificationProps {
  notification: NotificationType
  onClose: (id: string) => void
}

const iconMap = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
}

const colorMap = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: 'text-green-400',
    close: 'text-green-400 hover:text-green-600'
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: 'text-red-400',
    close: 'text-red-400 hover:text-red-600'
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: 'text-yellow-400',
    close: 'text-yellow-400 hover:text-yellow-600'
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'text-blue-400',
    close: 'text-blue-400 hover:text-blue-600'
  },
}

export default function Notification({ notification, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  const Icon = iconMap[notification.type]
  const colors = colorMap[notification.type]

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => onClose(notification.id), 300)
  }

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className={`
        ${colors.bg} ${colors.border} border rounded-lg shadow-lg p-4
        flex items-start space-x-3
      `}>
        <Icon className={`h-5 w-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
        
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-medium ${colors.text}`}>
            {notification.title}
          </h3>
          {notification.message && (
            <p className={`mt-1 text-sm ${colors.text} opacity-90`}>
              {notification.message}
            </p>
          )}
        </div>

        <button
          onClick={handleClose}
          className={`
            ${colors.close} flex-shrink-0 h-5 w-5
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
            rounded-full transition-colors duration-200
          `}
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
} 