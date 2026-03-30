import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Trophy } from 'lucide-react';
import { toast } from 'sonner';

const AdminRules = () => {
  const [granadaRules, setGranadaRules] = useState({ maxStay: '7', advanceNotice: '48', maxBookings: '2', cancellation: '24' });
  const [barcelonaRules, setBarcelonaRules] = useState({ maxSeats: '4', bookingClose: '24', cancellation: '48' });

  return (
    <div className="animate-fade-in max-w-2xl">
      <PageHeader title="Booking Rules" description="Configure rules for Granada and Barcelona bookings" />

      <div className="space-y-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-display text-lg text-foreground mb-4 flex items-center gap-2"><Building2 className="w-5 h-5 text-gold" /> Granada Rules</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Max Stay (nights)</Label><Input type="number" value={granadaRules.maxStay} onChange={e => setGranadaRules({...granadaRules, maxStay: e.target.value})} className="mt-1.5" /></div>
            <div><Label>Advance Notice (hours)</Label><Input type="number" value={granadaRules.advanceNotice} onChange={e => setGranadaRules({...granadaRules, advanceNotice: e.target.value})} className="mt-1.5" /></div>
            <div><Label>Max Active Bookings</Label><Input type="number" value={granadaRules.maxBookings} onChange={e => setGranadaRules({...granadaRules, maxBookings: e.target.value})} className="mt-1.5" /></div>
            <div><Label>Cancellation Window (hours)</Label><Input type="number" value={granadaRules.cancellation} onChange={e => setGranadaRules({...granadaRules, cancellation: e.target.value})} className="mt-1.5" /></div>
          </div>
          <Button className="mt-4 bg-gold-gradient text-accent-foreground hover:opacity-90" onClick={() => toast.success('Granada rules saved')}>Save Granada Rules</Button>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-display text-lg text-foreground mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-gold" /> Barcelona Rules</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Max Seats per Match</Label><Input type="number" value={barcelonaRules.maxSeats} onChange={e => setBarcelonaRules({...barcelonaRules, maxSeats: e.target.value})} className="mt-1.5" /></div>
            <div><Label>Booking Close (hours before)</Label><Input type="number" value={barcelonaRules.bookingClose} onChange={e => setBarcelonaRules({...barcelonaRules, bookingClose: e.target.value})} className="mt-1.5" /></div>
            <div><Label>Cancellation Window (hours)</Label><Input type="number" value={barcelonaRules.cancellation} onChange={e => setBarcelonaRules({...barcelonaRules, cancellation: e.target.value})} className="mt-1.5" /></div>
          </div>
          <Button className="mt-4 bg-gold-gradient text-accent-foreground hover:opacity-90" onClick={() => toast.success('Barcelona rules saved')}>Save Barcelona Rules</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminRules;
