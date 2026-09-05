import React, { useState, useEffect } from 'react';

export default function AuthModal({ isOpen, onClose, onSwitchToRegister }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Lock body scroll and register escape key (from login.js)
  useEffect(() => {
    if (!isOpen) return;

    document.body.classList.add('overflow-hidden');
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.classList.remove('overflow-hidden');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', { identifier, password });
    onClose();
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] px-4"
    >
      <div className="w-full max-w-[520px] bg-white rounded-[25px] shadow-xl px-8 sm:px-12 py-10 relative">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-6 text-2xl text-neutral-400 hover:text-black leading-none bg-transparent border-0 cursor-pointer"
        >
          &times;
        </button>
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">Log in or Sign up</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Phone number or Email Address"
            className="w-full border border-neutral-300 rounded-full px-6 py-4 text-lg outline-none focus:border-black transition-colors"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border border-neutral-300 rounded-full px-6 py-4 text-lg outline-none focus:border-black transition-colors"
            required
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onSwitchToRegister();
            }}
            className="text-base font-medium underline text-black w-fit bg-transparent border-0 cursor-pointer text-left p-0"
          >
            Register Account
          </button>
          <button
            type="submit"
            className="mt-2 w-full py-4 text-xl sm:text-2xl font-bold text-white bg-black border border-black rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}