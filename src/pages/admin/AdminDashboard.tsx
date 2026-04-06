import { useGranadaBookings, useBarcelonaBookings, useMembers, useMatches } from '@/hooks/useDb';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { Users, Building2, Trophy, CalendarDays } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) => (
  <div className="bg-card rounded-xl border border-border p-6">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <p className="font-display text-2xl text-foreground">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

const AdminDashboard = () => {
  const { data: members } = useMembers();
  const { data: granadaBookings } = useGranadaBookings();
  const { data: barcelonaBookings } = useBarcelonaBookings();
  const { data: matches } = useMatches();

  const allBookings = [...granadaBookings, ...barcelonaBookings];
  const pending = allBookings.filter(b => b.status === 'pending').length;

  return (
    <div className="animate-fade-in">
      <PageHeader title="Admin Dashboard" description="Overview of club activity" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Members" value={members.length} color="bg-navy text-gold" />
        <StatCard icon={CalendarDays} label="Total Bookings" value={allBookings.length} color="bg-blue-100 text-blue-700" />
        <StatCard icon={CalendarDays} label="Pending Bookings" value={pending} color="bg-amber-100 text-amber-700" />
        <StatCard icon={Trophy} label="Upcoming Matches" value={matches.filter(m => m.is_active).length} color="bg-emerald-100 text-emerald-700" />
      </div>

      <div className="bg-card rounded-xl border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="font-display text-lg text-foreground">Recent Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Member</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Type</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Resource</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Status</th>
            </tr></thead>
            <tbody>
              {granadaBookings.map(b => (
                <tr key={b.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-4 text-sm text-foreground">{b.member.first_name} {b.member.last_name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground"><span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Granada</span></td>
                  <td className="px-6 py-4 text-sm text-foreground">{b.room.name}</td>
                  <td className="px-6 py-4"><StatusBadge status={b.status} /></td>
                </tr>
              ))}
              {barcelonaBookings.map(b => (
                <tr key={b.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-4 text-sm text-foreground">{b.member.first_name} {b.member.last_name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground"><span className="flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5" /> Barcelona</span></td>
                  <td className="px-6 py-4 text-sm text-foreground">vs {b.match.opponent}</td>
                  <td className="px-6 py-4"><StatusBadge status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
