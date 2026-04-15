import { useState, useEffect, useRef } from 'react';
import { useMembers } from '@/hooks/useDb';
import { updateMember, createMemberProfile } from '@/lib/db';
import { useAuthStore } from '@/store/authStore';
import { uploadAvatar } from '@/lib/cloudinary';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { X, Loader2, Camera } from 'lucide-react';

const geocode = async (city: string, country: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    const q = encodeURIComponent(`${city}, ${country}`);
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`, {
      headers: { 'Accept-Language': 'en' },
    });
    const data = await res.json();
    if (data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch { /* ignore */ }
  return null;
};

const Profile = () => {
  const user = useAuthStore(s => s.user);
  const { data: members, loading } = useMembers();
  const member = members.find(m => m.user_id === user?.id);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [occupation, setOccupation] = useState('');
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
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!member) return;
    setFirstName(member.first_name);
    setLastName(member.last_name);
    setOccupation(member.occupation || '');
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
    setAvatarUrl(member.avatar_url);
    setAvatarPreview(null);
  }, [member?.id]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5 MB');
      return;
    }

    // Show local preview immediately
    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);

    setUploadingAvatar(true);
    try {
      const url = await uploadAvatar(file);
      setAvatarUrl(url);
      // Persist immediately so other pages update without waiting for the full form save
      if (member) {
        await updateMember(member.id, { avatar_url: url });
        toast.success('Profile picture updated');
      }
    } catch (err) {
      setAvatarPreview(null);
      toast.error(`Upload failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;
    setSaving(true);
    try {
      // Build location: geocode if city/country provided
      let location = member.location ?? null;
      if (city.trim() && country.trim()) {
        const cityChanged = city !== member.location?.city || country !== member.location?.country;
        if (cityChanged || !member.location?.latitude) {
          toast.info('Looking up coordinates…', { duration: 2000 });
          const coords = await geocode(city.trim(), country.trim());
          location = {
            id: member.location?.id ?? `loc_${member.id}`,
            city: city.trim(),
            country: country.trim(),
            latitude: coords?.lat ?? member.location?.latitude ?? 0,
            longitude: coords?.lng ?? member.location?.longitude ?? 0,
          };
        } else {
          location = { ...member.location, city: city.trim(), country: country.trim() };
        }
      } else if (!city.trim() && !country.trim()) {
        location = null;
      }

      await updateMember(member.id, {
        first_name: firstName,
        last_name: lastName,
        occupation: occupation || null,
        bio: bio || null,
        phone: phone || null,
        website_url: website || null,
        linkedin_url: linkedin || null,
        instagram_url: instagram || null,
        twitter_url: twitter || null,
        is_visible: isVisible,
        location,
        skills: skills.map((name, i) => ({ id: `s${i}`, name, slug: name.toLowerCase().replace(/\s+/g, '-') })),
      });
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Profile save error:', err);
      toast.error(`Failed to save profile: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSaving(false);
    }
  };

  if (!member && !loading) return (
    <div className="animate-fade-in max-w-2xl">
      <PageHeader title="Edit Profile" description="Update your profile information" />
      <div className="bg-card rounded-xl border border-border p-8 text-center space-y-4">
        <p className="text-muted-foreground">No profile found for your account.</p>
        <Button onClick={async () => {
          if (!user) return;
          try {
            await createMemberProfile(user.id, user.email);
            toast.success('Profile created — please refresh the page.');
          } catch (err) {
            toast.error(`Could not create profile: ${err instanceof Error ? err.message : String(err)}`);
          }
        }}>
          Create My Profile
        </Button>
      </div>
    </div>
  );

  if (!member) return <div className="animate-fade-in"><p className="text-muted-foreground p-8">Loading profile...</p></div>;

  return (
    <div className="animate-fade-in max-w-2xl">
      <PageHeader title="Edit Profile" description="Update your profile information" />

      <form onSubmit={handleSave} className="space-y-6">
        {/* ── Profile Picture ─────────────────────────────────── */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-display text-lg text-foreground mb-4">Profile Picture</h3>
          <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              {(avatarPreview || avatarUrl) ? (
                <img
                  src={avatarPreview ?? avatarUrl!}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gold/30"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-navy flex items-center justify-center text-gold font-display text-2xl font-bold border-2 border-gold/30">
                  {firstName[0] ?? ''}{lastName[0] ?? ''}
                </div>
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploadingAvatar}
                onClick={() => avatarInputRef.current?.click()}
                className="gap-2"
              >
                <Camera className="w-4 h-4" />
                {uploadingAvatar ? 'Uploading…' : 'Change Photo'}
              </Button>
              <p className="text-xs text-muted-foreground">JPG, PNG or WebP · Max 5 MB</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h3 className="font-display text-lg text-foreground">Personal Info</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>First Name</Label><Input value={firstName} onChange={e => setFirstName(e.target.value)} className="mt-1.5" /></div>
            <div><Label>Last Name</Label><Input value={lastName} onChange={e => setLastName(e.target.value)} className="mt-1.5" /></div>
          </div>
          <div><Label>Occupation</Label><Input value={occupation} onChange={e => setOccupation(e.target.value)} placeholder="e.g. Social Media Manager, Entrepreneur..." className="mt-1.5" /></div>
          <div><Label>About / Description</Label><Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell other members what you do and what skills you have..." className="mt-1.5" rows={4} /></div>
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

        <Button type="submit" disabled={saving} className="w-full bg-gold-gradient text-accent-foreground hover:opacity-90 font-semibold">
          {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : 'Save Profile'}
        </Button>
      </form>
    </div>
  );
};

export default Profile;
