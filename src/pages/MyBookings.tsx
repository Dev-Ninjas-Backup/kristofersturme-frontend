import { useState } from 'react';
import { useGranadaBookings, useBarcelonaBookings } from '@/hooks/useDb';
import { updateGranadaBookingStatus, updateBarcelonaBookingStatus, requestGranadaCancellation, requestBarcelonaCancellation } from '@/lib/db';
import { useAuthStore } from '@/store/authStore';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { cn } from '@/lib/utils';
import type { GranadaBooking, BarcelonaBooking } from '@/types';
import { Building2, Trophy, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const MyBookings = () => {
  const user = useAuthStore(s => s.user);
  const { data: granadaBookings } = useGranadaBookings();
  const { data: barcelonaBookings } = useBarcelonaBookings();
  const [tab, setTab] = useState<'granada' | 'barcelona'>('granada');

  const myGranada = granadaBookings.filter(b => b.member.user_id === user?.id);
  const myBarcelona = barcelonaBookings.filter(b => b.member.user_id === user?.id);

  // Pending bookings cancel immediately; confirmed bookings require admin approval
  const handleCancel = async (booking: GranadaBooking | BarcelonaBooking, type: 'granada' | 'barcelona') => {
    try {
      if (booking.status === 'pending') {
        if (type === 'granada') await updateGranadaBookingStatus(booking.id, 'cancelled');
        else await updateBarcelonaBookingStatus(booking.id, 'cancelled');
        toast.success('Booking cancelled');
      } else {
        if (type === 'granada') await requestGranadaCancellation(booking.id, booking as GranadaBooking);
        else await requestBarcelonaCancellation(booking.id, booking as BarcelonaBooking);
        toast.success('Cancellation request sent — awaiting admin approval');
      }
    } catch { toast.error('Failed to process cancellation'); }
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
          {myGranada.map(b => (
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
                  <Button variant="outline" size="sm" onClick={() => handleCancel(b, 'granada')} className="text-destructive border-destructive/30 hover:bg-destructive/10">
                    {b.status === 'confirmed' ? 'Request Cancel' : 'Cancel'}
                  </Button>
                )}
                {b.status === 'cancellation_requested' && (
                  <span className="text-xs text-orange-600 font-medium">Awaiting approval</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'barcelona' && (
        <div className="space-y-3">
          {myBarcelona.map(b => (
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
                  <Button variant="outline" size="sm" onClick={() => handleCancel(b, 'barcelona')} className="text-destructive border-destructive/30 hover:bg-destructive/10">
                    {b.status === 'confirmed' ? 'Request Cancel' : 'Cancel'}
                  </Button>
                )}
                {b.status === 'cancellation_requested' && (
                  <span className="text-xs text-orange-600 font-medium">Awaiting approval</span>
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
