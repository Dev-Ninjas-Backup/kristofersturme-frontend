import { useState, useEffect } from 'react';
import { useMembers } from '@/hooks/useDb';
import { updateMember } from '@/lib/db';
import { useAuthStore } from '@/store/authStore';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { X } from 'lucide-react';

const Profile = () => {
  const user = useAuthStore(s => s.user);
  const { data: members } = useMembers();
  const member = members.find(m => m.user_id === user?.id);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (!member) return;
    setFirstName(member.first_name);
    setLastName(member.last_name);
    setBio(member.bio || '');
    setPhone(member.phone || '');
    setWebsite(member.website_url || '');
    setLinkedin(member.linkedin_url || '');
    setInstagram(member.instagram_url || '');
    setTwitter(member.twitter_url || '');
    setCity(member.location?.city || '');
    setCountry(member.location?.country || '');
    setIsVisible(member.is_visible);
    setSkills((member.skills ?? []).map(s => s.name));
  }, [member?.id]);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;
    try {
      await updateMember(member.id, {
        first_name: firstName,
        last_name: lastName,
        bio: bio || null,
        phone: phone || null,
        website_url: website || null,
        linkedin_url: linkedin || null,
        instagram_url: instagram || null,
        twitter_url: twitter || null,
        is_visible: isVisible,
        location: member.location ? { ...member.location, city, country } : null,
        skills: skills.map((name, i) => ({ id: `s${i}`, name, slug: name.toLowerCase().replace(/\s+/g, '-') })),
      });
      toast.success('Profile updated successfully');
    } catch { toast.error('Failed to save profile'); }
  };

  if (!member) return <div className="animate-fade-in"><p className="text-muted-foreground p-8">Loading profile...</p></div>;

  return (
    <div className="animate-fade-in max-w-2xl">
      <PageHeader title="Edit Profile" description="Update your profile information" />

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h3 className="font-display text-lg text-foreground">Personal Info</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>First Name</Label><Input value={firstName} onChange={e => setFirstName(e.target.value)} className="mt-1.5" /></div>
            <div><Label>Last Name</Label><Input value={lastName} onChange={e => setLastName(e.target.value)} className="mt-1.5" /></div>
          </div>
          <div><Label>Bio</Label><Textarea value={bio} onChange={e => setBio(e.target.value)} className="mt-1.5" rows={4} /></div>
          <div><Label>Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} className="mt-1.5" /></div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h3 className="font-display text-lg text-foreground">Social Links</h3>
          <div><Label>Website</Label><Input value={website} onChange={e => setWebsite(e.target.value)} className="mt-1.5" /></div>
          <div><Label>LinkedIn</Label><Input value={linkedin} onChange={e => setLinkedin(e.target.value)} className="mt-1.5" /></div>
          <div><Label>Instagram</Label><Input value={instagram} onChange={e => setInstagram(e.target.value)} className="mt-1.5" /></div>
          <div><Label>Twitter</Label><Input value={twitter} onChange={e => setTwitter(e.target.value)} className="mt-1.5" /></div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h3 className="font-display text-lg text-foreground">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <span key={skill} className="flex items-center gap-1.5 bg-gold/10 text-gold-dark px-3 py-1 rounded-full text-sm border border-gold/20">
                {skill}
                <button type="button" onClick={() => setSkills(skills.filter(s => s !== skill))}><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Add a skill" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
            <Button type="button" variant="outline" onClick={addSkill}>Add</Button>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h3 className="font-display text-lg text-foreground">Location</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>City</Label><Input value={city} onChange={e => setCity(e.target.value)} className="mt-1.5" /></div>
            <div><Label>Country</Label><Input value={country} onChange={e => setCountry(e.target.value)} className="mt-1.5" /></div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg text-foreground">Directory Visibility</h3>
              <p className="text-sm text-muted-foreground">Show your profile in the members directory</p>
            </div>
            <Switch checked={isVisible} onCheckedChange={setIsVisible} />
          </div>
        </div>

        <Button type="submit" className="w-full bg-gold-gradient text-accent-foreground hover:opacity-90 font-semibold">
          Save Profile
        </Button>
      </form>
    </div>
  );
};

export default Profile;
