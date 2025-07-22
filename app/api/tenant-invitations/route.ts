import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (type === 'invitation') {
      const { email, first_name, last_name, property_name, unit_number, landlord_name, verification_url, expires_at } = data

      const emailContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to ${property_name}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4f46e5; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            .info-box { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #4f46e5; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ${property_name}</h1>
              <p>You've been invited to join your property management portal</p>
            </div>
            
            <div class="content">
              <p>Hello ${first_name} ${last_name},</p>
              
              <p>You've been invited by ${landlord_name} to join the property management portal for your new home at <strong>${property_name}, Unit ${unit_number}</strong>.</p>
              
              <div class="info-box">
                <h3>What you need to do:</h3>
                <ol>
                  <li>Click the verification link below to confirm your invitation</li>
                  <li>Set up your account password</li>
                  <li>Review and complete your profile information</li>
                  <li>Start using the portal to manage your rental</li>
                </ol>
              </div>
              
              <div style="text-align: center;">
                <a href="${verification_url}" class="button" style="display: inline-block; background: #4f46e5; color: #fff !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold;">Verify & Create Account</a>
              </div>
              
              <p><strong>Important:</strong> This invitation expires on ${new Date(expires_at).toLocaleDateString()}. Please verify your account before then.</p>
              
              <p>If you have any questions, please contact your property manager.</p>
              
              <p>Best regards,<br>The ${property_name} Management Team</p>
            </div>
            
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>If you didn't expect this invitation, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `

      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@gustavoai.com',
        to: email,
        subject: `Welcome to ${property_name} - Complete Your Account Setup`,
        html: emailContent,
      }

      await transporter.sendMail(mailOptions)
      console.log(`Tenant invitation email sent to ${email}`)

      return NextResponse.json({ success: true, message: 'Invitation email sent successfully' })
    }

    if (type === 'welcome') {
      const { email, first_name, last_name, property_name, unit_number, login_url } = data

      const emailContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Your New Home</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Your New Home!</h1>
              <p>Your account has been successfully created</p>
            </div>
            
            <div class="content">
              <p>Hello ${first_name} ${last_name},</p>
              
              <p>Congratulations! Your account for <strong>${property_name}, Unit ${unit_number}</strong> has been successfully created.</p>
              
              <p>You can now:</p>
              <ul>
                <li>View your lease information</li>
                <li>Make rent payments</li>
                <li>Submit maintenance requests</li>
                <li>Communicate with your property manager</li>
                <li>Access important documents</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${login_url}" class="button">Access Your Portal</a>
              </div>
              
              <p>If you have any questions or need assistance, please don't hesitate to contact your property manager.</p>
              
              <p>Welcome to your new home! 🏠</p>
            </div>
            
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `

      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@gustavoai.com',
        to: email,
        subject: `Welcome to ${property_name} - Your Account is Ready!`,
        html: emailContent,
      }

      await transporter.sendMail(mailOptions)
      console.log(`Welcome email sent to ${email}`)

      return NextResponse.json({ success: true, message: 'Welcome email sent successfully' })
    }

    return NextResponse.json({ error: 'Invalid email type' }, { status: 400 })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
} 