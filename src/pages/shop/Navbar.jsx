import { Search, MapPin, Phone, Menu } from "lucide-react";

export default function Navbar({
  currentTheme,
  search,
  setSearch,
  mobileSearchOpen,
  setMobileSearchOpen,
  mobileMenuOpen,
  setMobileMenuOpen
}) {
  return (
    <header 
      className="sticky top-0 z-40 w-full border-b shadow-2xl transition-colors duration-300"
      style={{ backgroundColor: `${currentTheme.surface}f9`, borderColor: currentTheme.border }}
    >
      <div className="h-1 w-full" />

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3 lg:px-8">
        
        <a href="#" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
          <img
  src="/logo.png"
  alt="Laxmi Sri Art Jewellers Logo" 
  className="h-28  w-auto object-contain transition-transform duration-300 group-hover:scale-105"
/>
          <div className="flex flex-col text-center">
            <span className=" font-brand truncate text-lg sm:text-5xl font-serif font-extrabold tracking-wider text-amber-300">
              LAXMI SRI
            </span>
            <span className=" font-subbrand sm:block text-[15px] text-center font-semibold tracking-[0.35em] uppercase mt-0.5" style={{ color: currentTheme.muted }}>
              ✦ ART JEWELLERS ✦
            </span>
          </div>
        </a>

        

       

       
      </div>

      {mobileSearchOpen && (
        <div className="px-4 pb-3 pt-1 md:hidden">
          <div className="relative">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search jewelry collections..."
              className="w-full rounded-full border py-2.5 pl-4 pr-10 text-xs outline-none shadow-md"
              style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border, color: currentTheme.text }}
              autoFocus
            />
            <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: currentTheme.accent }} />
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="border-t px-4 py-4 space-y-3 md:hidden" style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
          <div className="flex flex-col gap-2.5 text-xs" style={{ color: currentTheme.text }}>
            <button
              type="button"
              onClick={() => {
                alert("Store Location: Main Bazaar, Hyderabad");
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 py-1.5 text-left"
            >
              <MapPin size={16} style={{ color: currentTheme.accent }} />
              <span>Hyderabad Boutique</span>
            </button>
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2.5 py-1.5"
            >
              <Phone size={16} style={{ color: currentTheme.accent }} />
              <span>+91 98765 43210</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}