import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';

const CATEGORIZED_FAQS = [
  {
    categoryName: 'Booking and Reservations',
    faqs: [
      { id: 1, question: 'How can I book a unit?', answer: 'You can easily book a unit through our website by selecting your preferred dates and available unit, or by reaching out to us directly.' },
      { id: 2, question: 'What information is required when making a reservation?', answer: 'You will need to provide your full name, contact number, email address, preferred check-in/check-out dates, total number of guests, and a valid government-issued ID.' },
      { id: 3, question: 'How far in advance can I make a reservation?', answer: 'We accept reservations up to 3 to 6 months in advance. Early booking is highly recommended to secure your preferred dates.' },
      { id: 4, question: 'Can I modify my reservation after booking?', answer: 'Yes, modifications (such as date changes or guest adjustments) are subject to availability and must be requested prior to your scheduled check-in.' },
      { id: 5, question: 'Can I cancel my reservation?', answer: 'Yes, you may request to cancel your reservation according to our cancellation policy terms.' },
      { id: 6, question: 'What is the cancellation policy?', answer: 'Cancellations made well in advance receive a full or partial refund. Cancellations made close to the check-in date or reservation fees may be non-refundable.' },
      { id: 7, question: 'How will I know if my booking has been approved?', answer: 'Once your booking details and payment proof are verified, you will receive a confirmation message and email containing your reservation details.' },
      { id: 8, question: 'How long does it take to confirm a reservation?', answer: 'Booking confirmation typically takes 1 to 24 hours after your proof of payment has been submitted.' },
      { id: 9, question: 'Can I book for someone else?', answer: 'Yes, you can book for someone else. Please make sure to provide the primary guest’s name and contact details during the reservation process.' },
      { id: 10, question: 'What happens if my preferred dates are unavailable?', answer: 'If your preferred dates are unavailable, you can request to join our waitlist or choose alternative available dates.' },
    ],
  },
  {
    categoryName: 'Payments & Fees',
    faqs: [
      { id: 11, question: 'What payment methods are accepted?', answer: 'We accept bank transfers, GCash, Maya, and cash payments upon agreement.' },
      { id: 12, question: 'How much is the required payment or reservation fee?', answer: 'A standard down payment or reservation fee is required to lock in your booking.' },
      { id: 13, question: 'When should I make the payment?', answer: 'The reservation fee must be paid within 24 hours after placing your booking request to prevent auto-cancellation.' },
      { id: 14, question: 'Where should I send the payment?', answer: 'Payment details and account numbers will be displayed upon booking submission and sent to you.' },
      { id: 15, question: 'What proof of payment should I submit?', answer: 'Please upload a clear screenshot or photo of your transaction receipt showing the reference number and date.' },
      { id: 16, question: 'How long does payment verification take?', answer: 'Payment verification usually takes between 1 to 12 hours.' },
      { id: 17, question: 'Is the payment refundable?', answer: 'Reservation fees are generally non-refundable unless cancellation terms apply or if cancelled by management.' },
      { id: 18, question: 'What happens if my payment cannot be verified?', answer: 'Our team will reach out to request an updated receipt or reference number before releasing the reserved slot.' },
      { id: 19, question: 'Is there a security deposit?', answer: 'Yes, a refundable security deposit is collected upon check-in and returned upon check-out after unit inspection.' },
      { id: 20, question: 'Are there additional charges?', answer: 'Additional charges apply for extra guests beyond standard capacity, late check-outs, or damage to property.' },
    ],
  },
  {
    categoryName: 'Accommodations & Amenities',
    faqs: [
      { id: 21, question: 'What units are available?', answer: 'We offer fully furnished studio, 1-bedroom, and multi-guest pad suites designed for cozy stays.' },
      { id: 22, question: 'What are the rates for each unit?', answer: 'Rates vary by unit type, stay duration, and peak season pricing. You can check exact rates in our booking section.' },
      { id: 23, question: 'How many guests can each unit accommodate?', answer: 'Capacity ranges from 2 guests for standard units up to larger capacities for family suites.' },
      { id: 24, question: 'What amenities are included?', answer: 'Amenities include Wi-Fi, air conditioning, smart TV, basic kitchenware, hot & cold shower, and fresh linens.' },
      { id: 25, question: 'Are towels and toiletries provided?', answer: 'Yes, clean towels and basic complimentary toiletries are provided for all guests.' },
      { id: 26, question: 'Is Wi-Fi available?', answer: 'Yes, Wi-Fi is provided free of charge for all checked-in guests.' },
      { id: 27, question: 'Is air conditioning available?', answer: 'Yes, units are equipped with fully functional air conditioning.' },
      { id: 28, question: 'Is parking available?', answer: 'Yes, on-site or nearby secured parking options are available for guests.' },
      { id: 29, question: 'Are cooking facilities available?', answer: 'Selected units include induction cooktops, rice cookers, and microwave ovens for light cooking.' },
      { id: 30, question: 'Are pets allowed?', answer: 'Pet policies depend on the specific unit reserved. Please inform us beforehand if you plan to bring pets.' },
    ],
  },
  {
    categoryName: 'Policies & House Rules',
    faqs: [
      { id: 31, question: 'What time is check-in?', answer: 'Standard check-in time starts at 2:00 PM.' },
      { id: 32, question: 'What time is check-out?', answer: 'Standard check-out time is until 12:00 PM (Noon).' },
      { id: 33, question: 'What are the house rules?', answer: 'House rules include respecting quiet hours, taking care of amenities, and no illegal activities.' },
      { id: 34, question: 'Is smoking allowed?', answer: 'Smoking is strictly prohibited inside the units. Designated smoking areas are available outside.' },
      { id: 35, question: 'Are visitors allowed?', answer: 'Day visitors must be registered with management prior to arrival.' },
      { id: 36, question: 'Is there a maximum number of guests?', answer: 'Yes, strict capacity limits apply to each unit type to ensure guest safety and comfort.' },
    ],
  },
  {
    categoryName: 'Location & Support',
    faqs: [
      { id: 37, question: 'Where is H&A Cozy Pad located?', answer: 'H&A Cozy Pad is located in a prime, easily accessible neighborhood.' },
      { id: 38, question: 'How can I get to H&A Cozy Pad?', answer: 'Detailed pin locations and directions will be provided in your booking confirmation voucher.' },
      { id: 39, question: 'Is there a nearby landmark?', answer: 'Yes, we are situated near prominent commercial hubs and well-known local landmarks.' },
      { id: 40, question: 'What are the nearby establishments or attractions?', answer: 'Convenience stores, restaurants, and shopping centers are within short distance.' },
      { id: 41, question: 'How can I contact H&A Cozy Pad?', answer: 'Reach us through our contact form, direct phone line, email, or official social channels.' },
      { id: 42, question: 'How can I send an inquiry?', answer: 'Use the search bar or chatbot on this page, or click "Contact Us" to leave us a direct message.' },
      { id: 43, question: 'What should I do if I have a problem during my stay?', answer: 'Contact our on-site caretaker or host immediately using the contact details provided at check-in.' },
      { id: 44, question: 'Admin log in', answer: 'Authorized personnel can access the administration portal through the dedicated staff login page.' },
    ],
  },
];

