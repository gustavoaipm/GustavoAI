export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      maintenance: {
        Row: {
          assigned_to_id: string | null
          completed_date: string | null
          confirmation_token: string | null
          cost: number | null
          created_at: string | null
          description: string
          id: string
          images: string[] | null
          notes: string | null
          preferred_times: Json | null
          priority: Database["public"]["Enums"]["priority"] | null
          property_id: string
          scheduled_date: string | null
          scheduled_time: string | null
          status: Database["public"]["Enums"]["maintenance_status"] | null
          tenant_id: string | null
          title: string
          type: Database["public"]["Enums"]["maintenance_type"]
          unit_id: string | null
          updated_at: string | null
          vendor_email: string | null
          vendor_id: string | null
          vendor_name: string | null
          vendor_phone: string | null
        }
        Insert: {
          assigned_to_id?: string | null
          completed_date?: string | null
          confirmation_token?: string | null
          cost?: number | null
          created_at?: string | null
          description: string
          id?: string
          images?: string[] | null
          notes?: string | null
          preferred_times?: Json | null
          priority?: Database["public"]["Enums"]["priority"] | null
          property_id: string
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: Database["public"]["Enums"]["maintenance_status"] | null
          tenant_id?: string | null
          title: string
          type: Database["public"]["Enums"]["maintenance_type"]
          unit_id?: string | null
          updated_at?: string | null
          vendor_email?: string | null
          vendor_id?: string | null
          vendor_name?: string | null
          vendor_phone?: string | null
        }
        Update: {
          assigned_to_id?: string | null
          completed_date?: string | null
          confirmation_token?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string
          id?: string
          images?: string[] | null
          notes?: string | null
          preferred_times?: Json | null
          priority?: Database["public"]["Enums"]["priority"] | null
          property_id?: string
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: Database["public"]["Enums"]["maintenance_status"] | null
          tenant_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["maintenance_type"]
          unit_id?: string | null
          updated_at?: string | null
          vendor_email?: string | null
          vendor_id?: string | null
          vendor_name?: string | null
          vendor_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_assigned_to_id_fkey"
            columns: ["assigned_to_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string | null
          direction: string
          id: string
          message_type: string
          metadata: Json | null
          status: string | null
          timestamp: string | null
        }
        Insert: {
          content: string
          conversation_id?: string | null
          direction: string
          id?: string
          message_type: string
          metadata?: Json | null
          status?: string | null
          timestamp?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string | null
          direction?: string
          id?: string
          message_type?: string
          metadata?: Json | null
          status?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      participant_availability: {
        Row: {
          conversation_id: string | null
          created_at: string | null
          date: string
          id: string
          is_available: boolean | null
          time_slots: string[]
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string | null
          date: string
          id?: string
          is_available?: boolean | null
          time_slots: string[]
        }
        Update: {
          conversation_id?: string | null
          created_at?: string | null
          date?: string
          id?: string
          is_available?: boolean | null
          time_slots?: string[]
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          due_date: string
          id: string
          landlord_id: string
          late_fee: number | null
          paid_date: string | null
          property_id: string
          status: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_id: string | null
          tenant_id: string
          type: Database["public"]["Enums"]["payment_type"]
          unit_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          due_date: string
          id?: string
          landlord_id: string
          late_fee?: number | null
          paid_date?: string | null
          property_id: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_id?: string | null
          tenant_id: string
          type: Database["public"]["Enums"]["payment_type"]
          unit_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          due_date?: string
          id?: string
          landlord_id?: string
          late_fee?: number | null
          paid_date?: string | null
          property_id?: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_id?: string | null
          tenant_id?: string
          type?: Database["public"]["Enums"]["payment_type"]
          unit_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          city: string
          created_at: string | null
          description: string | null
          id: string
          images: string[] | null
          name: string
          owner_id: string
          property_type: Database["public"]["Enums"]["property_type"]
          state: string
          status: Database["public"]["Enums"]["old_property_status"] | null
          total_units: number | null
          updated_at: string | null
          zip_code: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          name: string
          owner_id: string
          property_type: Database["public"]["Enums"]["property_type"]
          state: string
          status?: Database["public"]["Enums"]["old_property_status"] | null
          total_units?: number | null
          updated_at?: string | null
          zip_code: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          name?: string
          owner_id?: string
          property_type?: Database["public"]["Enums"]["property_type"]
          state?: string
          status?: Database["public"]["Enums"]["old_property_status"] | null
          total_units?: number | null
          updated_at?: string | null
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_invitations: {
        Row: {
          created_at: string | null
          date_of_birth: string | null
          email: string
          emergency_contact: string | null
          emergency_phone: string | null
          expires_at: string
          first_name: string
          id: string
          is_verified: boolean | null
          landlord_id: string
          last_name: string
          lease_end: string
          lease_start: string
          phone: string
          rent_amount: number
          security_deposit: number
          unit_id: string
          updated_at: string | null
          verification_token: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          emergency_contact?: string | null
          emergency_phone?: string | null
          expires_at: string
          first_name: string
          id?: string
          is_verified?: boolean | null
          landlord_id: string
          last_name: string
          lease_end: string
          lease_start: string
          phone: string
          rent_amount: number
          security_deposit: number
          unit_id: string
          updated_at?: string | null
          verification_token: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          emergency_contact?: string | null
          emergency_phone?: string | null
          expires_at?: string
          first_name?: string
          id?: string
          is_verified?: boolean | null
          landlord_id?: string
          last_name?: string
          lease_end?: string
          lease_start?: string
          phone?: string
          rent_amount?: number
          security_deposit?: number
          unit_id?: string
          updated_at?: string | null
          verification_token?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_invitations_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_invitations_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string | null
          date_of_birth: string | null
          email: string
          emergency_contact: string | null
          emergency_phone: string | null
          first_name: string
          id: string
          landlord_id: string
          last_name: string
          lease_end: string
          lease_start: string
          phone: string
          property_id: string
          rent_amount: number
          security_deposit: number
          status: Database["public"]["Enums"]["tenant_status"] | null
          unit_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          emergency_contact?: string | null
          emergency_phone?: string | null
          first_name: string
          id?: string
          landlord_id: string
          last_name: string
          lease_end: string
          lease_start: string
          phone: string
          property_id: string
          rent_amount: number
          security_deposit: number
          status?: Database["public"]["Enums"]["tenant_status"] | null
          unit_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          emergency_contact?: string | null
          emergency_phone?: string | null
          first_name?: string
          id?: string
          landlord_id?: string
          last_name?: string
          lease_end?: string
          lease_start?: string
          phone?: string
          property_id?: string
          rent_amount?: number
          security_deposit?: number
          status?: Database["public"]["Enums"]["tenant_status"] | null
          unit_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenants_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenants_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          bathrooms: number
          bedrooms: number
          created_at: string | null
          description: string | null
          id: string
          images: string[] | null
          property_id: string
          rent_amount: number
          square_feet: number | null
          status: Database["public"]["Enums"]["unit_status"] | null
          unit_number: string
          updated_at: string | null
        }
        Insert: {
          bathrooms: number
          bedrooms: number
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          property_id: string
          rent_amount: number
          square_feet?: number | null
          status?: Database["public"]["Enums"]["unit_status"] | null
          unit_number: string
          updated_at?: string | null
        }
        Update: {
          bathrooms?: number
          bedrooms?: number
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          property_id?: string
          rent_amount?: number
          square_feet?: number | null
          status?: Database["public"]["Enums"]["unit_status"] | null
          unit_number?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "units_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: string
          is_tenant: boolean | null
          last_name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id: string
          is_tenant?: boolean | null
          last_name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          is_tenant?: boolean | null
          last_name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vendors: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          email: string | null
          id: string
          is_verified: boolean | null
          name: string
          phone: string
          rating: number | null
          services: string[]
          state: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_verified?: boolean | null
          name: string
          phone: string
          rating?: number | null
          services: string[]
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_verified?: boolean | null
          name?: string
          phone?: string
          rating?: number | null
          services?: string[]
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      maintenance_status:
        | "REQUESTED"
        | "SCHEDULED"
        | "IN_PROGRESS"
        | "COMPLETED"
        | "CANCELLED"
      maintenance_type:
        | "CLEANING"
        | "REPAIR"
        | "INSPECTION"
        | "PEST_CONTROL"
        | "HVAC"
        | "PLUMBING"
        | "ELECTRICAL"
        | "LANDSCAPING"
        | "OTHER"
      notification_type:
        | "PAYMENT_DUE"
        | "PAYMENT_OVERDUE"
        | "MAINTENANCE_SCHEDULED"
        | "MAINTENANCE_COMPLETED"
        | "LEASE_EXPIRING"
        | "GENERAL"
      old_property_status:
        | "AVAILABLE"
        | "OCCUPIED"
        | "MAINTENANCE"
        | "UNAVAILABLE"
      payment_status: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED"
      payment_type:
        | "RENT"
        | "SECURITY_DEPOSIT"
        | "LATE_FEE"
        | "MAINTENANCE_FEE"
        | "UTILITY_FEE"
      priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
      property_status: "ACTIVE" | "INACTIVE" | "MAINTENANCE" | "UNAVAILABLE"
      property_type:
        | "APARTMENT"
        | "HOUSE"
        | "CONDO"
        | "TOWNHOUSE"
        | "COMMERCIAL"
      tenant_status: "ACTIVE" | "INACTIVE" | "EVICTED" | "MOVED_OUT"
      unit_status:
        | "AVAILABLE"
        | "OCCUPIED"
        | "MAINTENANCE"
        | "UNAVAILABLE"
        | "RESERVED"
      user_role: "LANDLORD" | "TENANT" | "ADMIN"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      maintenance_status: [
        "REQUESTED",
        "SCHEDULED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ],
      maintenance_type: [
        "CLEANING",
        "REPAIR",
        "INSPECTION",
        "PEST_CONTROL",
        "HVAC",
        "PLUMBING",
        "ELECTRICAL",
        "LANDSCAPING",
        "OTHER",
      ],
      notification_type: [
        "PAYMENT_DUE",
        "PAYMENT_OVERDUE",
        "MAINTENANCE_SCHEDULED",
        "MAINTENANCE_COMPLETED",
        "LEASE_EXPIRING",
        "GENERAL",
      ],
      old_property_status: [
        "AVAILABLE",
        "OCCUPIED",
        "MAINTENANCE",
        "UNAVAILABLE",
      ],
      payment_status: ["PENDING", "PAID", "OVERDUE", "CANCELLED"],
      payment_type: [
        "RENT",
        "SECURITY_DEPOSIT",
        "LATE_FEE",
        "MAINTENANCE_FEE",
        "UTILITY_FEE",
      ],
      priority: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      property_status: ["ACTIVE", "INACTIVE", "MAINTENANCE", "UNAVAILABLE"],
      property_type: ["APARTMENT", "HOUSE", "CONDO", "TOWNHOUSE", "COMMERCIAL"],
      tenant_status: ["ACTIVE", "INACTIVE", "EVICTED", "MOVED_OUT"],
      unit_status: [
        "AVAILABLE",
        "OCCUPIED",
        "MAINTENANCE",
        "UNAVAILABLE",
        "RESERVED",
      ],
      user_role: ["LANDLORD", "TENANT", "ADMIN"],
    },
  },
} as const
