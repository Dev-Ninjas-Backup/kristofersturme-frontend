import { useState, useEffect } from 'react';
import {
  onMembers, onRooms, onMatches,
  onGranadaBookings, onBarcelonaBookings, onNotifications,
} from '@/lib/db';
import type {
  MemberProfile, GranadaRoom, BarcelonaMatch,
  GranadaBooking, BarcelonaBooking, Notification,
} from '@/types';

const useFirebase = <T>(subscribe: (cb: (data: T[]) => void) => () => void) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = subscribe(d => { setData(d); setLoading(false); });
    return unsub;
  }, []);
  return { data, loading };
};

export const useMembers = () => useFirebase<MemberProfile>(onMembers);
export const useRooms = () => useFirebase<GranadaRoom>(onRooms);
export const useMatches = () => useFirebase<BarcelonaMatch>(onMatches);
export const useGranadaBookings = () => useFirebase<GranadaBooking>(onGranadaBookings);
export const useBarcelonaBookings = () => useFirebase<BarcelonaBooking>(onBarcelonaBookings);

export const useNotifications = (uid: string | null) => {
  const [data, setData] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!uid) { setLoading(false); return; }
    const unsub = onNotifications(uid, d => { setData(d); setLoading(false); });
    return unsub;
  }, [uid]);
  return { data, loading };
};
