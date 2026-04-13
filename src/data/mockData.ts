import type { MemberProfile, GranadaRoom, GranadaBooking, BarcelonaMatch, BarcelonaBooking, Notification, User } from '@/types';

export const currentUser: User = {
  id: 'u1',
  email: 'james@example.com',
  role: 'member',
  is_active: true,
};

export const mockMembers: MemberProfile[] = [
  {
    id: 'm1', user_id: 'u1', first_name: 'James', last_name: 'Whitfield',
    avatar_url: null, bio: 'Serial entrepreneur and angel investor based in London. Passionate about fintech and sustainable business models.',
    phone: '+44 7700 900000', website_url: 'https://jameswhitfield.co', linkedin_url: 'https://linkedin.com/in/jameswhitfield',
    instagram_url: null, twitter_url: 'https://twitter.com/jwhitfield', is_visible: true,
    location: { id: 'l1', country: 'United Kingdom', city: 'London', latitude: 51.5074, longitude: -0.1278 },
    skills: [{ id: 's1', name: 'Fintech', slug: 'fintech' }, { id: 's2', name: 'Investing', slug: 'investing' }],
  },
  {
    id: 'm2', user_id: 'u2', first_name: 'Sofia', last_name: 'Martinez',
    avatar_url: null, bio: 'Creative director and brand strategist. Working with luxury brands across Europe.',
    phone: null, website_url: null, linkedin_url: 'https://linkedin.com/in/sofiamartinez',
    instagram_url: 'https://instagram.com/sofiam', twitter_url: null, is_visible: true,
    location: { id: 'l2', country: 'Spain', city: 'Barcelona', latitude: 41.3874, longitude: 2.1686 },
    skills: [{ id: 's3', name: 'Branding', slug: 'branding' }, { id: 's4', name: 'Design', slug: 'design' }],
  },
  {
    id: 'm3', user_id: 'u3', first_name: 'Marco', last_name: 'Bianchi',
    avatar_url: null, bio: 'Architect and real estate developer focused on sustainable luxury projects in the Mediterranean.',
    phone: '+39 333 123 4567', website_url: 'https://marcobianchi.it', linkedin_url: null,
    instagram_url: null, twitter_url: null, is_visible: true,
    location: { id: 'l3', country: 'Italy', city: 'Milan', latitude: 45.4642, longitude: 9.1900 },
    skills: [{ id: 's5', name: 'Architecture', slug: 'architecture' }, { id: 's6', name: 'Real Estate', slug: 'real-estate' }],
  },
  {
    id: 'm4', user_id: 'u4', first_name: 'Elena', last_name: 'Petrova',
    avatar_url: null, bio: 'Tech executive and startup mentor. Previously VP at a major European tech unicorn.',
    phone: null, website_url: null, linkedin_url: 'https://linkedin.com/in/elenapetrova',
    instagram_url: null, twitter_url: 'https://twitter.com/epetrova', is_visible: true,
    location: { id: 'l4', country: 'Germany', city: 'Berlin', latitude: 52.5200, longitude: 13.4050 },
    skills: [{ id: 's7', name: 'Technology', slug: 'technology' }, { id: 's1', name: 'Fintech', slug: 'fintech' }],
  },
  {
    id: 'm5', user_id: 'u5', first_name: 'Alexander', last_name: 'Dubois',
    avatar_url: null, bio: 'Private equity partner specializing in hospitality and luxury goods sectors.',
    phone: '+33 6 12 34 56 78', website_url: null, linkedin_url: 'https://linkedin.com/in/adubois',
    instagram_url: null, twitter_url: null, is_visible: true,
    location: { id: 'l5', country: 'France', city: 'Paris', latitude: 48.8566, longitude: 2.3522 },
    skills: [{ id: 's8', name: 'Private Equity', slug: 'private-equity' }, { id: 's9', name: 'Hospitality', slug: 'hospitality' }],
  },
  {
    id: 'm6', user_id: 'u6', first_name: 'Isabella', last_name: 'Santos',
    avatar_url: null, bio: 'Award-winning chef and restaurateur with venues across Lisbon and Porto.',
    phone: null, website_url: 'https://isabellasantos.pt', linkedin_url: null,
    instagram_url: 'https://instagram.com/chefisabella', twitter_url: null, is_visible: true,
    location: { id: 'l6', country: 'Portugal', city: 'Lisbon', latitude: 38.7223, longitude: -9.1393 },
    skills: [{ id: 's10', name: 'Culinary', slug: 'culinary' }, { id: 's9', name: 'Hospitality', slug: 'hospitality' }],
  },
  {
    id: 'm7', user_id: 'u7', first_name: 'Viktor', last_name: 'Lindqvist',
    avatar_url: null, bio: 'Venture capitalist and former CTO. Focused on climate-tech and deep-tech startups across Scandinavia.',
    phone: '+46 70 123 4567', website_url: 'https://viktorlindqvist.se', linkedin_url: 'https://linkedin.com/in/viktorlindqvist',
    instagram_url: null, twitter_url: null, is_visible: true,
    location: { id: 'l7', country: 'Sweden', city: 'Stockholm', latitude: 59.3293, longitude: 18.0686 },
    skills: [{ id: 's7', name: 'Technology', slug: 'technology' }, { id: 's2', name: 'Investing', slug: 'investing' }],
  },
  {
    id: 'm8', user_id: 'u8', first_name: 'Amara', last_name: 'Okafor',
    avatar_url: null, bio: 'International trade lawyer specializing in cross-border M&A and regulatory compliance.',
    phone: null, website_url: null, linkedin_url: 'https://linkedin.com/in/amaraokafor',
    instagram_url: null, twitter_url: null, is_visible: true,
    location: { id: 'l8', country: 'Netherlands', city: 'Amsterdam', latitude: 52.3676, longitude: 4.9041 },
    skills: [{ id: 's11', name: 'Law', slug: 'law' }, { id: 's1', name: 'Fintech', slug: 'fintech' }],
  },
  {
    id: 'm9', user_id: 'u9', first_name: 'Luca', last_name: 'Moretti',
    avatar_url: null, bio: 'Luxury automotive collector and motorsport enthusiast. Runs a classic car restoration business.',
    phone: '+39 348 567 8901', website_url: 'https://moretticlassics.com', linkedin_url: null,
    instagram_url: 'https://instagram.com/moretticlassics', twitter_url: null, is_visible: true,
    location: { id: 'l9', country: 'Italy', city: 'Turin', latitude: 45.0703, longitude: 7.6869 },
    skills: [{ id: 's12', name: 'Marketing', slug: 'marketing' }, { id: 's6', name: 'Real Estate', slug: 'real-estate' }],
  },
  {
    id: 'm10', user_id: 'u10', first_name: 'Charlotte', last_name: 'Van den Berg',
    avatar_url: null, bio: 'Contemporary art curator and gallery owner. Bridging emerging artists with private collectors.',
    phone: null, website_url: 'https://vandenberggallery.com', linkedin_url: 'https://linkedin.com/in/cvandenberg',
    instagram_url: 'https://instagram.com/cvandenberg_art', twitter_url: null, is_visible: true,
    location: { id: 'l10', country: 'Belgium', city: 'Brussels', latitude: 50.8503, longitude: 4.3517 },
    skills: [{ id: 's13', name: 'Art', slug: 'art' }, { id: 's4', name: 'Design', slug: 'design' }],
  },
  {
    id: 'm11', user_id: 'u11', first_name: 'Hugo', last_name: 'Fernandez',
    avatar_url: null, bio: 'Sports medicine physician and wellness entrepreneur. Founded a chain of elite recovery clinics.',
    phone: '+34 612 345 678', website_url: null, linkedin_url: 'https://linkedin.com/in/hugofernandez',
    instagram_url: null, twitter_url: null, is_visible: true,
    location: { id: 'l11', country: 'Spain', city: 'Madrid', latitude: 40.4168, longitude: -3.7038 },
    skills: [{ id: 's14', name: 'Medicine', slug: 'medicine' }, { id: 's9', name: 'Hospitality', slug: 'hospitality' }],
  },
  {
    id: 'm12', user_id: 'u12', first_name: 'Anastasia', last_name: 'Richter',
    avatar_url: null, bio: 'Digital marketing strategist and influencer economy expert. Advises Fortune 500 brands.',
    phone: null, website_url: 'https://anastasiarichter.de', linkedin_url: 'https://linkedin.com/in/arichter',
    instagram_url: 'https://instagram.com/anastasia.richter', twitter_url: 'https://twitter.com/arichter', is_visible: true,
    location: { id: 'l12', country: 'Austria', city: 'Vienna', latitude: 48.2082, longitude: 16.3738 },
    skills: [{ id: 's12', name: 'Marketing', slug: 'marketing' }, { id: 's3', name: 'Branding', slug: 'branding' }],
  },
];

