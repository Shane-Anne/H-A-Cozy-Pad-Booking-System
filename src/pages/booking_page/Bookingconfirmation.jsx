import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer_Lite";

function ImagePlaceholderIcon() {
  return (
    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ChevronDownIcon({ className = "w-4 h-4 text-gray-400" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}

export default function BookingConfirmation({
  isMenuOpen,
  setIsMenuOpen,
  onOpenSignIn,
  onOpenRegister,
}) {
  const location = useLocation();
  const booking = location.state || {};
  const property = booking.property || {};
  const checkIn = booking.checkIn || "";
  const checkOut = booking.checkOut || "";
  const guestCount = Number(booking.guests || 1);

  const [guests, setGuests] = useState(guestCount);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const nightRate = Number(property.rate_per_night || 0);
  const nights = checkIn && checkOut ? Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000)) : 1;
  const total = nightRate * nights;

  return (
    <div className="bg-white text-black font-sans min-h-screen flex flex-col">
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onOpenSignIn={onOpenSignIn}
        onOpenRegister={onOpenRegister}
      />

      <main className="grow px-5 md:px-10 lg:px-[52px] py-10">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Booking Confirmation
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Property + price card */}
            <section className="border border-gray-200 rounded-xl p-5 md:p-6 space-y-4 h-fit">
              <div className="flex gap-3 items-center">
                <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <ImagePlaceholderIcon />
                </div>
                <div>
                  <p className="text-base font-medium text-gray-900">{property.building_name || property.building_name || "Property Name"}</p>
                  <p className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                    <MapPinIcon />
                    {property.location || property.building_name || "Property Place"}
                  </p>
                </div>
              </div>

              {/* Dates + guests */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] text-gray-500 mb-1">Date</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <DatePill label={checkIn ? new Date(checkIn).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Select date"} sub={checkIn ? new Date(checkIn).toLocaleDateString("en-US", { weekday: "long" }) : "Check-in"} />
                    <span className="text-gray-300">–</span>
                    <DatePill label={checkOut ? new Date(checkOut).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Select date"} sub={checkOut ? new Date(checkOut).toLocaleDateString("en-US", { weekday: "long" }) : "Check-out"} />
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[11px] text-gray-500 mb-1">Number of Guest</p>
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="p-2 text-gray-500 hover:text-gray-900"
                      aria-label="Decrease guests"
                    >
                      <MinusIcon />
                    </button>
                    <span className="w-5 text-center text-sm text-gray-900">{guests}</span>
                    <button
                      onClick={() => setGuests((g) => g + 1)}
                      className="p-2 text-gray-500 hover:text-gray-900"
                      aria-label="Increase guests"
                    >
                      <PlusIcon />
                    </button>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Price detail */}
              <div>
                <p className="text-sm font-medium text-gray-700 text-center mb-2">
                  Price Detail
                </p>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{nights} night{nights > 1 ? "s" : ""} x PHP {nightRate.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
                  <span>PHP {nightRate.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="flex justify-between items-baseline">
                <span className="text-base font-semibold text-gray-900">
                  Total PHP
                </span>
                <span className="text-base font-semibold text-gray-900">PHP {total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
              </div>
            </section>

            {/* Payment section */}
            <section className="border border-gray-200 rounded-xl p-5 md:p-6 space-y-4 h-fit">
              <p className="text-base font-semibold text-gray-900">1. Add a payment method</p>

              {/* Card option */}
              <div>
                <PaymentRow
                  icon={<CardIcon />}
                  label="Credit or debit card"
                  selected={paymentMethod === "card"}
                  onSelect={() => setPaymentMethod("card")}
                />

                {paymentMethod === "card" && (
                  <div className="mt-3 space-y-3">
                    <input
                      type="text"
                      placeholder="Card number"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Expiration"
                        className="w-1/2 border border-gray-200 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="w-1/2 border border-gray-200 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                      />
                    </div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden sm:grid sm:grid-cols-2">
                      <input
                        type="text"
                        placeholder="First Name"
                        className="w-full px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none border-b sm:border-b-0 sm:border-r border-gray-200"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        className="w-full px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="ZIP code"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                    <button className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-left">
                      <span>
                        <span className="block text-[11px] text-gray-400">Country/Region</span>
                        <span className="text-gray-900 font-medium">Philippines</span>
                      </span>
                      <ChevronDownIcon />
                    </button>
                  </div>
                )}
              </div>

              <hr className="border-gray-100" />

              {/* Gcash option */}
              <PaymentRow
                icon={<WalletIcon />}
                label="Gcash"
                selected={paymentMethod === "gcash"}
                onSelect={() => setPaymentMethod("gcash")}
              />

              <hr className="border-gray-100" />

              <PaymentRow
                icon={<WalletIcon />}
                label="Proof of Payment Method"
                selected={paymentMethod === "proof"}
                onSelect={() => setPaymentMethod("proof")}
              />

              <hr className="border-gray-100" />
              
              <p className="text-[11px] text-center text-gray-500">
                By selecting the button, I agree to the booking terms.
              </p>
              <Link to="/booking-confirmation-2" className="block w-full bg-gray-900 text-white text-sm font-medium text-center rounded-full py-3 hover:bg-gray-800 transition-colors cursor-pointer">
                Confirm & Pay
              </Link>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function DatePill({ label, sub }) {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-2 py-1.5 hover:border-gray-300"
    >
      <CalendarIcon />
      <div className="leading-tight text-left">
        <p className="text-[11px] text-gray-800">{label}</p>
        <p className="text-[10px] text-gray-400">{sub}</p>
      </div>
      <ChevronDownIcon className="w-3.5 h-3.5 text-gray-300 ml-0.5" />
    </button>
  );
}

function PaymentRow({ icon, label, selected, onSelect }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
          {icon}
        </span>
        <span className="text-sm text-gray-800">{label}</span>
      </span>
      <input
        type="radio"
        name="payment"
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
      <RadioDot selected={selected} />
    </label>
  );
}

function RadioDot({ selected }) {
  return (
    <span
      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
        selected ? "border-gray-900" : "border-gray-300"
      }`}
    >
      {selected && <span className="w-2 h-2 rounded-full bg-gray-900" />}
    </span>
  );
}