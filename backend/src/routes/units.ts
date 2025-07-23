import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../index';
import { createError } from '../middleware/errorHandler';
import { Request, Response, NextFunction } from 'express';

// Extend Request to include user
interface AuthRequest extends Request {
  user: {
    id: string;
    // add other user properties if needed
  };
}

const router = Router();

// Get all units for a property
router.get('/property/:propertyId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as AuthRequest).user;
    const { propertyId } = req.params;

    // Verify the property belongs to the user
    const property = await prisma.property.findFirst({
      where: { 
        id: propertyId,
        ownerId: user.id 
      }
    });

    if (!property) {
      return res.status(404).json({ 
        error: 'Property not found' 
      });
    }

    const units = await prisma.unit.findMany({
      where: { propertyId },
      include: {
        tenants: true,
        maintenance: {
          where: { status: { not: 'COMPLETED' } }
        }
      }
    });

    return res.json({ units });
  } catch (error) {
    return next(error);
  }
});

// Get single unit
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as AuthRequest).user;
    const { id } = req.params;

    const unit = await prisma.unit.findFirst({
      where: { 
        id,
        property: {
          ownerId: user.id
        }
      },
      include: {
        property: true,
        tenants: true,
        maintenance: true,
        payments: {
          include: { tenant: true }
        }
      }
    });

    if (!unit) {
      return res.status(404).json({ 
        error: 'Unit not found' 
      });
    }

    return res.json({ unit });
  } catch (error) {
    return next(error);
  }
});

// Create new unit
router.post('/', [
  body('propertyId').notEmpty(),
  body('unitNumber').trim().notEmpty(),
  body('bedrooms').isInt({ min: 0 }),
  body('bathrooms').isInt({ min: 0 }),
  body('squareFeet').optional().isInt({ min: 0 }),
  body('rentAmount').isFloat({ min: 0 }),
  body('description').optional().trim()
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as AuthRequest).user;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const {
      propertyId,
      unitNumber,
      bedrooms,
      bathrooms,
      squareFeet,
      rentAmount,
      description
    } = req.body;

    // Verify the property belongs to the user
    const property = await prisma.property.findFirst({
      where: { 
        id: propertyId,
        ownerId: user.id 
      }
    });

    if (!property) {
      return res.status(404).json({ 
        error: 'Property not found' 
      });
    }

    // Check if unit number already exists for this property
    const existingUnit = await prisma.unit.findFirst({
      where: {
        propertyId,
        unitNumber
      }
    });

    if (existingUnit) {
      return res.status(400).json({ 
        error: 'Unit number already exists for this property' 
      });
    }

    const unit = await prisma.unit.create({
      data: {
        propertyId,
        unitNumber,
        bedrooms,
        bathrooms,
        squareFeet,
        rentAmount: parseFloat(rentAmount),
        description
      }
    });

    return res.status(201).json({ 
      message: 'Unit created successfully',
      unit 
    });
  } catch (error) {
    return next(error);
  }
});

// Update unit
router.put('/:id', [
  body('unitNumber').optional().trim().notEmpty(),
  body('bedrooms').optional().isInt({ min: 0 }),
  body('bathrooms').optional().isInt({ min: 0 }),
  body('squareFeet').optional().isInt({ min: 0 }),
  body('rentAmount').optional().isFloat({ min: 0 }),
  body('description').optional().trim(),
  body('status').optional().isIn(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'UNAVAILABLE', 'RESERVED'])
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as AuthRequest).user;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { id } = req.params;

    // Check if unit exists and belongs to user's property
    const existingUnit = await prisma.unit.findFirst({
      where: { 
        id,
        property: {
          ownerId: user.id
        }
      }
    });

    if (!existingUnit) {
      return res.status(404).json({ 
        error: 'Unit not found' 
      });
    }

    const updateData = { ...req.body };
    if (updateData.rentAmount) {
      updateData.rentAmount = parseFloat(updateData.rentAmount);
    }

    // If unit number is being changed, check for conflicts
    if (updateData.unitNumber && updateData.unitNumber !== existingUnit.unitNumber) {
      const conflictingUnit = await prisma.unit.findFirst({
        where: {
          propertyId: existingUnit.propertyId,
          unitNumber: updateData.unitNumber,
          id: { not: id }
        }
      });

      if (conflictingUnit) {
        return res.status(400).json({ 
          error: 'Unit number already exists for this property' 
        });
      }
    }

    const unit = await prisma.unit.update({
      where: { id },
      data: updateData
    });

    return res.json({ 
      message: 'Unit updated successfully',
      unit 
    });
  } catch (error) {
    return next(error);
  }
});

// Delete unit
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as AuthRequest).user;
    const { id } = req.params;

    // Check if unit exists and belongs to user's property
    const existingUnit = await prisma.unit.findFirst({
      where: { 
        id,
        property: {
          ownerId: user.id
        }
      }
    });

    if (!existingUnit) {
      return res.status(404).json({ 
        error: 'Unit not found' 
      });
    }

    // Check if unit has active tenants
    const activeTenants = await prisma.tenant.findFirst({
      where: {
        unitId: id,
        status: 'ACTIVE'
      }
    });

    if (activeTenants) {
      return res.status(400).json({ 
        error: 'Cannot delete unit with active tenants' 
      });
    }

    await prisma.unit.delete({
      where: { id }
    });

    return res.json({ 
      message: 'Unit deleted successfully' 
    });
  } catch (error) {
    return next(error);
  }
});

export default router; 