export const mockRooms: GranadaRoom[] = [
  { id: 'r1', room_number: 1, name: 'The Alhambra Suite', description: 'Spacious suite with views of the Sierra Nevada mountains. Features a private terrace and traditional Andalusian decor.', capacity: 1, is_owners: false, is_active: true },
  { id: 'r2', room_number: 2, name: 'The Generalife Room', description: 'Elegant room inspired by the Generalife gardens. Includes a reading nook and garden access.', capacity: 1, is_owners: false, is_active: true },
  { id: 'r3', room_number: 3, name: 'The Albaicín Chamber', description: 'Cozy room with whitewashed walls and cobalt blue accents. Perfect for solo travelers.', capacity: 1, is_owners: false, is_active: true },
  { id: 'r4', room_number: 4, name: 'The Sacromonte Loft', description: 'Unique cave-inspired loft with vaulted ceilings and warm lighting.', capacity: 1, is_owners: false, is_active: true },
  { id: 'r5', room_number: 5, name: 'The Carmen Suite', description: 'Charming suite with a private courtyard garden and Moorish tile details. Ideal for guests seeking tranquility.', capacity: 1, is_owners: false, is_active: true },
  { id: 'r6', room_number: 6, name: "Owner's Private Suite", description: 'Private suite reserved for the club owner.', capacity: 4, is_owners: true, is_active: true },
];

