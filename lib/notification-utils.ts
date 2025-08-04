import { NotificationType } from './notification-context'

// This will be used to store the notification context
let notificationContext: any = null

export const setNotificationContext = (context: any) => {
  notificationContext = context
}

export const showNotification = (
  type: NotificationType,
  title: string,
  message?: string,
  duration?: number
) => {
  if (notificationContext) {
    notificationContext.showNotification({
      type,
      title,
      message,
      duration
    })
  }
}

// Convenience functions for different notification types
export const showSuccess = (title: string, message?: string, duration?: number) => {
  showNotification('success', title, message, duration)
}

export const showError = (title: string, message?: string, duration?: number) => {
  showNotification('error', title, message, duration)
}

export const showWarning = (title: string, message?: string, duration?: number) => {
  showNotification('warning', title, message, duration)
}

export const showInfo = (title: string, message?: string, duration?: number) => {
  showNotification('info', title, message, duration)
}

// Common notification messages
export const notifications = {
  // Success messages
  tenantCreated: () => showSuccess(
    'Tenant Invitation Sent',
    'The tenant invitation has been sent successfully. The tenant will receive an email to verify and create their account.'
  ),
  propertyCreated: () => showSuccess(
    'Property Created',
    'The property has been created successfully.'
  ),
  unitCreated: () => showSuccess(
    'Unit Created',
    'The unit has been created successfully.'
  ),
  maintenanceRequestCreated: () => showSuccess(
    'Maintenance Request Created',
    'The maintenance request has been created successfully.'
  ),
  paymentRecorded: () => showSuccess(
    'Payment Recorded',
    'The payment has been recorded successfully.'
  ),
  statusUpdated: (item: string, status: string) => showSuccess(
    `${item} Updated`,
    `The ${item.toLowerCase()} has been marked as ${status.toLowerCase()}.`
  ),

  // Error messages
  genericError: (action: string) => showError(
    'Error',
    `An error occurred while ${action}. Please try again.`
  ),
  networkError: () => showError(
    'Network Error',
    'Unable to connect to the server. Please check your internet connection and try again.'
  ),
  validationError: (message: string) => showError(
    'Validation Error',
    message
  ),
  permissionError: () => showError(
    'Permission Denied',
    'You do not have permission to perform this action.'
  ),

  // Warning messages
  incompleteForm: () => showWarning(
    'Incomplete Form',
    'Please fill in all required fields before submitting.'
  ),
  unsavedChanges: () => showWarning(
    'Unsaved Changes',
    'You have unsaved changes. Are you sure you want to leave?'
  ),

  // Info messages
  loading: (action: string) => showInfo(
    'Loading',
    `${action}...`
  ),
  processing: (action: string) => showInfo(
    'Processing',
    `Please wait while we ${action}...`
  ),
} 