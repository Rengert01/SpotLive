import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from '@/components/ui/sheet';
  import { Bell } from 'lucide-react';
  import { useState } from 'react';
  
  type Notification = {
    id: number;
    message: string;
    timestamp: string;
    read: boolean;
  };
  
  export default function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>([
      {
        id: 1,
        message: 'You have a new follower!',
        timestamp: '2024-12-01T14:30:00Z',
        read: false,
      },
      {
        id: 2,
        message: 'Your recent upload is live!',
        timestamp: '2024-12-01T13:00:00Z',
        read: true,
      },
    ]);
  
    const markAsRead = (id: number) => {
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    };
  
    const deleteNotification = (id: number) => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    };
  
    return (
      <Sheet>
        <SheetTrigger>
          <Bell />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>
              Stay up to date with the latest updates and alerts.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    notif.read ? 'bg-gray-100' : 'bg-white'
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium">{notif.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(notif.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="text-blue-600 text-sm"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="text-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500">
                No new notifications.
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  