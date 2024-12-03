import { db } from '@/db';
import { sessions } from '@/models/session';
import { eq } from 'drizzle-orm';
import { Request, Response, NextFunction } from 'express';

export default async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const session = await db.query.sessions.findFirst({
    where: eq(sessions.session_id, req.sessionID),
  });

  // If there is no session, redirect to login
  if (!session) {
    return res.redirect('/login');
  }

  // If the session has expired, redirect to login
  if (session.expires_at < new Date()) {
    return res.redirect('/login');
  }

  next();
}
