import { useState } from 'react';
import { mockMatches } from '@/data/mockData';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const AdminMatches = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="animate-fade-in">
      <PageHeader title="Manage Matches" description="Create and manage Barcelona matches">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gold-gradient text-accent-foreground hover:opacity-90"><Plus className="w-4 h-4 mr-1.5" /> New Match</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">Create Match</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Opponent</Label><Input placeholder="e.g. Real Madrid" className="mt-1.5" /></div>
              <div><Label>Match Date</Label><Input type="datetime-local" className="mt-1.5" /></div>
              <div><Label>Venue</Label><Input placeholder="e.g. Camp Nou" className="mt-1.5" /></div>
              <div><Label>Competition</Label><Input placeholder="e.g. La Liga" className="mt-1.5" /></div>
              <div><Label>Total Seats</Label><Input type="number" defaultValue={4} className="mt-1.5" /></div>
              <Button className="w-full bg-gold-gradient text-accent-foreground hover:opacity-90" onClick={() => { toast.success('Match created'); setOpen(false); }}>Create Match</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="space-y-3">
        {mockMatches.map(m => (
          <div key={m.id} className="bg-card rounded-xl border border-border p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center"><Trophy className="w-5 h-5 text-gold" /></div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">vs {m.opponent}</h3>
                <p className="text-xs text-muted-foreground">{m.competition} · {new Date(m.match_date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">{m.seats_remaining}/{m.total_seats} seats</span>
              <span className={cn("text-xs px-2 py-0.5 rounded-full", m.is_active ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground")}>{m.is_active ? 'Active' : 'Inactive'}</span>
              <Button variant="ghost" size="sm"><Edit2 className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm" onClick={() => toast.success('Match deleted')}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMatches;
