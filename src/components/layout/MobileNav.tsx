import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard, Users, Building2, Trophy, CalendarDays,
  User, LogOut, X, Settings, ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
}

const MobileNav = ({ open, onClose }: MobileNavProps) => {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';

  const memberLinks: NavItem[] = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/members', icon: Users, label: 'Members' },
    { to: '/bookings/granada', icon: Building2, label: 'Granada' },
    { to: '/bookings/barcelona', icon: Trophy, label: 'Barcelona' },
    { to: '/my-bookings', icon: CalendarDays, label: 'My Bookings' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const adminLinks: NavItem[] = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/members', icon: Users, label: 'Members' },
    { to: '/admin/granada', icon: Building2, label: 'Granada' },
    { to: '/admin/barcelona', icon: Trophy, label: 'Barcelona' },
    { to: '/admin/rules', icon: Settings, label: 'Rules' },
  ];

  const links = isAdmin ? adminLinks : memberLinks;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-foreground/50" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 w-72 bg-sidebar flex flex-col animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img src="/onem-logo.jpg" alt="Onem" className="h-10 w-auto object-contain rounded" />
            {isAdmin && (
              <p className="text-xs text-sidebar-foreground/50 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Admin Panel
              </p>
            )}
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
