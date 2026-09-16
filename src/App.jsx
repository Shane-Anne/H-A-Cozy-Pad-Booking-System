import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import SearchSection from './components/SearchSection';
import PropertySection from './components/PropertySection';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import RegisterModal from './components/RegisterModal';
import HelpCenter from './pages/HelpCenter';
import DashboardListings from './pages/DashboardListings';
import DashboardReservations from './pages/DashboardReservations';
import BookingConfirmation from './pages/Bookingconfirmation';

//listing pages
import PlaceOffer from './pages/listing_page/PlaceOffer';
import UnitListing from './pages/listing_page/UnitListing';
import PropertyDescription from './pages/listing_page/PropertyDescription';
import PlaceDescription from './pages/listing_page/PlaceDescription';
import PlaceLocation from './pages/listing_page/PlaceLocation';
import PlaceRate from './pages/listing_page/PlaceRate';
import PlaceDiscount from './pages/listing_page/PlaceDiscount';
import PlaceDetail from './pages/listing_page/PlaceDetail';
import ListingPublish from './pages/listing_page/ListingPublish';
import { API_BASE_URL } from './lib/api';

// Home page wrapper containing the main landing sections
function HomePage({ onOpenSignIn, onOpenRegister, isMenuOpen, setIsMenuOpen }) {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/available_listings.php`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load available housing');
        }
        return response.json();
      })
      .then(setProperties)
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="bg-white text-black font-sans min-h-screen flex flex-col">
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onOpenSignIn={onOpenSignIn}
        onOpenRegister={onOpenRegister}
      />
      <main className="grow">
        <SearchSection />
        <PropertySection properties={properties} />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleOpenAuth = () => {
    setIsRegisterModalOpen(false);
    setIsAuthModalOpen(true);
  };

  const handleOpenRegister = () => {
    setIsAuthModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              onOpenSignIn={handleOpenAuth}
              onOpenRegister={handleOpenRegister}
            />
          }
        />
        <Route
          path="/help"
          element={
            <HelpCenter
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              onOpenSignIn={handleOpenAuth}
              onOpenRegister={handleOpenRegister}
            />
          }
        />
        <Route path="/host/listings" element={<DashboardListings />} />
        <Route path="/host/reservations" element={<DashboardReservations />} />
        <Route path="/booking/confirmation" element={<BookingConfirmation />} />
      </Routes>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSwitchToRegister={handleOpenRegister}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </Router>
  );
}