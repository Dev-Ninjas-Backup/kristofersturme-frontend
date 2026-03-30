import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import type { MemberProfile } from '@/types';

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const goldIcon = new L.DivIcon({
  className: '',
  html: `<div style="width:28px;height:28px;border-radius:50%;background:#B8860B;border:3px solid #0A1628;display:flex;align-items:center;justify-content:center;color:#0A1628;font-weight:700;font-size:12px;box-shadow:0 2px 8px rgba(0,0,0,0.3);">●</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -16],
});

interface Props {
  members: MemberProfile[];
}

const MembersMap = ({ members }: Props) => {
  const membersWithLocation = members.filter(m => m.location);

  return (
    <div className="rounded-xl border border-border overflow-hidden" style={{ height: 500 }}>
      <MapContainer
        center={[48.5, 8]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {membersWithLocation.map(m => (
          <Marker
            key={m.id}
            position={[m.location!.latitude, m.location!.longitude]}
            icon={goldIcon}
          >
            <Popup>
              <Link to={`/members/${m.id}`} className="no-underline">
                <div className="text-center p-1">
                  <div className="font-semibold text-sm">{m.first_name} {m.last_name}</div>
                  <div className="text-xs text-gray-500">{m.location!.city}, {m.location!.country}</div>
                  <div className="flex gap-1 mt-1 justify-center flex-wrap">
                    {m.skills.slice(0, 2).map(s => (
                      <span key={s.id} className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">{s.name}</span>
                    ))}
                  </div>
                </div>
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MembersMap;
