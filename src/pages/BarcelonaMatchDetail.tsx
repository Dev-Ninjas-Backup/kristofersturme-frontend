import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useMatches, useMembers } from '@/hooks/useDb';
import { createBarcelonaBooking } from '@/lib/db';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Calendar, MapPin, Trophy, Info, User } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { BookingGuest } from '@/types';

const emptyGuest = (): BookingGuest => ({ name: '', email: null, contact: null });

const BarcelonaMatchDetail = () => {
  const { matchId } = useParams();
  const { data: matches } = useMatches();
  const { data: members } = useMembers();
  const user = useAuthStore(s => s.user);
  const match = matches.find(m => m.id === matchId);

  const [seats, setSeats] = useState(1);
  const [guests, setGuests] = useState<BookingGuest[]>([]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Find the member profile for the logged-in user
  const memberProfile = members.find(m => m.user_id === user?.id);

  // Sync guest array length to seats - 1 (seat 1 is always the booking user)
  useEffect(() => {
    setGuests(prev => {
      const extra = seats - 1;
      if (extra <= 0) return [];
      if (prev.length === extra) return prev;
      if (prev.length < extra) return [...prev, ...Array.from({ length: extra - prev.length }, emptyGuest)];
      return prev.slice(0, extra);
    });
  }, [seats]);

  const updateGuest = (index: number, field: keyof BookingGuest, value: string) => {
    setGuests(prev => prev.map((g, i) => i === index ? { ...g, [field]: value || null } : g));
  };

  if (!match) return (
    <div className="text-center py-16">
      <p className="text-muted-foreground">Match not found.</p>
      <Link to="/bookings/barcelona" className="text-gold mt-2 inline-block">Back to matches</Link>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (match.seats_remaining === 0) { toast.error('No seats available'); return; }
    if (!user) return;

    // Validate guest names for additional seats
    for (let i = 0; i < guests.length; i++) {
      if (!guests[i].name.trim()) {
        toast.error(`Please enter a name for Guest ${i + 2}`);
        return;
      }
    }

    setSubmitting(true);
    try {
      // Seat 1 is always the booking user
      const allGuests: BookingGuest[] = [
        {
          name: memberProfile ? `${memberProfile.first_name} ${memberProfile.last_name}`.trim() : (user.email.split('@')[0]),
          email: user.email,
          contact: memberProfile?.phone ?? null,
        },
        ...guests,
      ];

      await createBarcelonaBooking({
        member: memberProfile ?? {
          id: user.id, user_id: user.id,
          first_name: user.email.split('@')[0], last_name: '',
          avatar_url: null, bio: null, occupation: null, phone: null,
          website_url: null, linkedin_url: null, instagram_url: null,
          twitter_url: null, is_visible: true, location: null, skills: [],
        },
        match,
        seats,
        guests: allGuests,
        status: 'pending',
        notes: notes || null,
        created_at: new Date().toISOString(),
      });
      toast.success(`Booking request for ${seats} seat${seats > 1 ? 's' : ''} submitted!`);
      setSeats(1);
      setNotes('');
      setGuests([]);
    } catch (err) {
      toast.error('Failed to submit booking');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl">
      <Link to="/bookings/barcelona" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Matches
      </Link>

      <div className="bg-card rounded-xl border border-border overflow-hidden mb-6">
        <div className="bg-navy-gradient p-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-navy-light flex items-center justify-center">
              <Trophy className="w-8 h-8 text-gold" />
            </div>
            <div>
              <h1 className="font-display text-2xl text-gold-light">FC Barcelona vs {match.opponent}</h1>
              <p className="text-sm mt-1" style={{ color: 'hsl(220 20% 70%)' }}>{match.competition}</p>
            </div>
          </div>
        </div>
        <div className="p-6 flex items-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(match.match_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {match.venue}</span>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 mb-6">
        <h2 className="font-display text-lg text-foreground mb-4">Select Seats</h2>

        <div className="flex items-center gap-3 mb-6">
          {Array.from({ length: match.total_seats }).map((_, i) => (
            <div key={i} className={cn(
              "w-10 h-10 rounded-lg border-2 flex items-center justify-center text-sm font-bold transition-colors",
              i < match.total_seats - match.seats_remaining
                ? "border-navy bg-navy text-gold"
                : "border-border text-muted-foreground"
            )}>{i + 1}</div>
          ))}
          <span className="text-sm text-muted-foreground ml-2">{match.seats_remaining} of {match.total_seats} available</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seat count selector */}
          <div>
            <Label>Number of Seats</Label>
            <div className="flex gap-2 mt-1.5">
              {Array.from({ length: Math.min(match.seats_remaining, 4) }).map((_, i) => (
                <button key={i} type="button" onClick={() => setSeats(i + 1)} className={cn(
                  "w-12 h-10 rounded-lg border-2 text-sm font-bold transition-colors",
                  seats === i + 1 ? "border-navy bg-navy text-gold" : "border-border text-foreground hover:border-navy/50"
                )}>{i + 1}</button>
              ))}
            </div>
          </div>

          {/* Seat 1 — booking user (read-only) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-navy flex items-center justify-center text-gold text-xs font-bold">1</div>
              <span className="text-sm font-medium text-foreground">Your Seat</span>
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
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
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

          <Button type="submit" disabled={match.seats_remaining === 0 || submitting} className="w-full bg-gold-gradient text-accent-foreground hover:opacity-90 font-semibold">
            {match.seats_remaining > 0
              ? `Book ${seats} Seat${seats > 1 ? 's' : ''}`
              : 'Fully Booked'}
          </Button>
        </form>
      </div>

      <div className="bg-muted/50 rounded-xl border border-border p-6">
        <h3 className="font-display text-sm text-foreground mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-gold" /> Booking Rules
        </h3>
        <ul className="text-sm text-muted-foreground space-y-1.5">
          <li>• Maximum 4 seats per member per match</li>
          <li>• Bookings close 24 hours before match time</li>
          <li>• Cancellation: Free up to 48 hours before match</li>
          <li>• All guests must present valid ID at entry</li>
        </ul>
      </div>
    </div>
  );
};

export default BarcelonaMatchDetail;