export const mockMatches: BarcelonaMatch[] = [
  { id: 'bm1', opponent: 'Real Madrid', match_date: '2026-04-15T21:00:00Z', venue: 'Camp Nou', competition: 'La Liga', total_seats: 4, seats_remaining: 2, is_active: true },
  { id: 'bm2', opponent: 'Bayern Munich', match_date: '2026-04-22T20:00:00Z', venue: 'Camp Nou', competition: 'Champions League', total_seats: 4, seats_remaining: 4, is_active: true },
  { id: 'bm3', opponent: 'Atletico Madrid', match_date: '2026-05-03T18:30:00Z', venue: 'Camp Nou', competition: 'La Liga', total_seats: 4, seats_remaining: 0, is_active: true },
  { id: 'bm4', opponent: 'PSG', match_date: '2026-05-10T20:00:00Z', venue: 'Camp Nou', competition: 'Champions League', total_seats: 4, seats_remaining: 3, is_active: true },
];

export const mockGranadaBookings: GranadaBooking[] = [
  { id: 'gb1', member: mockMembers[0], room: mockRooms[0], check_in: '2026-04-10', check_out: '2026-04-14', status: 'confirmed', notes: 'Anniversary trip', created_at: '2026-03-20T10:00:00Z' },
  { id: 'gb2', member: mockMembers[1], room: mockRooms[1], check_in: '2026-04-18', check_out: '2026-04-20', status: 'pending', notes: null, created_at: '2026-03-22T14:00:00Z' },
];

export const mockBarcelonaBookings: BarcelonaBooking[] = [
  { id: 'bb1', member: mockMembers[0], match: mockMatches[0], seats: 2, status: 'confirmed', notes: 'Bringing a guest', created_at: '2026-03-15T10:00:00Z' },
  { id: 'bb2', member: mockMembers[2], match: mockMatches[1], seats: 1, status: 'pending', notes: null, created_at: '2026-03-18T16:00:00Z' },
];

export const mockNotifications: Notification[] = [
  { id: 'n1', type: 'booking', title: 'Booking Confirmed', message: 'Your booking at The Alhambra Suite has been confirmed for April 10-14.', is_read: false, created_at: '2026-03-25T09:00:00Z' },
  { id: 'n2', type: 'match', title: 'New Match Available', message: 'FC Barcelona vs PSG - Champions League seats now available!', is_read: false, created_at: '2026-03-24T15:00:00Z' },
  { id: 'n3', type: 'member', title: 'New Member Joined', message: 'Isabella Santos has joined the club. Say hello!', is_read: true, created_at: '2026-03-20T12:00:00Z' },
  { id: 'n4', type: 'system', title: 'Profile Update Reminder', message: 'Complete your profile to be visible in the members directory.', is_read: true, created_at: '2026-03-18T10:00:00Z' },
];

export const allSkills: string[] = ['Fintech', 'Investing', 'Branding', 'Design', 'Architecture', 'Real Estate', 'Technology', 'Private Equity', 'Hospitality', 'Culinary', 'Marketing', 'Law', 'Medicine', 'Art'];
