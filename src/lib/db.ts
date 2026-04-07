import {
  ref, get, set, update, remove, push, onValue, off, runTransaction,
  type DataSnapshot,
} from 'firebase/database';
import {
  createUserWithEmailAndPassword,
  signOut,
  fetchSignInMethodsForEmail,
} from 'firebase/auth';
import { database, secondaryAuth } from './firebase';
import type {
  MemberProfile, GranadaRoom, BarcelonaMatch,
  GranadaBooking, BarcelonaBooking, Notification, BookingStatus,
} from '@/types';

// ─── helpers ─────────────────────────────────────────────────────────────────

const r = (path: string) => ref(database, path);

const snapToArray = <T>(snap: DataSnapshot): T[] => {
  if (!snap.exists()) return [];
  const val = snap.val();
  return Object.entries(val).map(([id, data]) => ({ ...(data as object), id } as T));
};

// ─── users / roles ────────────────────────────────────────────────────────────

export const getUserData = async (uid: string) => {
  const snap = await get(r(`users/${uid}`));
  return snap.exists() ? snap.val() as { email: string; role: 'admin' | 'member'; is_active: boolean } : null;
};

export const setUserData = (uid: string, data: { email: string; role: 'admin' | 'member'; is_active: boolean }) =>
  set(r(`users/${uid}`), data);

// ─── members ─────────────────────────────────────────────────────────────────

export const getMembers = async (): Promise<MemberProfile[]> =>
  snapToArray(await get(r('members')));

export const onMembers = (cb: (members: MemberProfile[]) => void) => {
  const ref_ = r('members');
  onValue(ref_, snap => cb(snapToArray<MemberProfile>(snap)));
  return () => off(ref_);
};

export const updateMember = (id: string, data: Partial<MemberProfile>) =>
  update(r(`members/${id}`), data);

export const deleteMember = (id: string) => remove(r(`members/${id}`));

export const createMemberProfile = async (uid: string, email: string) => {
  const memberId = `m_${uid.slice(0, 8)}`;
  const profile: MemberProfile = {
    id: memberId,
    user_id: uid,
    first_name: email.split('@')[0],
    last_name: '',
    avatar_url: null,
    bio: null,
    occupation: null,
    phone: null,
    website_url: null,
    linkedin_url: null,
    instagram_url: null,
    twitter_url: null,
    is_visible: true,
    location: null,
    skills: [],
  };
  await set(r(`members/${memberId}`), profile);
  return profile;
};

// ─── rooms ────────────────────────────────────────────────────────────────────

export const onRooms = (cb: (rooms: GranadaRoom[]) => void) => {
  const ref_ = r('rooms');
  onValue(ref_, snap => cb(snapToArray<GranadaRoom>(snap)));
  return () => off(ref_);
};

export const updateRoom = (id: string, data: Partial<GranadaRoom>) =>
  update(r(`rooms/${id}`), data);

// ─── matches ──────────────────────────────────────────────────────────────────

export const onMatches = (cb: (matches: BarcelonaMatch[]) => void) => {
  const ref_ = r('matches');
  onValue(ref_, snap => cb(snapToArray<BarcelonaMatch>(snap)));
  return () => off(ref_);
};

export const createMatch = (data: Omit<BarcelonaMatch, 'id'>) => {
  const newRef = push(r('matches'));
  return set(newRef, { ...data, id: newRef.key });
};

export const updateMatch = (id: string, data: Partial<BarcelonaMatch>) =>
  update(r(`matches/${id}`), data);

export const deleteMatch = (id: string) => remove(r(`matches/${id}`));

// ─── notifications ────────────────────────────────────────────────────────────

const pushNotification = async (uid: string, type: string, title: string, message: string) => {
  const newRef = push(r(`notifications/${uid}`));
  await set(newRef, {
    id: newRef.key,
    type,
    title,
    message,
    is_read: false,
    created_at: new Date().toISOString(),
  });
};

