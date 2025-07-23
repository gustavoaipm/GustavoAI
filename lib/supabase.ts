import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (these will be generated from your Supabase schema)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone: string | null
          role: 'LANDLORD' | 'TENANT' | 'ADMIN'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          phone?: string | null
          role?: 'LANDLORD' | 'TENANT' | 'ADMIN'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          phone?: string | null
          role?: 'LANDLORD' | 'TENANT' | 'ADMIN'
          created_at?: string
          total_units?: number
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          name: string
          address: string
          city: string
          state: string
          zip_code: string
          property_type: 'APARTMENT' | 'HOUSE' | 'CONDO' | 'TOWNHOUSE' | 'COMMERCIAL'
          bedrooms: number
          bathrooms: number
          square_feet: number | null
          rent_amount: number
          status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'UNAVAILABLE'
          description: string | null
          images: string[]
          owner_id: string
          total_units: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          city: string
          state: string
          zip_code: string
          property_type: 'APARTMENT' | 'HOUSE' | 'CONDO' | 'TOWNHOUSE' | 'COMMERCIAL'
          bedrooms: number
          bathrooms: number
          square_feet?: number | null
          rent_amount: number
          status?: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'UNAVAILABLE'
          description?: string | null
          images?: string[]
          owner_id: string
          total_units?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
          property_type?: 'APARTMENT' | 'HOUSE' | 'CONDO' | 'TOWNHOUSE' | 'COMMERCIAL'
          bedrooms?: number
          bathrooms?: number
          square_feet?: number | null
          rent_amount?: number
          status?: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'UNAVAILABLE'
          description?: string | null
          images?: string[]
          owner_id?: string
          total_units?: number
          created_at?: string
          updated_at?: string
        }
      }
      tenants: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone: string
          date_of_birth: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          status: 'ACTIVE' | 'INACTIVE' | 'EVICTED' | 'MOVED_OUT'
          lease_start: string
          lease_end: string
          rent_amount: number
          security_deposit: number
          property_id: string
          unit_id: string
          landlord_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          phone: string
          date_of_birth?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          status?: 'ACTIVE' | 'INACTIVE' | 'EVICTED' | 'MOVED_OUT'
          lease_start: string
          lease_end: string
          rent_amount: number
          security_deposit: number
          property_id: string
          unit_id: string
          landlord_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          phone?: string
          date_of_birth?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          status?: 'ACTIVE' | 'INACTIVE' | 'EVICTED' | 'MOVED_OUT'
          lease_start?: string
          lease_end?: string
          rent_amount?: number
          security_deposit?: number
          property_id?: string
          unit_id?: string
          landlord_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          amount: number
          type: 'RENT' | 'SECURITY_DEPOSIT' | 'LATE_FEE' | 'MAINTENANCE_FEE' | 'UTILITY_FEE'
          status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED'
          due_date: string
          paid_date: string | null
          late_fee: number
          description: string | null
          stripe_payment_id: string | null
          tenant_id: string
          property_id: string
          landlord_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          amount: number
          type: 'RENT' | 'SECURITY_DEPOSIT' | 'LATE_FEE' | 'MAINTENANCE_FEE' | 'UTILITY_FEE'
          status?: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED'
          due_date: string
          paid_date?: string | null
          late_fee?: number
          description?: string | null
          stripe_payment_id?: string | null
          tenant_id: string
          property_id: string
          landlord_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          amount?: number
          type?: 'RENT' | 'SECURITY_DEPOSIT' | 'LATE_FEE' | 'MAINTENANCE_FEE' | 'UTILITY_FEE'
          status?: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED'
          due_date?: string
          paid_date?: string | null
          late_fee?: number
          description?: string | null
          stripe_payment_id?: string | null
          tenant_id?: string
          property_id?: string
          landlord_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      maintenance: {
        Row: {
          id: string
          title: string
          description: string
          type: 'CLEANING' | 'REPAIR' | 'INSPECTION' | 'PEST_CONTROL' | 'HVAC' | 'PLUMBING' | 'ELECTRICAL' | 'LANDSCAPING' | 'OTHER'
          priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
          status: 'REQUESTED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
          scheduled_date: string | null
          completed_date: string | null
          cost: number | null
          vendor_name: string | null
          vendor_phone: string | null
          vendor_email: string | null
          notes: string | null
          images: string[]
          property_id: string
          unit_id: string | null
          tenant_id: string | null
          assigned_to_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          type: 'CLEANING' | 'REPAIR' | 'INSPECTION' | 'PEST_CONTROL' | 'HVAC' | 'PLUMBING' | 'ELECTRICAL' | 'LANDSCAPING' | 'OTHER'
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
          status?: 'REQUESTED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
          scheduled_date?: string | null
          completed_date?: string | null
          cost?: number | null
          vendor_name?: string | null
          vendor_phone?: string | null
          vendor_email?: string | null
          notes?: string | null
          images?: string[]
          property_id: string
          unit_id?: string | null
          tenant_id?: string | null
          assigned_to_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          type?: 'CLEANING' | 'REPAIR' | 'INSPECTION' | 'PEST_CONTROL' | 'HVAC' | 'PLUMBING' | 'ELECTRICAL' | 'LANDSCAPING' | 'OTHER'
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
          status?: 'REQUESTED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
          scheduled_date?: string | null
          completed_date?: string | null
          cost?: number | null
          vendor_name?: string | null
          vendor_phone?: string | null
          vendor_email?: string | null
          notes?: string | null
          images?: string[]
          property_id?: string
          unit_id?: string | null
          tenant_id?: string | null
          assigned_to_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          title: string
          message: string
          type: 'PAYMENT_DUE' | 'PAYMENT_OVERDUE' | 'MAINTENANCE_SCHEDULED' | 'MAINTENANCE_COMPLETED' | 'LEASE_EXPIRING' | 'GENERAL'
          is_read: boolean
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          message: string
          type: 'PAYMENT_DUE' | 'PAYMENT_OVERDUE' | 'MAINTENANCE_SCHEDULED' | 'MAINTENANCE_COMPLETED' | 'LEASE_EXPIRING' | 'GENERAL'
          is_read?: boolean
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          message?: string
          type?: 'PAYMENT_DUE' | 'PAYMENT_OVERDUE' | 'MAINTENANCE_SCHEDULED' | 'MAINTENANCE_COMPLETED' | 'LEASE_EXPIRING' | 'GENERAL'
          is_read?: boolean
          user_id?: string
          created_at?: string
        }
      }
      vendors: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string
          services: string[]
          rating: number | null
          is_verified: boolean
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone: string
          services: string[]
          rating?: number | null
          is_verified?: boolean
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string
          services?: string[]
          rating?: number | null
          is_verified?: boolean
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 