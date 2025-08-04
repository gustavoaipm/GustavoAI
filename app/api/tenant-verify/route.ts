import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create a Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    console.log('Tenant verification API called')
    const body = await request.json()
    const { token, invitationId, userId } = body

    console.log('Received token:', token ? 'present' : 'missing')
    console.log('Received invitationId:', invitationId)
    console.log('Received userId:', userId)

    if (!token || !invitationId || !userId) {
      console.log('Missing required parameters')
      return NextResponse.json(
        { error: 'Token, invitation ID, and user ID are required' },
        { status: 400 }
      )
    }

    // Get the invitation data
    console.log('Fetching invitation data...')
    const { data: invitation, error: fetchError } = await supabaseAdmin
      .from('tenant_invitations')
      .select('*')
      .eq('id', invitationId)
      .single()

    if (fetchError || !invitation) {
      console.log('Invitation fetch error:', fetchError)
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      )
    }

    console.log('Invitation found:', invitation.id)

    // Verify the token matches
    if (invitation.verification_token !== token) {
      console.log('Token mismatch')
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      )
    }

    // Check if invitation is already verified
    if (invitation.is_verified) {
      console.log('Invitation already verified')
      return NextResponse.json(
        { error: 'Invitation already verified' },
        { status: 400 }
      )
    }

    // Check if invitation has expired
    if (new Date(invitation.expires_at) < new Date()) {
      console.log('Invitation expired')
      return NextResponse.json(
        { error: 'Invitation has expired' },
        { status: 400 }
      )
    }

    // Mark invitation as verified
    console.log('Marking invitation as verified...')
    const { error: verifyError } = await supabaseAdmin
      .from('tenant_invitations')
      .update({
        is_verified: true,
        verified_at: new Date().toISOString()
      })
      .eq('id', invitationId)

    if (verifyError) {
      console.log('Error marking invitation as verified:', verifyError)
      return NextResponse.json(
        { error: 'Failed to mark invitation as verified' },
        { status: 500 }
      )
    }

    // Get the property_id from the unit
    console.log('Fetching unit to get property_id...')
    const { data: unit, error: unitFetchError } = await supabaseAdmin
      .from('units')
      .select('property_id')
      .eq('id', invitation.unit_id)
      .single()

    if (unitFetchError || !unit) {
      console.log('Error fetching unit:', unitFetchError)
      return NextResponse.json(
        { error: 'Failed to fetch unit information' },
        { status: 500 }
      )
    }

    console.log('Property ID from unit:', unit.property_id)

    // Create the user record in public.users
    console.log('Creating user record in public.users...')
    const { data: userRecord, error: userCreateError } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        email: invitation.email,
        first_name: invitation.first_name,
        last_name: invitation.last_name,
        phone: invitation.phone,
        role: 'TENANT'
      })
      .select()
      .single()

    if (userCreateError) {
      console.log('Failed to create user record:', userCreateError)
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      )
    }

    console.log('User record created:', userRecord)

    // Create the tenant
    console.log('Creating tenant with data:', {
      user_id: userId,
      email: invitation.email,
      first_name: invitation.first_name,
      last_name: invitation.last_name,
      phone: invitation.phone,
      unit_id: invitation.unit_id,
      property_id: unit.property_id,
      landlord_id: invitation.landlord_id
    })
    
    const { data: tenant, error: createError } = await supabaseAdmin
      .from('tenants')
      .insert({
        user_id: userId,
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
        property_id: unit.property_id,
        landlord_id: invitation.landlord_id,
        status: 'ACTIVE'
      })
      .select()
      .single()

    if (createError) {
      console.log('Error creating tenant:', createError)
      console.log('Error details:', {
        code: createError.code,
        message: createError.message,
        details: createError.details,
        hint: createError.hint
      })
      return NextResponse.json(
        { error: `Failed to create tenant account: ${createError.message}` },
        { status: 500 }
      )
    }

    console.log('Tenant created successfully:', tenant.id)

    // Only update unit status and property counts if unit_id is provided
    if (invitation.unit_id) {
      // Update unit status to occupied
      console.log('Updating unit status...')
      const { error: unitError } = await supabaseAdmin
        .from('units')
        .update({ status: 'OCCUPIED' })
        .eq('id', invitation.unit_id)

      if (unitError) {
        console.log('Error updating unit status:', unitError)
        return NextResponse.json(
          { error: 'Failed to update unit status' },
          { status: 500 }
        )
      }

      // Get the property_id for the unit to update available units count
      console.log('Updating property unit count...')
      const { data: unit, error: fetchUnitError } = await supabaseAdmin
        .from('units')
        .select('property_id')
        .eq('id', invitation.unit_id)
        .single()

      if (fetchUnitError) {
        console.log('Error fetching unit info:', fetchUnitError)
        return NextResponse.json(
          { error: 'Failed to fetch unit information' },
          { status: 500 }
        )
      }

      // Update the property's available units count
      if (unit && unit.property_id) {
        // Get current property
        const { data: property, error: propertyError } = await supabaseAdmin
          .from('properties')
          .select('total_units, available_units')
          .eq('id', unit.property_id)
          .single()

        if (!propertyError && property) {
          // Count occupied units
          const { count: occupiedUnits, error: countError } = await supabaseAdmin
            .from('units')
            .select('*', { count: 'exact', head: true })
            .eq('property_id', unit.property_id)
            .eq('status', 'OCCUPIED')

          if (!countError) {
            const availableUnits = (property.total_units || 0) - (occupiedUnits || 0)
            
            await supabaseAdmin
              .from('properties')
              .update({ available_units: availableUnits })
              .eq('id', unit.property_id)
          }
        }
      }
    } else {
      console.log('Tenant assigned to entire property (no specific unit)')
    }

    console.log('Tenant verification completed successfully')
    return NextResponse.json({
      success: true,
      tenant,
      message: 'Tenant account created successfully'
    })

  } catch (error) {
    console.error('Tenant verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 