const pushAdminNotification = async (type: string, title: string, message: string) => {
  const snap = await get(r('users'));
  if (!snap.exists()) return;
  const users = snap.val() as Record<string, { role: string }>;
  const adminUids = Object.entries(users)
    .filter(([, u]) => u.role === 'admin')
    .map(([uid]) => uid);
  await Promise.all(adminUids.map(uid => pushNotification(uid, type, title, message)));
};

// ─── granada bookings ─────────────────────────────────────────────────────────

export const onGranadaBookings = (cb: (bookings: GranadaBooking[]) => void) => {
  const ref_ = r('granadaBookings');
  onValue(ref_, snap => cb(snapToArray<GranadaBooking>(snap)));
  return () => off(ref_);
};

export const createGranadaBooking = async (data: Omit<GranadaBooking, 'id'>) => {
  const newRef = push(r('granadaBookings'));
  await set(newRef, { ...data, id: newRef.key });
  const memberName = `${data.member.first_name} ${data.member.last_name}`.trim();
  await Promise.all([
    pushNotification(
      data.member.user_id,
      'booking',
      'Booking Request Received',
      `Your request for ${data.room.name} (${data.check_in} → ${data.check_out}) has been submitted and is awaiting confirmation.`,
    ),
    pushAdminNotification(
      'booking',
      'New Granada Booking',
      `${memberName} requested ${data.room.name} (${data.check_in} → ${data.check_out}).`,
    ),
  ]);
};

export const updateGranadaBookingStatus = async (
  id: string,
  status: BookingStatus,
  booking?: GranadaBooking,
) => {
  await update(r(`granadaBookings/${id}`), { status });
  if (!booking) return;
  const uid = booking.member.user_id;
  const room = booking.room.name;
  const dates = `${booking.check_in} → ${booking.check_out}`;
  const prevStatus = booking.status;

  if (prevStatus === 'cancellation_requested' && status === 'cancelled')
    await pushNotification(uid, 'booking', 'Cancellation Approved', `Your cancellation request for ${room} (${dates}) has been approved.`);
  else if (prevStatus === 'cancellation_requested' && status === 'confirmed')
    await pushNotification(uid, 'booking', 'Cancellation Rejected', `Your cancellation request for ${room} (${dates}) was not approved. Your booking remains confirmed.`);
  else if (status === 'confirmed')
    await pushNotification(uid, 'booking', 'Booking Confirmed', `Your booking for ${room} (${dates}) has been confirmed.`);
  else if (status === 'cancelled')
    await pushNotification(uid, 'booking', 'Booking Cancelled', `Your booking for ${room} (${dates}) has been cancelled by the admin.`);
  else if (status === 'completed')
    await pushNotification(uid, 'booking', 'Stay Completed', `We hope you enjoyed your stay at ${room}. Thank you!`);
};

export const requestGranadaCancellation = async (id: string, booking: GranadaBooking) => {
  await update(r(`granadaBookings/${id}`), { status: 'cancellation_requested' });
  const memberName = `${booking.member.first_name} ${booking.member.last_name}`.trim();
  await Promise.all([
    pushNotification(
      booking.member.user_id,
      'booking',
      'Cancellation Requested',
      `Your cancellation request for ${booking.room.name} (${booking.check_in} → ${booking.check_out}) is awaiting admin approval.`,
    ),
    pushAdminNotification(
      'booking',
      'Cancellation Request — Granada',
      `${memberName} requested cancellation for ${booking.room.name} (${booking.check_in} → ${booking.check_out}).`,
    ),
  ]);
};

export const requestBarcelonaCancellation = async (id: string, booking: BarcelonaBooking) => {
  await update(r(`barcelonaBookings/${id}`), { status: 'cancellation_requested' });
  const memberName = `${booking.member.first_name} ${booking.member.last_name}`.trim();
  const seats = `${booking.seats} seat${booking.seats > 1 ? 's' : ''}`;
  await Promise.all([
    pushNotification(
      booking.member.user_id,
      'booking',
      'Cancellation Requested',
      `Your cancellation request for FC Barcelona vs ${booking.match.opponent} (${seats}) is awaiting admin approval.`,
    ),
    pushAdminNotification(
      'booking',
      'Cancellation Request — Barcelona',
      `${memberName} requested cancellation for FC Barcelona vs ${booking.match.opponent} (${seats}).`,
    ),
  ]);
};

