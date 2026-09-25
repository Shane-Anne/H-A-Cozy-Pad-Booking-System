import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { API_BASE_URL } from './lib/api';

import AuthModal from './components/AuthModal';
import RegisterModal from './components/RegisterModal';
import Chatbot from './components/Chatbot';
import ProtectedRoute from './components/ProtectedRoute';

import HelpCenter from './pages/faq_page/HelpCenter';
import FaqManagement from './pages/faq_page/FaqManagement';
import Profile from './pages/Profile';
import Trips from './pages/Trips';

import ListedProperty from './pages/ListedProperty';

// Home page
import HomePage from './pages/home_page/HomePage';

// Dashboard pages
import DashboardListings from './pages/dashboard_page/DashboardListings';
import DashboardReservations from './pages/dashboard_page/DashboardReservations';
import DashboardCalendar from './pages/dashboard_page/DashboardCalendar';
import UserManagement from './pages/dashboard_page/UserManagement';

// Booking pages
import BookingConfirmation from './pages/booking_page/Bookingconfirmation';
import BookingConfirmation2 from './pages/booking_page/Bookingconfirmation_2';

// Listing pages
import PlaceOffer from './pages/listing_page/PlaceOffer';
import UnitListing from './pages/listing_page/UnitListing';
import PropertyDescription from './pages/listing_page/PropertyDescription';
import PlaceDescription from './pages/listing_page/PlaceDescription';
import PlaceLocation from './pages/listing_page/PlaceLocation';
import PlaceRate from './pages/listing_page/PlaceRate';
import PlaceDiscount from './pages/listing_page/PlaceDiscount';
import PlaceDetail from './pages/listing_page/PlaceDetail';
import ListingPublish from './pages/listing_page/ListingPublish';
import PlaceImages from './pages/listing_page/PlaceImages';

export default function App() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
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

    useEffect(() => {
        fetch(`${API_BASE_URL}/check_auth.php`, {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.authenticated) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            })
            .catch(() => setUser(null))
            .finally(() => setIsLoading(false));

        const handleAuthChange = (event) => {
            if (event.detail?.loggedIn && event.detail?.user) {
                setUser(event.detail.user);
            } else {
                setUser(null);
            }
        };

        window.addEventListener('auth-changed', handleAuthChange);

        return () => {
            window.removeEventListener('auth-changed', handleAuthChange);
        };
    }, []);

    return (
        <Router>
            <Routes>
                {/* Home */}
                <Route
                    path="/"
                    element={
                        <HomePage
                            isMenuOpen={isMenuOpen}
                            setIsMenuOpen={setIsMenuOpen}
                            user={user}
                            onLogout={() => setUser(null)}
                            onOpenSignIn={handleOpenAuth}
                            onOpenRegister={handleOpenRegister}
                        />
                    }
                />

                {/* Property */}
                <Route
                    path="/property/:unitId"
                    element={
                        <ListedProperty
                            isMenuOpen={isMenuOpen}
                            setIsMenuOpen={setIsMenuOpen}
                            user={user}
                            onLogout={() => setUser(null)}
                            onOpenSignIn={handleOpenAuth}
                            onOpenRegister={handleOpenRegister}
                        />
                    }
                />

                {/* Help Center */}
                <Route
                    path="/help"
                    element={
                        <HelpCenter
                            isMenuOpen={isMenuOpen}
                            setIsMenuOpen={setIsMenuOpen}
                            user={user}
                            onLogout={() => setUser(null)}
                            onOpenSignIn={handleOpenAuth}
                            onOpenRegister={handleOpenRegister}
                            onOpenChat={() => setIsChatOpen(true)}
                        />
                    }
                />

                {/* Profile */}
                <Route
                    element={
                        <ProtectedRoute
                            user={user}
                            isLoading={isLoading}
                        />
                    }
                >
                    <Route
                        path="/profile"
                        element={<Profile user={user} />}
                    />
                </Route>

                {/* Host Dashboard */}
                <Route
                    element={
                        <ProtectedRoute
                            user={user}
                            isLoading={isLoading}
                            allowedRoles={['admin', 'assistant']}
                        />
                    }
                >
                    <Route
                        path="/host/listings"
                        element={<DashboardListings />}
                    />

                    <Route
                        path="/host/reservations"
                        element={<DashboardReservations />}
                    />

                    <Route
                        path="/host/calendar"
                        element={<DashboardCalendar />}
                    />

                    <Route
                        path="/host/faqs"
                        element={<FaqManagement />}
                    />

                    <Route
                        path="/host/listing"
                        element={<UnitListing />}
                    />

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

                    <Route
                        path="/host/listing/PlaceImages"
                        element={<PlaceImages />}
                    />
                </Route>

                {/* FAQ Management compatibility route */}
                <Route
                    path="/host/FaqManagement"
                    element={<FaqManagement />}
                />

                {/* User Management */}
                <Route
                    element={
                        <ProtectedRoute
                            user={user}
                            isLoading={isLoading}
                            allowedRoles={['admin']}
                        />
                    }
                >
                    <Route
                        path="/host/users"
                        element={<UserManagement />}
                    />
                </Route>

                {/* Customer Routes */}
                <Route
                    element={
                        <ProtectedRoute
                            user={user}
                            isLoading={isLoading}
                            allowedRoles={[
                                'customer',
                                'admin',
                                'assistant',
                            ]}
                        />
                    }
                >
                    <Route
                        path="/trips"
                        element={<Trips />}
                    />

                    <Route
                        path="/booking-confirmation"
                        element={
                            <BookingConfirmation
                                user={user}
                                onLogout={() => setUser(null)}
                                isMenuOpen={isMenuOpen}
                                setIsMenuOpen={setIsMenuOpen}
                                onOpenSignIn={handleOpenAuth}
                                onOpenRegister={handleOpenRegister}
                            />
                        }
                    />

                    <Route
                        path="/booking-confirmation-2"
                        element={
                            <BookingConfirmation2
                                user={user}
                                onLogout={() => setUser(null)}
                                isMenuOpen={isMenuOpen}
                                setIsMenuOpen={setIsMenuOpen}
                                onOpenSignIn={handleOpenAuth}
                                onOpenRegister={handleOpenRegister}
                            />
                        }
                    />
                </Route>
            </Routes>

            {/* Global Authentication Modals */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onLoginSuccess={(userData) => setUser(userData)}
            />

            <RegisterModal
                isOpen={isRegisterModalOpen}
                onClose={() => setIsRegisterModalOpen(false)}
            />

            {/* Floating Chat Button */}
            {!isChatOpen && (
                <button
                    onClick={() => setIsChatOpen(true)}
                    className="fixed bottom-6 right-6 z-40 bg-gray-800 text-white px-5 py-3 rounded-full shadow-lg hover:bg-gray-700"
                >
                    💬 Chat
                </button>
            )}

            {/* Global Chatbot */}
            <Chatbot
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                onToggle={() => setIsChatOpen(!isChatOpen)}
            />
        </Router>
    );
}