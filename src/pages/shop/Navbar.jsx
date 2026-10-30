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
            className="h-12 sm:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="truncate text-sm sm:text-2xl font-serif font-extrabold tracking-wider uppercase text-amber-300">
              LAXMI SRI
            </span>
            <span className="sm:block text-[9px] font-semibold tracking-[0.35em] uppercase mt-0.5" style={{ color: currentTheme.muted }}>
              ✦ ART JEWELLERS ✦
            </span>
          </div>
        </a>

        <div className="hidden lg:flex items-center gap-6 text-xs font-medium" style={{ color: currentTheme.muted }}>
          <button
            type="button"
            onClick={() => alert("Store Location: Main Bazaar, Hyderabad")}
            className="flex items-center gap-2 transition hover:opacity-80"
          >
            <MapPin size={16} style={{ color: currentTheme.accent }} />
            <span>Hyderabad Boutique</span>
          </button>
          <a
            href="tel:+919876543210"
            className="flex items-center gap-2 transition hover:opacity-80"
          >
            <Phone size={16} style={{ color: currentTheme.accent }} />
            <span>+91 98765 43210</span>
          </a>
        </div>

        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative group">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search diamond harams, gemstone chokers..."
              className="w-full rounded-full border py-2.5 pl-4 pr-11 text-xs outline-none transition shadow-inner"
              style={{
                backgroundColor: currentTheme.card,
                borderColor: currentTheme.border,
                color: currentTheme.text
              }}
            />
            <button
              type="button"
              aria-label="Search"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 transition"
              style={{ color: currentTheme.muted }}
            >
              <Search size={16} />
            </button>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 md:hidden">
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="min-h-10 min-w-10 rounded-xl p-2 transition"
            style={{ backgroundColor: currentTheme.card, color: currentTheme.accent }}
          >
            <Search size={18} />
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="min-h-10 min-w-10 rounded-xl p-2 transition"
            style={{ backgroundColor: currentTheme.card, color: currentTheme.accent }}
          >
            <Menu size={18} />
          </button>
        </div>
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