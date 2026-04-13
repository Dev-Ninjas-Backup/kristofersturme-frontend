import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useRooms, useMembers, useGranadaBookings } from '@/hooks/useDb';
import { createGranadaBooking } from '@/lib/db';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Users, Calendar, Info, User } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { BookingGuest } from '@/types';

const emptyGuest = (): BookingGuest => ({ name: '', email: null, contact: null });

const GranadaRoomDetail = () => {
  const { roomId } = useParams();
  const { data: rooms } = useRooms();
  const { data: members } = useMembers();
  const { data: bookings } = useGranadaBookings();
  const user = useAuthStore(s => s.user);
  const room = rooms.find(r => r.id === roomId);
  const memberProfile = members.find(m => m.user_id === user?.id);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [dateError, setDateError] = useState('');
  const [notes, setNotes] = useState('');
  const [guestCount, setGuestCount] = useState(1); // includes the booking user
  const [guests, setGuests] = useState<BookingGuest[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Sync additional guest forms to guestCount - 1
  useEffect(() => {
    setGuests(prev => {
      const extra = guestCount - 1;
      if (extra <= 0) return [];
      if (prev.length === extra) return prev;
      if (prev.length < extra) return [...prev, ...Array.from({ length: extra - prev.length }, emptyGuest)];
      return prev.slice(0, extra);
    });
  }, [guestCount]);

  const updateGuest = (index: number, field: keyof BookingGuest, value: string) => {
    setGuests(prev => prev.map((g, i) => i === index ? { ...g, [field]: value || null } : g));
  };

  if (!room || room.is_owners) return (
    <div className="text-center py-16">
      <p className="text-muted-foreground">Room not found.</p>
      <Link to="/bookings/granada" className="text-gold mt-2 inline-block">Back to rooms</Link>
    </div>
  );

  // Bookings that block this room (confirmed or pending, not yet checked out)
  const today = new Date().toISOString().split('T')[0];
  const roomBookings = bookings.filter(b =>
    b.room.id === roomId &&
    (b.status === 'confirmed' || b.status === 'pending') &&
    b.check_out >= today
  );

  const hasDateConflict = (ci: string, co: string) =>
    roomBookings.some(b => ci < b.check_out && co > b.check_in);

  const validateDates = (ci: string, co: string) => {
    if (!ci || !co) { setDateError(''); return; }
    if (co <= ci) { setDateError('Check-out must be after check-in.'); return; }
    const conflict = roomBookings.find(b => ci < b.check_out && co > b.check_in);
    if (conflict) {
      setDateError(`These dates overlap a ${conflict.status} booking (${conflict.check_in} → ${conflict.check_out}). Please choose different dates.`);
    } else {
      setDateError('');
    }
  };

  const handleCheckInChange = (val: string) => {
    setCheckIn(val);
    validateDates(val, checkOut);
    // Reset check-out if it's now before or equal to check-in
    if (checkOut && checkOut <= val) setCheckOut('');
  };

  const handleCheckOutChange = (val: string) => {
    setCheckOut(val);
    validateDates(checkIn, val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) { toast.error('Please select check-in and check-out dates'); return; }
    if (new Date(checkOut) <= new Date(checkIn)) { toast.error('Check-out must be after check-in'); return; }
    if (hasDateConflict(checkIn, checkOut)) { toast.error('These dates overlap with an existing booking. Please choose different dates.'); return; }
    if (!room || !user) return;

    for (let i = 0; i < guests.length; i++) {
      if (!guests[i].name.trim()) {
        toast.error(`Please enter a name for Guest ${i + 2}`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const allGuests: BookingGuest[] = [
        {
          name: memberProfile
            ? `${memberProfile.first_name} ${memberProfile.last_name}`.trim()
            : user.email.split('@')[0],
          email: user.email,
          contact: memberProfile?.phone ?? null,
        },
        ...guests,
      ];

      await createGranadaBooking({
        member: memberProfile ?? {
          id: user.id, user_id: user.id,
          first_name: user.email.split('@')[0], last_name: '',
          avatar_url: null, bio: null, occupation: null, phone: null,
          website_url: null, linkedin_url: null, instagram_url: null,
          twitter_url: null, is_visible: true, location: null, skills: [],
        },
        room,
        check_in: checkIn,
        check_out: checkOut,
        guests: allGuests,
        status: 'pending',
        notes: notes || null,
        created_at: new Date().toISOString(),
      });
      toast.success('Booking request submitted! You will be notified once confirmed.');
      setCheckIn(''); setCheckOut(''); setNotes('');
      setGuestCount(1); setGuests([]);
    } catch (err) {
      toast.error('Failed to submit booking');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl">
      <Link to="/bookings/granada" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Rooms
      </Link>

      <div className="bg-card rounded-xl border border-border overflow-hidden mb-6">
        <div className="h-56 bg-gradient-to-br from-navy/5 to-gold/10 flex items-center justify-center">
          <span className="font-display text-6xl text-gold/20">{room.room_number}</span>
        </div>
        <div className="p-6">
          <h1 className="font-display text-2xl text-foreground mb-2">{room.name}</h1>
          <p className="text-muted-foreground mb-4">{room.description}</p>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="w-4 h-4" /> 1 person per room · Plus 1 allowed
          </span>
        </div>
      </div>

      {roomBookings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-medium text-amber-800 mb-2">Unavailable dates:</p>
          <div className="flex flex-wrap gap-2">
            {roomBookings
              .sort((a, b) => a.check_in.localeCompare(b.check_in))
              .map(b => (
                <span key={b.id} className={cn(
                  "text-xs px-2.5 py-1 rounded-full font-medium",
                  b.status === 'confirmed' ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                )}>
                  {b.check_in} → {b.check_out}
                  <span className="ml-1 opacity-60">({b.status})</span>
                </span>
              ))}
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border p-6 mb-6">
        <h2 className="font-display text-lg text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gold" /> Book This Room
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dates */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="check-in">Check-in</Label>
                <Input
                  id="check-in"
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={e => handleCheckInChange(e.target.value)}
                  className={cn("mt-1.5", dateError && checkIn && "border-destructive focus-visible:ring-destructive")}
                />
              </div>
              <div>
                <Label htmlFor="check-out">Check-out</Label>
                <Input
                  id="check-out"
                  type="date"
                  value={checkOut}
                  min={checkIn || today}
                  onChange={e => handleCheckOutChange(e.target.value)}
                  className={cn("mt-1.5", dateError && checkOut && "border-destructive focus-visible:ring-destructive")}
                />
              </div>
            </div>
            {dateError && (
              <p className="text-xs text-destructive flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-destructive text-white flex items-center justify-center text-[10px] font-bold shrink-0">!</span>
                {dateError}
              </p>
            )}
            {checkIn && checkOut && !dateError && (
              <p className="text-xs text-emerald-600">✓ These dates are available</p>
            )}
          </div>

          {/* Plus 1 option */}
          <div>
            <Label>Plus 1</Label>
            <p className="text-xs text-muted-foreground mt-0.5 mb-2">Each room is for 1 member. You may bring one additional guest during the day.</p>
            <div className="flex gap-2 mt-1.5">
              <button
                type="button"
                onClick={() => setGuestCount(1)}
                className={cn(
                  "px-4 h-10 rounded-lg border-2 text-sm font-semibold transition-colors",
                  guestCount === 1
                    ? "border-navy bg-navy text-gold"
                    : "border-border text-foreground hover:border-navy/50"
                )}
              >
                Just me
              </button>
              <button
                type="button"
                onClick={() => setGuestCount(2)}
                className={cn(
                  "px-4 h-10 rounded-lg border-2 text-sm font-semibold transition-colors",
                  guestCount === 2
                    ? "border-navy bg-navy text-gold"
                    : "border-border text-foreground hover:border-navy/50"
                )}
              >
                + 1 Guest
              </button>
            </div>
          </div>

          {/* Guest 1 — booking user (read-only) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-navy flex items-center justify-center text-gold text-xs font-bold">1</div>
              <span className="text-sm font-medium text-foreground">Your Details</span>
              <span className="text-xs text-muted-foreground">(auto-filled)</span>
            </div>
            <div className="bg-muted/40 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Name</Label>
                <Input
                  value={memberProfile ? `${memberProfile.first_name} ${memberProfile.last_name}`.trim() : user?.email?.split('@')[0] ?? ''}
                  disabled
                  className="mt-1 bg-muted text-muted-foreground"
                />
              </div>
              <div>
                <Label className="text-xs">Email</Label>
                <Input value={user?.email ?? ''} disabled className="mt-1 bg-muted text-muted-foreground" />
              </div>
              <div>
                <Label className="text-xs">Contact</Label>
                <Input value={memberProfile?.phone ?? ''} disabled className="mt-1 bg-muted text-muted-foreground" placeholder="—" />
              </div>
            </div>
          </div>

          {/* Additional guests */}
          {guests.map((guest, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-navy/20 border border-navy/30 flex items-center justify-center text-navy text-xs font-bold">{i + 2}</div>
                <span className="text-sm font-medium text-foreground">Guest {i + 2}</span>
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="border border-border rounded-lg p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs">Name <span className="text-destructive">*</span></Label>
                  <Input
                    value={guest.name}
                    onChange={e => updateGuest(i, 'name', e.target.value)}
                    placeholder="Full name"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs">Email <span className="text-muted-foreground">(optional)</span></Label>
                  <Input
                    type="email"
                    value={guest.email ?? ''}
                    onChange={e => updateGuest(i, 'email', e.target.value)}
                    placeholder="guest@email.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Contact <span className="text-muted-foreground">(optional)</span></Label>
                  <Input
                    value={guest.contact ?? ''}
                    onChange={e => updateGuest(i, 'contact', e.target.value)}
                    placeholder="+1 234 567 890"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" placeholder="Any special requests..." value={notes} onChange={e => setNotes(e.target.value)} className="mt-1.5" />
          </div>

          <Button type="submit" disabled={submitting || !!dateError} className="w-full bg-gold-gradient text-accent-foreground hover:opacity-90 font-semibold">
            {submitting ? 'Submitting…' : `Submit Booking Request${guestCount === 2 ? ' + Plus 1' : ''}`}
          </Button>
        </form>
      </div>

      <div className="bg-muted/50 rounded-xl border border-border p-6">
        <h3 className="font-display text-sm text-foreground mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-gold" /> Booking Rules
        </h3>
        <ul className="text-sm text-muted-foreground space-y-1.5">
          <li>• Maximum stay: 7 nights per booking</li>
          <li>• Advance notice: At least 48 hours before check-in</li>
          <li>• Cancellation: Free up to 24 hours before check-in</li>
          <li>• Maximum 2 active bookings per member</li>
        </ul>
      </div>
    </div>
  );
};

export default GranadaRoomDetail;
