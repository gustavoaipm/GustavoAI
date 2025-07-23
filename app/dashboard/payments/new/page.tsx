"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardNav from "@/app/components/DashboardNav"
import { payments, properties, tenants } from '@/lib/supabase-utils'
import { useAuth } from '@/lib/auth-context'

const PAYMENT_TYPES = [
  { value: "RENT", label: "Rent" },
  { value: "SECURITY_DEPOSIT", label: "Security Deposit" },
  { value: "LATE_FEE", label: "Late Fee" },
  { value: "MAINTENANCE_FEE", label: "Maintenance Fee" },
  { value: "UTILITY_FEE", label: "Utility Fee" },
]

const PAYMENT_STATUS = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "OVERDUE", label: "Overdue" },
  { value: "CANCELLED", label: "Cancelled" },
]

export default function NewPaymentPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [form, setForm] = useState({
    property_id: "",
    unit_id: "",
    tenant_id: "",
    amount: "",
    type: PAYMENT_TYPES[0].value,
    status: PAYMENT_STATUS[0].value,
    due_date: "",
    paid_date: "",
    late_fee: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [propertiesList, setProperties] = useState<any[]>([])
  const [units, setUnits] = useState<any[]>([])
  const [tenantsList, setTenants] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      fetchProperties()
      fetchTenants()
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

  const fetchTenants = async () => {
    try {
      const data = await tenants.getAll()
      setTenants(data)
    } catch (err) {
      setError("Failed to load tenants.")
    }
  }

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess(false)
    try {
      if (!user) throw new Error("Not authenticated")
      await payments.create({
        amount: parseFloat(form.amount),
        type: form.type as "RENT" | "SECURITY_DEPOSIT" | "LATE_FEE" | "MAINTENANCE_FEE" | "UTILITY_FEE",
        status: form.status as "CANCELLED" | "PENDING" | "PAID" | "OVERDUE" | null,
        due_date: form.due_date,
        paid_date: form.paid_date || null,
        late_fee: form.late_fee ? parseFloat(form.late_fee) : null,
        description: form.description,
        stripe_payment_id: null,
        property_id: form.property_id,
        tenant_id: form.tenant_id,
        unit_id: form.unit_id || null,
        landlord_id: user.id,
      })
      setSuccess(true)
      setTimeout(() => router.push("/dashboard/payments"), 1200)
    } catch (err: any) {
      setError(err.message || "Failed to record payment.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Record Payment</h1>
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">Payment recorded!</div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property *</label>
            <select
              required
              className="form-select"
              value={form.property_id}
              onChange={(e) => {
                handleChange("property_id", e.target.value)
                handleChange("unit_id", "")
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Tenant *</label>
            <select
              required
              className="form-select"
              value={form.tenant_id}
              onChange={(e) => handleChange("tenant_id", e.target.value)}
            >
              <option value="">Select tenant</option>
              {tenantsList.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.first_name} {t.last_name}
                </option>
              ))}
            </select>
          </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
            <select
              required
              className="form-select"
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
            >
              {PAYMENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
            <select
              required
              className="form-select"
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              {PAYMENT_STATUS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
            <input
              type="date"
              required
              className="form-input"
              value={form.due_date}
              onChange={(e) => handleChange("due_date", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Paid Date</label>
            <input
              type="date"
              className="form-input"
              value={form.paid_date}
              onChange={(e) => handleChange("paid_date", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Late Fee</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="form-input"
              value={form.late_fee}
              onChange={(e) => handleChange("late_fee", e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe the payment..."
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Recording..." : "Record Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 