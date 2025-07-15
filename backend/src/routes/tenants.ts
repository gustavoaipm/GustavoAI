import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const router = Router();
const prisma = new PrismaClient();

// Email configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Validation schemas
const createTenantSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone number is required'),
  dateOfBirth: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  leaseStart: z.string().datetime(),
  leaseEnd: z.string().datetime(),
  rentAmount: z.number().positive('Rent amount must be positive'),
  securityDeposit: z.number().positive('Security deposit must be positive'),
  unitId: z.string().min(1, 'Unit ID is required'),
});

// Get all tenants for a landlord
router.get('/', async (req, res) => {
  try {
    const landlordId = req.user.id;
    
    const tenants = await prisma.tenant.findMany({
      where: { landlordId },
      include: {
        unit: {
          include: {
            property: {
              select: {
                name: true,
                address: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(tenants);
  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
});

// Get a specific tenant
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const landlordId = req.user.id;

    const tenant = await prisma.tenant.findFirst({
      where: { id, landlordId },
      include: {
        unit: {
          include: {
            property: true,
          },
        },
        payments: {
          orderBy: { dueDate: 'desc' },
          take: 10,
        },
        maintenance: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    res.json(tenant);
  } catch (error) {
    console.error('Error fetching tenant:', error);
    res.status(500).json({ error: 'Failed to fetch tenant' });
  }
});

// Create a new tenant with email invitation
router.post('/', async (req, res) => {
  try {
    const landlordId = req.user.id;
    const validatedData = createTenantSchema.parse(req.body);

    // Check if unit exists and is available
    const unit = await prisma.unit.findFirst({
      where: { 
        id: validatedData.unitId,
        property: { ownerId: landlordId }
      },
      include: { property: true }
    });

    if (!unit) {
      return res.status(404).json({ error: 'Unit not found' });
    }

    if (unit.status !== 'AVAILABLE') {
      return res.status(400).json({ error: 'Unit is not available' });
    }

    // Check if email is already in use by a tenant
    const existingTenant = await prisma.tenant.findUnique({
      where: { email: validatedData.email }
    });

    if (existingTenant) {
      return res.status(400).json({ error: 'This email is already registered as a tenant' });
    }

    // Check if user exists (could be a property owner wanting to be a tenant)
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    // Create tenant record
    const tenant = await prisma.tenant.create({
      data: {
        ...validatedData,
        landlordId,
        leaseStart: new Date(validatedData.leaseStart),
        leaseEnd: new Date(validatedData.leaseEnd),
        rentAmount: validatedData.rentAmount,
        securityDeposit: validatedData.securityDeposit,
      },
      include: {
        unit: {
          include: {
            property: true,
          },
        },
      },
    });

    // Update unit status to occupied
    await prisma.unit.update({
      where: { id: validatedData.unitId },
      data: { status: 'OCCUPIED' },
    });

    // Generate invitation token
    const invitationToken = jwt.sign(
      { 
        tenantId: tenant.id, 
        email: validatedData.email,
        unitId: validatedData.unitId,
        landlordId 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Send invitation email
    const invitationLink = `${process.env.FRONTEND_URL}/tenant-signup?token=${invitationToken}`;
    
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f2937;">Welcome to Your New Home!</h2>
        <p>Hello ${validatedData.firstName},</p>
        <p>You've been invited to join the tenant portal for your new property. Here are your details:</p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Property Details</h3>
          <p><strong>Property:</strong> ${unit.property.name}</p>
          <p><strong>Address:</strong> ${unit.property.address}</p>
          <p><strong>Unit:</strong> ${unit.unitNumber}</p>
          <p><strong>Monthly Rent:</strong> $${validatedData.rentAmount}</p>
          <p><strong>Lease Start:</strong> ${new Date(validatedData.leaseStart).toLocaleDateString()}</p>
          <p><strong>Lease End:</strong> ${new Date(validatedData.leaseEnd).toLocaleDateString()}</p>
        </div>
        
        <p>To complete your account setup and access your tenant portal, please click the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${invitationLink}" 
             style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Complete Account Setup
          </a>
        </div>
        
        <p>This invitation link will expire in 7 days. If you have any questions, please contact your landlord.</p>
        
        <p>Best regards,<br>Your Property Management Team</p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: validatedData.email,
      subject: 'Welcome to Your New Home - Complete Your Account Setup',
      html: emailContent,
    });

    // Create initial rent payment record
    await prisma.payment.create({
      data: {
        amount: validatedData.rentAmount,
        type: 'RENT',
        status: 'PENDING',
        dueDate: new Date(validatedData.leaseStart),
        tenantId: tenant.id,
        unitId: validatedData.unitId,
        landlordId,
        description: 'First month rent',
      },
    });

    res.status(201).json({
      message: 'Tenant created successfully. Invitation email sent.',
      tenant,
    });
  } catch (error) {
    console.error('Error creating tenant:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Failed to create tenant' });
  }
});

// Update tenant
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const landlordId = req.user.id;
    const updateData = req.body;

    const tenant = await prisma.tenant.findFirst({
      where: { id, landlordId },
    });

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    const updatedTenant = await prisma.tenant.update({
      where: { id },
      data: {
        ...updateData,
        leaseStart: updateData.leaseStart ? new Date(updateData.leaseStart) : undefined,
        leaseEnd: updateData.leaseEnd ? new Date(updateData.leaseEnd) : undefined,
        rentAmount: updateData.rentAmount ? parseFloat(updateData.rentAmount) : undefined,
        securityDeposit: updateData.securityDeposit ? parseFloat(updateData.securityDeposit) : undefined,
      },
      include: {
        unit: {
          include: {
            property: true,
          },
        },
      },
    });

    res.json(updatedTenant);
  } catch (error) {
    console.error('Error updating tenant:', error);
    res.status(500).json({ error: 'Failed to update tenant' });
  }
});

// Delete tenant
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const landlordId = req.user.id;

    const tenant = await prisma.tenant.findFirst({
      where: { id, landlordId },
      include: { unit: true },
    });

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    // Update unit status back to available
    await prisma.unit.update({
      where: { id: tenant.unitId },
      data: { status: 'AVAILABLE' },
    });

    // Delete tenant
    await prisma.tenant.delete({
      where: { id },
    });

    res.json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    console.error('Error deleting tenant:', error);
    res.status(500).json({ error: 'Failed to delete tenant' });
  }
});

// Get available units for tenant assignment
router.get('/available-units', async (req, res) => {
  try {
    const landlordId = req.user.id;

    const units = await prisma.unit.findMany({
      where: {
        property: { ownerId: landlordId },
        status: 'AVAILABLE',
      },
      include: {
        property: {
          select: {
            name: true,
            address: true,
          },
        },
      },
      orderBy: [
        { property: { name: 'asc' } },
        { unitNumber: 'asc' },
      ],
    });

    res.json(units);
  } catch (error) {
    console.error('Error fetching available units:', error);
    res.status(500).json({ error: 'Failed to fetch available units' });
  }
});

// Verify tenant invitation token
router.post('/verify-invitation', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Check if tenant exists
    const tenant = await prisma.tenant.findUnique({
      where: { id: decoded.tenantId },
      include: {
        unit: {
          include: {
            property: true,
          },
        },
      },
    });

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    // Check if user account already exists (this is allowed for property owners)
    const existingUser = await prisma.user.findUnique({
      where: { email: tenant.email }
    });

    const invitation = {
      tenantId: tenant.id,
      email: tenant.email,
      unitId: tenant.unitId,
      landlordId: tenant.landlordId,
      firstName: tenant.firstName,
      lastName: tenant.lastName,
      propertyName: tenant.unit.property.name,
      unitNumber: tenant.unit.unitNumber,
      rentAmount: tenant.rentAmount,
    };

    res.json({ invitation });
  } catch (error) {
    console.error('Error verifying invitation:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ error: 'Invalid or expired invitation link' });
    }
    res.status(500).json({ error: 'Failed to verify invitation' });
  }
});

