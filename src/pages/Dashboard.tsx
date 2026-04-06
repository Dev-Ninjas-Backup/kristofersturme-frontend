import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useMembers, useGranadaBookings, useBarcelonaBookings } from '@/hooks/useDb';
import PageHeader from '@/components/shared/PageHeader';
import { Users, Building2, Trophy, Bell, ArrowRight } from 'lucide-react';

const DashboardCard = ({ icon: Icon, label, value, to, color }: { icon: any; label: string; value: string | number; to: string; color: string }) => (
  <Link to={to} className="bg-card rounded-xl border border-border p-6 hover:shadow-elevated transition-all group">
    <div className="flex items-start justify-between">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
    </div>
    <p className="font-display text-3xl text-foreground mt-4">{value}</p>
    <p className="text-sm text-muted-foreground mt-1">{label}</p>
  </Link>
);

const Dashboard = () => {
  const user = useAuthStore(s => s.user);
  const unreadCount = useNotificationStore(s => s.unreadCount);
  const { data: members } = useMembers();
  const { data: granadaBookings } = useGranadaBookings();
  const { data: barcelonaBookings } = useBarcelonaBookings();

  const granadaCount = granadaBookings.filter(b => b.member.user_id === user?.id && b.status !== 'cancelled').length;
  const barcelonaCount = barcelonaBookings.filter(b => b.member.user_id === user?.id && b.status !== 'cancelled').length;

  return (
    <div className="animate-fade-in">
      <PageHeader title={`Welcome back`} description="Here's an overview of your club activity" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard icon={Users} label="Total Members" value={members.length} to="/members" color="bg-navy text-gold" />
        <DashboardCard icon={Building2} label="Granada Bookings" value={granadaCount} to="/bookings/granada" color="bg-emerald-100 text-emerald-700" />
        <DashboardCard icon={Trophy} label="Barcelona Bookings" value={barcelonaCount} to="/bookings/barcelona" color="bg-blue-100 text-blue-700" />
        <DashboardCard icon={Bell} label="Unread Notifications" value={unreadCount} to="/notifications" color="bg-amber-100 text-amber-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-display text-lg text-foreground mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/bookings/granada" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
              <Building2 className="w-5 h-5 text-gold" />
              <div><p className="text-sm font-medium text-foreground">Book a Room in Granada</p><p className="text-xs text-muted-foreground">Check availability and reserve</p></div>
            </Link>
            <Link to="/bookings/barcelona" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
              <Trophy className="w-5 h-5 text-gold" />
              <div><p className="text-sm font-medium text-foreground">Book Barcelona Seats</p><p className="text-xs text-muted-foreground">Upcoming matches available</p></div>
            </Link>
            <Link to="/members" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
              <Users className="w-5 h-5 text-gold" />
              <div><p className="text-sm font-medium text-foreground">Browse Members</p><p className="text-xs text-muted-foreground">Connect with fellow members</p></div>
            </Link>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-display text-lg text-foreground mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {granadaBookings.slice(0, 2).map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{b.room.name}</p>
                  <p className="text-xs text-muted-foreground">{b.check_in} → {b.check_out}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {b.status}
                </span>
              </div>
            ))}
            {barcelonaBookings.slice(0, 1).map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium text-foreground">vs {b.match.opponent}</p>
                  <p className="text-xs text-muted-foreground">{new Date(b.match.match_date).toLocaleDateString()} · {b.seats} seat(s)</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
