import { supabase } from './supabaseClient'
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
        data: userData,
        emailRedirectTo: typeof window !== 'undefined' ? window.location.origin + '/auth/callback' : undefined
      }
    })
    
    if (error) {
      console.error('Supabase signUp error:', error)
      throw new Error(error.message || 'Registration failed')
    }
    
    // Manually create user profile if auth signup succeeds
    if (data.user) {
      try {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            first_name: userData.first_name,
            last_name: userData.last_name,
            phone: userData.phone || null,
            role: userData.role || 'LANDLORD'
          })
        
        if (profileError) {
          console.error('Profile creation error:', profileError)
          // Don't throw here - auth succeeded, profile creation failed
          // User can still sign in and we can retry profile creation later
        } else {
          console.log('User profile created successfully')
        }
      } catch (profileError) {
        console.error('Profile creation failed:', profileError)
        // Don't throw here - auth succeeded, profile creation failed
      }
    }
    
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
  getUser: async () => {
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

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      // If profile doesn't exist, try to create it from auth user data
      if (profileError.code === 'PGRST116') { // No rows returned
        return await auth.createProfileFromAuthUser(user)
      }
      throw profileError
    }
    return profile
  },

  // Create profile from auth user data
  createProfileFromAuthUser: async (authUser: any) => {
    try {
      const userData = authUser.user_metadata || {}
      const { data: profile, error } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          email: authUser.email!,
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          phone: userData.phone || null,
          role: userData.role || 'LANDLORD'
        })
        .select()
        .single()

      if (error) {
        console.error('Profile creation from auth user failed:', error)
        return null
      }

      return profile
    } catch (error) {
      console.error('Profile creation from auth user error:', error)
      return null
    }
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
    // Get current user first
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        units (*),
        maintenance (*)
      `)
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get single property
  getById: async (id: string) => {
    // Get current user first
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        units (*),
        maintenance (*)
      `)
      .eq('id', id)
      .eq('owner_id', user.id)
      .single()

    if (error) throw error
    return data
  },

  // Create new property
  create: async (propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => {
    // Get current user first
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('properties')
      .insert({
        ...propertyData,
        owner_id: user.id
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update property
  update: async (id: string, updates: Partial<Property>) => {
    // Get current user first
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .eq('owner_id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete property
  delete: async (id: string) => {
    // Get current user first
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)
      .eq('owner_id', user.id)

    if (error) throw error
  }
}

// Unit utilities
export const units = {
  // Create new unit
  create: async (unitData: {
    property_id: string
    unit_number: string
    bedrooms: number
    bathrooms: number
    square_feet?: number
    rent_amount: number
    status: string
    description?: string
    images?: string[]
  }) => {
    const { data, error } = await supabase
      .from('units')
      .insert(unitData)
      .select()
      .single()

    if (error) throw error

    // Update property's total_units count
    await units.updatePropertyUnitCount(unitData.property_id)

    return data
  },

  // Update unit
  update: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('units')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Update property's total_units count if property_id changed
    if (updates.property_id) {
      await units.updatePropertyUnitCount(updates.property_id)
    }

    return data
  },

  // Delete unit
  delete: async (id: string) => {
    // Get the property_id before deleting
    const { data: unit, error: fetchError } = await supabase
      .from('units')
      .select('property_id')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    const { error } = await supabase
      .from('units')
      .delete()
      .eq('id', id)

    if (error) throw error

    // Update property's total_units count
    if (unit) {
      await units.updatePropertyUnitCount(unit.property_id)
    }
  },

  // Update property's total_units count
  updatePropertyUnitCount: async (propertyId: string) => {
    // Count units for this property
    const { count, error: countError } = await supabase
      .from('units')
      .select('*', { count: 'exact', head: true })
      .eq('property_id', propertyId)

    if (countError) throw countError

    // Update property's total_units field
    const { error: updateError } = await supabase
      .from('properties')
      .update({ total_units: count || 0 })
      .eq('id', propertyId)

    if (updateError) throw updateError
  },

  // Sync all properties' total_units with actual unit counts
  syncAllPropertyUnitCounts: async () => {
    // Get all properties
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('id')

    if (propertiesError) throw propertiesError

    // Update each property's total_units
    for (const property of properties || []) {
      await units.updatePropertyUnitCount(property.id)
    }
  }
}

// Tenant utilities
export const tenants = {
  // Get all tenants for current user
  getAll: async () => {
    // Get current user first
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('tenants')
      .select(`
        *,
        unit:units (
          *,
          property:properties (*)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get tenant by ID
  getById: async (id: string) => {
    // Get current user first
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('tenants')
      .select(`
        *,
        unit:units (
          *,
          property:properties (*)
        ),
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

    // Update the unit's status to OCCUPIED
    const { error: unitError } = await supabase
      .from('units')
      .update({ status: 'OCCUPIED' })
      .eq('id', tenantData.unit_id)

    if (unitError) throw unitError

    // Get the property_id for the unit
    const { data: unit, error: fetchUnitError } = await supabase
      .from('units')
      .select('property_id')
      .eq('id', tenantData.unit_id)
      .single()

    if (fetchUnitError) throw fetchUnitError

    // Update the property's available units count
    if (unit && unit.property_id) {
      await units.updatePropertyUnitCount(unit.property_id)
    }

    return data
  },

  // Update tenant
  update: async (id: string, updates: Partial<Tenant>) => {
    // Get the current tenant before updating
    const { data: currentTenant, error: fetchError } = await supabase
      .from('tenants')
      .select('unit_id')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError
    const oldUnitId = currentTenant?.unit_id

    const { data, error } = await supabase
      .from('tenants')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // If unit_id changed, update both old and new units
    const newUnitId = updates.unit_id
    if (newUnitId && newUnitId !== oldUnitId) {
      // Set new unit to OCCUPIED
      const { error: newUnitError } = await supabase
        .from('units')
        .update({ status: 'OCCUPIED' })
        .eq('id', newUnitId)
      if (newUnitError) throw newUnitError

      // Set old unit to AVAILABLE
      if (oldUnitId) {
        const { error: oldUnitError } = await supabase
          .from('units')
          .update({ status: 'AVAILABLE' })
          .eq('id', oldUnitId)
        if (oldUnitError) throw oldUnitError
      }

      // Update property unit counts for both units
      // Get property_id for new unit
      const { data: newUnit, error: fetchNewUnitError } = await supabase
        .from('units')
        .select('property_id')
        .eq('id', newUnitId)
        .single()
      if (fetchNewUnitError) throw fetchNewUnitError
      if (newUnit && newUnit.property_id) {
        await units.updatePropertyUnitCount(newUnit.property_id)
      }
      // Get property_id for old unit
      if (oldUnitId) {
        const { data: oldUnit, error: fetchOldUnitError } = await supabase
          .from('units')
          .select('property_id')
          .eq('id', oldUnitId)
          .single()
        if (fetchOldUnitError) throw fetchOldUnitError
        if (oldUnit && oldUnit.property_id) {
          await units.updatePropertyUnitCount(oldUnit.property_id)
        }
      }
    } else if (newUnitId) {
      // If unit_id didn't change but we want to ensure status is correct
      const { error: unitError } = await supabase
        .from('units')
        .update({ status: 'OCCUPIED' })
        .eq('id', newUnitId)
      if (unitError) throw unitError
      // Update property unit count
      const { data: unit, error: fetchUnitError } = await supabase
        .from('units')
        .select('property_id')
        .eq('id', newUnitId)
        .single()
      if (fetchUnitError) throw fetchUnitError
      if (unit && unit.property_id) {
        await units.updatePropertyUnitCount(unit.property_id)
      }
    }

    return data
  },

  // Delete tenant
  delete: async (id: string) => {
    // Fetch the tenant to get the unit_id and property_id
    const { data: tenant, error: fetchError } = await supabase
      .from('tenants')
      .select('unit_id, property_id')
      .eq('id', id)
      .single()
    if (fetchError) throw fetchError

    // Delete the tenant
    const { error } = await supabase
      .from('tenants')
      .delete()
      .eq('id', id)
    if (error) throw error

    // Set the unit status to AVAILABLE
    if (tenant?.unit_id) {
      const { error: unitError } = await supabase
        .from('units')
        .update({ status: 'AVAILABLE' })
        .eq('id', tenant.unit_id)
      if (unitError) throw unitError
    }

    // Update the property's available units count
    if (tenant?.property_id) {
      await units.updatePropertyUnitCount(tenant.property_id)
    }
  },

  // Get available units for tenant assignment
  getAvailableUnits: async () => {
    // Get current user first
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!user) throw new Error('User not authenticated')

    // Get available units
    const { data: units, error: unitsError } = await supabase
      .from('units')
      .select(`
        *,
        property:properties (
          name,
          address
        )
      `)
      .eq('status', 'AVAILABLE')
      .order('unit_number', { ascending: true })

    if (unitsError) throw unitsError

    // Get properties without units (for HOUSE/TOWNHOUSE/COMMERCIAL)
    const { data: propertiesWithoutUnits, error: propertiesError } = await supabase
      .from('properties')
      .select(`
        id,
        name,
        address,
        property_type
      `)
      .eq('owner_id', user.id)
      .not('id', 'in', `(${units?.map(u => `'${u.property_id}'`).join(',') || 'null'})`)

    if (propertiesError) throw propertiesError

    // Combine units with properties that have no units
    const availableUnits = units || []
    const propertiesForTenants = (propertiesWithoutUnits || []).map(property => ({
      id: `property-${property.id}`, // Use a special ID to distinguish from units
      unit_number: 'Entire Property',
      bedrooms: 1,
      bathrooms: 1,
      square_feet: null,
      rent_amount: 0,
      property_id: property.id,
      property: {
        name: property.name,
        address: property.address
      },
      is_entire_property: true // Flag to indicate this is the entire property
    }))

    return [...availableUnits, ...propertiesForTenants]
  },

  // Get all units for tenant editing (including occupied ones)
  getAllUnits: async () => {
    const { data, error } = await supabase
      .from('units')
      .select(`
        *,
        property:properties (
          name,
          address
        )
      `)
      .order('unit_number', { ascending: true })

    if (error) throw error
    return data
  },

  // Debug function to check tenant creation
  debugTenants: async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!user) throw new Error('User not authenticated')

    // Get all tenants without RLS filtering
    const { data: allTenants, error: allError } = await supabase
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false })

    if (allError) throw allError

    // Get tenants filtered by landlord_id
    const { data: landlordTenants, error: landlordError } = await supabase
      .from('tenants')
      .select('*')
      .eq('landlord_id', user.id)
      .order('created_at', { ascending: false })

    if (landlordError) throw landlordError

    return {
      currentUser: user.id,
      allTenants,
      landlordTenants,
      totalTenants: allTenants?.length || 0,
      userTenants: landlordTenants?.length || 0
    }
  }
}