// Complete tenant signup
router.post('/complete-signup', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Check if tenant exists
    const tenant = await prisma.tenant.findUnique({
      where: { id: decoded.tenantId },
      include: {
        unit: {
          include: {
            property: true,
          },
        },
      },
    });

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    // Check if user account already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: tenant.email }
    });

    let user;
    
    if (existingUser) {
      // User exists (could be a property owner), update their password and role
      const hashedPassword = await bcrypt.hash(password, 12);
      
      user = await prisma.user.update({
        where: { email: tenant.email },
        data: {
          password: hashedPassword,
          // Keep existing role if they're an admin, otherwise set to TENANT
          role: existingUser.role === 'ADMIN' ? 'ADMIN' : 'TENANT',
          isTenant: true, // Mark as tenant
        },
      });
    } else {
      // Create new user account
      const hashedPassword = await bcrypt.hash(password, 12);
      
      user = await prisma.user.create({
        data: {
          email: tenant.email,
          password: hashedPassword,
          firstName: tenant.firstName,
          lastName: tenant.lastName,
          phone: tenant.phone,
          role: 'TENANT',
          isTenant: true,
        },
      });
    }

    // Update tenant to link with user account
    await prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        // Add any additional linking if needed
      },
    });

    // Send notification to landlord
    await prisma.notification.create({
      data: {
        title: 'Tenant Account Created',
        message: `${tenant.firstName} ${tenant.lastName} has completed their account setup for ${tenant.unit.property.name} Unit ${tenant.unit.unitNumber}.`,
        type: 'GENERAL',
        userId: tenant.landlordId,
      },
    });

    res.json({ 
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error completing signup:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ error: 'Invalid or expired invitation link' });
    }
    res.status(500).json({ error: 'Failed to create account' });
  }
});

export default router; 