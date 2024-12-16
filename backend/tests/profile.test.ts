import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import profile from '@/controllers/profile';
import { db } from '@/db';
import { users } from '@/models/user';
import { eq } from 'drizzle-orm';
import { sessions, sessionRelations } from '@/models/session';

import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

// Extend the Request interface to include the email property
declare module 'express-serve-static-core' {
  interface Request {
    email?: string;
  }
}

const mockAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionID =
    req.cookies?.sessionID || (req.headers['session-id'] as string);
  if (sessionID) {
    const session = await db.query.sessions.findFirst({
      where: eq(sessions.session_id, sessionID),
    });
    if (session) {
      req.sessionID = sessionID || '';
    }
  }
  next();
};

const app = express();
app.use(express.json());
app.use(mockAuthMiddleware); // Use the mock authentication middleware
app.put('/editProfile', upload.single('image'), profile.updateProfile);
app.post('/delete-account', profile.deleteAccount);
app.get('/get-user-details/:id', profile.getUserDetails);

describe('Profile API', () => {
  beforeEach(async () => {
    // Setup: Insert a test user into the database
    await db.insert(users).values({
      email: 'test@example.com',
      password: 'testpassword',
      username: 'Test User',
      id: 1,
    });
    await db.insert(sessions).values({
      user_id: 1,
      id: 1,
      session_id: '1234',
      created_at: new Date(),
      data: 'ioioioiq',
      expires_at: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), // 1 day from now
    });
  });

  afterEach(async () => {
    // Cleanup: Remove the test user from the database
    // await db.delete(users).where(eq(users.email, 'test@example.com'));
    await db.delete(sessions).where(eq(sessions.user_id, 1));
    await db.delete(users).where(eq(users.id, 1));
  });

  describe('GET /get-user-details/:id', () => {
    it('should return the user details and return 200', async () => {
      const response = await request(app).get(`/get-user-details/1`);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe('test@example.com');
      expect(response.body.username).toBe('Test User');
    });

    it('should return 404 if the user is not found', async () => {
      const response = await request(app).get(`/get-user-details/2`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('PUT /update-profile', () => {
    it('should return 404 if the user session is not found', async () => {
      const response = await request(app)
        .put('/update-profile')
        .set('session-id', '')
        .send({ gender: 'male', username: 'UpdatedUser', phone: '1234567890' });

      expect(response.status).toBe(404);
      // expect(response.body.message).toBe('User not found');
    });
    it('should update the user profile and return 201 ', async () => {
      const response = await request(app)
        .put('/editProfile')
        .set('session-id', '1234')
        .send({
          gender: 'male',
          username: 'Updated User',
          phone: '1234567890',
          country: 'USA',
          bio: 'Updated bio',
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User details updated successfully');
    });
  });

  describe('POST /delete-account', () => {
    it('should delete the user account and return 200', async () => {
      const response = await request(app)
        .post('/delete-account')
        .set('Cookie', 'sessionID=1234')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Account deleted successfully');
    });

    it('should return 404 if the user is not found', async () => {
      const response = await request(app)
        .post('/delete-account')
        .set('Cookie', 'sessionID=1234')
        .send({ email: 'nonexistent@example.com' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });
});
