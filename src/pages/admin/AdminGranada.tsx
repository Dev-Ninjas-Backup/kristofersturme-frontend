import { useState } from 'react';
import AdminGranadaBookings from './AdminGranadaBookings';
import AdminRooms from './AdminRooms';
import { cn } from '@/lib/utils';
import { Building2 } from 'lucide-react';

const AdminGranada = () => {
  const [tab, setTab] = useState<'bookings' | 'rooms'>('bookings');

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-navy/10 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-navy" />
        </div>
        <div>
          <h1 className="font-display text-2xl text-foreground">Granada</h1>
          <p className="text-sm text-muted-foreground">Manage rooms and bookings at the Granada property</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(['bookings', 'rooms'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            tab === t ? "bg-navy text-gold" : "bg-muted text-muted-foreground hover:text-foreground"
          )}>{t === 'bookings' ? 'Bookings' : 'Rooms'}</button>
        ))}
      </div>

      {tab === 'bookings' ? <AdminGranadaBookings embedded /> : <AdminRooms embedded />}
    </div>
  );
};

export default AdminGranada;
