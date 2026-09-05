import React, { useState, useEffect } from 'react';

export default function RegisterModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
  });

  // Lock body scroll and register escape key (from register.js)
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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register submitted:', formData);
    onClose();
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] px-4"
    >
      <div className="w-full max-w-[520px] bg-white rounded-[25px] shadow-xl px-8 sm:px-12 py-10 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-6 text-2xl text-neutral-400 hover:text-black leading-none bg-transparent border-0 cursor-pointer"
        >
          &times;
        </button>
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">Register your account</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-lg font-semibold">Legal Name</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col border border-neutral-300 rounded-xl px-5 py-2.5 focus-within:border-black transition-colors">
                <span className="text-xs text-neutral-400">First name</span>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border-none outline-none bg-transparent text-lg"
                  required
                />
              </label>
              <label className="flex flex-col border border-neutral-300 rounded-xl px-5 py-2.5 focus-within:border-black transition-colors">
                <span className="text-xs text-neutral-400">Last name</span>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border-none outline-none bg-transparent text-lg"
                  required
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-lg font-semibold">Date of Birth</span>
            <label className="flex flex-col justify-center gap-1 border border-neutral-300 rounded-xl px-5 py-3.5 min-h-[62px] focus-within:border-black transition-colors cursor-text">
              <span className="text-xs text-neutral-400 leading-none">Birth date</span>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full border-none outline-none bg-transparent text-lg leading-none p-0 [color-scheme:light] [&::-webkit-datetime-edit]:text-neutral-400 [&::-webkit-datetime-edit-fields-wrapper]:text-neutral-400"
                required
              />
            </label>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-lg font-semibold">Email Address</span>
            <label className="flex flex-col justify-center gap-1 border border-neutral-300 rounded-xl px-5 py-3.5 min-h-[62px] focus-within:border-black transition-colors cursor-text">
              <span className="text-xs text-neutral-400 leading-none">Email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="juan.delacruz@example.com"
                className="w-full border-none outline-none bg-transparent text-lg leading-none p-0 placeholder:text-neutral-400"
                required
              />
            </label>
          </div>

          <p className="text-sm text-neutral-500 leading-relaxed">
            By selecting Agree and register, I agree to the{' '}
            <a href="#" className="underline text-black">Terms of Service</a>,{' '}
            <a href="#" className="underline text-black">Payments Terms of Service</a>, and{' '}
            <a href="#" className="underline text-black">Nondiscrimination Policy</a>, and acknowledge the{' '}
            <a href="#" className="underline text-black">Privacy Policy</a>.
          </p>

          <button
            type="submit"
            className="mt-2 w-full py-4 text-xl sm:text-2xl font-bold text-white bg-black border border-black rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Agree & Register
          </button>
        </form>
      </div>
    </div>
  );
}