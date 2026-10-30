import React from 'react';

const CategoryCollectionShowcase = ({ 
  categories = [], // Array of categories, e.g., [{ name: "Earrings", subtitle: "Our Exclusive Earring Collection", images: [...] }]
  onImageClick 
}) => {
  return (
    <div className="w-full space-y-12">
      {categories.map((cat, catIndex) => (
        <section 
          key={cat.name || catIndex} 
          className="w-full bg-[#1c382f] py-10 px-4 sm:px-6 lg:px-8 rounded-2xl shadow-xl"
        >
          <div className="max-w-7xl mx-auto">
            
            {/* Header Section */}
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#d4af37] tracking-wider mb-2">
                {cat.name} Collection
              </h2>
              <p className="text-xs sm:text-sm font-serif text-[#d4af37]/80 tracking-widest uppercase">
                {cat.subtitle || `Our Exclusive ${cat.name} Collection`}
              </p>
            </div>

            {/* 4-Card Image Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {(cat.images || []).slice(0, 4).map((imgUrl, imgIndex) => (
                <div
                  key={imgIndex}
                  onClick={() => onImageClick && onImageClick(cat, imgUrl)}
                  className="group cursor-pointer bg-white rounded-xl p-2 sm:p-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={typeof imgUrl === 'string' ? imgUrl : imgUrl?.url}
                      alt={`${cat.name} Item ${imgIndex + 1}`}
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      ))}
    </div>
  );
};

export default CategoryCollectionShowcase;