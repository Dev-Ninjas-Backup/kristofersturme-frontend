import { useState } from 'react';
import { useBarcelonaBookings } from '@/hooks/useDb';
import { updateBarcelonaBookingStatus } from '@/lib/db';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Check, X, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { BookingStatus } from '@/types';

const AdminBarcelonaBookings = () => {
  const { data: bookings, loading } = useBarcelonaBookings();
  const [updating, setUpdating] = useState<string | null>(null);

  const changeStatus = async (id: string, status: BookingStatus, label: string) => {
    setUpdating(id + status);
    try {
      await updateBarcelonaBookingStatus(id, status);
      toast.success(`Booking ${label}`);
    } catch {
      toast.error('Failed to update booking');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Barcelona Bookings" description="Manage all match bookings" />
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Member</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Match</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Seats</th>
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
                  <td className="px-6 py-4 text-sm text-muted-foreground">{b.seats}</td>
                  <td className="px-6 py-4"><StatusBadge status={b.status} /></td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" disabled={!!updating} onClick={() => changeStatus(b.id, 'confirmed', 'confirmed')} title="Confirm">
                        <Check className="w-4 h-4 text-emerald-600" />
                      </Button>
                      <Button variant="ghost" size="sm" disabled={!!updating} onClick={() => changeStatus(b.id, 'completed', 'completed')} title="Complete">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="sm" disabled={!!updating} onClick={() => changeStatus(b.id, 'cancelled', 'cancelled')} title="Cancel">
                        <X className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
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
