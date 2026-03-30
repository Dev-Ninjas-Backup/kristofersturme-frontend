import { useState } from 'react';
import { mockMembers } from '@/data/mockData';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { X } from 'lucide-react';

const Profile = () => {
  const member = mockMembers[0];
  const [firstName, setFirstName] = useState(member.first_name);
  const [lastName, setLastName] = useState(member.last_name);
  const [bio, setBio] = useState(member.bio || '');
  const [phone, setPhone] = useState(member.phone || '');
  const [website, setWebsite] = useState(member.website_url || '');
  const [linkedin, setLinkedin] = useState(member.linkedin_url || '');
  const [instagram, setInstagram] = useState(member.instagram_url || '');
  const [twitter, setTwitter] = useState(member.twitter_url || '');
  const [city, setCity] = useState(member.location?.city || '');
  const [country, setCountry] = useState(member.location?.country || '');
  const [isVisible, setIsVisible] = useState(member.is_visible);
  const [skills, setSkills] = useState(member.skills.map(s => s.name));
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully');
  };

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
