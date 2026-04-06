import { useState } from 'react';
import { useMatches } from '@/hooks/useDb';
import { createMatch, updateMatch, deleteMatch } from '@/lib/db';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { BarcelonaMatch } from '@/types';

const toLocal = (iso: string) => {
  // Convert ISO to datetime-local input format
  return iso.slice(0, 16);
};

const AdminMatches = () => {
  const { data: matches } = useMatches();
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<BarcelonaMatch | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BarcelonaMatch | null>(null);

  const [editForm, setEditForm] = useState({
    opponent: '',
    match_date: '',
    venue: '',
    competition: '',
    total_seats: 4,
    seats_remaining: 4,
    is_active: true,
  });

  const [createForm, setCreateForm] = useState({
    opponent: '',
    match_date: '',
    venue: '',
    competition: '',
    total_seats: 4,
  });

  const openEdit = (m: BarcelonaMatch) => {
    setEditForm({
      opponent: m.opponent,
      match_date: toLocal(m.match_date),
      venue: m.venue,
      competition: m.competition,
      total_seats: m.total_seats,
      seats_remaining: m.seats_remaining,
      is_active: m.is_active,
    });
    setEditTarget(m);
  };

  const handleEditSave = async () => {
    if (!editTarget) return;
    try {
      await updateMatch(editTarget.id, {
        opponent: editForm.opponent,
        match_date: new Date(editForm.match_date).toISOString(),
        venue: editForm.venue,
        competition: editForm.competition,
        total_seats: Number(editForm.total_seats),
        seats_remaining: Number(editForm.seats_remaining),
        is_active: editForm.is_active,
      });
      toast.success('Match updated');
    } catch { toast.error('Failed to update match'); }
    setEditTarget(null);
  };

  const handleCreate = async () => {
    try {
      await createMatch({
        opponent: createForm.opponent,
        match_date: createForm.match_date ? new Date(createForm.match_date).toISOString() : new Date().toISOString(),
        venue: createForm.venue,
        competition: createForm.competition,
        total_seats: Number(createForm.total_seats),
        seats_remaining: Number(createForm.total_seats),
        is_active: true,
      });
      setCreateForm({ opponent: '', match_date: '', venue: '', competition: '', total_seats: 4 });
      toast.success('Match created');
      setCreateOpen(false);
    } catch { toast.error('Failed to create match'); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMatch(deleteTarget.id);
      toast.success('Match deleted');
    } catch { toast.error('Failed to delete match'); }
    setDeleteTarget(null);
  };

  const ef = (key: keyof typeof editForm) => (
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setEditForm(f => ({ ...f, [key]: key === 'is_active' ? (e.target as HTMLInputElement).checked : e.target.value }))
  );

  const cf = (key: keyof typeof createForm) => (
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setCreateForm(f => ({ ...f, [key]: e.target.value }))
  );

  return (
    <div className="animate-fade-in">
      <PageHeader title="Manage Matches" description="Create and manage Barcelona matches">
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gold-gradient text-accent-foreground hover:opacity-90">
              <Plus className="w-4 h-4 mr-1.5" /> New Match
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Create Match</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Opponent</Label><Input placeholder="e.g. Real Madrid" className="mt-1.5" value={createForm.opponent} onChange={cf('opponent')} /></div>
              <div><Label>Match Date</Label><Input type="datetime-local" className="mt-1.5" value={createForm.match_date} onChange={cf('match_date')} /></div>
              <div><Label>Venue</Label><Input placeholder="e.g. Camp Nou" className="mt-1.5" value={createForm.venue} onChange={cf('venue')} /></div>
              <div><Label>Competition</Label><Input placeholder="e.g. La Liga" className="mt-1.5" value={createForm.competition} onChange={cf('competition')} /></div>
              <div><Label>Total Seats</Label><Input type="number" className="mt-1.5" value={createForm.total_seats} onChange={cf('total_seats')} /></div>
              <Button className="w-full bg-gold-gradient text-accent-foreground hover:opacity-90" onClick={handleCreate}>
                Create Match
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="space-y-3">
        {matches.map(m => (
          <div key={m.id} className="bg-card rounded-xl border border-border p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">vs {m.opponent}</h3>
                <p className="text-xs text-muted-foreground">{m.competition} · {new Date(m.match_date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">{m.seats_remaining}/{m.total_seats} seats</span>
              <span className={cn("text-xs px-2 py-0.5 rounded-full", m.is_active ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground")}>
                {m.is_active ? 'Active' : 'Inactive'}
              </span>
              <Button variant="ghost" size="sm" onClick={() => openEdit(m)}>
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(m)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      <Dialog open={!!editTarget} onOpenChange={open => !open && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="w-4 h-4" /> Edit Match
            </DialogTitle>
            <DialogDescription>Update details for vs {editTarget?.opponent}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div><Label>Opponent</Label><Input className="mt-1.5" value={editForm.opponent} onChange={ef('opponent')} /></div>
            <div><Label>Match Date</Label><Input type="datetime-local" className="mt-1.5" value={editForm.match_date} onChange={ef('match_date')} /></div>
            <div><Label>Venue</Label><Input className="mt-1.5" value={editForm.venue} onChange={ef('venue')} /></div>
            <div><Label>Competition</Label><Input className="mt-1.5" value={editForm.competition} onChange={ef('competition')} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Total Seats</Label><Input type="number" className="mt-1.5" value={editForm.total_seats} onChange={ef('total_seats')} /></div>
              <div><Label>Seats Remaining</Label><Input type="number" className="mt-1.5" value={editForm.seats_remaining} onChange={ef('seats_remaining')} /></div>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="is_active"
                type="checkbox"
                checked={editForm.is_active}
                onChange={e => setEditForm(f => ({ ...f, is_active: e.target.checked }))}
                className="w-4 h-4 rounded border-border"
              />
              <Label htmlFor="is_active" className="cursor-pointer">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button className="bg-gold-gradient text-accent-foreground hover:opacity-90" onClick={handleEditSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="w-5 h-5" /> Delete Match
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>vs {deleteTarget?.opponent}</strong>? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMatches;
