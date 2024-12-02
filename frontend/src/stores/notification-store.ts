import { create } from 'zustand';

type Notification = {
  id: number;
  message: string;
  createdAt: string;
  read: boolean;
};

type NotificationState = {
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  clearNotification: () => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  clearNotification: () => set({ notifications: [] }),
}));
