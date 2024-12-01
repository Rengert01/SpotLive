import { getNotifications } from '@/controllers/notifications';
import express from 'express';

const notificationsRouter = express.Router();

notificationsRouter.get('/notifications', getNotifications);
notificationsRouter.put('/readNotification', getNotifications);
notificationsRouter.post('/deleteNotification', getNotifications);

export default notificationsRouter;
