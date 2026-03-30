import { mockBarcelonaBookings } from '@/data/mockData';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Check, X, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const AdminBarcelonaBookings = () => (
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
            {mockBarcelonaBookings.map(b => (
              <tr key={b.id} className="border-b border-border last:border-0">
                <td className="px-6 py-4 text-sm text-foreground">{b.member.first_name} {b.member.last_name}</td>
                <td className="px-6 py-4 text-sm text-foreground">vs {b.match.opponent}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{b.seats}</td>
                <td className="px-6 py-4"><StatusBadge status={b.status} /></td>
                <td className="px-6 py-4">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => toast.success('Confirmed')}><Check className="w-4 h-4 text-emerald-600" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => toast.success('Completed')}><CheckCircle className="w-4 h-4 text-blue-600" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => toast.success('Cancelled')}><X className="w-4 h-4 text-destructive" /></Button>
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

export default AdminBarcelonaBookings;
