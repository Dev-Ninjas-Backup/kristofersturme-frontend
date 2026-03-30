import { mockRooms } from '@/data/mockData';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Edit2, Lock, Users } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const AdminRooms = () => (
  <div className="animate-fade-in">
    <PageHeader title="Manage Rooms" description="Configure Granada rooms" />
    <div className="space-y-3">
      {mockRooms.map(room => (
        <div key={room.id} className={cn("bg-card rounded-xl border border-border p-5 flex flex-col sm:flex-row sm:items-center gap-4", room.is_owners && "opacity-70")}>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground text-sm">{room.name}</h3>
              {room.is_owners && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Lock className="w-3 h-3" /> Owner</span>}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
              <span>Room #{room.room_number}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {room.capacity}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!room.is_owners && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Active</span>
                  <Switch defaultChecked={room.is_active} onCheckedChange={() => toast.success('Room status updated')} />
                </div>
                <Button variant="ghost" size="sm"><Edit2 className="w-4 h-4" /></Button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AdminRooms;
