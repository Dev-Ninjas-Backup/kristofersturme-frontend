import { useState } from 'react';
import AdminBarcelonaBookings from './AdminBarcelonaBookings';
import AdminMatches from './AdminMatches';
import { cn } from '@/lib/utils';
import { Trophy } from 'lucide-react';

const AdminBarcelona = () => {
  const [tab, setTab] = useState<'bookings' | 'matches'>('matches');

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-navy/10 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-navy" />
        </div>
        <div>
          <h1 className="font-display text-2xl text-foreground">Barcelona</h1>
          <p className="text-sm text-muted-foreground">Manage matches and bookings for FC Barcelona</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(['matches', 'bookings'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
            tab === t ? "bg-navy text-gold" : "bg-muted text-muted-foreground hover:text-foreground"
          )}>{t === 'matches' ? 'Matches' : 'Bookings'}</button>
        ))}
      </div>

      {tab === 'matches' ? <AdminMatches embedded /> : <AdminBarcelonaBookings embedded />}
    </div>
  );
};

export default AdminBarcelona;