// ─── barcelona bookings ───────────────────────────────────────────────────────

export const onBarcelonaBookings = (cb: (bookings: BarcelonaBooking[]) => void) => {
  const ref_ = r('barcelonaBookings');
  onValue(ref_, snap => cb(snapToArray<BarcelonaBooking>(snap)));
  return () => off(ref_);
};

export const createBarcelonaBooking = async (data: Omit<BarcelonaBooking, 'id'>) => {
  const newRef = push(r('barcelonaBookings'));
  await set(newRef, { ...data, id: newRef.key });
  await runTransaction(r(`matches/${data.match.id}/seats_remaining`), current =>
    Math.max(0, (current ?? 0) - data.seats)
  );
  const memberName = `${data.member.first_name} ${data.member.last_name}`.trim();
  const seats = `${data.seats} seat${data.seats > 1 ? 's' : ''}`;
  await Promise.all([
    pushNotification(
      data.member.user_id,
      'booking',
      'Booking Request Received',
      `Your request for ${seats} at FC Barcelona vs ${data.match.opponent} has been submitted and is awaiting confirmation.`,
    ),
    pushAdminNotification(
      'booking',
      'New Barcelona Booking',
      `${memberName} requested ${seats} for FC Barcelona vs ${data.match.opponent}.`,
    ),
  ]);
};

export const updateBarcelonaBookingStatus = async (
  id: string,
  newStatus: BookingStatus,
  booking?: BarcelonaBooking,
) => {
  await update(r(`barcelonaBookings/${id}`), { status: newStatus });
  if (!booking) return;

  const prevStatus = booking.status;
  const uid = booking.member.user_id;
  const match = `FC Barcelona vs ${booking.match.opponent}`;
  const seats = `${booking.seats} seat${booking.seats > 1 ? 's' : ''}`;

  // Seat delta
  let delta = 0;
  if (newStatus === 'cancelled' && prevStatus !== 'cancelled') delta = +booking.seats;
  if (newStatus !== 'cancelled' && prevStatus === 'cancelled') delta = -booking.seats;

  if (delta !== 0) {
    const totalSnap = await get(r(`matches/${booking.match.id}/total_seats`));
    const total: number = totalSnap.val() ?? 999;
    await runTransaction(r(`matches/${booking.match.id}/seats_remaining`), current =>
      Math.min(total, Math.max(0, (current ?? 0) + delta))
    );
  }

  // Notifications — check cancellation_requested transitions first
  if (prevStatus === 'cancellation_requested' && newStatus === 'cancelled')
    await pushNotification(uid, 'booking', 'Cancellation Approved', `Your cancellation request for ${match} (${seats}) has been approved.`);
  else if (prevStatus === 'cancellation_requested' && newStatus === 'confirmed')
    await pushNotification(uid, 'booking', 'Cancellation Rejected', `Your cancellation request for ${match} was not approved. Your booking remains confirmed.`);
  else if (newStatus === 'confirmed')
    await pushNotification(uid, 'booking', 'Booking Confirmed', `Your booking for ${seats} at ${match} has been confirmed.`);
  else if (newStatus === 'cancelled')
    await pushNotification(uid, 'booking', 'Booking Cancelled', `Your booking for ${seats} at ${match} has been cancelled by the admin.`);
  else if (newStatus === 'completed')
    await pushNotification(uid, 'booking', 'Match Completed', `We hope you enjoyed the match: ${match}!`);
};

// ─── notifications ────────────────────────────────────────────────────────────

export const onNotifications = (uid: string, cb: (notifs: Notification[]) => void) => {
  const ref_ = r(`notifications/${uid}`);
  onValue(ref_, snap => {
    const notifs = snapToArray<Notification>(snap);
    notifs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    cb(notifs);
  });
  return () => off(ref_);
};

