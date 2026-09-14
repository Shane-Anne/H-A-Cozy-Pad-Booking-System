import React, { useState } from 'react';
import HostHeader from '../components/HostHeader';

export default function DashboardReservations() {
  const [activeTab, setActiveTab] = useState('today'); // 'today' | 'soon'

  return (
    <div className="bg-white text-black font-sans min-h-screen flex flex-col">
      <HostHeader activeNav="Today" />

      <main className="flex flex-col items-center px-5 pt-10 pb-24 grow">
        {/* Tab Controls */}
        <div className="flex gap-3 mb-16">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-6 py-2.5 rounded-full text-base cursor-pointer border-0 ${
              activeTab === 'today'
                ? 'font-semibold bg-neutral-800 text-white'
                : 'font-medium bg-neutral-100 text-neutral-400'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveTab('soon')}
            className={`px-6 py-2.5 rounded-full text-base cursor-pointer border-0 ${
              activeTab === 'soon'
                ? 'font-semibold bg-neutral-800 text-white'
                : 'font-medium bg-neutral-100 text-neutral-400'
            }`}
          >
            Soon
          </button>
        </div>

        {/* Empty State Display */}
        <div className="flex flex-col items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-neutral-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
          <p className="text-xl font-bold text-black">
            {activeTab === 'today' ? 'No reservations for today' : 'No upcoming reservations'}
          </p>
        </div>
      </main>
    </div>
  );
}