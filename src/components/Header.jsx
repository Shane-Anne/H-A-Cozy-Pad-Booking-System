import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Header({
  isMenuOpen,
  setIsMenuOpen,
  onOpenSignIn,
  onOpenRegister,
}) {
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Replaces menu.js document click listener to close menu outside clicks
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen, setIsMenuOpen]);

  return (
    <header className="flex items-center justify-between px-5 md:px-10 lg:px-[52px] py-7 bg-[#fdfdfd]">
      <Link to="/" className="text-3xl lg:text-4xl font-bold text-black no-underline">
        H&A Cozy Pad
      </Link>

      <nav className="hidden md:block">
        <ul className="flex gap-8 list-none m-0 p-0">
          <li><Link to="/all" className="text-xl hover:underline">All</Link></li>
          <li><Link to="/homes" className="text-xl hover:underline">Homes</Link></li>
          <li><Link to="/host/reservations" className="text-xl hover:underline">Reservations</Link></li>
        </ul>
      </nav>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenRegister}
          className="hidden md:block px-6 py-2.5 text-lg border border-black rounded-md hover:bg-neutral-100 bg-transparent cursor-pointer"
        >
          Register
        </button>
        <button
          onClick={onOpenSignIn}
          className="hidden md:block px-6 py-2.5 text-lg border border-black rounded-md hover:bg-neutral-100 bg-transparent cursor-pointer"
        >
          Sign in
        </button>
        <button
          ref={buttonRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
          className="w-9 h-9 flex flex-col items-center justify-center gap-[5px] cursor-pointer bg-transparent border-0"
        >
          <span className="block w-6 h-[2px] bg-black"></span>
          <span className="block w-6 h-[2px] bg-black"></span>
        </button>
      </div>

      {/* Side Menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute right-[30px] top-[90px] w-[280px] bg-white rounded-2xl shadow-xl border border-neutral-100 py-3 z-40"
        >
          <Link to="/host/listings" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-5 py-3 text-base font-medium hover:bg-neutral-100 no-underline text-black">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7"/><path d="M9 22V12h6v10"/></svg>
            Switch to hosting
          </Link>
          <a href="#" className="flex items-center gap-3 px-5 py-3 text-base font-medium hover:bg-neutral-100 no-underline text-black">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 16.5l20-9-6 18-3-7-7-3z"/></svg>
            Trips
          </a>
          <a href="#" className="flex items-center gap-3 px-5 py-3 text-base font-medium hover:bg-neutral-100 no-underline text-black">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>
            Profile
          </a>
          <hr className="my-2 border-neutral-200" />
          <Link to="/help" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-5 py-3 text-base font-medium hover:bg-neutral-100 no-underline text-black">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 2-3 4"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Help Center
          </Link>
          <hr className="my-2 border-neutral-200" />
          <button
            onClick={() => {
              setIsMenuOpen(false);
              onOpenSignIn();
            }}
            className="w-full text-left flex items-center gap-3 px-5 py-3 text-base font-semibold hover:bg-neutral-100 bg-transparent border-0 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Log in or sign up
          </button>
        </div>
      )}
    </header>
  );
}