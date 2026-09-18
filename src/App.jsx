import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import AuthModal from './components/AuthModal';
import RegisterModal from './components/RegisterModal';
import HelpCenter from './pages/HelpCenter';
import DashboardListings from './pages/DashboardListings';
import DashboardReservations from './pages/DashboardReservations';
import ListedProperty from './pages/ListedProperty';

// home page
import HomePage from './pages/home_page/HomePage';

// booking confirmation
import BookingConfirmation from './pages/booking_page/Bookingconfirmation';
import BookingConfirmation2 from './pages/booking_page/Bookingconfirmation_2';

import Chatbot from './components/Chatbot';

// listing pages
import PlaceOffer from './pages/listing_page/PlaceOffer';
import UnitListing from './pages/listing_page/UnitListing';
import PropertyDescription from './pages/listing_page/PropertyDescription';
import PlaceDescription from './pages/listing_page/PlaceDescription';
import PlaceLocation from './pages/listing_page/PlaceLocation';
import PlaceRate from './pages/listing_page/PlaceRate';
import PlaceDiscount from './pages/listing_page/PlaceDiscount';
import PlaceDetail from './pages/listing_page/PlaceDetail';
import ListingPublish from './pages/listing_page/ListingPublish';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

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
              onOpenChat={() => setIsChatOpen(true)}
            />
          }   
        />
        <Route path="/host/listings" element={<DashboardListings />} />
        <Route path="/host/reservations" element={<DashboardReservations />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        <Route path="/booking-confirmation-2" element={<BookingConfirmation2 />} />

        <Route
          path="/property/:unitId"
          element={
            <ListedProperty
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              onOpenSignIn={handleOpenAuth}
              onOpenRegister={handleOpenRegister}
            />
          }
        />

        <Route path="/host/listing" element={<UnitListing />} />
        <Route path="/host/listing/PropertyDescription" element={<PropertyDescription />} />
        <Route path="/host/listing/PlaceDescription" element={<PlaceDescription />} />
        <Route path="/host/listing/PlaceOffer" element={<PlaceOffer />} />
        <Route path="/host/listing/PlaceLocation" element={<PlaceLocation />} />
        <Route path="/host/listing/PlaceRate" element={<PlaceRate />} />
        <Route path="/host/listing/PlaceDiscount" element={<PlaceDiscount />} />
        <Route path="/host/listing/PlaceDetail" element={<PlaceDetail />} />
        <Route path="/host/listing/ListingPublish" element={<ListingPublish />} />
      </Routes>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSwitchToRegister={handleOpenRegister}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

      <Chatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />
    </Router>
  );
}