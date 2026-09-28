import { useEffect, useState } from 'react';
import HostHeader from '../../components/HostHeader';
import { API_BASE_URL } from '../../lib/api';

function StatIcon({ type }) {
  const icons = {
    bookings: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </svg>
    ),
    active: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
    pending: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
    payment: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18M7 15h3" />
      </svg>
    ),
    available: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 21V9l9-6 9 6v12" />
        <path d="M8 21v-6h8v6M3 10h18" />
      </svg>
    ),
    occupied: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 18v-7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7" />
        <path d="M4 18h16v3M4 18v3M7 9V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
      </svg>
    ),
    properties: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 21V4l8-2 8 2v17" />
        <path d="M8 8h2M14 8h2M8 12h2M14 12h2M8 16h2M14 16h2" />
      </svg>
    ),
    customers: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <path d="M16 5.5a3 3 0 0 1 0 5.8M17 14c2.2.7 4 2.8 4 6" />
      </svg>
    ),
    revenue: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M15 8.5c-.7-.7-1.7-1-3-1-1.7 0-3 .8-3 2s1.3 2 3 2 3 .8 3 2-1.3 2-3 2c-1.3 0-2.3-.3-3-1M12 6v12" />
      </svg>
    ),
  };

  return icons[type];
}

export default function DashboardOverview() {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch(
        `${API_BASE_URL}/dashboard_overview.php`,
        {
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Unable to load dashboard overview'
        );
      }

      setDashboard(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const formatDate = (date) =>
    new Date(`${date}T00:00:00`).toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const statusClasses = {
    pending: 'bg-amber-100 text-amber-800',
    awaiting_payment: 'bg-orange-100 text-orange-800',
    payment_review: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-green-100 text-green-800',
    checked_in: 'bg-green-100 text-green-800',
    checked_out: 'bg-neutral-200 text-neutral-700',
    cancelled: 'bg-neutral-200 text-neutral-700',
    rejected: 'bg-red-100 text-red-800',
  };

  const paymentStatusClasses = {
    pending: 'bg-amber-100 text-amber-800',
    verified: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    refunded: 'bg-purple-100 text-purple-800',
  };

  const cards = dashboard
    ? [
        {
          label: 'Total Bookings',
          value: dashboard.stats.totalBookings,
          description: 'All booking records',
          icon: 'bookings',
        },
        {
          label: 'Active Stays',
          value: dashboard.stats.activeStays,
          description: 'Currently staying',
          icon: 'active',
        },
        {
          label: 'Pending Bookings',
          value: dashboard.stats.pendingBookings,
          description: 'Waiting for action',
          icon: 'pending',
        },
        {
          label: 'Payment Reviews',
          value: dashboard.stats.paymentReviews,
          description: 'Need payment review',
          icon: 'payment',
        },
        {
          label: 'Available Units',
          value: dashboard.stats.availableUnits,
          description: 'Ready to be booked',
          icon: 'available',
        },
        {
          label: 'Occupied Units',
          value: dashboard.stats.occupiedUnits,
          description: 'Currently occupied',
          icon: 'occupied',
        },
      ]
    : [];

  const additionalCards = dashboard
    ? [
        {
          label: 'Total Properties',
          value: dashboard.stats.totalProperties,
          description: 'Registered properties',
          icon: 'properties',
        },
        {
          label: 'Total Customers',
          value: dashboard.stats.totalCustomers,
          description: 'Registered customers',
          icon: 'customers',
        },
        {
          label: 'Verified Revenue',
          value: `₱${formatAmount(dashboard.stats.verifiedRevenue)}`,
          description: 'From verified payments',
          icon: 'revenue',
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <HostHeader activeNav="Overview" />

      <main className="w-full px-6 pb-12 pt-8 md:px-8 lg:px-10 xl:px-12">
        <div className="mb-7">
          <h1 className="text-3xl font-semibold text-neutral-900">
            Overview
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Here's what's happening with your property today.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <p className="text-sm text-neutral-500">
              Loading dashboard overview...
            </p>
          </div>
        ) : dashboard ? (
          <>
            <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {cards.map((card) => (
                <article
                  key={card.label}
                  className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-neutral-500">
                      {card.label}
                    </p>

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                      <StatIcon type={card.icon} />
                    </div>
                  </div>

                  <p className="mt-4 text-4xl font-bold tracking-tight text-neutral-900">
                    {card.value}
                  </p>

                  <p className="mt-1 text-sm text-neutral-500">
                    {card.description}
                  </p>
                </article>
              ))}
            </section>

            <section className="mt-5 grid gap-5 lg:grid-cols-[1.7fr_1fr]">
              <article className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Upcoming Reservations
                  </h2>

                  <p className="mt-1 text-sm text-neutral-500">
                    The next customer stays on your schedule.
                  </p>
                </div>

                {dashboard.upcomingReservations.length > 0 ? (
                  <div className="space-y-3">
                    {dashboard.upcomingReservations.map(
                      (reservation) => (
                        <div
                          key={reservation.booking_id}
                          className="rounded-xl border border-neutral-100 bg-neutral-50 p-3"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-neutral-900">
                                {reservation.guest_name}
                              </p>

                              <p className="mt-1 text-sm text-neutral-600">
                                {reservation.building_name}
                                {' · '}
                                {reservation.unit_name}
                              </p>
                            </div>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                statusClasses[
                                  reservation.status
                                ] ||
                                'bg-neutral-100 text-neutral-700'
                              }`}
                            >
                              {reservation.status.replace(
                                '_',
                                ' '
                              )}
                            </span>
                          </div>

                          <div className="mt-3 grid gap-3 border-t border-neutral-200 pt-3 text-sm sm:grid-cols-3">
                            <div>
                              <p className="font-semibold text-neutral-900">
                                Check-in
                              </p>

                              <p className="mt-1 text-neutral-600">
                                {formatDate(
                                  reservation.check_in_date
                                )}
                              </p>
                            </div>

                            <div>
                              <p className="font-semibold text-neutral-900">
                                Check-out
                              </p>

                              <p className="mt-1 text-neutral-600">
                                {formatDate(
                                  reservation.check_out_date
                                )}
                              </p>
                            </div>

                            <div>
                              <p className="font-semibold text-neutral-900">
                                Guests
                              </p>

                              <p className="mt-1 text-neutral-600">
                                {reservation.num_of_guests}{' '}
                                guest
                                {reservation.num_of_guests === 1
                                  ? ''
                                  : 's'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-neutral-200 py-8 text-center">
                    <p className="text-sm text-neutral-500">
                      No upcoming reservations.
                    </p>
                  </div>
                )}
              </article>

              <article className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Booking Summary
                  </h2>

                  <p className="mt-1 text-sm text-neutral-500">
                    Current booking status breakdown.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {Object.entries(
                    dashboard.bookingSummary
                  ).map(([status, count]) => (
                    <div
                      key={status}
                      className="flex min-w-0 items-center justify-between gap-2"
                    >
                      <span
                        className={`truncate rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          statusClasses[status] ||
                          'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {status.replace('_', ' ')}
                      </span>

                      <span className="shrink-0 text-sm font-semibold text-neutral-900">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="mt-5 grid gap-5 md:grid-cols-3">
              {additionalCards.map((card) => (
                <article
                  key={card.label}
                  className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-neutral-500">
                      {card.label}
                    </p>

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                      <StatIcon type={card.icon} />
                    </div>
                  </div>

                  <p
                    className={`mt-4 font-bold tracking-tight text-neutral-900 ${
                      card.label === 'Verified Revenue'
                        ? 'text-3xl'
                        : 'text-4xl'
                    }`}
                  >
                    {card.value}
                  </p>

                  <p className="mt-1 text-sm text-neutral-500">
                    {card.description}
                  </p>
                </article>
              ))}
            </section>

            <section className="mt-5 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-neutral-900">
                  Recent Payments
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Latest payment activity.
                </p>
              </div>

              {dashboard.recentPayments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left">
                    <thead>
                      <tr className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
                        <th className="px-3 py-3 font-medium">
                          Customer
                        </th>

                        <th className="px-3 py-3 font-medium">
                          Property
                        </th>

                        <th className="px-3 py-3 font-medium">
                          Amount
                        </th>

                        <th className="px-3 py-3 font-medium">
                          Method
                        </th>

                        <th className="px-3 py-3 font-medium">
                          Status
                        </th>

                        <th className="px-3 py-3 font-medium">
                          Date
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {dashboard.recentPayments.map(
                        (payment) => (
                          <tr
                            key={payment.payment_id}
                            className="border-b border-neutral-100 last:border-0"
                          >
                            <td className="px-3 py-4">
                              <p className="font-medium text-neutral-900">
                                {payment.guest_name}
                              </p>
                            </td>

                            <td className="px-3 py-4">
                              <p className="text-sm text-neutral-700">
                                {payment.building_name}
                              </p>

                              <p className="text-xs text-neutral-500">
                                {payment.unit_name}
                              </p>
                            </td>

                            <td className="px-3 py-4 text-sm font-semibold text-neutral-900">
                              ₱{formatAmount(payment.amount)}
                            </td>

                            <td className="px-3 py-4 text-sm capitalize text-neutral-600">
                              {payment.payment_method.replace(
                                '_',
                                ' '
                              )}
                            </td>

                            <td className="px-3 py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                  paymentStatusClasses[
                                    payment.payment_status
                                  ] ||
                                  'bg-neutral-100 text-neutral-700'
                                }`}
                              >
                                {payment.payment_status}
                              </span>
                            </td>

                            <td className="px-3 py-4 text-sm text-neutral-600">
                              {new Date(
                                payment.created_at
                              ).toLocaleDateString('en-PH', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-neutral-200 py-8 text-center">
                  <p className="text-sm text-neutral-500">
                    No payment records yet.
                  </p>
                </div>
              )}
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}