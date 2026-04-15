import { useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { allSkills } from '@/data/mockData';
import { useMembers } from '@/hooks/useDb';
import PageHeader from '@/components/shared/PageHeader';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Grid3X3, Map } from 'lucide-react';

const MembersMap = lazy(() => import('@/components/MembersMap'));
import { cn } from '@/lib/utils';

import type { MemberProfile } from '@/types';
const MemberCard = ({ member }: { member: MemberProfile }) => (
  <Link to={`/members/${member.id}`} className="bg-card rounded-xl border border-border p-6 hover:shadow-elevated transition-all group">
    <div className="flex items-center gap-4 mb-4">
      {member.avatar_url ? (
        <img src={member.avatar_url} alt={`${member.first_name} ${member.last_name}`} className="w-14 h-14 rounded-full object-cover shrink-0 border border-gold/20" />
      ) : (
        <div className="w-14 h-14 rounded-full bg-navy flex items-center justify-center text-gold font-display text-xl font-bold shrink-0">
          {member.first_name[0]}{member.last_name[0]}
        </div>
      )}
      <div className="min-w-0">
        <h3 className="font-semibold text-foreground truncate">{member.first_name} {member.last_name}</h3>
        {member.occupation && <p className="text-xs text-foreground/70 truncate">{member.occupation}</p>}
        {member.location && (
          <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{member.location.city}, {member.location.country}</p>
        )}
      </div>
    </div>
    {member.bio && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{member.bio}</p>}
    <div className="flex flex-wrap gap-1.5">
      {(member.skills ?? []).map(skill => (
        <span key={skill.id} className="text-xs bg-gold/10 text-gold-dark px-2 py-0.5 rounded-full border border-gold/20">{skill.name}</span>
      ))}
    </div>
  </Link>
);

const Members = () => {
  const { data: members } = useMembers();
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'map'>('grid');
  const [skillFilter, setSkillFilter] = useState('');

  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    const matchesSearch = !q || m.first_name.toLowerCase().includes(q) || m.last_name.toLowerCase().includes(q) || m.bio?.toLowerCase().includes(q) || m.occupation?.toLowerCase().includes(q) || (m.skills ?? []).some(s => s.name.toLowerCase().includes(q));
    const matchesSkill = !skillFilter || (m.skills ?? []).some(s => s.slug === skillFilter);
    return matchesSearch && matchesSkill;
  });

  return (
    <div className="animate-fade-in">
      <PageHeader title="Members Directory" description={`${members.length} members in the club`}>
        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
          <button onClick={() => setView('grid')} className={cn("p-2 rounded-md transition-colors", view === 'grid' ? "bg-card shadow-sm text-foreground" : "text-muted-foreground")}>
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button onClick={() => setView('map')} className={cn("p-2 rounded-md transition-colors", view === 'map' ? "bg-card shadow-sm text-foreground" : "text-muted-foreground")}>
            <Map className="w-4 h-4" />
          </button>
        </div>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search members by name, bio, or skill..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <select value={skillFilter} onChange={e => setSkillFilter(e.target.value)} className="h-10 rounded-md border border-input bg-card px-3 text-sm text-foreground">
          <option value="">All Skills</option>
          {allSkills.map(s => <option key={s} value={s.toLowerCase().replace(/\s+/g, '-')}>{s}</option>)}
        </select>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(m => <MemberCard key={m.id} member={m} />)}
        </div>
      ) : (
        <Suspense fallback={<div className="h-[500px] rounded-xl border border-border bg-muted animate-pulse" />}>
          <MembersMap members={filtered} />
        </Suspense>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No members match your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Members;
