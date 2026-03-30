import { Link } from 'react-router-dom';
import { useState } from 'react';
import { mockMatches } from '@/data/mockData';
import PageHeader from '@/components/shared/PageHeader';
import { Calendar, MapPin, Trophy, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const BarcelonaBookings = () => {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const upcoming = mockMatches.filter(m => m.is_active && new Date(m.match_date) > new Date());
  const past = mockMatches.filter(m => !m.is_active || new Date(m.match_date) <= new Date());

  const matches = tab === 'upcoming' ? upcoming : past;

  return (
    <div className="animate-fade-in">
      <PageHeader title="Barcelona Matches" description="Book seats for upcoming FC Barcelona matches" />

      <div className="flex gap-2 mb-6">
        {(['upcoming', 'past'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
            tab === t ? "bg-navy text-gold" : "bg-muted text-muted-foreground hover:text-foreground"
          )}>{t}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matches.map(match => (
          <Link key={match.id} to={`/bookings/barcelona/${match.id}`} className={cn(
            "bg-card rounded-xl border border-border p-6 transition-all group",
            match.seats_remaining > 0 ? "hover:shadow-elevated" : "opacity-70"
          )}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-navy/5 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-foreground">vs {match.opponent}</h3>
                  <p className="text-xs text-muted-foreground">{match.competition}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(match.match_date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {match.venue}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {Array.from({ length: match.total_seats }).map((_, i) => (
                  <div key={i} className={cn("w-6 h-6 rounded-md border-2 flex items-center justify-center text-xs font-bold",
                    i < match.total_seats - match.seats_remaining ? "border-navy bg-navy text-gold" : "border-border text-muted-foreground"
                  )}>{i + 1}</div>
                ))}
              </div>
              <span className={cn("text-xs px-2 py-0.5 rounded-full",
                match.seats_remaining > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
              )}>
                {match.seats_remaining > 0 ? `${match.seats_remaining} seats left` : 'Fully booked'}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BarcelonaBookings;
