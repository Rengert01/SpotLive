import { getNotifications } from '@/controllers/notifications';
import express from 'express';

const NotificationsRouter = express.Router();

NotificationsRouter.get('/notifications', getNotifications);

export default NotificationsRouter;
