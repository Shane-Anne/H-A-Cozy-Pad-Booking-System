import React, { useState } from 'react';
import ListingHeader from '../components/ListingHeader';
import { useNavigate } from 'react-router-dom';

function CheckSquare({ checked }) {
  return (
    <span
      className={`
        w-7 h-7 rounded-md border border-black flex items-center justify-center shrink-0
        ${checked ? 'bg-white' : 'bg-white'}
      `}
    >
      {checked && (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      )}
    </span>
  );
}

export default function PricesDiscounts() {
  const navigate = useNavigate();

  const [basePrice, setBasePrice] = useState('');

  const [discounts, setDiscounts] = useState([
    {
      id: 'newListing1',
      percent: '20%',
      title: 'New Listing Promotion',
      description: 'Offer 20% off your first 3 books',
      checked: false,
    },
    {
      id: 'newListing2',
      percent: '20%',
      title: 'New Listing Promotion',
      description: 'Offer 20% off your first 3 books',
      checked: false,
    },
  ]);

  const toggleDiscount = (id) => {
    setDiscounts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, checked: !d.checked } : d))
    );
  };

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
          <h1 className="text-center text-[23px] md:text-[24px] font-semibold leading-tight mb-8">
            Prices &amp; Discounts
          </h1>

          {/* Base Price */}
          <p className="text-[15px] font-medium mb-2">Base Price</p>
          <div className="relative mb-6">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[15px] text-neutral-500 pointer-events-none">
              PHP
            </span>
            <input
              type="number"
              min="0"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              placeholder="0"
              className="w-full h-[50px] border border-black rounded-[19px] pl-16 pr-5 text-[15px] placeholder:text-neutral-400 focus:outline-none focus:bg-neutral-50"
            />
          </div>

          {/* View similar listing */}
          <div className="flex justify-center mb-8">
            <button
              type="button"
              onClick={() => console.log('View Similar Listing')}
              className="h-[42px] px-6 rounded-full border border-black bg-white text-[14px] font-medium hover:bg-neutral-100 transition"
            >
              View Similar Listing
            </button>
          </div>

          {/* Add Discounts */}
          <h2 className="text-[16px] font-semibold mb-3">Add Discounts</h2>

          <div className="space-y-4 mb-8">
            {discounts.map((discount) => (
              <button
                key={discount.id}
                type="button"
                onClick={() => toggleDiscount(discount.id)}
                className="w-full flex items-center gap-4 border border-black rounded-[19px] px-5 py-4 text-left hover:bg-neutral-50 transition"
              >
                <span className="text-[17px] font-semibold w-12 shrink-0">
                  {discount.percent}
                </span>

                <span className="flex-1">
                  <span className="block text-[15px] font-semibold leading-tight">
                    {discount.title}
                  </span>
                  <span className="block text-[14px] text-neutral-600 leading-tight mt-0.5">
                    {discount.description}
                  </span>
                </span>

                <CheckSquare checked={discount.checked} />
              </button>
            ))}
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

          {/* Continue */}
          <button
            type="button"
            onClick={() => navigate('/host/listing/PlaceDetail')}
            className="
              w-[142px] h-[50px]
              rounded-full
              border border-neutral-400
              bg-neutral-300 text-black
              text-[20px]
              hover:bg-neutral-400
              transition
            "
          >
            Continue
          </button>
        </div>
      </main>
    </div>
  );
}