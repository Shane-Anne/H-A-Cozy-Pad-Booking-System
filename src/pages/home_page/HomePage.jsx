import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import SearchSection from './SearchSection';
import PropertySection from './PropertySection';
import Footer from '../../components/Footer';
import { API_BASE_URL } from '../../lib/api';

export default function HomePage({ onOpenSignIn, onOpenRegister, isMenuOpen, setIsMenuOpen }) {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/available_listings.php`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load available housing');
        }
        return response.json();
      })
      .then((data) => {
        setProperties(data);
        setFilteredProperties(data);
      })
      .catch((error) => console.error(error));
  }, []);

  // Filter properties dynamically when search parameters change
  const handleSearch = (searchParams) => {
    const { query, num_of_guests } = searchParams;

    const filtered = properties.filter((property) => {
      const matchesQuery =
        !query ||
        property.building_name?.toLowerCase().includes(query.toLowerCase()) ||
        property.location?.toLowerCase().includes(query.toLowerCase()) ||
        property.unit_name?.toLowerCase().includes(query.toLowerCase());

      const matchesGuests =
        !num_of_guests || (property.max_guests ? property.max_guests >= num_of_guests : true);

      return matchesQuery && matchesGuests;
    });

    setFilteredProperties(filtered);
  };

  return (
    <div className="bg-white text-black font-sans min-h-screen flex flex-col">
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onOpenSignIn={onOpenSignIn}
        onOpenRegister={onOpenRegister}
      />
      <main className="grow">
        <SearchSection onSearch={handleSearch} />
        <PropertySection properties={filteredProperties} />
      </main>
      <Footer />
    </div>
  );
}