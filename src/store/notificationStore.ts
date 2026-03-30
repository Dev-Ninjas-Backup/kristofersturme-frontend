import { create } from 'zustand';
import { mockNotifications } from '@/data/mockData';
import type { Notification } from '@/types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: mockNotifications,
  unreadCount: mockNotifications.filter(n => !n.is_read).length,
  markAsRead: (id: string) => {
    const notifications = get().notifications.map(n =>
      n.id === id ? { ...n, is_read: true } : n
    );
    set({ notifications, unreadCount: notifications.filter(n => !n.is_read).length });
  },
  markAllAsRead: () => {
    const notifications = get().notifications.map(n => ({ ...n, is_read: true }));
    set({ notifications, unreadCount: 0 });
  },
  deleteNotification: (id: string) => {
    const notifications = get().notifications.filter(n => n.id !== id);
    set({ notifications, unreadCount: notifications.filter(n => !n.is_read).length });
  },
}));
