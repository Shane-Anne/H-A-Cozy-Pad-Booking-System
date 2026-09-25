import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingHeader from '../../components/ListingHeader';
import {
  getListingDraft,
  updateListingDraft,
} from '../../lib/listingDraft';

export default function PropertyDescription() {
  const navigate = useNavigate();

  const draft = getListingDraft();

  const [selectedType, setSelectedType] = useState(
    draft.accommodationType || null
  );

  const propertyTypes = [
    {
      id: 'house',
      title: 'House',
      description:
        'Independently hosted, freestanding house with a private entrance.',
    },
    {
      id: 'villa',
      title: 'Villa',
      description:
        'Freestanding luxury vacation house with local decor and atmosphere.',
    },
    {
      id: 'bungalow',
      title: 'Bungalow',
      description:
        'Basic freestanding accommodation unit in a tropical environment.',
    },
    {
      id: 'house-2',
      title: 'House',
      description:
        'Independently hosted, freestanding house with a private entrance.',
    },
    {
      id: 'villa-2',
      title: 'Villa',
      description:
        'Freestanding luxury vacation house with local decor and atmosphere.',
    },
    {
      id: 'bungalow-2',
      title: 'Bungalow',
      description:
        'Basic freestanding accommodation unit in a tropical environment.',
    },
  ];

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);

    updateListingDraft({
      accommodationType: typeId,
    });
  };

  const handleContinue = () => {
    if (!selectedType) {
      return;
    }

    updateListingDraft({
      accommodationType: selectedType,
    });

    navigate('/host/listing/PlaceDescription');
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">

      {/* Header */}
      <ListingHeader
        onOpenQuestions={() => console.log('Questions')}
        onSaveAndExit={() => console.log('Save & Exit')}
      />

      {/* Main */}
      <main className="flex-1 flex flex-col">

        <div className="w-full max-w-[760px] mx-auto pt-12">

          {/* Heading */}
          <h1 className="text-center text-[28px] md:text-[29px] font-semibold">
            Which of these best describes your place?
          </h1>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-14">
            {propertyTypes.map((property) => {
              const selected = selectedType === property.id;

              return (
                <button
                  key={property.id}
                  type="button"
                  onClick={() => handleTypeSelect(property.id)}
                  className={`
                    h-[168px]
                    rounded-[22px]
                    border border-black
                    px-7
                    py-7
                    text-center
                    transition-all
                    cursor-pointer
                    ${
                      selected
                        ? 'bg-neutral-100'
                        : 'bg-white hover:bg-neutral-50'
                    }
                  `}
                >
                  <h2 className="text-[20px] font-semibold">
                    {property.title}
                  </h2>

                  <p className="mt-4 text-[15px] leading-[1.15] text-neutral-700">
                    {property.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="mt-auto flex items-center justify-between px-10 pb-6 pt-8">

          {/* Back */}
          <button
            type="button"
            onClick={() => navigate('/host/listing')}
            className="
              w-[142px] h-[50px]
              rounded-full
              border border-black
              bg-white
              text-[20px]
              cursor-pointer
              hover:bg-neutral-100
              transition
            "
          >
            Back
          </button>

          {/* Continue */}
          <button
            type="button"
            disabled={!selectedType}
            onClick={handleContinue}
            className={`
              w-[142px] h-[50px]
              rounded-full
              border border-black
              text-[20px]
              transition
              ${
                selectedType
                  ? 'bg-black text-white hover:bg-neutral-800 cursor-pointer'
                  : 'bg-neutral-200 text-black cursor-not-allowed'
              }
            `}
          >
            Continue
          </button>

        </div>
      </main>
    </div>
  );
}