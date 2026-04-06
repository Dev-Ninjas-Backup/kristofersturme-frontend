import { useState } from 'react';
import { useMembers } from '@/hooks/useDb';
import { updateMember, deleteMember, createMemberUser } from '@/lib/db';
import PageHeader from '@/components/shared/PageHeader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Search, MoreHorizontal, Eye, EyeOff, Trash2, UserCircle, Pencil, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import type { MemberProfile } from '@/types';

type Action = 'view' | 'toggle-visibility' | 'remove' | 'edit' | null;

const toEditForm = (m: MemberProfile) => ({
  first_name: m.first_name,
  last_name: m.last_name,
  bio: m.bio ?? '',
  phone: m.phone ?? '',
  city: m.location?.city ?? '',
  country: m.location?.country ?? '',
  website_url: m.website_url ?? '',
  linkedin_url: m.linkedin_url ?? '',
});

const emptyEdit = { first_name: '', last_name: '', bio: '', phone: '', city: '', country: '', website_url: '', linkedin_url: '' };
const emptyCreate = { first_name: '', last_name: '', email: '', password: '', role: 'member' as 'admin' | 'member' };

const AdminMembers = () => {
  const { data: members, loading } = useMembers();
  const [search, setSearch] = useState('');

  // existing member actions
  const [selectedMember, setSelectedMember] = useState<MemberProfile | null>(null);
  const [action, setAction] = useState<Action>(null);
  const [editForm, setEditForm] = useState(emptyEdit);

  // create new member
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreate);
  const [creating, setCreating] = useState(false);

  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    return !q || `${m.first_name} ${m.last_name}`.toLowerCase().includes(q);
  });

  const openAction = (member: MemberProfile, act: Action) => {
    setSelectedMember(member);
    if (act === 'edit') setEditForm(toEditForm(member));
    setAction(act);
  };

  const closeModal = () => { setSelectedMember(null); setAction(null); };

  const handleToggleVisibility = async () => {
    if (!selectedMember) return;
    try {
      await updateMember(selectedMember.id, { is_visible: !selectedMember.is_visible });
      toast.success(`${selectedMember.first_name} is now ${selectedMember.is_visible ? 'hidden' : 'visible'}`);
    } catch { toast.error('Failed to update'); }
    closeModal();
  };

  const handleRemove = async () => {
    if (!selectedMember) return;
    try {
      await deleteMember(selectedMember.id);
      toast.success(`${selectedMember.first_name} ${selectedMember.last_name} removed`);
    } catch { toast.error('Failed to remove member'); }
    closeModal();
  };

  const handleEditSave = async () => {
    if (!selectedMember) return;
    try {
      await updateMember(selectedMember.id, {
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        bio: editForm.bio || null,
        phone: editForm.phone || null,
        website_url: editForm.website_url || null,
        linkedin_url: editForm.linkedin_url || null,
        location: selectedMember.location
          ? { ...selectedMember.location, city: editForm.city, country: editForm.country }
          : null,
      });
      toast.success('Profile updated');
    } catch { toast.error('Failed to save changes'); }
    closeModal();
  };

  const handleCreate = async () => {
    const { email, password, first_name, last_name, role } = createForm;
    if (!email || !password || !first_name) {
      toast.error('First name, email and password are required');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setCreating(true);
    try {
      await createMemberUser(email, password, first_name, last_name, role);
      toast.success(`${first_name} ${last_name} account created`);
      setCreateForm(emptyCreate);
      setCreateOpen(false);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      if (code === 'auth/email-already-in-use') toast.error('Email is already in use');
      else if (code === 'auth/invalid-email') toast.error('Invalid email address');
      else toast.error('Failed to create account');
    } finally {
      setCreating(false);
    }
  };

  const ef = (key: keyof typeof editForm) => (
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setEditForm(f => ({ ...f, [key]: e.target.value }))
  );

  const cf = (key: keyof typeof createForm) => (
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setCreateForm(f => ({ ...f, [key]: e.target.value }))
  );

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Manage Members"
        description={loading ? 'Loading...' : `${members.length} registered members`}
      >
        <Button
          className="bg-gold-gradient text-accent-foreground hover:opacity-90"
          onClick={() => setCreateOpen(true)}
        >
          <UserPlus className="w-4 h-4 mr-1.5" /> New Member
        </Button>
      </PageHeader>

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
              {loading && <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">Loading...</td></tr>}
              {filtered.map(m => (
                <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-gold text-xs font-bold">
                        {m.first_name[0]}{m.last_name?.[0] ?? ''}
                      </div>
                      <span className="text-sm font-medium text-foreground">{m.first_name} {m.last_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{m.location?.city || '—'}</td>
                  <td className="px-6 py-4"><div className="flex gap-1">{(m.skills ?? []).slice(0, 2).map(s => <span key={s.id} className="text-xs bg-gold/10 text-gold-dark px-2 py-0.5 rounded-full">{s.name}</span>)}</div></td>
                  <td className="px-6 py-4 text-sm">{m.is_visible ? <span className="text-emerald-600">Yes</span> : <span className="text-muted-foreground">No</span>}</td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" onClick={() => openAction(m, 'view')}>
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Create Member Modal ───────────────────────────────────── */}
      <Dialog open={createOpen} onOpenChange={open => { if (!creating) { setCreateOpen(open); if (!open) setCreateForm(emptyCreate); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" /> Create Member
            </DialogTitle>
            <DialogDescription>Create a new portal account. The member can log in immediately with these credentials.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="c_first_name">First Name <span className="text-destructive">*</span></Label>
                <Input id="c_first_name" value={createForm.first_name} onChange={cf('first_name')} placeholder="James" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c_last_name">Last Name</Label>
                <Input id="c_last_name" value={createForm.last_name} onChange={cf('last_name')} placeholder="Whitfield" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="c_email">Email <span className="text-destructive">*</span></Label>
              <Input id="c_email" type="email" value={createForm.email} onChange={cf('email')} placeholder="james@example.com" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="c_password">Password <span className="text-destructive">*</span></Label>
              <Input id="c_password" type="password" value={createForm.password} onChange={cf('password')} placeholder="Min 6 characters" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="c_role">Role</Label>
              <select
                id="c_role"
                value={createForm.role}
                onChange={cf('role')}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" disabled={creating} onClick={() => { setCreateOpen(false); setCreateForm(emptyCreate); }}>Cancel</Button>
            <Button
              className="bg-gold-gradient text-accent-foreground hover:opacity-90"
              disabled={creating}
              onClick={handleCreate}
            >
              {creating ? 'Creating...' : 'Create Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Action Picker ─────────────────────────────────────────── */}
      <Dialog open={action === 'view'} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>{selectedMember?.first_name} {selectedMember?.last_name}</DialogTitle>
            <DialogDescription>{selectedMember?.location?.city || 'No location'}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-2">
            <Button variant="ghost" className="justify-start gap-3 h-10" onClick={() => openAction(selectedMember!, 'edit')}>
              <Pencil className="w-4 h-4" /> Edit Profile
            </Button>
            <Button variant="ghost" className="justify-start gap-3 h-10" onClick={() => openAction(selectedMember!, 'toggle-visibility')}>
              {selectedMember?.is_visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {selectedMember?.is_visible ? 'Hide from Directory' : 'Show in Directory'}
            </Button>
            <Button variant="ghost" className="justify-start gap-3 h-10 text-destructive hover:text-destructive" onClick={() => openAction(selectedMember!, 'remove')}>
              <Trash2 className="w-4 h-4" /> Remove Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Edit Profile ─────────────────────────────────────────── */}
      <Dialog open={action === 'edit'} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Pencil className="w-5 h-5" /> Edit Profile</DialogTitle>
            <DialogDescription>Update details for {selectedMember?.first_name} {selectedMember?.last_name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>First Name</Label><Input value={editForm.first_name} onChange={ef('first_name')} /></div>
              <div className="space-y-1.5"><Label>Last Name</Label><Input value={editForm.last_name} onChange={ef('last_name')} /></div>
            </div>
            <div className="space-y-1.5"><Label>Bio</Label><Textarea value={editForm.bio} onChange={ef('bio')} rows={3} placeholder="Short bio..." /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>City</Label><Input value={editForm.city} onChange={ef('city')} /></div>
              <div className="space-y-1.5"><Label>Country</Label><Input value={editForm.country} onChange={ef('country')} /></div>
            </div>
            <div className="space-y-1.5"><Label>Phone</Label><Input value={editForm.phone} onChange={ef('phone')} placeholder="+1 234 567 890" /></div>
            <div className="space-y-1.5"><Label>Website</Label><Input value={editForm.website_url} onChange={ef('website_url')} placeholder="https://..." /></div>
            <div className="space-y-1.5"><Label>LinkedIn</Label><Input value={editForm.linkedin_url} onChange={ef('linkedin_url')} placeholder="https://linkedin.com/in/..." /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button onClick={handleEditSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Toggle Visibility ────────────────────────────────────── */}
      <Dialog open={action === 'toggle-visibility'} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><UserCircle className="w-5 h-5" />{selectedMember?.is_visible ? 'Hide Member' : 'Show Member'}</DialogTitle>
            <DialogDescription>
              {selectedMember?.is_visible
                ? `${selectedMember?.first_name} will no longer appear in the member directory.`
                : `${selectedMember?.first_name} will be visible in the member directory.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button onClick={handleToggleVisibility}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Remove Confirm ───────────────────────────────────────── */}
      <Dialog open={action === 'remove'} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive"><Trash2 className="w-5 h-5" /> Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <strong>{selectedMember?.first_name} {selectedMember?.last_name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button variant="destructive" onClick={handleRemove}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMembers;
