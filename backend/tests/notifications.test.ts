import express, { Request, Response, NextFunction } from 'express';
import {
  deleteNotification,
  getNotifications,
  markNotificationAsRead,
  notifyAllFollowers,
} from '@/controllers/notifications';
import request from 'supertest';
import { db } from '@/db'; // Adjust the import based on your project structure
import { users, sessions, notifications, followers } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface MockRequest extends Request {
  sessionID: string;
}

const mockAuthMiddleware = (
  req: MockRequest,
  res: Response,
  next: NextFunction
) => {
  req.sessionID = '1234'; // Mock authenticated session ID
  next();
};

const app = express();
app.use(express.json());
app.use(mockAuthMiddleware); // Use the mock authentication middleware
app.get('/notifications', getNotifications);
app.put('/readNotification', markNotificationAsRead);
app.delete('/notifications', deleteNotification);

describe('Notifications API', () => {
  let notificationId: number;
  beforeEach(async () => {
    // Setup: Insert test users and session into the database
    await db.insert(users).values([
      {
        email: 'test@example.com',
        password: 'testpassword',
        username: 'Test User',
        id: 1,
      },
      {
        email: 'artist@example.com',
        password: 'artistpassword',
        username: 'Artist User',
        id: 2,
      },
    ]);

    await db.insert(sessions).values([
      {
        user_id: 1,
        session_id: '1234',
        created_at: new Date(),
        data: 'ioioioiq',
        expires_at: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), // 1 day from now
      },
      {
        user_id: 2,
        session_id: '5678',
        created_at: new Date(),
        data: 'ioioioiq',
        expires_at: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), // 1 day from now
      },
    ]);

    const [notification] = await db
      .insert(notifications)
      .values({
        userId: 1,
        message: 'Test notification',
        createdAt: new Date(),
        read: false,
      })
      .returning();

    notificationId = notification.id;

    await db.insert(followers).values({
      followerId: 1,
      followedId: 2,
    });
  });

  afterEach(async () => {
    // Cleanup: Remove the test data from the database
    await db.delete(sessions).where(eq(sessions.user_id, 1));
    await db.delete(sessions).where(eq(sessions.user_id, 2));
    await db.delete(users).where(eq(users.id, 1));
    await db.delete(users).where(eq(users.id, 2));
    await db.delete(notifications).where(eq(notifications.userId, 1));
    await db.delete(followers).where(eq(followers.followerId, 1));
  });

  it('should get notifications for the user', async () => {
    const response = await request(app)
      .get('/notifications')
      .set('Cookie', 'sessionID=1234');

    expect(response.status).toBe(200);
    expect(response.body.notifications).toHaveLength(1);
    expect(response.body.notifications[0].message).toBe('Test notification');
  });

  it('should mark a notification as read', async () => {
    const response = await request(app)
      .put('/readNotification')
      .set('Cookie', 'sessionID=1234')
      .send({ id: notificationId });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      'Notification marked as read successfully'
    );
    expect(response.body.notification.read).toBe(true);
  });

  it('should delete a notification', async () => {
    const response = await request(app)
      .delete('/notifications')
      .set('Cookie', 'sessionID=1234')
      .send({ id: notificationId });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Notification deleted successfully');
  });

  //   it('should notify all followers', async () => {
  //     await request(app)
  //       .post('/notifications/notify-all-followers')
  //       .send({ artistId: 2, songTitle: 'New Song' });

  //     const notificationsList = await db.query.notifications.findMany({
  //       where: eq(notifications.userId, 1),
  //     });

  //     expect(notificationsList).toHaveLength(2);
  //     expect(notificationsList[1].message).toBe('New song uploaded: New Song');
  //   });
});
