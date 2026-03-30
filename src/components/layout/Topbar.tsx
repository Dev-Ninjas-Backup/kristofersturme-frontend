import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { Bell, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import MobileNav from './MobileNav';

const Topbar = () => {
  const user = useAuthStore(s => s.user);
  const unreadCount = useNotificationStore(s => s.unreadCount);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-8">
        <button onClick={() => setMobileOpen(true)} className="lg:hidden text-foreground">
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden lg:block">
          <h2 className="text-sm text-muted-foreground">Welcome back,</h2>
          <p className="font-semibold text-foreground">{user?.email || 'Member'}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/notifications" className="relative text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold text-accent-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>
          <Link to="/profile" className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-gold text-sm font-bold">
            {user?.email?.charAt(0).toUpperCase() || 'M'}
          </Link>
        </div>
      </header>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
};

export default Topbar;
