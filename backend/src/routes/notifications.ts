import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';

const router = Router();

// Placeholder for notification routes
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Notification routes - to be implemented' });
});

export default router; 