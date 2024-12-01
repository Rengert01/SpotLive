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

export const markNotificationAsRead = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  // Validate input
  if (!id) {
    res.status(400).json({ message: 'Notification ID is required' });
    return;
  }

  try {
    // Update the notification's read status
    const updatedNotification = await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, Number(id)))
      .returning();

    if (!updatedNotification.length) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }

    res.status(200).json({
      message: 'Notification marked as read successfully',
      notification: updatedNotification[0],
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res
      .status(500)
      .json({ message: 'An error occurred while updating the notification' });
  }
};

export const deleteNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  // Validate input
  if (!id) {
    res.status(400).json({ message: 'Notification ID is required' });
    return;
  }

  try {
    // Attempt to delete the notification
    const deletedNotification = await db
      .delete(notifications)
      .where(eq(notifications.id, Number(id)))
      .returning();

    if (!deletedNotification.length) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }

    res.status(200).json({
      message: 'Notification deleted successfully',
      notification: deletedNotification[0],
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res
      .status(500)
      .json({ message: 'An error occurred while deleting the notification' });
  }
};
