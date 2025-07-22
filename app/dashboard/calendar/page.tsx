'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { payments, maintenance } from '@/lib/supabase-utils'
import DashboardNav from '@/app/components/DashboardNav'
import { 
  PlusIcon, 
  CalendarIcon, 
  WrenchScrewdriverIcon, 
  CurrencyDollarIcon, 
  ExclamationTriangleIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

interface CalendarEvent {
  id: string
  title: string
  type: 'maintenance' | 'payment' | 'inspection' | 'lease'
  date: string
  time?: string
  description?: string
  priority?: string
  status?: string
  property?: {
    name: string
  }
  tenant?: {
    first_name: string
    last_name: string
  }
}

export default function CalendarPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    if (user) {
      fetchEvents()
    }
  }, [user])

  const fetchEvents = async () => {
    try {
      // Fetch payments and maintenance data to create calendar events
      const [paymentsData, maintenanceData] = await Promise.all([
        payments.getAll(),
        maintenance.getAll()
      ])

      const calendarEvents: CalendarEvent[] = []

      // Convert payments to calendar events
      paymentsData.forEach(payment => {
        calendarEvents.push({
          id: `payment-${payment.id}`,
          title: `Rent Due - ${payment.unit?.property?.name || 'Property'}`,
          type: 'payment',
          date: payment.due_date,
          time: '09:00',
          description: `Monthly rent payment due: $${payment.amount}`,
          status: payment.status.toLowerCase(),
          property: payment.unit?.property,
          tenant: payment.tenant
        })
      })

      // Convert maintenance to calendar events
      maintenanceData.forEach(maintenance => {
        if (maintenance.scheduled_date) {
          calendarEvents.push({
            id: `maintenance-${maintenance.id}`,
            title: maintenance.title,
            type: 'maintenance',
            date: maintenance.scheduled_date,
            time: '14:00',
            description: maintenance.description,
            priority: maintenance.priority?.toLowerCase(),
            status: maintenance.status.toLowerCase(),
            property: maintenance.property
          })
        }
      })

      setEvents(calendarEvents)
    } catch (error) {
      console.error('Error fetching calendar events:', error)
      // Fallback to mock data if needed
      setEvents([
        {
          id: '1',
          title: 'Rent Due - Sunset Apartments',
          type: 'payment',
          date: new Date().toISOString().split('T')[0],
          time: '09:00',
          description: 'Monthly rent payment due',
          status: 'pending',
          property: { name: 'Sunset Apartments' },
          tenant: { first_name: 'John', last_name: 'Doe' }
        },
        {
          id: '2',
          title: 'HVAC Maintenance',
          type: 'maintenance',
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '14:00',
          description: 'Annual HVAC system inspection',
          priority: 'medium',
          status: 'scheduled',
          property: { name: 'Downtown Loft' }
        },
        {
          id: '3',
          title: 'Lease Renewal',
          type: 'lease',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '10:00',
          description: 'Lease renewal discussion',
          status: 'pending',
          property: { name: 'Garden Villa' },
          tenant: { first_name: 'Jane', last_name: 'Smith' }
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'maintenance':
        return <WrenchScrewdriverIcon className="h-4 w-4" />
      case 'payment':
        return <CurrencyDollarIcon className="h-4 w-4" />
      case 'inspection':
        return <ExclamationTriangleIcon className="h-4 w-4" />
      case 'lease':
        return <UserGroupIcon className="h-4 w-4" />
      default:
        return <CalendarIcon className="h-4 w-4" />
    }
  }

  const getEventColor = (type: string, priority?: string) => {
    if (priority === 'urgent') return 'bg-red-100 text-red-800 border-red-200'
    
    switch (type) {
      case 'maintenance':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'payment':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'inspection':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'lease':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />
      case 'scheduled':
        return <ClockIcon className="h-4 w-4 text-blue-600" />
      case 'pending':
        return <ClockIcon className="h-4 w-4 text-yellow-600" />
      default:
        return <ClockIcon className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (timeString?: string) => {
    if (!timeString) return ''
    return timeString
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    return { daysInMonth, startingDay }
  }

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return events.filter(event => event.date === dateString)
  }

  const { daysInMonth, startingDay } = getDaysInMonth(selectedDate)
  const monthName = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading calendar...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
              <p className="mt-2 text-gray-600">View scheduled events and maintenance</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard/calendar/new')}
                className="btn-primary flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Event
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Calendar Controls */}
        <div className="card mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  const newDate = new Date(selectedDate)
                  newDate.setMonth(newDate.getMonth() - 1)
                  setSelectedDate(newDate)
                }}
                className="btn-outline"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Previous
              </button>
              <h2 className="text-xl font-semibold text-gray-900">{monthName}</h2>
              <button
                onClick={() => {
                  const newDate = new Date(selectedDate)
                  newDate.setMonth(newDate.getMonth() + 1)
                  setSelectedDate(newDate)
                }}
                className="btn-outline"
              >
                Next
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="btn-secondary"
            >
              Today
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-gray-50 p-3 text-center">
                <span className="text-sm font-medium text-gray-700">{day}</span>
              </div>
            ))}

            {/* Empty cells for days before the first day of the month */}
            {Array.from({ length: startingDay }, (_, i) => (
              <div key={`empty-${i}`} className="bg-white min-h-[120px]"></div>
            ))}

            {/* Calendar days */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1
              const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day)
              const dayEvents = getEventsForDate(date)
              const isToday = date.toDateString() === new Date().toDateString()

              return (
                <div 
                  key={day} 
                  className={`bg-white min-h-[120px] p-2 ${
                    isToday ? 'bg-blue-50 border-2 border-blue-200' : ''
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded border ${getEventColor(event.type, event.priority)} cursor-pointer hover:opacity-80`}
                        onClick={() => {
                          // Handle event click
                          console.log('Event clicked:', event)
                        }}
                      >
                        <div className="flex items-center space-x-1">
                          {getEventIcon(event.type)}
                          <span className="truncate">{event.title}</span>
                        </div>
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {events
              .filter(event => new Date(event.date) >= new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 5)
              .map(event => (
                <div key={event.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <div className={`p-2 rounded-full ${getEventColor(event.type, event.priority)}`}>
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(event.status)}
                        <span className="text-xs text-gray-500">
                          {formatDate(event.date)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                    {event.property && (
                      <p className="text-xs text-gray-500 mt-1">
                        {event.property.name}
                        {event.tenant && ` • ${event.tenant.first_name} ${event.tenant.last_name}`}
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
} 