import React, { useState } from 'react';
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
import PlaceOffer from './pages/PlaceOffer';
import UnitListing from './pages/UnitListing';
import PropertyDescription from './pages/PropertyDescription';
import PlaceDescription from './pages/PlaceDescription';
import PlaceLocation from './pages/PlaceLocation';
import PlaceRate from './pages/PlaceRate';
import PlaceDiscount from './pages/PlaceDiscount';
import PlaceDetail from './pages/PlaceDetail';
import ListingPublish from './pages/ListingPublish';

// Home page wrapper containing the main landing sections
function HomePage({ onOpenSignIn, onOpenRegister, isMenuOpen, setIsMenuOpen }) {
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
        <PropertySection title="Popular Homes Nearby" />
        <PropertySection title="Popular Homes in Philippines" />
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

        <Route path="/host/listing" element={<UnitListing />} />

        <Route
            path="/host/listing/PropertyDescription"
            element={<PropertyDescription />}
        />

        <Route
            path="/host/listing/PlaceDescription"
            element={<PlaceDescription />}
        />

        <Route
            path="/host/listing/PlaceOffer"
            element={<PlaceOffer />}
        />

        <Route
            path="/host/listing/PlaceLocation"
            element={<PlaceLocation />}
        />

        <Route
            path="/host/listing/PlaceRate"
            element={<PlaceRate />}
        />

        <Route
            path="/host/listing/PlaceDiscount"
            element={<PlaceDiscount />}
        />

        <Route
            path="/host/listing/PlaceDetail"
            element={<PlaceDetail />}
        />

        <Route
            path="/host/listing/ListingPublish" 
            element={<ListingPublish />}
        />
        
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