import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';

const router = Router();

// Placeholder for maintenance routes
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Maintenance routes - to be implemented' });
});

export default router; 