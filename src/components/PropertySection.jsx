import React from 'react';

export default function PropertySection({ title, properties = [] }) {
  return (
    <section className="px-5 md:px-10 lg:px-[52px] py-10">
      {title && (
        <div className="flex items-center gap-3 mb-7">
          <h2 className="text-2xl lg:text-[27px] font-medium">{title}</h2>
          <span className="text-xl text-neutral-400 cursor-pointer">›</span>
        </div>
      )}
      {properties.length === 0 ? (
        <div className="min-h-[280px] flex flex-col items-center justify-center text-center text-neutral-500">
          <svg
            aria-hidden="true"
            className="w-16 h-16 mb-5 text-neutral-400"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path d="m3 10 9-7 9 7" />
            <path d="M5 9v11h14V9" />
            <path d="M9 20v-6h6v6" />
          </svg>
          <p className="text-3xl lg:text-4xl font-medium">No available housing</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {properties.map((property) => (
            <div key={property.unit_id}>
              <div className="w-full aspect-square bg-neutral-300 rounded-[20px]"></div>
              <div className="mt-3">
                <h3 className="text-xl lg:text-2xl font-normal">
                  {property.building_name}
                </h3>
                <p className="text-base text-neutral-500">
                  {property.location}
                </p>
                <p className="text-lg lg:text-xl font-light">
                  ₱ {Number(property.rate_per_night).toLocaleString('en-PH', {
                    minimumFractionDigits: 2,
                  })} / night
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}