export const markNotificationRead = (uid: string, id: string) =>
  update(r(`notifications/${uid}/${id}`), { is_read: true });

export const markAllNotificationsRead = async (uid: string) => {
  const snap = await get(r(`notifications/${uid}`));
  if (!snap.exists()) return;
  const updates: Record<string, boolean> = {};
  Object.keys(snap.val()).forEach(id => { updates[`notifications/${uid}/${id}/is_read`] = true; });
  return update(r('/'), updates);
};

export const deleteNotificationItem = (uid: string, id: string) =>
  remove(r(`notifications/${uid}/${id}`));

// ─── create member user (admin action) ───────────────────────────────────────

export const createMemberUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: 'admin' | 'member' = 'member',
) => {
  // Use secondary auth so the current admin session is not affected
  const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
  const uid = cred.user.uid;
  await signOut(secondaryAuth);

  const userData = { email, role, is_active: true };
  await setUserData(uid, userData);

  const memberId = `m_${uid.slice(0, 8)}`;
  const memberProfile: MemberProfile = {
    id: memberId,
    user_id: uid,
    first_name: firstName,
    last_name: lastName,
    avatar_url: null,
    bio: null,
    occupation: null,
    phone: null,
    website_url: null,
    linkedin_url: null,
    instagram_url: null,
    twitter_url: null,
    is_visible: true,
    location: null,
    skills: [],
  };
  await set(r(`members/${memberId}`), memberProfile);

  return { uid, memberId };
};

// ─── seed superadmin (runs once on app start) ─────────────────────────────────

export const seedSuperAdmin = async () => {
  const email = import.meta.env.VITE_SUPERADMIN_EMAIL as string;
  const password = import.meta.env.VITE_SUPERADMIN_PASSWORD as string;
  if (!email || !password) return;

  // Check if already seeded
  const snap = await get(r('config/superadmin_seeded'));
  if (snap.exists()) return;

  // Check if account already exists in Firebase Auth
  try {
    const methods = await fetchSignInMethodsForEmail(secondaryAuth, email);
    if (methods.length > 0) {
      // Auth user exists — just ensure DB record exists
      await set(r('config/superadmin_seeded'), true);
      return;
    }
  } catch { /* ignore */ }

  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    const uid = cred.user.uid;
    await signOut(secondaryAuth);
    await setUserData(uid, { email, role: 'admin', is_active: true });
    await set(r('config/superadmin_seeded'), true);
  } catch (err: unknown) {
    // auth/email-already-in-use means it exists — mark as seeded
    if ((err as { code?: string }).code === 'auth/email-already-in-use') {
      await set(r('config/superadmin_seeded'), true);
    }
    // other errors: silently skip (e.g. network issue on cold start)
  }
};

// ─── seed (runs once when /members is empty) ──────────────────────────────────

export const seedIfEmpty = async () => {
  const snap = await get(r('members'));
  if (snap.exists()) return; // already seeded

  const { mockMembers, mockRooms, mockMatches, mockGranadaBookings, mockBarcelonaBookings, mockNotifications } =
    await import('@/data/mockData');

  const batch: Record<string, unknown> = {};

  mockMembers.forEach(m => { batch[`members/${m.id}`] = m; });
  mockRooms.forEach(r_ => { batch[`rooms/${r_.id}`] = r_; });
  mockMatches.forEach(m => { batch[`matches/${m.id}`] = m; });
  mockGranadaBookings.forEach(b => { batch[`granadaBookings/${b.id}`] = b; });
  mockBarcelonaBookings.forEach(b => { batch[`barcelonaBookings/${b.id}`] = b; });

  // seed notifications for first member's user_id as a demo
  const demoUid = 'DEMO_MEMBER_UID';
  mockNotifications.forEach(n => { batch[`notifications/${demoUid}/${n.id}`] = n; });

  await update(r('/'), batch);
};
