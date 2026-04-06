import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useMatches } from '@/hooks/useDb';
import { createBarcelonaBooking } from '@/lib/db';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Calendar, MapPin, Trophy, Info } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const BarcelonaMatchDetail = () => {
  const { matchId } = useParams();
  const { data: matches } = useMatches();
  const user = useAuthStore(s => s.user);
  const match = matches.find(m => m.id === matchId);
  const [seats, setSeats] = useState(1);
  const [notes, setNotes] = useState('');

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
    try {
      await createBarcelonaBooking({
        member: { id: user.id, user_id: user.id, first_name: user.email.split('@')[0], last_name: '', avatar_url: null, bio: null, phone: null, website_url: null, linkedin_url: null, instagram_url: null, twitter_url: null, is_visible: true, location: null, skills: [] },
        match,
        seats,
        status: 'pending',
        notes: notes || null,
        created_at: new Date().toISOString(),
      });
      toast.success(`Booking request for ${seats} seat(s) submitted!`);
      setSeats(1); setNotes('');
    } catch { toast.error('Failed to submit booking'); }
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
            <div key={i} className={cn("w-10 h-10 rounded-lg border-2 flex items-center justify-center text-sm font-bold transition-colors",
              i < match.total_seats - match.seats_remaining ? "border-navy bg-navy text-gold" : "border-border text-muted-foreground"
            )}>{i + 1}</div>
          ))}
          <span className="text-sm text-muted-foreground ml-2">{match.seats_remaining} of {match.total_seats} available</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Number of Seats</Label>
            <div className="flex gap-2 mt-1.5">
              {Array.from({ length: Math.min(match.seats_remaining, 4) }).map((_, i) => (
                <button key={i} type="button" onClick={() => setSeats(i + 1)} className={cn(
                  "w-12 h-10 rounded-lg border-2 text-sm font-bold transition-colors",
                  seats === i + 1 ? "border-gold bg-gold text-accent-foreground" : "border-border text-foreground hover:border-gold/50"
                )}>{i + 1}</button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" placeholder="Any special requests..." value={notes} onChange={e => setNotes(e.target.value)} className="mt-1.5" />
          </div>
          <Button type="submit" disabled={match.seats_remaining === 0} className="w-full bg-gold-gradient text-accent-foreground hover:opacity-90 font-semibold">
            {match.seats_remaining > 0 ? `Book ${seats} Seat${seats > 1 ? 's' : ''}` : 'Fully Booked'}
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
