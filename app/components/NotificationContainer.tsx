'use client'

import { useNotification } from '@/lib/notification-context'
import Notification from './Notification'

export default function NotificationContainer() {
  const { notifications, hideNotification } = useNotification()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={hideNotification}
        />
      ))}
    </div>
  )
} 