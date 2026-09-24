import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../lib/api";

export default function Trips() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelBox, setShowCancelBox] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadBookings() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/get_booking.php`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        console.log("Trips API response:", data);

        if (!response.ok) {
          throw new Error(data.error || "Unable to load trips");
        }

        setBookings(data.bookings || []);
      } catch (err) {
        console.error("Trips error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadBookings();
  }, []);

  async function handleCancelBooking() {
    if (!selectedBooking || !cancelReason.trim()) {
      return;
    }

    try {
      setIsCancelling(true);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `${API_BASE_URL}/cancel_booking.php`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: selectedBooking,
            cancelReason: cancelReason.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to cancel booking");
      }

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.bookingId === selectedBooking
            ? {
                ...booking,
                status: "cancelled",
              }
            : booking
        )
      );

      setShowCancelBox(false);
      setCancelReason("");
      setSuccessMessage(
        `Booking #${selectedBooking} has been cancelled successfully.`
      );
    } catch (err) {
      console.error("Cancel booking error:", err);
      setError(err.message);
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <main className="min-h-screen bg-white px-5 py-12 text-black md:px-10">
      <div className="mx-auto max-w-2xl">

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-8 text-sm underline"
        >
          Back to home
        </button>

        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">
            Your trips
          </h1>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={!selectedBooking}
              className={`rounded-lg border px-4 py-2 text-sm transition ${
                selectedBooking
                  ? "border-red-600 bg-red-600 text-white hover:bg-red-700"
                  : "border-red-500 bg-white text-red-600"
              }`}
              onClick={() => {
                setError("");
                setSuccessMessage("");
                setShowCancelBox(true);
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!selectedBooking}
              className={`rounded-lg border px-4 py-2 text-sm transition ${
                selectedBooking
                  ? "border-yellow-500 bg-yellow-500 text-white hover:bg-yellow-600"
                  : "border-yellow-500 bg-white text-yellow-600"
              }`}
              onClick={() => {
                // Request change action
              }}
            >
              Request to change
            </button>
          </div>
        </div>

        {isLoading && (
          <p className="mt-6 text-sm text-gray-500">
            Loading your trips...
          </p>
        )}

        {error && (
          <p className="mt-6 text-sm text-red-600">
            {error}
          </p>
        )}

        {successMessage && (
          <p className="mt-6 text-sm text-green-600">
            {successMessage}
          </p>
        )}

        {!isLoading && !error && bookings.length === 0 && (
          <p className="mt-6 text-sm text-gray-500">
            Your saved trips will appear here.
          </p>
        )}

        {!isLoading && !error && bookings.length > 0 && (
          <div className="mt-6 space-y-4">
            {bookings.map((booking) => (
              <label
                key={booking.bookingId}
                className={`block cursor-pointer rounded-xl border p-5 transition ${
                  selectedBooking === booking.bookingId
                    ? "border-black ring-1 ring-black"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-4">

                  <input
                    type="radio"
                    name="selectedBooking"
                    value={booking.bookingId}
                    checked={selectedBooking === booking.bookingId}
                    onChange={() =>
                      setSelectedBooking(booking.bookingId)
                    }
                    className="mt-1 h-4 w-4"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">
                          Booking #{booking.bookingId}
                        </p>

                        {booking.unitName && (
                          <p className="mt-1 text-sm text-gray-700">
                            {booking.unitName}
                          </p>
                        )}
                      </div>

                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-800 capitalize">
                        {booking.status.replaceAll("_", " ")}
                      </span>
                    </div>

                    <div className="mt-4 space-y-1 text-sm text-gray-500">
                      <p>
                        Check-in: {booking.checkIn}
                      </p>

                      <p>
                        Check-out: {booking.checkOut}
                      </p>

                      <p>
                        Guests: {booking.guests}
                      </p>
                    </div>

                    {booking.guestName && (
                      <p className="mt-3 text-sm text-gray-600">
                        Guest: {booking.guestName}
                      </p>
                    )}

                    {booking.vehicleType && (
                      <p className="mt-1 text-sm text-gray-600">
                        Vehicle: {booking.vehicleType}
                      </p>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}

        {showCancelBox && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="text-xl font-semibold">
                Cancel booking?
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Are you sure you want to cancel booking #{selectedBooking}?
              </p>

              <label className="mt-5 block text-sm font-medium text-gray-700">
                Why are you cancelling?
              </label>

              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please tell us why you want to cancel..."
                rows={4}
                disabled={isCancelling}
                className="mt-2 w-full resize-none rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-red-500 disabled:bg-gray-100"
              />

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={isCancelling}
                  onClick={() => {
                    setShowCancelBox(false);
                    setCancelReason("");
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Keep booking
                </button>

                <button
                  type="button"
                  disabled={isCancelling || !cancelReason.trim()}
                  onClick={handleCancelBooking}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCancelling ? "Cancelling..." : "Confirm cancellation"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

    </main>
  );
}
