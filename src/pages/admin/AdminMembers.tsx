import { useState } from 'react';
import { mockMembers } from '@/data/mockData';
import PageHeader from '@/components/shared/PageHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

const AdminMembers = () => {
  const [search, setSearch] = useState('');
  const filtered = mockMembers.filter(m => {
    const q = search.toLowerCase();
    return !q || `${m.first_name} ${m.last_name}`.toLowerCase().includes(q);
  });

  return (
    <div className="animate-fade-in">
      <PageHeader title="Manage Members" description={`${mockMembers.length} registered members`} />

      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Name</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Location</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Skills</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Visible</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-gold text-xs font-bold">{m.first_name[0]}{m.last_name[0]}</div>
                      <span className="text-sm font-medium text-foreground">{m.first_name} {m.last_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{m.location?.city || '—'}</td>
                  <td className="px-6 py-4"><div className="flex gap-1">{m.skills.slice(0, 2).map(s => <span key={s.id} className="text-xs bg-gold/10 text-gold-dark px-2 py-0.5 rounded-full">{s.name}</span>)}</div></td>
                  <td className="px-6 py-4 text-sm">{m.is_visible ? <span className="text-emerald-600">Yes</span> : <span className="text-muted-foreground">No</span>}</td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" onClick={() => toast.info('Member actions coming soon')}>
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminMembers;
