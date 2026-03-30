import { useState } from 'react';
import { mockGranadaBookings, mockBarcelonaBookings } from '@/data/mockData';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { cn } from '@/lib/utils';
import { Building2, Trophy, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const MyBookings = () => {
  const [tab, setTab] = useState<'granada' | 'barcelona'>('granada');

  const handleCancel = (type: string) => {
    toast.success(`${type} booking cancelled successfully`);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="My Bookings" description="Manage your Granada and Barcelona bookings" />

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('granada')} className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
          tab === 'granada' ? "bg-navy text-gold" : "bg-muted text-muted-foreground"
        )}><Building2 className="w-4 h-4" /> Granada</button>
        <button onClick={() => setTab('barcelona')} className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
          tab === 'barcelona' ? "bg-navy text-gold" : "bg-muted text-muted-foreground"
        )}><Trophy className="w-4 h-4" /> Barcelona</button>
      </div>

      {tab === 'granada' && (
        <div className="space-y-3">
          {mockGranadaBookings.map(b => (
            <div key={b.id} className="bg-card rounded-xl border border-border p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{b.room.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                  <CalendarDays className="w-3.5 h-3.5" /> {b.check_in} → {b.check_out}
                </p>
                {b.notes && <p className="text-xs text-muted-foreground mt-1">Note: {b.notes}</p>}
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={b.status} />
                {(b.status === 'pending' || b.status === 'confirmed') && (
                  <Button variant="outline" size="sm" onClick={() => handleCancel('Granada')} className="text-destructive border-destructive/30 hover:bg-destructive/10">
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'barcelona' && (
        <div className="space-y-3">
          {mockBarcelonaBookings.map(b => (
            <div key={b.id} className="bg-card rounded-xl border border-border p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">vs {b.match.opponent}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                  <CalendarDays className="w-3.5 h-3.5" /> {new Date(b.match.match_date).toLocaleDateString()} · {b.seats} seat(s)
                </p>
                {b.notes && <p className="text-xs text-muted-foreground mt-1">Note: {b.notes}</p>}
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={b.status} />
                {(b.status === 'pending' || b.status === 'confirmed') && (
                  <Button variant="outline" size="sm" onClick={() => handleCancel('Barcelona')} className="text-destructive border-destructive/30 hover:bg-destructive/10">
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
