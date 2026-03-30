import { useNotificationStore } from '@/store/notificationStore';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Bell, Check, Trash2 } from 'lucide-react';
import EmptyState from '@/components/shared/EmptyState';
import { cn } from '@/lib/utils';

const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, unreadCount } = useNotificationStore();

  return (
    <div className="animate-fade-in max-w-2xl">
      <PageHeader title="Notifications" description={`${unreadCount} unread`}>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <Check className="w-4 h-4 mr-1.5" /> Mark all read
          </Button>
        )}
      </PageHeader>

      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up!" />
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} onClick={() => markAsRead(n.id)} className={cn(
              "bg-card rounded-xl border border-border p-4 flex items-start gap-4 cursor-pointer transition-colors",
              !n.is_read && "border-gold/30 bg-gold/5"
            )}>
              <div className={cn("w-2 h-2 rounded-full mt-2 shrink-0", n.is_read ? "bg-transparent" : "bg-gold")} />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm">{n.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1.5">{new Date(n.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <button onClick={e => { e.stopPropagation(); deleteNotification(n.id); }} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
