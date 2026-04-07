import { useParams, Link } from 'react-router-dom';
import { useMembers } from '@/hooks/useDb';
import PageHeader from '@/components/shared/PageHeader';
import { ArrowLeft, MapPin, Globe, Linkedin, Instagram, Twitter, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MemberProfile = () => {
  const { id } = useParams();
  const { data: members } = useMembers();
  const member = members.find(m => m.id === id);

  if (!member) return (
    <div className="text-center py-16">
      <p className="text-muted-foreground">Member not found.</p>
      <Link to="/members" className="text-gold mt-2 inline-block">Back to members</Link>
    </div>
  );

  return (
    <div className="animate-fade-in max-w-3xl">
      <Link to="/members" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Members
      </Link>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="bg-navy-gradient p-8">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-navy-light border-2 border-gold/30 flex items-center justify-center text-gold font-display text-2xl font-bold">
              {member.first_name[0]}{member.last_name[0]}
            </div>
            <div>
              <h1 className="font-display text-2xl text-gold-light">{member.first_name} {member.last_name}</h1>
              {member.occupation && (
                <p className="text-sm mt-0.5" style={{ color: 'hsl(60 16% 75%)' }}>{member.occupation}</p>
              )}
              {member.location && (
                <p className="flex items-center gap-1.5 mt-1" style={{ color: 'hsl(220 20% 70%)' }}>
                  <MapPin className="w-4 h-4" /> {member.location.city}, {member.location.country}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {member.bio && (
            <div>
              <h3 className="font-display text-lg text-foreground mb-2">About</h3>
              <p className="text-muted-foreground leading-relaxed">{member.bio}</p>
            </div>
          )}

          <div>
            <h3 className="font-display text-lg text-foreground mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {(member.skills ?? []).map(s => (
                <span key={s.id} className="bg-gold/10 text-gold-dark px-3 py-1 rounded-full text-sm border border-gold/20">{s.name}</span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg text-foreground mb-3">Connect</h3>
            <div className="flex flex-wrap gap-3">
              {member.website_url && (
                <a href={member.website_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Globe className="w-4 h-4" /> Website
                </a>
              )}
              {member.linkedin_url && (
                <a href={member.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              )}
              {member.instagram_url && (
                <a href={member.instagram_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Instagram className="w-4 h-4" /> Instagram
                </a>
              )}
              {member.twitter_url && (
                <a href={member.twitter_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="w-4 h-4" /> Twitter
                </a>
              )}
              {member.phone && (
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" /> {member.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
