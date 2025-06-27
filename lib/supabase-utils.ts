import { supabase } from './supabase'
import type { Database } from './supabase'

// Type helpers
export type User = Database['public']['Tables']['users']['Row']
export type Property = Database['public']['Tables']['properties']['Row']
export type Tenant = Database['public']['Tables']['tenants']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
export type Maintenance = Database['public']['Tables']['maintenance']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type Vendor = Database['public']['Tables']['vendors']['Row']

// Authentication utilities
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string, userData: {
    first_name: string
    last_name: string
    phone?: string
    role?: 'LANDLORD' | 'TENANT' | 'ADMIN'
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    if (error) throw error
    return data
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Get current user profile
  getCurrentUserProfile: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    if (!user) return null

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) throw profileError
    return profile
  },

  // Update user profile
  updateProfile: async (updates: Partial<User>) => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    if (!user) throw new Error('No user found')

    const { data, error: updateError } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (updateError) throw updateError
    return data
  }
}

// Property utilities
export const properties = {
  // Get all properties for current user
  getAll: async () => {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        tenants (*),
        maintenance (
          *,
          tenant:tenants (*)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get single property
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        tenants (*),
        maintenance (*),
        payments (
          *,
          tenant:tenants (*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Create new property
  create: async (propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('properties')
      .insert(propertyData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update property
  update: async (id: string, updates: Partial<Property>) => {
    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete property
  delete: async (id: string) => {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Tenant utilities
export const tenants = {
  // Get all tenants for current user
  getAll: async () => {
    const { data, error } = await supabase
      .from('tenants')
      .select(`
        *,
        property:properties (*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get tenant by ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('tenants')
      .select(`
        *,
        property:properties (*),
        payments (*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Create new tenant
  create: async (tenantData: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('tenants')
      .insert(tenantData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update tenant
  update: async (id: string, updates: Partial<Tenant>) => {
    const { data, error } = await supabase
      .from('tenants')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete tenant
  delete: async (id: string) => {
    const { error } = await supabase
      .from('tenants')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Payment utilities
export const payments = {
  // Get all payments for current user
  getAll: async () => {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        tenant:tenants (*),
        property:properties (*)
      `)
      .order('due_date', { ascending: false })

    if (error) throw error
    return data
  },

  // Get payments by status
  getByStatus: async (status: Payment['status']) => {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        tenant:tenants (*),
        property:properties (*)
      `)
      .eq('status', status)
      .order('due_date', { ascending: false })

    if (error) throw error
    return data
  },

  // Create new payment
  create: async (paymentData: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('payments')
      .insert(paymentData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update payment status
  updateStatus: async (id: string, status: Payment['status'], paidDate?: string) => {
    const updates: Partial<Payment> = { status }
    if (paidDate) updates.paid_date = paidDate

    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Maintenance utilities
export const maintenance = {
  // Get all maintenance requests for current user
  getAll: async () => {
    const { data, error } = await supabase
      .from('maintenance')
      .select(`
        *,
        property:properties (*),
        tenant:tenants (*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get maintenance by status
  getByStatus: async (status: Maintenance['status']) => {
    const { data, error } = await supabase
      .from('maintenance')
      .select(`
        *,
        property:properties (*),
        tenant:tenants (*)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Create new maintenance request
  create: async (maintenanceData: Omit<Maintenance, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('maintenance')
      .insert(maintenanceData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update maintenance request
  update: async (id: string, updates: Partial<Maintenance>) => {
    const { data, error } = await supabase
      .from('maintenance')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Notification utilities
export const notifications = {
  // Get all notifications for current user
  getAll: async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get unread notifications
  getUnread: async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('is_read', false)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Mark notification as read
  markAsRead: async (id: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })

    if (error) throw error
  }
}

// Vendor utilities
export const vendors = {
  // Get all vendors
  getAll: async () => {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return data
  },

  // Get vendors by service
  getByService: async (service: string) => {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .contains('services', [service])
      .order('rating', { ascending: false })

    if (error) throw error
    return data
  }
}

// Real-time subscriptions
export const subscriptions = {
  // Subscribe to property changes
  onPropertyChange: (callback: (payload: any) => void) => {
    return supabase
      .channel('properties')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, callback)
      .subscribe()
  },

  // Subscribe to payment changes
  onPaymentChange: (callback: (payload: any) => void) => {
    return supabase
      .channel('payments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, callback)
      .subscribe()
  },

  // Subscribe to maintenance changes
  onMaintenanceChange: (callback: (payload: any) => void) => {
    return supabase
      .channel('maintenance')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'maintenance' }, callback)
      .subscribe()
  },

  // Subscribe to notification changes
  onNotificationChange: (callback: (payload: any) => void) => {
    return supabase
      .channel('notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, callback)
      .subscribe()
  }
} 