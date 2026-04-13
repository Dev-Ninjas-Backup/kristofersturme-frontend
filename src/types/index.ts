export interface User {
  id: string;
  email: string;
  role: 'admin' | 'member';
  is_active: boolean;
}

export interface MemberLocation {
  id: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
}

export interface MemberProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  bio: string | null;
  occupation: string | null;
  phone: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  is_visible: boolean;
  location: MemberLocation | null;
  skills: Skill[];
}

export interface GranadaRoom {
  id: string;
  room_number: number;
  name: string;
  description: string;
  capacity: number;
  is_owners: boolean;
  is_active: boolean;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancellation_requested' | 'cancelled' | 'completed';

export interface GranadaBooking {
  id: string;
  member: MemberProfile;
  room: GranadaRoom;
  check_in: string;
  check_out: string;
  guests: BookingGuest[];
  status: BookingStatus;
  notes: string | null;
  created_at: string;
}

export interface BarcelonaMatch {
  id: string;
  opponent: string;
  match_date: string;
  venue: string;
  competition: string;
  total_seats: number;
  seats_remaining: number;
  is_active: boolean;
}

export interface BookingGuest {
  name: string;
  email: string | null;
  contact: string | null;
}

export interface BarcelonaBooking {
  id: string;
  member: MemberProfile;
  match: BarcelonaMatch;
  seats: number;
  guests: BookingGuest[];
  status: BookingStatus;
  notes: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Invitation {
  token: string;
  email: string | null;
  created_at: string;
  expires_at: string | null;   // null = never expires
  created_by: string;
  status: 'pending' | 'used' | 'revoked';
  max_uses: number | null;     // null = unlimited
  used_count: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
