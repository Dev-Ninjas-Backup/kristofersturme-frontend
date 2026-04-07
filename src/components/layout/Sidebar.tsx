import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard, Users, Building2, Trophy, CalendarDays,
  User, LogOut, Settings, ChevronLeft, ChevronRight, ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const Sidebar = () => {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const isAdmin = user?.role === 'admin';

  const memberLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/members', icon: Users, label: 'Members' },
    { to: '/bookings/granada', icon: Building2, label: 'Granada' },
    { to: '/bookings/barcelona', icon: Trophy, label: 'Barcelona' },
    { to: '/my-bookings', icon: CalendarDays, label: 'My Bookings' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/members', icon: Users, label: 'Members' },
    { to: '/admin/granada', icon: Building2, label: 'Granada' },
    { to: '/admin/barcelona', icon: Trophy, label: 'Barcelona' },
    { to: '/admin/rules', icon: Settings, label: 'Rules' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const links = isAdmin ? adminLinks : memberLinks;

  return (
    <aside className={cn(
      "hidden lg:flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
      collapsed ? "w-[72px]" : "w-64"
    )}>
      <div className="flex items-center justify-center p-4 border-b border-sidebar-border">
        {collapsed ? (
          <span className="font-display text-xl text-sidebar-primary font-bold">O</span>
        ) : (
          <img src="/onem-logo.jpg" alt="Onem" className="h-12 w-auto object-contain rounded" />
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map(link => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            isActive ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}>
            <link.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{link.label}</span>}
          </NavLink>
        ))}

        {isAdmin && !collapsed && (
          <div className="pt-4 pb-1 px-3">
            <p className="text-xs uppercase tracking-wider text-sidebar-foreground/50 flex items-center gap-2">
              <ShieldCheck className="w-3 h-3" /> Admin Panel
            </p>
          </div>
        )}
      </nav>

      <div className="p-3 border-t border-sidebar-border space-y-1">
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent w-full transition-colors">
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
        <button onClick={() => setCollapsed(!collapsed)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/50 hover:bg-sidebar-accent w-full transition-colors">
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <><ChevronLeft className="w-5 h-5" /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
