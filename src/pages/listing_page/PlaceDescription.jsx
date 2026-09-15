import React, { useState } from 'react';
import ListingHeader from '../../components/ListingHeader';
import { useNavigate } from 'react-router-dom';

export default function PlaceDescription() {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const navigate = useNavigate();

  const propertyTypes = [
    {
      id: 'entirePlace',
      title: 'Entire place',
      description:
        'Standalone units rented as a whole, such as individual apartments/flats, single bungalows, villas, and guest houses. They offer a residential experience for travelers seeking privacy and self-sufficient stays.',
    },
    {
      id: 'room',
      title: 'Room',
      description:
        'Standalone units rented as a whole, such as individual apartments/flats, single bungalows, villas, and guest houses. They offer a residential experience for travelers seeking privacy and self-sufficient stays.',
    },
    {
      id: 'hostel',
      title: 'Hostel shared-room',
      description:
        'Standalone units rented as a whole, such as individual apartments/flats, single bungalows, villas, and guest houses. They offer a residential experience for travelers seeking privacy and self-sufficient stays.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">

      {/* Header */}
      <ListingHeader
        onOpenQuestions={() => console.log('Questions')}
        onSaveAndExit={() => console.log('Save & Exit')}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col">

        <div className="w-full max-w-[636px] mx-auto pt-10 md:pt-11">

          {/* Heading */}
          <h1 className="text-center text-[23px] md:text-[24px] font-semibold leading-tight mb-5">
            What type of property are you listing?
          </h1>

          {/* Property cards */}
          <div className="space-y-5">
            {propertyTypes.map((property) => {
              const selected = selectedProperty === property.id;

              return (
                <button
                  key={property.id}
                  type="button"
                  onClick={() => setSelectedProperty(property.id)}
                  className={`
                    block w-full text-left
                    border border-black
                    rounded-[19px]
                    px-6 py-4
                    transition
                    cursor-pointer
                    ${
                      selected
                        ? 'bg-neutral-100'
                        : 'bg-white hover:bg-neutral-50'
                    }
                  `}
                >
                  <h2 className="text-[20px] md:text-[21px] font-medium leading-tight">
                    {property.title}
                  </h2>

                  <p className="mt-1.5 text-[15px] md:text-[15.5px] leading-[1.15] font-normal">
                    {property.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="mt-auto flex items-center justify-between px-10 pb-6 pt-8">

          {/* Exit */}
          <button
            type="button"
            onClick={() => window.history.back()}
            className="
              w-[142px] h-[50px]
              rounded-full
              border border-black
              bg-white
              text-[20px]
              hover:bg-neutral-100
              transition
            "
          >
            Back
          </button>

          {/* Continue */}
        <button
            type="button"
            disabled={!selectedProperty}
            onClick={() => navigate('/host/listing/PlaceOffer')}
            className={`
                w-[142px] h-[50px]
                rounded-full
                border border-black
                text-[20px]
                transition
                ${
                selectedProperty
                    ? 'bg-black text-white hover:bg-neutral-800 cursor-pointer'
                    : 'bg-neutral-200 text-black cursor-not-allowed'
                }
            `} >
            Continue
        </button>
        </div>
      </main>
    </div>
  );
}