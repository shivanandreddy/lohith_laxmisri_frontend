import { useNavigate } from "react-router-dom";
import { Award, AlertCircle } from "lucide-react";
import LoadedImage from "./LoadedImage";

export default function ProductGrid({ currentTheme, loading, error, fetchProducts, staticCategories }) {
  const navigate = useNavigate();

  return (
    <section id="shop-products" className="mx-auto w-full max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-6 flex flex-col items-center text-center">
        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-1.5 mb-1" style={{ color: currentTheme.accent }}>
          <Award size={13} /> Curated Boutique Showcase
        </p>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          Explore Our Collections
        </h2>
        <p className="mt-1 text-xs opacity-70">
          Select a category below to browse exquisite jewelry items
        </p>
      </div>

      {error && (
        <div role="alert" className="flex flex-col items-center gap-3 border border-red-900/50 rounded-2xl p-6 my-6 text-center bg-red-950/20 text-red-300">
          <div className="flex items-center gap-2 font-semibold">
            <AlertCircle size={20} />
            <p className="text-sm">{error}</p>
          </div>
          <button type="button" onClick={fetchProducts} className="rounded-xl px-4 py-2 text-xs font-bold text-black transition" style={{ backgroundColor: currentTheme.accent }}>
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 justify-items-center">
            {staticCategories.map(({ name, image }) => (
              <button
                key={name}
                type="button"
                onClick={() => navigate(`/shop/${encodeURIComponent(name)}`)}
                className="group flex flex-col items-center gap-3 shrink-0 focus:outline-none transition-transform duration-300 hover:scale-105"
              >
                <div 
                  className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full p-1.5 shadow-xl transition-all duration-300 group-hover:ring-4"
                  style={{ 
                    border: `2px solid ${currentTheme.accent}`,
                    backgroundColor: currentTheme.card
                  }}
                >
                  <div className="h-full w-full overflow-hidden rounded-full bg-black/20">
                    <LoadedImage
                      src={image}
                      alt={name}
                      containerClassName="h-full w-full"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-extrabold tracking-wide transition-colors" style={{ color: currentTheme.text }}>
                  {name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}