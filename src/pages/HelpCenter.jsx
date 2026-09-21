
import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';

export default function HelpCenter({
  isMenuOpen,
  setIsMenuOpen,
  onOpenSignIn,
  onOpenRegister,
}) {
  const [categorizedFaqs, setCategorizedFaqs] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [openFaqId, setOpenFaqId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const searchRef = useRef(null);
  const suggestionsListRef = useRef(null);


  // ==============================
  // Load FAQs from database
  // ==============================

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(
          'http://localhost:5000/api/faqs'
        );

        if (!response.ok) {
          throw new Error('Failed to load FAQs.');
        }

        const data = await response.json();

        setCategorizedFaqs(data);

        // Automatically select the first category
        if (data.length > 0) {
          setActiveCategory(data[0].categoryName);
        }

      } catch (error) {
        console.error('FAQ loading error:', error);

        setError(
          'Unable to load frequently asked questions.'
        );

      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);


  // ==============================
  // Toggle FAQ
  // ==============================

  const toggleFaq = (id) => {
    setOpenFaqId(
      openFaqId === id ? null : id
    );
  };


  // ==============================
  // Search Suggestions
  // ==============================

  const suggestions = searchQuery.trim()
    ? categorizedFaqs
        .flatMap((cat) =>
          cat.faqs.map((faq) => ({
            ...faq,
            categoryName: cat.categoryName,
          }))
        )
        .filter((faq) =>
          faq.question
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
    : [];


  // Reset selected highlight index
  // when search query changes

  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery]);


  // ==============================
  // Close dropdown when clicking outside
  // ==============================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);


  // ==============================
  // Scroll selected suggestion
  // ==============================

  const scrollSuggestionIntoView = (index) => {
    if (suggestionsListRef.current) {
      const activeItem =
        suggestionsListRef.current.children[index];

      if (activeItem) {
        activeItem.scrollIntoView({
          block: 'nearest',
        });
      }
    }
  };


  // ==============================
  // Select suggestion
  // ==============================

  const handleSelectSuggestion = (suggestion) => {
    setActiveCategory(suggestion.categoryName);
    setOpenFaqId(suggestion.id);
    setSearchQuery('');
    setShowSuggestions(false);

    setTimeout(() => {
      const element = document.getElementById(
        `faq-item-${suggestion.id}`
      );

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 100);
  };


  // ==============================
  // Keyboard navigation
  // ==============================

  const handleKeyDown = (e) => {
    if (
      !showSuggestions ||
      suggestions.length === 0
    ) {
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();

      setSelectedIndex((prev) => {
        const nextIndex =
          prev < suggestions.length - 1
            ? prev + 1
            : 0;

        scrollSuggestionIntoView(nextIndex);

        return nextIndex;
      });

    } else if (e.key === 'ArrowUp') {
      e.preventDefault();

      setSelectedIndex((prev) => {
        const nextIndex =
          prev > 0
            ? prev - 1
            : suggestions.length - 1;

        scrollSuggestionIntoView(nextIndex);

        return nextIndex;
      });

    } else if (e.key === 'Enter') {

      if (
        selectedIndex >= 0 &&
        selectedIndex < suggestions.length
      ) {
        e.preventDefault();

        handleSelectSuggestion(
          suggestions[selectedIndex]
        );
      }

    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };


  // ==============================
  // Current Category
  // ==============================

  const currentCategoryData =
    categorizedFaqs.find(
      (cat) =>
        cat.categoryName === activeCategory
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

        {/* Search Banner */}

        <section className="flex flex-col items-center px-5 pt-14 pb-10">

          <h1 className="text-3xl lg:text-4xl font-bold mb-8 text-center">
            Hello, how can we help you?
          </h1>


          <div
            ref={searchRef}
            className="relative w-full max-w-[520px]"
          >

            <div className="w-full flex items-center gap-3 bg-white border border-neutral-300 rounded-full px-6 py-4 shadow-sm focus-within:border-black transition-colors">

              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() =>
                  setShowSuggestions(true)
                }
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
                <circle
                  cx="11"
                  cy="11"
                  r="8"
                />

                <line
                  x1="21"
                  y1="21"
                  x2="16.65"
                  y2="16.65"
                />
              </svg>

            </div>


            {/* Suggestions Dropdown */}

            {showSuggestions &&
              searchQuery.trim() !== '' && (

                <div
                  ref={suggestionsListRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-2xl shadow-xl overflow-hidden z-50 max-h-72 overflow-y-auto"
                >

                  {suggestions.length > 0 ? (

                    suggestions.map((item, index) => {

                      const isSelected =
                        index === selectedIndex;

                      return (
                        <button
                          key={item.id}
                          onClick={() =>
                            handleSelectSuggestion(item)
                          }
                          onMouseEnter={() =>
                            setSelectedIndex(index)
                          }
                          className={`w-full text-left px-6 py-3.5 flex flex-col gap-0.5 border-b border-neutral-100 last:border-b-0 cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-neutral-100'
                              : 'hover:bg-neutral-50'
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

          <h2 className="text-2xl font-bold mb-6 text-center">
            Need to get in touch?
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">

            <button className="px-10 py-3 text-lg font-medium bg-neutral-100 border border-neutral-300 rounded-full hover:bg-neutral-200 cursor-pointer">
              Chatbots
            </button>

            <button className="px-10 py-3 text-lg font-medium bg-neutral-100 border border-neutral-300 rounded-full hover:bg-neutral-200 cursor-pointer">
              Contact Us
            </button>

          </div>

          <p className="text-sm text-neutral-600">
            You can also{' '}
            <a
              href="#"
              className="underline text-black"
            >
              give us feedback
            </a>
          </p>

        </section>


        <hr className="border-neutral-200 mx-5" />


        {/* FAQ Section */}

        <section className="px-5 md:px-10 lg:px-[52px] py-12">

          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>


          {/* Loading */}

          {loading && (
            <div className="text-center text-neutral-500 py-10">
              Loading frequently asked questions...
            </div>
          )}


          {/* Error */}

          {!loading && error && (
            <div className="text-center text-red-500 py-10">
              {error}
            </div>
          )}


          {/* Categories */}

          {!loading &&
            !error &&
            categorizedFaqs.length > 0 && (

              <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-[900px] mx-auto">

                {categorizedFaqs.map((cat) => (

                  <button
                    key={cat.categoryId}
                    onClick={() => {
                      setActiveCategory(
                        cat.categoryName
                      );

                      setOpenFaqId(null);
                    }}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                      activeCategory ===
                      cat.categoryName
                        ? 'bg-black text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {cat.categoryName}
                  </button>

                ))}

              </div>

            )}


          {/* FAQ Accordion */}

          {!loading &&
            !error &&
            currentCategoryData && (

              <div className="max-w-[800px] mx-auto flex flex-col gap-4">

                {currentCategoryData.faqs.map(
                  (faq) => {

                    const isOpen =
                      openFaqId === faq.id;

                    return (

                      <div
                        key={faq.id}
                        id={`faq-item-${faq.id}`}
                        className="border border-neutral-300 rounded-xl overflow-hidden transition-colors"
                      >

                        <button
                          onClick={() =>
                            toggleFaq(faq.id)
                          }
                          className="w-full flex items-center justify-between px-6 py-4 text-left text-lg font-medium bg-transparent border-0 cursor-pointer"
                        >

                          <span className="pr-4">
                            {faq.question}
                          </span>

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                              isOpen
                                ? 'rotate-180'
                                : ''
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

                  }
                )}

              </div>

            )}

        </section>

      </main>


      <Footer />

      <Chatbot />

    </div>
  );
}