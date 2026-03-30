import { Link } from 'react-router-dom';
import { mockRooms } from '@/data/mockData';
import PageHeader from '@/components/shared/PageHeader';
import { Users, ArrowRight } from 'lucide-react';

const GranadaBookings = () => {
  const availableRooms = mockRooms.filter(r => !r.is_owners && r.is_active);

  return (
    <div className="animate-fade-in">
      <PageHeader title="Granada Rooms" description="Browse available rooms at the Granada property" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableRooms.map(room => (
          <Link key={room.id} to={`/bookings/granada/${room.id}`} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-elevated transition-all group">
            <div className="h-48 bg-gradient-to-br from-navy/5 to-gold/10 flex items-center justify-center">
              <span className="font-display text-4xl text-gold/30">{room.room_number}</span>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-display text-lg text-foreground">{room.name}</h3>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors mt-1" />
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{room.description}</p>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="w-3.5 h-3.5" /> Up to {room.capacity} guests
                </span>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Available</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GranadaBookings;
