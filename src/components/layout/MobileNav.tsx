import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import {
  Crown, LayoutDashboard, Users, Building2, Trophy, CalendarDays,
  User, Bell, LogOut, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

const MobileNav = ({ open, onClose }: MobileNavProps) => {
  const logout = useAuthStore(s => s.logout);
  const unreadCount = useNotificationStore(s => s.unreadCount);
  const navigate = useNavigate();

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/members', icon: Users, label: 'Members' },
    { to: '/bookings/granada', icon: Building2, label: 'Granada' },
    { to: '/bookings/barcelona', icon: Trophy, label: 'Barcelona' },
    { to: '/my-bookings', icon: CalendarDays, label: 'My Bookings' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/notifications', icon: Bell, label: 'Notifications', badge: unreadCount },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-foreground/50" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 w-72 bg-sidebar flex flex-col animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Crown className="w-7 h-7 text-sidebar-primary" />
            <span className="font-display text-lg text-sidebar-primary">Members Club</span>
          </div>
          <button onClick={onClose} className="text-sidebar-foreground"><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} onClick={onClose} className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground hover:bg-sidebar-accent"
            )}>
              <link.icon className="w-5 h-5" />
              <span>{link.label}</span>
              {link.badge ? <span className="ml-auto bg-gold text-accent-foreground text-xs font-bold px-2 py-0.5 rounded-full">{link.badge}</span> : null}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <button onClick={() => { logout(); navigate('/login'); onClose(); }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent w-full">
            <LogOut className="w-5 h-5" /><span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
