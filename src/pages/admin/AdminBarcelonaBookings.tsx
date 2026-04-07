import { useState } from 'react';
import { useBarcelonaBookings } from '@/hooks/useDb';
import { updateBarcelonaBookingStatus } from '@/lib/db';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Check, X, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { BarcelonaBooking, BookingStatus } from '@/types';

const AdminBarcelonaBookings = ({ embedded }: { embedded?: boolean } = {}) => {
  const { data: bookings, loading } = useBarcelonaBookings();
  const [updating, setUpdating] = useState<string | null>(null);

  const changeStatus = async (booking: BarcelonaBooking, status: BookingStatus, label: string) => {
    setUpdating(booking.id + status);
    try {
      await updateBarcelonaBookingStatus(booking.id, status, booking);
      toast.success(`Booking ${label}`);
    } catch {
      toast.error('Failed to update booking');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className={embedded ? '' : 'animate-fade-in'}>
      {!embedded && <PageHeader title="Barcelona Bookings" description="Manage all match bookings" />}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Member</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Match</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Seats / Guests</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Status</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Actions</th>
            </tr></thead>
            <tbody>
              {loading && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">Loading...</td></tr>
              )}
              {!loading && bookings.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">No bookings yet.</td></tr>
              )}
              {bookings.map(b => (
                <tr key={b.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-4 text-sm text-foreground">{b.member.first_name} {b.member.last_name}</td>
                  <td className="px-6 py-4 text-sm text-foreground">vs {b.match.opponent}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="space-y-1">
                      {(b.guests ?? []).map((g, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <span className="w-5 h-5 rounded-full bg-navy/10 text-navy font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                          <span className="font-medium text-foreground">{g.name}</span>
                          {g.email && <span className="text-muted-foreground">{g.email}</span>}
                          {g.contact && <span className="text-muted-foreground">{g.contact}</span>}
                        </div>
                      ))}
                      {(!b.guests || b.guests.length === 0) && (
                        <span className="text-muted-foreground">{b.seats} seat{b.seats > 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={b.status} /></td>
                  <td className="px-6 py-4">
                    {b.status === 'cancellation_requested' ? (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-orange-600 mr-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Cancel req.
                        </span>
                        <Button variant="ghost" size="sm" disabled={!!updating} onClick={() => changeStatus(b, 'cancelled', 'cancellation approved')} title="Approve cancellation">
                          <Check className="w-4 h-4 text-emerald-600" />
                        </Button>
                        <Button variant="ghost" size="sm" disabled={!!updating} onClick={() => changeStatus(b, 'confirmed', 'cancellation rejected')} title="Reject cancellation">
                          <X className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" disabled={!!updating} onClick={() => changeStatus(b, 'confirmed', 'confirmed')} title="Confirm">
                          <Check className="w-4 h-4 text-emerald-600" />
                        </Button>
                        <Button variant="ghost" size="sm" disabled={!!updating} onClick={() => changeStatus(b, 'completed', 'completed')} title="Complete">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="sm" disabled={!!updating} onClick={() => changeStatus(b, 'cancelled', 'cancelled')} title="Cancel">
                          <X className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBarcelonaBookings;