// Tenant invitation utilities
export const tenantInvitations = {
  // Create a new tenant invitation
  create: async (invitationData: {
    email: string
    first_name: string
    last_name: string
    phone: string
    date_of_birth?: string
    emergency_contact?: string
    emergency_phone?: string
    lease_start: string
    lease_end: string
    rent_amount: number
    security_deposit: number
    unit_id: string | null
    landlord_id: string
  }) => {
    // Generate a unique verification token
    const verificationToken = crypto.randomUUID()
    
    // Set expiration (7 days from now)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const { data, error } = await supabase
      .from('tenant_invitations')
      .insert({
        ...invitationData,
        verification_token: verificationToken,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return { ...data, verification_token: verificationToken }
  },

  // Get invitation by token
  getByToken: async (token: string) => {
    const { data, error } = await supabase
      .from('tenant_invitations')
      .select(`
        *,
        unit:units (
          *,
          property:properties (*)
        ),
        landlord:users!landlord_id (
          first_name,
          last_name,
          email
        )
      `)
      .eq('verification_token', token)
      .eq('is_verified', false)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error) throw error
    return data
  },

  // Mark invitation as verified
  markAsVerified: async (token: string) => {
    const { data, error } = await supabase
      .from('tenant_invitations')
      .update({
        is_verified: true,
        verified_at: new Date().toISOString()
      })
      .eq('verification_token', token)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Convert invitation to tenant
  convertToTenant: async (invitationId: string) => {
    // Get the invitation data
    const { data: invitation, error: fetchError } = await supabase
      .from('tenant_invitations')
      .select('*')
      .eq('id', invitationId)
      .single()

    if (fetchError) throw fetchError

    // Create the tenant
    const { data: tenant, error: createError } = await supabase
      .from('tenants')
      .insert({
        email: invitation.email,
        first_name: invitation.first_name,
        last_name: invitation.last_name,
        phone: invitation.phone,
        date_of_birth: invitation.date_of_birth,
        emergency_contact: invitation.emergency_contact,
        emergency_phone: invitation.emergency_phone,
        lease_start: invitation.lease_start,
        lease_end: invitation.lease_end,
        rent_amount: invitation.rent_amount,
        security_deposit: invitation.security_deposit,
        unit_id: invitation.unit_id,
        landlord_id: invitation.landlord_id,
        status: 'ACTIVE'
      })
      .select()
      .single()

    if (createError) throw createError

    // Update unit status to occupied
    const { error: unitError } = await supabase
      .from('units')
      .update({ status: 'OCCUPIED' })
      .eq('id', invitation.unit_id)

    if (unitError) throw unitError

    // Get the property_id for the unit to update available units count
    const { data: unit, error: fetchUnitError } = await supabase
      .from('units')
      .select('property_id')
      .eq('id', invitation.unit_id)
      .single()

    if (fetchUnitError) throw fetchUnitError

    // Update the property's available units count
    if (unit && unit.property_id) {
      await units.updatePropertyUnitCount(unit.property_id)
    }

    return tenant
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
        unit:units (
          *,
          property:properties (*)
        )
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
        unit:units (
          *,
          property:properties (*)
        )
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
  create: async (maintenanceData: Omit<Maintenance, 'id' | 'created_at' | 'updated_at'> & { unit_id?: string | null }) => {
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
  },

  // Delete notification
  delete: async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)

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