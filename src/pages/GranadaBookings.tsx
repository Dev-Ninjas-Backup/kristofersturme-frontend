import { Link } from 'react-router-dom';
import { useRooms, useGranadaBookings } from '@/hooks/useDb';
import PageHeader from '@/components/shared/PageHeader';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GranadaRoom, GranadaBooking } from '@/types';

const today = new Date().toISOString().split('T')[0];

const getRoomStatus = (room: GranadaRoom, bookings: GranadaBooking[]) => {
  const activeBookings = bookings.filter(b =>
    b.room.id === room.id &&
    (b.status === 'confirmed' || b.status === 'pending') &&
    b.check_out >= today
  );

  if (activeBookings.length === 0) return { label: 'Available', style: 'bg-emerald-100 text-emerald-700' };

  // Check if currently occupied (checked in today)
  const currentlyOccupied = activeBookings.some(b => b.check_in <= today && b.check_out > today);
  if (currentlyOccupied) return { label: 'Occupied', style: 'bg-red-100 text-red-700' };

  // Has upcoming bookings
  const next = activeBookings.sort((a, b) => a.check_in.localeCompare(b.check_in))[0];
  return { label: `Booked from ${next.check_in}`, style: 'bg-amber-100 text-amber-700' };
};

const GranadaBookings = () => {
  const { data: rooms } = useRooms();
  const { data: bookings } = useGranadaBookings();
  const availableRooms = rooms.filter(r => !r.is_owners && r.is_active);

  return (
    <div className="animate-fade-in">
      <PageHeader title="Granada Rooms" description="Browse available rooms at the Granada property" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableRooms.map(room => {
          const status = getRoomStatus(room, bookings);
          return (
            <Link key={room.id} to={`/bookings/granada/${room.id}`} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-elevated transition-all group">
              <div className="h-48 bg-gradient-to-br from-navy/5 to-gold/10 flex items-center justify-center">
                <span className="font-display text-4xl text-gold/30">{room.room_number}</span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-display text-lg text-foreground">{room.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{room.description}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="w-3.5 h-3.5" /> Up to {room.capacity} guests
                  </span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full", status.style)}>
                    {status.label}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default GranadaBookings;
