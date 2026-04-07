import { useState } from 'react';
import { useRooms } from '@/hooks/useDb';
import { updateRoom } from '@/lib/db';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Edit2, Lock, Users } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { GranadaRoom } from '@/types';

const AdminRooms = ({ embedded }: { embedded?: boolean } = {}) => {
  const { data: rooms } = useRooms();
  const [editTarget, setEditTarget] = useState<GranadaRoom | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    room_number: 1,
    description: '',
    capacity: 2,
  });

  const openEdit = (room: GranadaRoom) => {
    setEditForm({
      name: room.name,
      room_number: room.room_number,
      description: room.description,
      capacity: room.capacity,
    });
    setEditTarget(room);
  };

  const handleSave = async () => {
    if (!editTarget) return;
    try {
      await updateRoom(editTarget.id, {
        name: editForm.name,
        room_number: Number(editForm.room_number),
        description: editForm.description,
        capacity: Number(editForm.capacity),
      });
      toast.success('Room updated');
    } catch { toast.error('Failed to update room'); }
    setEditTarget(null);
  };

  const ef = (key: keyof typeof editForm) => (
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setEditForm(f => ({ ...f, [key]: e.target.value }))
  );

  return (
    <div className={embedded ? '' : 'animate-fade-in'}>
      {!embedded && <PageHeader title="Manage Rooms" description="Configure Granada rooms" />}

      <div className="space-y-3">
        {rooms.map(room => (
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
              {room.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{room.description}</p>}
            </div>
            <div className="flex items-center gap-3">
              {!room.is_owners && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Active</span>
                    <Switch
                      checked={room.is_active}
                      onCheckedChange={async checked => {
                        try {
                          await updateRoom(room.id, { is_active: checked });
                          toast.success('Room status updated');
                        } catch { toast.error('Failed to update room'); }
                      }}
                    />
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(room)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      <Dialog open={!!editTarget} onOpenChange={open => !open && setEditTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="w-4 h-4" /> Edit Room
            </DialogTitle>
            <DialogDescription>Update details for {editTarget?.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="name">Room Name</Label>
                <Input id="name" value={editForm.name} onChange={ef('name')} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="room_number">Room Number</Label>
                <Input id="room_number" type="number" value={editForm.room_number} onChange={ef('room_number')} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="capacity">Capacity</Label>
              <Input id="capacity" type="number" value={editForm.capacity} onChange={ef('capacity')} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} value={editForm.description} onChange={ef('description')} placeholder="Room description..." />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button className="bg-gold-gradient text-accent-foreground hover:opacity-90" onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRooms;
