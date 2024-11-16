import { Request, Response, NextFunction } from 'express';

export default function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.user) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
}
