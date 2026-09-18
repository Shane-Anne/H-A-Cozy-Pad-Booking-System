import { useEffect, useState } from 'react';
import HostHeader from '../components/HostHeader';
import { API_BASE_URL } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function DashboardListings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteListing = async () => {
    if (!selectedBuildingId || !window.confirm('Delete this listing?')) {
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/delete_listing.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buildingId: selectedBuildingId }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to delete listing');
      }

      setListings((currentListings) =>
        currentListings.filter((listing) => listing.building_id !== selectedBuildingId)
      );
      setSelectedBuildingId(null);
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/available_listings.php`, { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || `Unable to load listings (${response.status})`);
        }
        return data;
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error(data.error || 'Unable to load listings');
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
      <HostHeader activeNav="Listing" />

      <main className="px-5 md:px-10 lg:px-[52px] py-10">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-bold">Your Listing</h1>
          <div className="flex gap-3">
            <button
              type="button"
              disabled={!selectedBuildingId || isDeleting}
              onClick={deleteListing}
              className="px-6 py-2.5 text-base font-medium border border-neutral-300 rounded-md hover:bg-neutral-100 bg-transparent cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>

            <button
              type="button"
              disabled={!selectedBuildingId}
              onClick={() => {
                if (window.confirm('Edit this listing?')) {
                  navigate(`/host/listing?edit=${selectedBuildingId}`);
                }
              }}
              className="px-6 py-2.5 text-base font-medium border border-neutral-300 rounded-md hover:bg-neutral-100 bg-transparent cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Edit
            </button>

            <button 
              onClick={() => navigate('/host/listing')}
              className="px-6 py-2.5 text-base font-medium border border-neutral-300 rounded-md hover:bg-neutral-100 bg-transparent cursor-pointer">
                Add
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading listings...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : listings.length === 0 ? (
          <div className="py-20 text-center text-neutral-500">
            <p className="text-2xl font-medium">No listings yet</p>
            <p className="mt-2">Add your first housing listing to see it here.</p>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b border-neutral-200">
                <th className="pb-3 font-semibold text-base w-2/5">Listing</th>
                <th className="pb-3 font-semibold text-base">Type</th>
                <th className="pb-3 font-semibold text-base">Location</th>
                <th className="pb-3 font-semibold text-base">Status</th>
              </tr>
            </thead>

            <tbody>
              {listings.map((listing) => (
                <tr
                  key={listing.unit_id}
                  onClick={() => setSelectedBuildingId(listing.building_id)}
                  className={`border-b border-neutral-100 cursor-pointer transition-colors ${
                    selectedBuildingId === listing.building_id ? 'bg-neutral-100' : ''
                  }`}
                >
                  <td className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 shrink-0 rounded-lg bg-neutral-300 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="9" cy="9" r="2" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>

                      <span className="text-base">
                        {listing.building_name} - {listing.unit_name}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 text-base align-middle">
                    Home
                  </td>

                  <td className="py-4 text-base align-middle">
                    {listing.location}
                  </td>

                  <td className="py-4 text-base align-middle">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      {listing.status
                        ? listing.status.charAt(0).toUpperCase() + listing.status.slice(1)
                        : ''}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
