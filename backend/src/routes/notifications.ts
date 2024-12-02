import { deleteNotification, getNotifications, markNotificationAsRead } from '@/controllers/notifications';
import express from 'express';

const notificationsRouter = express.Router();

notificationsRouter.get('/notifications', getNotifications);
notificationsRouter.put('/readNotification', markNotificationAsRead);
notificationsRouter.post('/deleteNotification', deleteNotification);

export default notificationsRouter;
