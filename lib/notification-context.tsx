'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { setNotificationContext } from './notification-utils'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number
}

interface NotificationContextType {
  notifications: Notification[]
  showNotification: (notification: Omit<Notification, 'id'>) => void
  hideNotification: (id: string) => void
  clearAllNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification = { ...notification, id }
    
    setNotifications(prev => [...prev, newNotification])

    // Auto-hide after duration (default 5 seconds)
    const duration = notification.duration || 5000
    if (duration > 0) {
      setTimeout(() => {
        hideNotification(id)
      }, duration)
    }
  }, [])

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  // Expose the context to utility functions
  useEffect(() => {
    setNotificationContext({
      showNotification,
      hideNotification,
      clearAllNotifications
    })
  }, [showNotification, hideNotification, clearAllNotifications])

  return (
    <NotificationContext.Provider value={{
      notifications,
      showNotification,
      hideNotification,
      clearAllNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
} 