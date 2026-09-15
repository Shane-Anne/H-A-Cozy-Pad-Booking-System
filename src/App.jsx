import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import SearchSection from './components/SearchSection';
import PropertySection from './components/PropertySection';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import RegisterModal from './components/RegisterModal';
import Chatbot from './components/Chatbot'; // 💬 Import Chatbot component

import DashboardListings from './pages/DashboardListings';
import DashboardReservations from './pages/DashboardReservations';
import HelpCenter from './pages/HelpCenter';

function HomePage({
    onOpenSignIn,
    onOpenRegister,
    isMenuOpen,
    setIsMenuOpen,
}) {
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
    const [isChatOpen, setIsChatOpen] = useState(false); // 💬 State for floating chatbot

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
                {/* Home */}
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

                {/* Help Center */}
                <Route
                    path="/help"
                    element={
                        <HelpCenter
                            isMenuOpen={isMenuOpen}
                            setIsMenuOpen={setIsMenuOpen}
                            onOpenSignIn={handleOpenAuth}
                            onOpenRegister={handleOpenRegister}
                            onOpenChat={() => setIsChatOpen(true)} // 💬 Pass trigger to HelpCenter
                        />
                    }
                />

                {/* Host Dashboard */}
                <Route
                    path="/host/listings"
                    element={<DashboardListings />}
                />

                <Route
                    path="/host/reservations"
                    element={<DashboardReservations />}
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

            {/* 💬 Global Floating Chatbot Bubble */}
            <Chatbot
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                onToggle={() => setIsChatOpen(!isChatOpen)}
            />
        </Router>
    );
}