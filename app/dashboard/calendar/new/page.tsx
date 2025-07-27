"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardNav from "@/app/components/DashboardNav"
import { maintenance, payments, properties } from '@/lib/supabase-utils'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabaseClient'

const EVENT_TYPES = [
  { value: "maintenance", label: "Maintenance" },
  { value: "payment", label: "Payment" },
  { value: "inspection", label: "Inspection" },
  { value: "lease", label: "Lease" },
]

const MAINTENANCE_TYPES = [
  'CLEANING',
  'REPAIR',
  'INSPECTION',
  'PEST_CONTROL',
  'HVAC',
  'PLUMBING',
  'ELECTRICAL',
  'LANDSCAPING',
  'OTHER'
] as const

type MaintenanceType = typeof MAINTENANCE_TYPES[number]

export default function NewCalendarEventPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [form, setForm] = useState({
    title: "",
    type: EVENT_TYPES[0].value,
    date: "",
    time: "",
    description: "",
    property_id: "",
    unit_id: "",
    amount: "",
    maintenance_type: "OTHER" as MaintenanceType,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [propertiesList, setProperties] = useState<any[]>([])
  const [units, setUnits] = useState<any[]>([])
  // Add tenantId state and effect to look up tenant id by user email
  const [tenantId, setTenantId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProperties()
    }
  }, [user])

  useEffect(() => {
    const fetchTenantId = async () => {
      if (user) {
        const { data: tenant } = await supabase
          .from('tenants')
          .select('id')
          .eq('email', user.email)
          .single();
        setTenantId(tenant ? tenant.id : null);
      }
    };
    fetchTenantId();
  }, [user]);

  const fetchProperties = async () => {
    try {
      const data = await properties.getAll()
      setProperties(data)
      // Flatten all units for selection
      const allUnits = data.flatMap((p: any) =>
        (p.units || []).map((u: any) => ({ ...u, property: { id: p.id, name: p.name } }))
      )
      setUnits(allUnits)
    } catch (err) {
      setError("Failed to load properties/units.")
    }
  }

  const handleChange = (field: string, value: any) => {
    setForm((prev) => {
      const newForm = { ...prev, [field]: value }
      
      // Auto-set maintenance type to INSPECTION when event type is inspection
      if (field === "type" && value === "inspection") {
        newForm.maintenance_type = "INSPECTION" as MaintenanceType
      }
      
      return newForm
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess(false)
    try {
      if (!user) throw new Error("Not authenticated")
      
      if (form.type === "maintenance" || form.type === "inspection") {
        // Use the selected maintenance type, or default to INSPECTION for inspection events
        const maintenanceType = form.type === "inspection" ? "INSPECTION" : form.maintenance_type
        
        await maintenance.create({
          title: form.title,
          description: form.description,
          type: maintenanceType,
          priority: "MEDIUM",
          status: "REQUESTED",
          property_id: form.property_id,
          unit_id: form.unit_id, // always required
          tenant_id: tenantId,   // null if not a tenant, otherwise the tenant's id
          notes: null,
          images: [],
          scheduled_date: form.date && form.time ? `${form.date}T${form.time}` : form.date, // combine date and time
          scheduled_time: null, // explicitly set to null
          completed_date: null,
          cost: null,
          vendor_name: null,
          vendor_phone: null,
          vendor_email: null,
          assigned_to_id: null,
          confirmation_token: null,
          preferred_times: null,
          vendor_id: null,
        })
      } else if (form.type === "payment") {
        await payments.create({
          amount: parseFloat(form.amount),
          type: "RENT",
          status: "PENDING",
          due_date: form.date,
          paid_date: null,
          late_fee: null,
          description: form.description,
          stripe_payment_id: null,
          property_id: form.property_id,
          tenant_id: user.id,
          unit_id: form.unit_id || null,
          landlord_id: user.id,
        })
      } else if (form.type === "lease") {
        // TODO: Implement lease event handling
        throw new Error("Lease events are not yet supported. Please use maintenance or payment events for now.")
      } else {
        throw new Error("Unsupported event type.")
      }
      setSuccess(true)
      setTimeout(() => router.push("/dashboard/calendar"), 1200)
    } catch (err: any) {
      setError(err.message || "Failed to create event.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Add Calendar Event</h1>
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">Event created!</div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              required
              className="form-input"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Event title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
            <select
              required
              className="form-select"
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
            >
              {EVENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          {(form.type === "maintenance" || form.type === "inspection") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Type *</label>
              <select
                required
                className="form-select"
                value={form.maintenance_type}
                onChange={(e) => handleChange("maintenance_type", e.target.value)}
              >
                {MAINTENANCE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property *</label>
            <select
              required
              className="form-select"
              value={form.property_id}
              onChange={(e) => {
                handleChange("property_id", e.target.value)
                handleChange("unit_id", "") // Reset unit selection when property changes
              }}
            >
              <option value="">Select property</option>
              {propertiesList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unit (optional)</label>
            <select
              className="form-select"
              value={form.unit_id}
              onChange={(e) => handleChange("unit_id", e.target.value)}
              disabled={!form.property_id}
            >
              <option value="">Entire property</option>
              {units
                .filter((u) => u.property.id === form.property_id)
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    Unit {u.unit_number}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
            <input
              type="date"
              required
              className="form-input"
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
            <input
              type="time"
              className="form-input"
              value={form.time}
              onChange={(e) => handleChange("time", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe the event..."
            />
          </div>
          {form.type === "payment" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)*</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                className="form-input"
                value={form.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                placeholder="1200.00"
              />
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 