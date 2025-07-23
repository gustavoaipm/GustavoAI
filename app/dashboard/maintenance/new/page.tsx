"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { properties, maintenance } from '@/lib/supabase-utils'
import DashboardNav from "@/app/components/DashboardNav"

const SERVICE_TYPES = [
  'CLEANING',
  'REPAIR',
  'INSPECTION',
  'PEST_CONTROL',
  'HVAC',
  'PLUMBING',
  'ELECTRICAL',
  'LANDSCAPING',
  'OTHER'
]

export default function NewMaintenanceRequestPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [propertiesList, setProperties] = useState<any[]>([])
  const [units, setUnits] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  const [form, setForm] = useState({
    description: "",
    property_id: "",
    unit_id: "",
    service_type: SERVICE_TYPES[0],
    preferred_times: [""],
  })

  useEffect(() => {
    if (user) {
      fetchProperties()
    }
  }, [user])

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
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handlePreferredTimeChange = (idx: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      preferred_times: prev.preferred_times.map((t, i) => (i === idx ? value : t)),
    }))
  }

  const addPreferredTime = () => {
    setForm((prev) => ({ ...prev, preferred_times: [...prev.preferred_times, ""] }))
  }

  const removePreferredTime = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      preferred_times: prev.preferred_times.filter((_, i) => i !== idx),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess(false)
    
    try {
      await maintenance.create({
        title: form.description.substring(0, 100), // Use first 100 chars as title
        description: form.description,
        type: form.service_type as "CLEANING" | "REPAIR" | "INSPECTION" | "PEST_CONTROL" | "HVAC" | "PLUMBING" | "ELECTRICAL" | "LANDSCAPING" | "OTHER",
        priority: 'MEDIUM',
        status: 'REQUESTED',
        property_id: form.property_id,
        unit_id: form.unit_id || null,
        tenant_id: user?.id || null,
        notes: `Preferred times: ${form.preferred_times.filter((t) => t).join(', ')}`,
        images: [],
        scheduled_date: null,
        completed_date: null,
        cost: null,
        vendor_name: null,
        vendor_phone: null,
        vendor_email: null,
        assigned_to_id: null,
        confirmation_token: null,
        preferred_times: form.preferred_times,
        vendor_id: null,
        scheduled_time: null,
      })
      
      setSuccess(true)
      setForm({
        description: "",
        property_id: "",
        unit_id: "",
        service_type: SERVICE_TYPES[0],
        preferred_times: [""],
      })
    } catch (err) {
      setError("Failed to submit request.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Submit Maintenance Request</h1>
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">Request submitted! You'll be notified when it's scheduled.</div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              required
              className="form-textarea"
              rows={3}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe the issue in detail..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property *</label>
            <select
              required
              className="form-select"
              value={form.property_id}
              onChange={(e) => handleChange("property_id", e.target.value)}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Unit *</label>
            <select
              required
              className="form-select"
              value={form.unit_id}
              onChange={(e) => handleChange("unit_id", e.target.value)}
            >
              <option value="">Select unit</option>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
            <select
              required
              className="form-select"
              value={form.service_type}
              onChange={(e) => handleChange("service_type", e.target.value)}
            >
              {SERVICE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Times *</label>
            {form.preferred_times.map((time, idx) => (
              <div key={idx} className="flex items-center space-x-2 mb-2">
                <input
                  type="datetime-local"
                  required
                  className="form-input"
                  value={time}
                  onChange={(e) => handlePreferredTimeChange(idx, e.target.value)}
                />
                {form.preferred_times.length > 1 && (
                  <button
                    type="button"
                    className="text-red-600 hover:underline text-xs"
                    onClick={() => removePreferredTime(idx)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn-secondary mt-2"
              onClick={addPreferredTime}
            >
              Add Another Time
            </button>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 