import React from 'react';

export default function SearchSection() {
  return (
    <section className="flex justify-center px-5 md:px-10 lg:px-[52px] pt-6 pb-12 bg-[#fdfdfd]">
      <div className="w-full max-w-[971px] flex flex-col items-center gap-5 bg-[#efefef] rounded-[25px] px-5 md:px-10 lg:px-[60px] py-10">
        <div className="flex items-center gap-4 w-full bg-white border border-neutral-300 rounded-[10px] px-6 py-[18px]">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-[26px] h-[26px] shrink-0 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search destination or property"
            className="w-full bg-transparent border-none outline-none text-lg lg:text-xl font-light"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div className="flex items-center gap-3 bg-white border border-neutral-300 rounded-[10px] px-5 py-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 shrink-0 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            <div className="flex flex-col">
              <span className="text-sm font-medium">July 28, 2026</span>
              <span className="text-sm">Tuesday</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 shrink-0 text-neutral-500 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>

          <div className="flex items-center gap-3 bg-white border border-neutral-300 rounded-[10px] px-5 py-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 shrink-0 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <div className="flex flex-col">
              <span className="text-sm font-medium">July 29, 2026</span>
              <span className="text-sm">Wednesday</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 shrink-0 text-neutral-500 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>

          <div className="flex items-center gap-3 bg-white border border-neutral-300 rounded-[10px] px-5 py-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 shrink-0 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/>
              <path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
            <div className="flex flex-col">
              <span className="text-sm font-medium">1 Adult</span>
              <span className="text-sm">1 Room</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0 text-neutral-500 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>

        <button className="mt-2 px-16 py-3 text-2xl lg:text-3xl font-bold text-white bg-neutral-400 border border-neutral-500 rounded-full hover:bg-neutral-500 cursor-pointer">
          SEARCH
        </button>
      </div>
    </section>
  );
}