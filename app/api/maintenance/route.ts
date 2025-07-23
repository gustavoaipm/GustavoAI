import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import nodemailer from 'nodemailer'
import { supabase } from '@/lib/supabase'

async function assignVendor(serviceType: string) {
  // Find an active vendor whose services array includes the requested serviceType
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .contains('services', [serviceType])
    .eq('is_verified', true)
    .limit(1)
    .single()
  if (error || !data) return null
  return data
}

async function sendVendorEmail(vendor: any, maintenance: any, confirmationToken: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const confirmUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/maintenance/confirm?token=${confirmationToken}`

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || 'noreply@gustavoai.com',
    to: vendor.email,
    subject: `New Maintenance Request: ${maintenance.description}`,
    text: `You have a new maintenance request.\n\nDescription: ${maintenance.description}\nPreferred Times: ${JSON.stringify(maintenance.preferred_times)}\n\nClick to confirm: ${confirmUrl}`,
    html: `<p>You have a new maintenance request.</p><p><b>Description:</b> ${maintenance.description}</p><p><b>Preferred Times:</b> ${JSON.stringify(maintenance.preferred_times)}</p><p><a href="${confirmUrl}">Click here to confirm this job</a></p>`
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { description, property_id, unit_id, preferred_times, service_type, tenant_id } = body
    if (!description || !property_id || !preferred_times || !service_type || !tenant_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Assign a vendor (by service_type)
    const vendor = await assignVendor(service_type)
    if (!vendor) {
      return NextResponse.json({ error: 'No available vendor found' }, { status: 404 })
    }

    // Generate a confirmation token
    const confirmationToken = uuidv4()

    // Insert the maintenance request into Supabase
    const { data: maintenance, error: insertError } = await supabase
      .from('maintenance')
      .insert([
        {
          description,
          property_id,
          unit_id,
          preferred_times,
          vendor_id: vendor.id,
          status: 'PENDING',
          confirmation_token: confirmationToken,
          tenant_id,
        }
      ])
      .select()
      .single()
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // Send email to vendor
    await sendVendorEmail(vendor, maintenance, confirmationToken)

    // TODO: Send notification to tenant and owner/manager

    return NextResponse.json({ success: true, maintenance })
  } catch (error: any) {
    console.error('Error creating maintenance request:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 