import { useLocation, useNavigate } from "react-router-dom";

export default function Trips() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state;

  return (
    <main className="min-h-screen bg-white px-5 py-12 text-black md:px-10">
      <div className="mx-auto max-w-2xl">
        <button type="button" onClick={() => navigate("/")} className="mb-8 text-sm underline">
          Back to home
        </button>
        <h1 className="text-3xl font-bold">Your trips</h1>
        {booking?.bookingId ? (
          <section className="mt-6 rounded-xl border border-gray-200 p-5">
            <p className="font-semibold">Booking #{booking.bookingId}</p>
            <p className="mt-2 text-sm text-gray-500">
              {booking.checkIn || "Check-in"} to {booking.checkOut || "Check-out"}
            </p>
            <p className="mt-1 text-sm text-gray-500">Your booking is awaiting payment review.</p>
          </section>
        ) : (
          <p className="mt-6 text-sm text-gray-500">Your saved trips will appear here.</p>
        )}
      </div>
    </main>
  );
}