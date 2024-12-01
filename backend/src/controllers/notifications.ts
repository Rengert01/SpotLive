import { Request, Response } from 'express';
import { db } from '@/db';
import { desc, eq } from 'drizzle-orm';
import { followers, notifications } from '@/db/schema';

export const getNotifications = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.query;

  if (!userId) {
    res.status(400).json({ message: 'User ID is required' });
    return;
  }

  const notificationsList = await db.query.notifications.findMany({
    where: eq(notifications.userId, Number(userId)),
    orderBy: desc(notifications.createdAt),
  });

  res.status(200).json({ notifications: notificationsList });
};

export const notifyAllFollowers = async (
  artistId: number,
  songTitle: string
): Promise<void> => {
  const followersList = await db.query.followers.findMany({
    where: eq(followers.followedId, artistId),
  });

  if (!followersList.length) {
    return;
  }

  const notificationsData = followersList.map((follower) => ({
    userId: follower.followerId,
    message: `New song uploaded: ${songTitle}`,
  }));

  await db.insert(notifications).values(notificationsData);
};
