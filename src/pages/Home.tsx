import { Link } from 'react-router-dom';
import { Crown, Users, MapPin, Ticket, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TestimonialCard from '@/components/TestimonialCard';

const testimonials = [
  { name: 'Josh', videoId: 'Nf3VLhyeHMg' },
  { name: 'Thibault', videoId: 'rGZRdgiRi9M' },
  { name: 'Smit', videoId: 'sM-XJnI7vAg' },
  { name: 'Kevin', videoId: 'e1Lsk36G37w' },
  { name: 'Ted', videoId: 'p_3iFffody4' },
  { name: 'Abde', videoId: 'XfMXgFIDiIA' },
  { name: 'Lucas', videoId: 'rHL9Wil5RUE' },
  { name: 'Pierre', videoId: 'i3NNcSQMvec' },
];

const features = [
  {
    icon: Users,
    title: 'Exclusive Network',
    description: 'Connect with exceptional individuals across Europe — entrepreneurs, investors, and visionaries.',
  },
  {
    icon: MapPin,
    title: 'Granada Retreats',
    description: 'Book luxury suites at our private villa in the heart of Andalusia with stunning Sierra Nevada views.',
  },
  {
    icon: Ticket,
    title: 'Barcelona Experiences',
    description: 'Access premium seats at Camp Nou for the biggest FC Barcelona matches in La Liga and Champions League.',
  },
  {
    icon: Star,
    title: 'Curated Events',
    description: 'Enjoy members-only dinners, cultural experiences, and networking events across premier European cities.',
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-7 h-7 text-gold" />
            <span className="font-display text-xl text-foreground">Members Club</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gold-gradient text-accent-foreground hover:opacity-90 font-semibold">
                Join Now
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 bg-navy-gradient overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(43 96% 58% / 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(43 96% 58% / 0.2) 0%, transparent 40%)',
        }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 mb-8">
            <Crown className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-gold-light">By Invitation Only</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-gold-light mb-6 leading-tight">
            Where Extraordinary Minds Connect
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10" style={{ color: 'hsl(220 20% 70%)' }}>
            An exclusive community of exceptional individuals. Access premium experiences, luxury retreats in Granada, and front-row seats at Camp Nou.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-gold-gradient text-accent-foreground hover:opacity-90 font-semibold text-base px-8">
                Apply for Membership <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-gold/30 text-gold-light hover:bg-gold/10 text-base px-8">
                Member Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-center text-foreground mb-4">
            The Privileges of Membership
          </h2>
          <p className="text-center text-muted-foreground mb-14 max-w-xl mx-auto">
            Every detail is curated for those who appreciate the finer things in life.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-xl border border-border bg-card hover:shadow-elevated transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-display text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-muted/30 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-center text-foreground mb-4">
            What Our Members Say
          </h2>
          <p className="text-center text-muted-foreground mb-14 max-w-xl mx-auto">
            Hear directly from the community
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t) => (
              <TestimonialCard key={t.videoId} name={t.name} videoId={t.videoId} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Crown className="w-12 h-12 text-gold mx-auto mb-6" />
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
            Ready to Join?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Membership is by invitation or application. Begin your journey into an extraordinary community.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-gold-gradient text-accent-foreground hover:opacity-90 font-semibold text-base px-10">
              Apply Now <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-gold" />
            <span className="font-display text-sm text-foreground">Members Club</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Members Club. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
