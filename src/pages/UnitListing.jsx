import React from 'react';
import ListingHeader from '../components/ListingHeader';

export default function Listing() {
  const handleQuestions = () => {
    console.log('Questions clicked');
  };

  const handleSaveAndExit = () => {
    console.log('Save & Exit clicked');
  };

  return (
    <div className="min-h-screen bg-white">

      <ListingHeader
        onOpenQuestions={handleQuestions}
        onSaveAndExit={handleSaveAndExit}
      />

      <main>
        <h1>
          What type of property are you listing?
        </h1>

        {/* Your listing content goes here */}
        <h2>asdaowidinaowiwdinaonda</h2>

      </main>

    </div>
  );
}