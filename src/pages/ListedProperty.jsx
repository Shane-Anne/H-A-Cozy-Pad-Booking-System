import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import { API_BASE_URL } from '../lib/api';

import 'leaflet/dist/leaflet.css';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIconPng,
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
});

const PLACEHOLDER_AMENITIES = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: 'Kitchen',
}));

//for comments wala pang purpose
const PLACEHOLDER_CATEGORIES = ['Category', 'Category', 'Category', 'Category', 'Category'];

function normalizeAmenities(amenities) {
  if (!amenities) return [];

  if (Array.isArray(amenities)) {
    return amenities
      .map((item) => (typeof item === 'string' ? item.trim() : item?.name || ''))
      .filter(Boolean)
      .map((name, index) => ({ id: `${name}-${index}`, name }));
  }

  return String(amenities)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((name, index) => ({ id: `${name}-${index}`, name }));
}

const PLACEHOLDER_REVIEWS = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: 'Name',
  dateRange: '00/00/0000 - 00/00/0000',
  text:
    'Secure your upcoming booking by filling out the details below. Please choose your preferred date, time, and total number of guests. You will be held for a maximum of fifteen minutes upon schedule.',
}));

export default function PropertyDetail({
  isMenuOpen,
  setIsMenuOpen,
  onOpenSignIn,
  onOpenRegister,
  unitId, // optional: pass a specific unit_id to show; falls back to the first available unit
}) {
  const { unitId: routeUnitId } = useParams();
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    let isMounted = true;

    async function fetchUnits() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/available_listings.php`);
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const data = await res.json();
        if (isMounted) {
          setUnits(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load listing.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchUnits();
    return () => {
      isMounted = false;
    };
  }, []);

  const selectedUnitId = unitId ?? routeUnitId;

  const unit = selectedUnitId
    ? units.find((u) => String(u.unit_id) === String(selectedUnitId))
    : units[0];

  const propertyAmenities = normalizeAmenities(unit?.amenities);
  const visibleAmenities = showAllAmenities
    ? (propertyAmenities.length ? propertyAmenities : PLACEHOLDER_AMENITIES)
    : (propertyAmenities.length ? propertyAmenities.slice(0, 8) : PLACEHOLDER_AMENITIES.slice(0, 8));

  const handleReserve = () => {
    if (!unit) return;

    navigate('/booking-confirmation', {
      state: {
        property: unit,
        checkIn,
        checkOut,
        guests,
      },
    });
  };

  const visibleReviews = showAllComments
    ? PLACEHOLDER_REVIEWS
    : PLACEHOLDER_REVIEWS.slice(0, 6);

  return (
    <div className="bg-white text-black font-sans min-h-screen flex flex-col">
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onOpenSignIn={onOpenSignIn}
        onOpenRegister={onOpenRegister}
      />

      <main className="grow px-5 md:px-10 lg:px-[52px] py-10">
        {loading && (
          <div className="max-w-[1200px] mx-auto py-20 text-center text-neutral-500">
            Loading listing…
          </div>
        )}

        {!loading && error && (
          <div className="max-w-[1200px] mx-auto py-20 text-center text-red-600">
            Couldn&apos;t load this listing: {error}
          </div>
        )}

        {!loading && !error && !unit && (
          <div className="max-w-[1200px] mx-auto py-20 text-center text-neutral-500">
            No available units found.
          </div>
        )}

        {!loading && !error && unit && (
          <div className="max-w-[1200px] mx-auto flex flex-col gap-10">
            {/* Title */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{unit.building_name}</h1>
              <p  className="text-neutral-600 mt-1">{unit.unit_name} · {unit.location}</p>
            </div>

            {/* Gallery + Map */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 h-56 md:h-72 bg-neutral-100 border border-neutral-200 rounded-xl flex items-center justify-center text-neutral-400">
                  Image
                </div>
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-28 md:h-32 bg-neutral-100 border border-neutral-200 rounded-xl flex items-center justify-center text-neutral-400"
                  >
                    Image
                  </div>
                ))}
              </div>
              <div className="h-56 lg:h-full min-h-[220px] overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                {Number.isFinite(Number(unit.latitude)) && Number.isFinite(Number(unit.longitude)) ? (
                  <MapContainer
                    center={[Number(unit.latitude), Number(unit.longitude)]}
                    zoom={15}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[Number(unit.latitude), Number(unit.longitude)]} />
                  </MapContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-neutral-400">
                    Location unavailable
                  </div>
                )}
              </div>
            </div>

            {/* Details + Booking */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
              <div>
                <h2 className="text-lg font-semibold mb-2">
                  {unit.max_guests ?? '—'} guests
                </h2>
                <p className="text-neutral-700 leading-relaxed">
                  {unit.description || 'No description provided for this unit yet.'}
                </p>
              </div>

              <div className="border border-neutral-300 rounded-xl p-5 h-fit">
                <p className="text-xl font-bold mb-4">
                  ₱{Number(unit.rate_per_night ?? 0).toFixed(2)}{' '}
                  <span className="text-sm font-normal text-neutral-500">/ night</span>
                </p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <label className="border border-neutral-300 rounded-lg px-3 py-2 flex flex-col">
                    <span className="text-[11px] text-neutral-500 uppercase">Check-in</span>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="bg-transparent outline-none text-sm"
                    />
                  </label>
                  <label className="border border-neutral-300 rounded-lg px-3 py-2 flex flex-col">
                    <span className="text-[11px] text-neutral-500 uppercase">Check-out</span>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="bg-transparent outline-none text-sm"
                    />
                  </label>
                </div>
                <label className="block border border-neutral-300 rounded-lg px-3 py-2 mb-4">
                  <span className="text-[11px] text-neutral-500 uppercase block">Guests</span>
                  <input
                    type="number"
                    min={1}
                    max={unit.max_guests || undefined}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="bg-transparent outline-none text-sm w-full"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleReserve}
                  disabled={unit.status !== 'available'}
                  className="w-full py-3 rounded-full bg-black text-white font-medium disabled:bg-neutral-300 disabled:cursor-not-allowed hover:bg-neutral-800 cursor-pointer"
                >
                  {unit.status === 'available' ? 'Reserve' : 'Unavailable'}
                </button>
              </div>
            </div>

            <hr className="border-neutral-200" />

            {/* Amenities */}
            <section>
              <h2 className="text-xl font-bold mb-5">What&apos;s this place offer</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {visibleAmenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200" />
                    <span className="text-sm">{amenity.name}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowAllAmenities((v) => !v)}
                className="text-sm font-medium underline cursor-pointer"
              >
                {showAllAmenities ? 'Show less' : 'Show all amenities'}
              </button>
            </section>

            <hr className="border-neutral-200" />

            {/* Ratings */}
            <section>
              <h2 className="text-xl font-bold text-center mb-2">Overall Ratings</h2>
              <p className="text-3xl font-bold text-center mb-6">5.0</p>
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {PLACEHOLDER_CATEGORIES.map((cat, i) => (
                  <span
                    key={i}
                    className="px-4 py-1.5 text-sm border border-neutral-300 rounded-full text-neutral-600"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleReviews.map((review) => (
                  <div key={review.id} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-neutral-200" />
                      <div>
                        <p className="text-sm font-medium">{review.name}</p>
                        <p className="text-xs text-neutral-500">{review.dateRange}</p>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600">{review.text}</p>
                    <button className="text-sm font-medium underline self-start cursor-pointer">
                      Show more
                    </button>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8">
                <button
                  onClick={() => setShowAllComments((v) => !v)}
                  className="px-8 py-3 border border-neutral-300 rounded-full font-medium hover:bg-neutral-100 cursor-pointer"
                >
                  {showAllComments ? 'Show less' : 'Show all comments'}
                </button>
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}