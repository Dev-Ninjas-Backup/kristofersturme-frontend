import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { mockRooms } from '@/data/mockData';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Users, Calendar, Info } from 'lucide-react';
import { toast } from 'sonner';

const GranadaRoomDetail = () => {
  const { roomId } = useParams();
  const room = mockRooms.find(r => r.id === roomId);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [notes, setNotes] = useState('');

  if (!room || room.is_owners) return (
    <div className="text-center py-16">
      <p className="text-muted-foreground">Room not found.</p>
      <Link to="/bookings/granada" className="text-gold mt-2 inline-block">Back to rooms</Link>
    </div>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      toast.error('Check-out must be after check-in');
      return;
    }
    toast.success('Booking request submitted! You will be notified once confirmed.');
    setCheckIn('');
    setCheckOut('');
    setNotes('');
  };

  return (
    <div className="animate-fade-in max-w-3xl">
      <Link to="/bookings/granada" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Rooms
      </Link>

      <div className="bg-card rounded-xl border border-border overflow-hidden mb-6">
        <div className="h-56 bg-gradient-to-br from-navy/5 to-gold/10 flex items-center justify-center">
          <span className="font-display text-6xl text-gold/20">{room.room_number}</span>
        </div>
        <div className="p-6">
          <h1 className="font-display text-2xl text-foreground mb-2">{room.name}</h1>
          <p className="text-muted-foreground mb-4">{room.description}</p>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="w-4 h-4" /> Capacity: {room.capacity} guests
          </span>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 mb-6">
        <h2 className="font-display text-lg text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gold" /> Book This Room
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="check-in">Check-in</Label>
              <Input id="check-in" type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="check-out">Check-out</Label>
              <Input id="check-out" type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" placeholder="Any special requests..." value={notes} onChange={e => setNotes(e.target.value)} className="mt-1.5" />
          </div>
          <Button type="submit" className="w-full bg-gold-gradient text-accent-foreground hover:opacity-90 font-semibold">
            Submit Booking Request
          </Button>
        </form>
      </div>

      <div className="bg-muted/50 rounded-xl border border-border p-6">
        <h3 className="font-display text-sm text-foreground mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-gold" /> Booking Rules
        </h3>
        <ul className="text-sm text-muted-foreground space-y-1.5">
          <li>• Maximum stay: 7 nights per booking</li>
          <li>• Advance notice: At least 48 hours before check-in</li>
          <li>• Cancellation: Free up to 24 hours before check-in</li>
          <li>• Maximum 2 active bookings per member</li>
        </ul>
      </div>
    </div>
  );
};

export default GranadaRoomDetail;
