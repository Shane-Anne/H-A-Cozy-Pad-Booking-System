import React, { useState } from 'react';
import ListingHeader from '../components/ListingHeader';
import { useNavigate } from 'react-router-dom';

export default function Location() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [unit, setUnit] = useState('');
  const [zip, setZip] = useState('');

  const inputClass =
    'w-full h-[52px] border border-black rounded-full px-5 text-[15px] placeholder:text-neutral-500 focus:outline-none focus:bg-neutral-50';

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">

      {/* Header */}
      <ListingHeader
        onOpenQuestions={() => console.log('Questions')}
        onSaveAndExit={() => console.log('Save & Exit')}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col">

        <div className="w-full max-w-[560px] mx-auto pt-10 md:pt-11 px-6">

          {/* Heading */}
          <h1 className="text-center text-[23px] md:text-[24px] font-semibold leading-tight mb-6">
            Where is your place located?
          </h1>

          {/* Search bar */}
          <div className="relative mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for property or location"
              className="w-full h-[52px] border border-black rounded-full pl-11 pr-5 text-[15px] placeholder:text-neutral-500 focus:outline-none focus:bg-neutral-50"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </div>

          {/* Property location fields */}
          <h2 className="text-[16px] font-semibold mb-3">Property Location</h2>

          <div className="space-y-4">
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country or Region"
              className={inputClass}
            />

            <div className="flex gap-4">
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State/Province"
                className={inputClass}
              />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className={inputClass}
              />
            </div>

            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Street Address"
              className={inputClass}
            />

            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="Building, Floor or Unit Number (Optional)"
              className={inputClass}
            />

            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="ZIP/Postal Code (Optional)"
              className={inputClass}
            />
          </div>

          {/* Map preview */}
          <div className="relative mt-6 mb-6 h-[220px] rounded-[19px] border border-black overflow-hidden bg-gradient-to-br from-emerald-100 via-lime-100 to-sky-100">
            <button
              type="button"
              aria-label="Zoom map"
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white border border-black flex items-center justify-center"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
            <p className="absolute inset-0 flex items-center justify-center text-[13px] text-neutral-600">
              Map preview
            </p>
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="mt-auto flex items-center justify-between px-10 pb-6 pt-8">

          {/* Back */}
          <button
            type="button"
            onClick={() => window.history.back()}
            className="
              w-[142px] h-[50px]
              rounded-full
              border border-black
              bg-white
              text-[20px]
              hover:bg-neutral-100
              transition
            "
          >
            Back
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={() => navigate('/host/listing/PlaceRate')}
            className="
              w-[142px] h-[50px]
              rounded-full
              border border-black
              bg-black text-white
              text-[20px]
              hover:bg-neutral-800
              transition
            "
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}