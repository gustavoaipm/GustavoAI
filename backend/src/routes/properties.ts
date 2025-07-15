import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../index';
import { createError } from '../middleware/errorHandler';

const router = Router();

// Get all properties for the authenticated user
router.get('/', async (req: any, res, next) => {
  try {
    const properties = await prisma.property.findMany({
      where: { ownerId: req.user.id },
      include: {
        units: {
          include: {
            tenants: true,
            maintenance: {
              where: { status: { not: 'COMPLETED' } }
            }
          }
        },
        maintenance: {
          where: { status: { not: 'COMPLETED' } }
        }
      }
    });

    res.json({ properties });
  } catch (error) {
    next(error);
  }
});

// Get single property
router.get('/:id', async (req: any, res, next) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findFirst({
      where: { 
        id,
        ownerId: req.user.id 
      },
      include: {
        units: {
          include: {
            tenants: true,
            maintenance: true,
            payments: {
              include: { tenant: true }
            }
          }
        },
        maintenance: true
      }
    });

    if (!property) {
      return res.status(404).json({ 
        error: 'Property not found' 
      });
    }

    res.json({ property });
  } catch (error) {
    next(error);
  }
});

// Create new property
router.post('/', [
  body('name').trim().notEmpty(),
  body('address').trim().notEmpty(),
  body('city').trim().notEmpty(),
  body('state').trim().notEmpty(),
  body('zipCode').trim().notEmpty(),
  body('propertyType').isIn(['APARTMENT', 'HOUSE', 'CONDO', 'TOWNHOUSE', 'COMMERCIAL']),
  body('totalUnits').isInt({ min: 1 }),
  body('description').optional().trim(),
  body('units').isArray().optional()
], async (req: any, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const {
      name,
      address,
      city,
      state,
      zipCode,
      propertyType,
      totalUnits,
      description,
      units
    } = req.body;

    const property = await prisma.property.create({
      data: {
        name,
        address,
        city,
        state,
        zipCode,
        propertyType,
        totalUnits,
        description,
        ownerId: req.user.id
      }
    });

    // If units are provided, create them
    if (units && Array.isArray(units)) {
      for (const unitData of units) {
        await prisma.unit.create({
          data: {
            ...unitData,
            propertyId: property.id,
            rentAmount: parseFloat(unitData.rentAmount)
          }
        });
      }
    }

    // Fetch the property with units
    const propertyWithUnits = await prisma.property.findUnique({
      where: { id: property.id },
      include: {
        units: true
      }
    });

    res.status(201).json({ 
      message: 'Property created successfully',
      property: propertyWithUnits
    });
  } catch (error) {
    next(error);
  }
});

// Update property
router.put('/:id', [
  body('name').optional().trim().notEmpty(),
  body('address').optional().trim().notEmpty(),
  body('city').optional().trim().notEmpty(),
  body('state').optional().trim().notEmpty(),
  body('zipCode').optional().trim().notEmpty(),
  body('propertyType').optional().isIn(['APARTMENT', 'HOUSE', 'CONDO', 'TOWNHOUSE', 'COMMERCIAL']),
  body('totalUnits').optional().isInt({ min: 1 }),
  body('description').optional().trim()
], async (req: any, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { id } = req.params;

    // Check if property exists and belongs to user
    const existingProperty = await prisma.property.findFirst({
      where: { 
        id,
        ownerId: req.user.id 
      }
    });

    if (!existingProperty) {
      return res.status(404).json({ 
        error: 'Property not found' 
      });
    }

    const updateData = { ...req.body };

    const property = await prisma.property.update({
      where: { id },
      data: updateData
    });

    res.json({ 
      message: 'Property updated successfully',
      property 
    });
  } catch (error) {
    next(error);
  }
});

// Delete property
router.delete('/:id', async (req: any, res, next) => {
  try {
    const { id } = req.params;

    // Check if property exists and belongs to user
    const property = await prisma.property.findFirst({
      where: { 
        id,
        ownerId: req.user.id 
      }
    });

    if (!property) {
      return res.status(404).json({ 
        error: 'Property not found' 
      });
    }

    await prisma.property.delete({
      where: { id }
    });

    res.json({ 
      message: 'Property deleted successfully' 
    });
  } catch (error) {
    next(error);
  }
});

export default router; 