import React from 'react';

const CategoryCollectionShowcase = ({ 
  categories = [], 
  onImageClick 
}) => {
  // 1. Gather all available images (either from cat.images array or fallback to cat.image/thumbnail)
  const items = categories.flatMap(cat => {
    const imgList = Array.isArray(cat.images) && cat.images.length > 0 
      ? cat.images 
      : [cat.image, cat.thumbnail].filter(Boolean);

    return imgList.map(img => ({
      url: typeof img === 'string' ? img : img?.url,
      name: cat.name,
      subtitle: cat.subtitle
    }));
  }).filter(item => item.url).slice(0, 14); // Limit to 14 items for a clean mosaic shape

  // If no images exist anywhere, don't break
  if (items.length === 0) return null;

  return (
    <div className="w-full py-12 px-4 flex flex-col items-center justify-center overflow-hidden">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif text-[#d4af37] tracking-widest mb-1 font-bold">
          Handpicked Just for You
        </h2>
        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-black">
          ✦ Exclusive Curated Masterpieces ✦
        </p>
      </div>

      {/* Honeycomb Grid Container */}
      <div className="hex-grid-container">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => onImageClick && onImageClick(item.name, item.url)}
            className="hex-item group cursor-pointer bg-amber-300"
          >
            <div className="hex-inner">
              <img
                src={item.url}
                alt={item.name || `Collection Item ${index + 1}`}
                className="hex-image"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                <span className="text-[10px] font-bold text-[#d4af37] tracking-widest uppercase">
                  {item.name}
                </span>
                <span className="text-xs font-serif text-white mt-1">
                  {item.subtitle || 'Explore Collection'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Embedded Hexagon Layout Styles */}
      <style>{`
        .hex-grid-container {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          max-width: 1100px;
          justify-content: center;
          gap: 12px;
          padding-bottom: 2rem;
        }

        .hex-item {
          position: relative;
          width: 170px;
          height: 196px;
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          transition: transform 0.4s ease, filter 0.4s ease;
          
        }

        .hex-item:hover {
          transform: scale(1.08);
          z-index: 20;
          filter: brightness(1.15);
        }

        .hex-inner {
          position: absolute;
          inset: 3px; 
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          overflow: hidden;
        }

        .hex-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .hex-item:hover .hex-image {
          transform: scale(1.15);
        }

        @media (max-width: 640px) {
          .hex-item {
            width: 110px;
            height: 127px;
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryCollectionShowcase;