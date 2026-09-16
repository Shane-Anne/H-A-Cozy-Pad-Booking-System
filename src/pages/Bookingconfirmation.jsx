import React, { useState } from "react";

function MenuIcon() {
  return (
    <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

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

function ChevronDownIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function BookingConfirmation() {
  const [guests, setGuests] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-sm bg-white relative">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <h1 className="text-base font-semibold text-gray-900">H&A Cozy Pad</h1>
          <MenuIcon />
        </header>

        <main className="px-4 py-5 space-y-6 pb-10">
          <h2 className="text-lg font-semibold text-center text-gray-900">
            Booking Confirmation
          </h2>

          {/* Property card */}
          <section className="border border-gray-200 rounded-xl p-4 space-y-4">
            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <ImagePlaceholderIcon />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Property Name</p>
                <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                  <MapPinIcon />
                  Property Place
                </p>
              </div>
            </div>

            {/* Dates + guests */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] text-gray-500 mb-1">Date</p>
                <div className="flex items-center gap-2">
                  <DatePill label="July 28, 2026" sub="Tuesday" />
                  <span className="text-gray-300">–</span>
                  <DatePill label="July 29, 2026" sub="Tuesday" />
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
              <p className="text-xs font-medium text-gray-700 text-center mb-2">
                Price Detail
              </p>
              <div className="flex justify-between text-sm text-gray-600">
                <span>1 night x PHP 1000</span>
                <span>PHP 1000</span>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="flex justify-between items-baseline">
              <span className="text-sm font-semibold text-gray-900 underline underline-offset-2">
                Total PHP
              </span>
              <span className="text-sm font-semibold text-gray-900">PHP 1000</span>
            </div>
          </section>

          {/* Payment section */}
          <section className="border border-gray-200 rounded-xl p-4 space-y-4">
            <p className="text-sm font-semibold text-gray-900">1. Add a payment method</p>

            {/* Card option */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <RadioDot selected={paymentMethod === "card"} />
                <span className="text-sm text-gray-800">Credit or debit card</span>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="sr-only"
                />
              </label>

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
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="w-full px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none border-b border-gray-200"
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
            <label className="flex items-center gap-2 cursor-pointer">
              <RadioDot selected={paymentMethod === "gcash"} />
              <span className="text-sm text-gray-800">Gcash</span>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "gcash"}
                onChange={() => setPaymentMethod("gcash")}
                className="sr-only"
              />
            </label>

            <hr className="border-gray-100" />

            <p className="text-[11px] text-center text-gray-500">
              By selecting the button, I agree to the booking terms.
            </p>

            <button className="w-full bg-gray-900 text-white text-sm font-medium rounded-full py-2.5 hover:bg-gray-800 transition-colors">
              Confirm & Pay
            </button>
          </section>
        </main>

        <footer className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
          <span>@website · Privacy · Terms</span>
          <span>English · PHP</span>
        </footer>
      </div>
    </div>
  );
}

function DatePill({ label, sub }) {
  return (
    <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-2 py-1.5">
      <CalendarIcon />
      <div className="leading-tight">
        <p className="text-[11px] text-gray-800">{label}</p>
        <p className="text-[10px] text-gray-400">{sub}</p>
      </div>
    </div>
  );
}

function RadioDot({ selected }) {
  return (
    <span
      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
        selected ? "border-gray-900" : "border-gray-300"
      }`}
    >
      {selected && <span className="w-2 h-2 rounded-full bg-gray-900" />}
    </span>
  );
}