import { useEffect, useState } from 'react';
import HostHeader from '../../components/HostHeader';
import { API_BASE_URL } from '../../lib/api';
import noReservationsImage from '../../images/no-reservations.svg';

export default function DashboardReservations() {
  const [activeTab, setActiveTab] = useState('soon');
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingBookingId, setUpdatingBookingId] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/reservations.php`, { credentials: 'include' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to load reservations');
        return data;
      })
      .then((data) => setReservations(data.reservations || []))
      .catch((loadError) => setError(loadError.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleStatusUpdate = async (bookingId, status) => {
    setError('');
    setUpdatingBookingId(bookingId);

    try {
      const response = await fetch(`${API_BASE_URL}/update_booking_status.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to update booking status');
      }

      setReservations((currentReservations) =>
        currentReservations.map((reservation) =>
          reservation.booking_id === bookingId
            ? { ...reservation, status: data.status }
            : reservation
        )
      );
    } catch (statusError) {
      setError(statusError.message);
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const activeReservations = reservations.filter(
    (reservation) => !['cancelled', 'rejected'].includes(reservation.status)
  );

  const visibleReservations = reservations.filter((reservation) => {
    const start = new Date(`${reservation.check_in_date}T00:00:00`);
    const end = new Date(`${reservation.check_out_date}T00:00:00`);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (['cancelled', 'rejected'].includes(reservation.status)) return false;
    if (activeTab === 'today') return start <= now && end > now;
    if (activeTab === 'soon') return start > now;
    return true;
  });

  const formatDate = (date) => new Date(`${date}T00:00:00`).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const statusClasses = {
    awaiting_payment: 'bg-amber-100 text-amber-800',
    payment_review: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white text-black font-sans min-h-screen flex flex-col">
      <HostHeader activeNav="Today" />

      <main className="flex flex-col items-center px-5 pt-10 pb-10 grow">
        <div className="mb-10 flex flex-wrap gap-3">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-6 py-2.5 rounded-full text-base cursor-pointer border-0 ${
              activeTab === 'today'
                ? 'font-semibold bg-neutral-800 text-white'
                : 'font-medium bg-neutral-100 text-neutral-400'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveTab('soon')}
            className={`px-6 py-2.5 rounded-full text-base cursor-pointer border-0 ${
              activeTab === 'soon'
                ? 'font-semibold bg-neutral-800 text-white'
                : 'font-medium bg-neutral-100 text-neutral-400'
            }`}
          >
            Soon
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2.5 rounded-full text-base cursor-pointer border-0 ${
              activeTab === 'all'
                ? 'font-semibold bg-neutral-800 text-white'
                : 'font-medium bg-neutral-100 text-neutral-400'
            }`}
          >
            All
          </button>
        </div>

        <div className="mb-8 text-center">
          <p className="m-0 text-sm text-neutral-500">
            {activeReservations.length} active booking{activeReservations.length === 1 ? '' : 's'}
          </p>
        </div>

        {error && <p className="mb-5 text-sm text-red-600">{error}</p>}

        {isLoading ? (
          <p className="text-sm text-neutral-500">Loading customer bookings...</p>
        ) : visibleReservations.length > 0 ? (
          <div className="grid w-full max-w-6xl grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] justify-items-center gap-6">
            {visibleReservations.map((reservation) => {
              const canDecide = ['pending', 'awaiting_payment', 'payment_review'].includes(reservation.status);
              const isUpdating = updatingBookingId === reservation.booking_id;

              return (
                <article key={reservation.booking_id} className="w-full max-w-[390px] rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Booked property</p>
                      <h2 className="mt-1 text-lg font-semibold">{reservation.building_name}</h2>
                      <p className="text-sm text-neutral-600">{reservation.unit_name} · {reservation.location}</p>
                    </div>
                    <span className={`flex min-h-7 min-w-[118px] shrink-0 items-center justify-center rounded-full px-3 py-1 text-center text-xs font-semibold capitalize ${statusClasses[reservation.status] || 'bg-neutral-100 text-neutral-700'}`}>
                      {reservation.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid gap-3 border-t border-neutral-100 pt-4 text-sm text-neutral-600 sm:grid-cols-2">
                    <div>
                      <p className="font-semibold text-neutral-900">Stay dates</p>
                      <p>{formatDate(reservation.check_in_date)} to {formatDate(reservation.check_out_date)}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-neutral-900">Customer</p>
                      <p>{reservation.booked_guest_name || reservation.guest_name}</p>
                      <p>{reservation.booked_guest_contact_num || reservation.guest_contact_num}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-neutral-900">Guests</p>
                      <p>{reservation.num_of_guests} guest{Number(reservation.num_of_guests) === 1 ? '' : 's'}</p>
                    </div>

                    {reservation.special_requests && (
                      <div>
                        <p className="font-semibold text-neutral-900">Special request</p>
                        <p>{reservation.special_requests}</p>
                      </div>
                    )}
                  </div>

                  {canDecide && (
                    <div className="mt-5 flex justify-end gap-3 border-t border-neutral-100 pt-4">
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleStatusUpdate(reservation.booking_id, 'rejected')}
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isUpdating ? 'Updating...' : 'Reject'}
                      </button>

                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleStatusUpdate(reservation.booking_id, 'confirmed')}
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isUpdating ? 'Updating...' : 'Approve'}
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <img src={noReservationsImage} alt="No reservations" className="h-20 w-20 object-contain" />
            <p className="text-xl font-bold text-black">
              {activeTab === 'today' ? 'No reservations for today' : activeTab === 'soon' ? 'No upcoming customer reservations' : 'No customer bookings yet'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}