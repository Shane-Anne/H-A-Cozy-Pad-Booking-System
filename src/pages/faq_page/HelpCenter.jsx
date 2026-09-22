import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Chatbot from '../../components/Chatbot';

const FAQS = [
  { id: 1, question: 'What is your cancellation policy?', answer: 'Answer to question 1 goes here.' },
  { id: 2, question: 'How do I cancel or change my booking?', answer: 'Answer to question 2 goes here.' },
  { id: 3, question: 'What happens if my event or stay is canceled by the business?', answer: 'Answer to question 3 goes here.' },
  { id: 4, question: 'What payment methods do you accept?', answer: 'Answer to question 4 goes here.' },
  { id: 5, question: 'Are there any hidden fees?', answer: 'Answer to question 5 goes here.' },
];

const FAQ_CATEGORIES = [
  { name: 'Booking Questions', description: 'Changes, cancellations, and reservation details.' },
  { name: 'Payment Questions', description: 'Accepted payment methods, charges, and refunds.' },
  { name: 'Host Questions', description: 'Managing your property and welcoming guests.' },
];

export default function HelpCenter({
  isMenuOpen,
  setIsMenuOpen,
  user,
  onLogout,
  onOpenSignIn,
  onOpenRegister,
}) {
  const [openFaqId, setOpenFaqId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const toggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="bg-white text-black font-sans min-h-screen flex flex-col">
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} user={user} onLogout={onLogout} onOpenSignIn={onOpenSignIn} onOpenRegister={onOpenRegister} />
      <main className="grow">
        <section className="flex flex-col items-center px-5 pt-14 pb-10">
          <h1 className="text-3xl lg:text-4xl font-bold mb-8 text-center">Hello, how can we help you?</h1>
          <div className="w-full max-w-[520px] flex items-center gap-3 bg-white border border-neutral-300 rounded-full px-6 py-4 shadow-sm">
            <input type="text" placeholder="Search" className="w-full bg-transparent border-none outline-none text-lg font-light" />
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </div>
        </section>
        <section className="flex flex-col items-center px-5 pb-10">
          <h2 className="text-2xl font-bold mb-6 text-center">Need to get in touch?</h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-4"><button className="px-10 py-3 text-lg font-medium bg-neutral-100 border border-neutral-300 rounded-full hover:bg-neutral-200 cursor-pointer">Chatbots</button><button className="px-10 py-3 text-lg font-medium bg-neutral-100 border border-neutral-300 rounded-full hover:bg-neutral-200 cursor-pointer">Contact Us</button></div>
          <p className="text-sm text-neutral-600">You can also <a href="#" className="underline text-black">give us feedback</a></p>
        </section>
        <hr className="border-neutral-200 mx-5" />
        <section className="px-5 md:px-10 lg:px-[52px] py-12">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="pb-5 flex flex-wrap justify-center gap-3">
              {FAQ_CATEGORIES.map((category) => {
                const isSelected = selectedCategory === category.name;
                return (
                  <button
                    type="button"
                    key={category.name}
                    onClick={() => setSelectedCategory(isSelected ? null : category.name)}
                    aria-pressed={isSelected}
                    className={`px-5 py-3 text-sm font-medium border rounded-full cursor-pointer transition-colors ${isSelected ? 'bg-black text-white border-black' : 'bg-white text-black border-neutral-300 hover:border-black hover:bg-neutral-50'}`}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
            {selectedCategory && (
              <p className="mb-5 text-center text-sm text-neutral-600">
                {FAQ_CATEGORIES.find((category) => category.name === selectedCategory)?.description}
              </p>
            )}
          <div className="max-w-[800px] mx-auto flex flex-col gap-4">
            {FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return <div key={faq.id} className="border border-neutral-300 rounded-xl overflow-hidden"><button onClick={() => toggleFaq(faq.id)} className="w-full flex items-center justify-between px-6 py-4 text-left text-lg font-medium bg-transparent border-0 cursor-pointer">{faq.question}<svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg></button>{isOpen && <div className="px-6 pb-4 text-base text-neutral-600">{faq.answer}</div>}</div>;
            })}
          </div>
        </section>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
