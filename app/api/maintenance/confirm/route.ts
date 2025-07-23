import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import nodemailer from 'nodemailer'

async function sendNotificationEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
  await transporter.sendMail({
    from: process.env.FROM_EMAIL || 'noreply@gustavoai.com',
    to,
    subject,
    html,
  })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  if (!token) {
    return new NextResponse('<h2>Invalid confirmation link.</h2>', { status: 400, headers: { 'Content-Type': 'text/html' } })
  }

  // Find the maintenance request by confirmation_token
  const { data: maintenance, error } = await supabase
    .from('maintenance')
    .select('*')
    .eq('confirmation_token', token)
    .single()

  if (error || !maintenance) {
    return new NextResponse('<h2>Maintenance request not found or already confirmed.</h2>', { status: 404, headers: { 'Content-Type': 'text/html' } })
  }

  // Update the status and scheduled_time
  const scheduledTime = new Date().toISOString()
  const { error: updateError } = await supabase
    .from('maintenance')
    .update({ status: 'SCHEDULED', scheduled_time: scheduledTime })
    .eq('id', maintenance.id)

  if (updateError) {
    return new NextResponse('<h2>Failed to confirm the maintenance request. Please try again later.</h2>', { status: 500, headers: { 'Content-Type': 'text/html' } })
  }

  // Fetch tenant info
  let tenantEmail = ''
  let tenantName = ''
  if (maintenance.tenant_id) {
    const { data: tenant } = await supabase
      .from('tenants')
      .select('email, first_name, last_name')
      .eq('id', maintenance.tenant_id)
      .single()
    if (tenant) {
      tenantEmail = tenant.email
      tenantName = `${tenant.first_name} ${tenant.last_name}`
    }
  }

  // Fetch property and owner info
  let ownerEmail = ''
  let ownerName = ''
  if (maintenance.property_id) {
    const { data: property } = await supabase
      .from('properties')
      .select('owner_id, name')
      .eq('id', maintenance.property_id)
      .single()
    if (property && property.owner_id) {
      const { data: owner } = await supabase
        .from('users')
        .select('email, first_name, last_name')
        .eq('id', property.owner_id)
        .single()
      if (owner) {
        ownerEmail = owner.email
        ownerName = `${owner.first_name} ${owner.last_name}`
      }
    }
  }

  // Fetch vendor info
  let vendorName = ''
  let vendorEmail = ''
  if (maintenance.vendor_id) {
    const { data: vendor } = await supabase
      .from('vendors')
      .select('name, email')
      .eq('id', maintenance.vendor_id)
      .single()
    if (vendor) {
      vendorName = vendor.name
      vendorEmail = vendor.email
    }
  }

  // Send notification emails
  const subject = `Maintenance Scheduled: ${maintenance.description}`
  const html = `<p>Your maintenance request has been scheduled.</p>
    <p><b>Description:</b> ${maintenance.description}</p>
    <p><b>Scheduled Time:</b> ${new Date(scheduledTime).toLocaleString()}</p>
    <p><b>Vendor:</b> ${vendorName} (${vendorEmail})</p>`

  if (tenantEmail) {
    await sendNotificationEmail(tenantEmail, subject, `<p>Hi ${tenantName},</p>` + html)
  }
  if (ownerEmail) {
    await sendNotificationEmail(ownerEmail, subject, `<p>Hi ${ownerName},</p>` + html)
  }

  return new NextResponse('<h2>Thank you! The maintenance request has been confirmed and scheduled. Notifications have been sent.</h2>', { status: 200, headers: { 'Content-Type': 'text/html' } })
} 