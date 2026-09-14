import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Header from './components/Header';
import SearchSection from './components/SearchSection';
import PropertySection from './components/PropertySection';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import RegisterModal from './components/RegisterModal';

import DashboardListings from './pages/DashboardListings';
import DashboardReservations from './pages/DashboardReservations';

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
                <PropertySection title="Popular Homes Nearby"/>
                <PropertySection title="Popular Homes in Philippines"/>
            </main>

            <Footer />
        </div>
    );
}

function HelpCenter({
    onOpenSignIn,
    onOpenRegister,
    isMenuOpen,
    setIsMenuOpen,
}) {
    const [ openQuestion, setOpenQuestion ] = useState(null);

    const questions = [
        {
            question: "How do I make a reservation?",
            answer: "Search for an avaiable home, select your preferred dates, and follow the booking process to complete your reservation.",
        },

        {
            question: "How can I cancel my reservation?",
            answer: "You can cancel a reservation from your reservations page. Cancellation policies may vary depending on the property.",
        },

        {
            question: "How do I contact my host?",
            answer: "You can contact your host through the messaging or contact options available for your reservation.",
        },

        {
            question: "What should I do if I have a problem with my booking?",
            answer: "Contact our support team as soon as possible and provide your reservation details so we can assist you.",
        },

        {
            question: "How can I become a host?",
            answer: "How can I become a host?",
        },
    ];

    const toggleQuestion = (index) => {
        setOpenQuestion(openQuestion === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans flex flex-col">
            <Header 
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                onOpenSignIn={onOpenSignIn}
                onOpenRegister={onOpenRegister}
            />

            <main className="flex-1">
                <section className="pt-4 pb-2 text-center">
                    <h1 className="text-2xl font-bold mb-3">Hello, how can we help you?</h1>
                    <div className="mx-auto w-[198px] h-[41px] rounded-full border border-gray-500 bg-gray-100 flex 
                                    items-center justify-between px-4">
                        <span className="text-[10px] text-gray-700">Search</span>
                        <button type="button" 
                                className="w-6 h-6 rounded-full border border-gray-400 bg-white flex items-center justify-center" 
                                aria-label="Search">
                            <svg xmlns="http:/www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                                 strokeWidth="1.5" className="w-4 h-4">
                                <circle cx="11" cy="11" r="6.5" />
                                <path d="m16 16L20 20"/>
                            </svg>
                        </button>
                    </div>
                </section>

                /* HERE NEXT */
                <section>
                    
                </section>
            </main>
        </div>
    )
}