import { Link } from 'react-router-dom';

export default function PropertySection({ title, properties = [] }) {
  return (
    <section className="px-4 md:px-8 lg:px-10 py-6">
      {title && (
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg lg:text-xl font-medium">{title}</h2>
          <span className="text-lg text-neutral-400 cursor-pointer">›</span>
        </div>
      )}

      {properties.length === 0 ? (
        <div className="min-h-[240px] flex flex-col items-center justify-center text-center text-neutral-500">
          <svg
            aria-hidden="true"
            className="w-12 h-12 mb-4 text-neutral-400"
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
          <p className="text-xl lg:text-2xl font-medium">No available housing</p>
          <p className="text-sm text-neutral-400 mt-2">Try adjusting your search criteria or dates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {properties.map((property) => (
            <Link
              key={property.unit_id}
              to={`/property/${property.unit_id}`}
              className="block no-underline text-black hover:text-black group"
            >
              <div>
                {/* Property Image Placeholder */}
                <div className="w-full aspect-square bg-neutral-300 rounded-xl overflow-hidden group-hover:opacity-95 transition-opacity">
                  {property.image_url ? (
                    <img 
                      src={property.image_url} 
                      alt={property.unit_name} 
                      className="w-full h-full object-cover"
                     />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-500 font-light text-sm">
                      No Image Available
                    </div>
                  )}
                </div>

                {/* Property Details */}
                <div className="mt-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-base lg:text-lg font-normal leading-tight">
                      {property.building_name}
                    </h3>
                    {property.max_guests && (
                      <span className="text-[11px] bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                        Up to {property.max_guests} guests
                      </span>
                    )}
                  </div>

                  <p className="text-xs lg:text-sm text-neutral-500 mt-0.5">
                    {property.unit_name} • {property.location}
                  </p>

                  <p className="text-sm lg:text-base font-light mt-1">
                    ₱ {Number(property.rate_per_night).toLocaleString('en-PH', {
                      minimumFractionDigits: 2,
                    })} <span className="text-xs text-neutral-500 font-normal">/ night</span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}