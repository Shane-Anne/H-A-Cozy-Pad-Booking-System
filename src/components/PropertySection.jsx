import React from 'react';

export default function PropertySection({ title, properties = [1, 2, 3, 4] }) {
  return (
    <section className="px-5 md:px-10 lg:px-[52px] py-10">
      <div className="flex items-center gap-3 mb-7">
        <h2 className="text-2xl lg:text-[27px] font-medium">{title}</h2>
        <span className="text-xl text-neutral-400 cursor-pointer">›</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
        {properties.map((_, index) => (
          <div key={index}>
            <div className="w-full aspect-square bg-neutral-300 rounded-[20px]"></div>
            <div className="mt-3">
              <h3 className="text-xl lg:text-2xl font-normal">Title</h3>
              <p className="text-lg lg:text-xl font-light">₱ 0.00</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}