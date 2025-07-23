"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { maintenance } from "@/lib/supabase-utils"
import DashboardNav from "@/app/components/DashboardNav"
import {
  PlusIcon,
  WrenchScrewdriverIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline"

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  SCHEDULED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-orange-100 text-orange-800",
  COMPLETED: "bg-green-100 text-green-800",
  DECLINED: "bg-red-100 text-red-800",
}

export default function MaintenancePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [requests, setRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchRequests()
    }
  }, [user])

  const fetchRequests = async () => {
    setIsLoading(true)
    try {
      const data = await maintenance.getAll()
      setRequests(data)
    } catch (error) {
      console.error("Error fetching maintenance requests:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredRequests =
    statusFilter === "all"
      ? requests
      : requests.filter((r) => r.status === statusFilter)

  const statusOptions = [
    "all",
    "PENDING",
    "SCHEDULED",
    "IN_PROGRESS",
    "COMPLETED",
    "DECLINED",
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Maintenance Requests</h1>
            <p className="mt-2 text-gray-600">
              View and manage all maintenance requests for your properties
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/maintenance/new')}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Request
          </button>
        </div>
        <div className="mb-4 flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property / Unit
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled Time
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    Loading maintenance requests...
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No maintenance requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <>
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {req.description}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {req.property?.name || "-"}
                        {req.unit_id ? ` / Unit ${req.unit_id}` : ""}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[req.status] || "bg-gray-100 text-gray-800"}`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {req.vendor_name || "-"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {req.scheduled_date ? new Date(req.scheduled_date).toLocaleString() : "-"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <button
                          className="text-blue-600 hover:underline text-sm"
                          onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
                        >
                          {expandedId === req.id ? "Hide" : "Details"}
                        </button>
                      </td>
                    </tr>
                    {expandedId === req.id && (
                      <tr>
                        <td colSpan={6} className="bg-blue-50 px-4 py-4">
                          <div className="text-sm text-gray-700 mb-2">
                            <b>Created:</b> {new Date(req.created_at).toLocaleString()}<br />
                            <b>Tenant:</b> {req.tenant?.first_name} {req.tenant?.last_name} ({req.tenant?.email})<br />
                            <b>Vendor:</b> {req.vendor_name} ({req.vendor_email})<br />
                            <b>Preferred Times:</b> {Array.isArray(req.preferred_times) ? req.preferred_times.join(", ") : req.preferred_times}<br />
                            <b>Notes:</b> {req.notes || "-"}
                          </div>
                          {/* (Optional) Add actions: mark as completed, reassign vendor, etc. */}
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 