export default function HelpCenter({
  isMenuOpen,
  setIsMenuOpen,
  onOpenSignIn,
  onOpenRegister,
}) {
  const [activeCategory, setActiveCategory] = useState('Booking and Reservations');
  const [openFaqId, setOpenFaqId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchRef = useRef(null);
  const suggestionsListRef = useRef(null);

  const toggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  // Filter suggestions by matching QUESTION text
  const suggestions = searchQuery.trim()
    ? CATEGORIZED_FAQS.flatMap((cat) =>
        cat.faqs.map((faq) => ({ ...faq, categoryName: cat.categoryName }))
      ).filter((faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Reset selected highlight index when search query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle key navigation (Up, Down, Enter, Escape)
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => {
        const nextIndex = prev < suggestions.length - 1 ? prev + 1 : 0;
        scrollSuggestionIntoView(nextIndex);
        return nextIndex;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => {
        const nextIndex = prev > 0 ? prev - 1 : suggestions.length - 1;
        scrollSuggestionIntoView(nextIndex);
        return nextIndex;
      });
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Keep highlighted suggestion visible inside scrollable container
  const scrollSuggestionIntoView = (index) => {
    if (suggestionsListRef.current) {
      const activeItem = suggestionsListRef.current.children[index];
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }
  };

  // Handle selecting a suggestion
  const handleSelectSuggestion = (suggestion) => {
    setActiveCategory(suggestion.categoryName);
    setOpenFaqId(suggestion.id);
    setSearchQuery('');
    setShowSuggestions(false);

    setTimeout(() => {
      const element = document.getElementById(`faq-item-${suggestion.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const currentCategoryData = CATEGORIZED_FAQS.find(
    (cat) => cat.categoryName === activeCategory
  );

  return (
    <div className="bg-white text-black font-sans min-h-screen flex flex-col">
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onOpenSignIn={onOpenSignIn}
        onOpenRegister={onOpenRegister}
      />

      <main className="grow">
        {/* Search Banner with Keyboard Accessible Dropdown */}
        <section className="flex flex-col items-center px-5 pt-14 pb-10">
          <h1 className="text-3xl lg:text-4xl font-bold mb-8 text-center">
            Hello, how can we help you?
          </h1>

          <div ref={searchRef} className="relative w-full max-w-[520px]">
            <div className="w-full flex items-center gap-3 bg-white border border-neutral-300 rounded-full px-6 py-4 shadow-sm focus-within:border-black transition-colors">
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none outline-none text-lg font-light"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 shrink-0 text-neutral-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && searchQuery.trim() !== '' && (
              <div
                ref={suggestionsListRef}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-2xl shadow-xl overflow-hidden z-50 max-h-72 overflow-y-auto"
              >
                {suggestions.length > 0 ? (
                  suggestions.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectSuggestion(item)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full text-left px-6 py-3.5 flex flex-col gap-0.5 border-b border-neutral-100 last:border-b-0 cursor-pointer transition-colors ${
                          isSelected ? 'bg-neutral-100' : 'hover:bg-neutral-50'
                        }`}
                      >
                        <span className="text-base font-medium text-black">
                          {item.question}
                        </span>
                        <span className="text-xs text-neutral-400">
                          In {item.categoryName}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="px-6 py-4 text-neutral-500 text-sm text-center">
                    No matching questions found
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Contact Options */}
        <section className="flex flex-col items-center px-5 pb-10">
          <h2 className="text-2xl font-bold mb-6 text-center">Need to get in touch?</h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <button className="px-10 py-3 text-lg font-medium bg-neutral-100 border border-neutral-300 rounded-full hover:bg-neutral-200 cursor-pointer">
              Chatbots
            </button>
            <button className="px-10 py-3 text-lg font-medium bg-neutral-100 border border-neutral-300 rounded-full hover:bg-neutral-200 cursor-pointer">
              Contact Us
            </button>
          </div>
          <p className="text-sm text-neutral-600">
            You can also <a href="#" className="underline text-black">give us feedback</a>
          </p>
        </section>

        <hr className="border-neutral-200 mx-5" />

        {/* FAQ Section */}
        <section className="px-5 md:px-10 lg:px-[52px] py-12">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-[900px] mx-auto">
            {CATEGORIZED_FAQS.map((cat) => (
              <button
                key={cat.categoryName}
                onClick={() => {
                  setActiveCategory(cat.categoryName);
                  setOpenFaqId(null);
                }}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  activeCategory === cat.categoryName
                    ? 'bg-black text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {cat.categoryName}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="max-w-[800px] mx-auto flex flex-col gap-4">
            {currentCategoryData?.faqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  id={`faq-item-${faq.id}`}
                  className="border border-neutral-300 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left text-lg font-medium bg-transparent border-0 cursor-pointer"
                  >
                    <span className="pr-4">{faq.question}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 text-base text-neutral-600 border-t border-neutral-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}