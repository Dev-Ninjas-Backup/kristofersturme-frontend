import { create } from 'zustand';
import {
  onNotifications, markNotificationRead,
  markAllNotificationsRead, deleteNotificationItem,
} from '@/lib/db';
import type { Notification } from '@/types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  uid: string | null;
  init: (uid: string) => () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  uid: null,

  init: (uid: string) => {
    set({ uid });
    return onNotifications(uid, (notifs) => {
      set({ notifications: notifs, unreadCount: notifs.filter(n => !n.is_read).length });
    });
  },

  markAsRead: (id: string) => {
    const { uid } = get();
    if (uid) markNotificationRead(uid, id);
  },

  markAllAsRead: () => {
    const { uid } = get();
    if (uid) markAllNotificationsRead(uid);
  },

  deleteNotification: (id: string) => {
    const { uid } = get();
    if (uid) deleteNotificationItem(uid, id);
  },
}));
