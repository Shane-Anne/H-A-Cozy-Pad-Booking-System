import React, { useState } from 'react';

export default function SearchSection({ onSearch }) {
  const [query, setQuery] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numOfGuests, setNumOfGuests] = useState(1);

  const handleSearch = (e) => {
    if (e) e.preventDefault();

    const today = new Date().toISOString().split('T')[0];

    if (checkInDate && checkInDate < today) {
      alert('Check-in date cannot be in the past.');
      return;
    }

    if (checkInDate && checkOutDate && checkOutDate <= checkInDate) {
      alert('Check-out date must be after the check-in date.');
      return;
    }

    const searchParams = {
      query: query.trim(),
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      num_of_guests: numOfGuests,
    };

    if (onSearch) {
      onSearch(searchParams);
    } else {
      console.log('Database Query Parameters:', searchParams);
    }
  };

  return (
    <section className="flex justify-center px-5 md:px-10 lg:px-[52px] pt-6 pb-10 bg-white">
      <form
        onSubmit={handleSearch}
        className="w-full max-w-[980px] flex flex-col items-center gap-5 bg-[#efefef] rounded-[25px] px-5 md:px-10 lg:px-[60px] py-10"
      >
        <div className="flex items-center gap-4 w-full bg-white border border-neutral-300 rounded-[10px] px-6 py-[18px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-[26px] h-[26px] shrink-0 text-neutral-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            type="text"
            placeholder="Search destination, building, or unit..."
            value={query}
            onChange={(e) => {
              const value = e.target.value;
              setQuery(value);

              if (onSearch) {
                onSearch({
                  query: value.trim(),
                  check_in_date: checkInDate,
                  check_out_date: checkOutDate,
                  num_of_guests: numOfGuests,
                });
              }
            }}
            className="w-full bg-transparent border-none outline-none text-lg lg:text-xl font-light text-neutral-800 placeholder-neutral-400"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">
              Check-in
            </label>

            <div className="flex items-center bg-white border border-neutral-300 rounded-[10px] px-5 py-3.5">
              <input
                type="date"
                value={checkInDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  const value = e.target.value;
                  setCheckInDate(value);

                  if (onSearch) {
                    onSearch({
                      query: query.trim(),
                      check_in_date: value,
                      check_out_date: checkOutDate,
                      num_of_guests: numOfGuests,
                    });
                  }
                }}
                className="w-full bg-transparent outline-none text-neutral-700"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">
              Check-out
            </label>

            <div className="flex items-center bg-white border border-neutral-300 rounded-[10px] px-5 py-3.5">
              <input
                type="date"
                value={checkOutDate}
                min={checkInDate || new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  const value = e.target.value;
                  setCheckOutDate(value);

                  if (onSearch) {
                    onSearch({
                      query: query.trim(),
                      check_in_date: checkInDate,
                      check_out_date: value,
                      num_of_guests: numOfGuests,
                    });
                  }
                }}
                className="w-full bg-transparent outline-none text-neutral-700"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">
              Guests
            </label>

            <div className="flex items-center gap-3 bg-white border border-neutral-300 rounded-[10px] px-5 py-3.5">
              <span className="text-neutral-500">👥</span>

              <select
                value={numOfGuests}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setNumOfGuests(value);

                  if (onSearch) {
                    onSearch({
                      query: query.trim(),
                      check_in_date: checkInDate,
                      check_out_date: checkOutDate,
                      num_of_guests: value,
                    });
                  }
                }}
                className="text-sm font-medium text-neutral-700 bg-transparent outline-none cursor-pointer w-full"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}