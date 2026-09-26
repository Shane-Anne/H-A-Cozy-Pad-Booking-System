import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { API_BASE_URL } from '../../lib/api';
import { useNavigate } from 'react-router-dom';

export default function YourCurrentBooks() {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/available_listings.php`, {
      cache: 'no-store',
      credentials: 'include',
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              `Unable to load listings (${response.status})`
          );
        }

        return data;
      })
      .then((data) => {
        console.log('AVAILABLE LISTINGS:', data);

        if (!Array.isArray(data)) {
          throw new Error(
            data.error || 'Unable to load listings'
          );
        }

        setListings(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching listings:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white text-black font-sans min-h-screen">

      <Header activeNav="Listing" />

      <main className="px-5 md:px-10 lg:px-[52px] py-10">

        {/* Page heading */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            Current Listings
          </h1>

        </div>

        {/* Loading */}
        {loading && (
          <p>
            Loading listings...
          </p>
        )}

        {/* Error */}
        {!loading && error && (
          <p className="text-red-600">
            {error}
          </p>
        )}

        {/* No listings */}
        {!loading && !error && listings.length === 0 && (
          <div className="py-20 text-center text-neutral-500">
            <p className="text-2xl font-medium">
              No available listings
            </p>

            <p className="mt-2">
              There are currently no properties available.
            </p>
          </div>
        )}

        {/* Listings */}
        {!loading && !error && listings.length > 0 && (
          <div className="w-full overflow-x-auto">

            <table className="w-full border-collapse">

              <thead>
                <tr className="text-left border-b border-neutral-200">

                  <th className="pb-4 font-semibold">
                    Property
                  </th>

                  <th className="pb-4 font-semibold">
                    Location
                  </th>

                  <th className="pb-4 font-semibold">
                    Guests
                  </th>

                  <th className="pb-4 font-semibold">
                    Price
                  </th>

                  <th className="pb-4 font-semibold">
                    Status
                  </th>

                  <th className="pb-4 font-semibold text-right">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {listings.map((listing) => (

                  <tr
                    key={listing.unit_id}
                    className="border-b border-neutral-100"
                  >

                    {/* Property */}
                    <td className="py-5">
                      <div>
                        <p className="font-medium">
                          {listing.building_name}
                        </p>

                        <p className="text-sm text-neutral-500">
                          {listing.unit_name}
                        </p>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-5">
                      {listing.location}
                    </td>

                    {/* Guests */}
                    <td className="py-5">
                      {listing.max_guests}
                    </td>

                    {/* Price */}
                    <td className="py-5">
                      ₱
                      {Number(
                        listing.rate_per_night
                      ).toLocaleString()}
                      <span className="text-sm text-neutral-500">
                        {' '}
                        / night
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-5">

                      <span className="inline-flex items-center gap-2">

                        <span
                          className={`w-2 h-2 rounded-full ${
                            listing.status === 'available'
                              ? 'bg-green-500'
                              : 'bg-neutral-400'
                          }`}
                        />

                        {listing.status
                          ? listing.status
                              .charAt(0)
                              .toUpperCase() +
                            listing.status.slice(1)
                          : 'Unknown'}

                      </span>

                    </td>

                    {/* Action */}
                    <td className="py-5 text-right">

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/listing/${listing.building_id}`
                          )
                        }
                        className="
                          px-6
                          py-2.5
                          border
                          border-black
                          rounded-md
                          hover:bg-neutral-100
                          cursor-pointer
                        "
                      >
                        View
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </main>
    </div>
  );
}