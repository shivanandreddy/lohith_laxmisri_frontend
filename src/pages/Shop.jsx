import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Search,
  ShoppingBag,
  Package,
  SlidersHorizontal,
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Phone,
  Mail,
  MapPin,
  Menu,
  Sparkles,
  Award,
  RefreshCw,
  AlertCircle,
  Heart
} from "lucide-react";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";

const ITEMS_PER_PAGE = 8;

// MANUALLY CONFIGURE YOUR STATIC CATEGORIES & IMAGES HERE
const STATIC_CATEGORIES = [
  { name: "All", image: "/cat_all.webp" },
  { name: "Necklaces", image: "/cat_necklace.webp" },
  { name: "Bangles", image: "/cat_bangles.webp" },   
  { name: "Earrings", image: "/cat_jhumkas.webp" },  
  { name: "Rings", image: "/cat_rings.webp" },    
  { name: "Mangalsutra", image: "/cat_ms.webp" },       
  { name: "Combo Sets", image: "/cat_cs.webp" },
];

const getImage = (product) => {
  const images = product.images;
  return (
    product.imageUrl ||
    product.image ||
    product.thumbnail ||
    (Array.isArray(images) ? images[0]?.url || images[0] : images?.url) ||
    ""
  );
};

const getPrice = (product) => {
  const price = Number(product.price ?? product.salePrice);
  return Number.isFinite(price) && price >= 0 ? price : 0;
};

// Reusable Image Component with smooth loading skeleton effect
function LoadedImage({ src, alt, className = "", containerClassName = "", accentColor }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-black/20 ${containerClassName}`}>
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 z-10 animate-pulse opacity-40 bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]"
        />
      )}

      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          className={`${className} transition-opacity duration-500 ease-out ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 opacity-50">
          <Package size={30} strokeWidth={1.2} />
          <span className="text-[10px]">No image</span>
        </div>
      )}
    </div>
  );
}

export default function Shop() {
  const { currentTheme } = useTheme();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // State for the standalone gallery carousel above footer
  const [footerGalleryIndex, setFooterGalleryIndex] = useState(0);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/products");
      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : data.products ?? data.data ?? [];

      if (!Array.isArray(list)) {
        throw new Error("Unexpected products response format.");
      }

      setProducts(list);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not load products from backend."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

// Extract all product images for the gallery carousel above footer safely
  // Extract all product images for the gallery carousel above footer safely
  const allProductImages = useMemo(() => {
    const list = [];
    products.forEach((prod) => {
      // 1. Add images from the array if present
      if (Array.isArray(prod.images) && prod.images.length > 0) {
        prod.images.forEach((imgUrl) => {
          if (typeof imgUrl === "string" && imgUrl.trim() !== "") {
            list.push({ 
              url: imgUrl.trim(), 
              title: prod.title ?? prod.name ?? "Exquisite Jewelry" 
            });
          }
        });
      } 
      // 2. Fallback to single image / imageUrl / thumbnail if images array is empty
      else {
        const singleImg = getImage(prod);
        if (singleImg) {
          list.push({ 
            url: singleImg, 
            title: prod.title ?? prod.name ?? "Exquisite Jewelry" 
          });
        }
      }
    });
    return list;
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = products.filter((product) => {
      const productCategory =
        typeof product.category === "object"
          ? product.category?.name
          : product.category;

      const matchesSearch = [
        product.title,
        product.name,
        product.description,
        productCategory,
        product.platingType,
        product.stoneDetails,
      ].some((value) => String(value ?? "").toLowerCase().includes(query));

      const matchesCategory =
        category === "All" || productCategory === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "price-low") {
      result.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (sort === "price-high") {
      result.sort((a, b) => getPrice(b) - getPrice(a));
    } else if (sort === "name") {
      result.sort((a, b) =>
        String(a.title ?? a.name ?? "").localeCompare(
          String(b.title ?? b.name ?? "")
        )
      );
    }

    return result;
  }, [products, search, category, sort]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, sort]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    document.body.style.overflow = "auto";
  };

  return (
    <div 
      className="min-h-screen flex flex-col transition-colors duration-300"
      style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}
    >
      
      {/* NAVBAR */}
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
              <span className="hidden sm:block text-[9px] font-semibold tracking-[0.35em] uppercase mt-0.5" style={{ color: currentTheme.muted }}>
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

      {/* MAIN CONTAINER */}
      <main className="flex-1">
        
        {/* RESPONSIVE LUXURY HERO BANNER */}
        <section className="w-full px-3 pt-3 sm:px-6 sm:pt-6 lg:px-8">
          <div
            className="relative isolate mx-auto min-h-[430px] w-full max-w-7xl overflow-hidden rounded-2xl border shadow-xl sm:min-h-0 sm:aspect-[16/7] sm:rounded-3xl lg:aspect-[16/6]"
            style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}
          >
            {/* Banner artwork */}
            <div className="absolute inset-0">
              <LoadedImage
                src="/banner.png"
                alt="Luxury jewellery collection"
                containerClassName="h-full w-full"
                className="h-full w-full object-cover object-[58%_center] sm:object-center"
                accentColor={currentTheme.accent}
              />
            </div>

            {/* Readability overlays: bottom-up on phones, right-to-left on desktop */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/5 sm:bg-gradient-to-r sm:from-black/5 sm:via-black/35 sm:to-black/95" />
            <div className="absolute inset-0 flex items-end sm:items-center sm:justify-end">
              <div className="w-full px-5 pb-7 pt-24 text-white sm:w-[56%] sm:px-8 sm:py-8 md:w-[52%] md:px-12 lg:px-16">
                <div className="mb-3 flex items-center gap-3 sm:mb-5">
                  <img
                    src="/logo.png"
                    alt="Laxmi Sri Art Jewellers"
                    className="h-10 w-auto max-w-[130px] object-contain drop-shadow-lg sm:h-14 md:h-16"
                  />
                  <span className="h-8 w-px bg-white/40 sm:h-10" />
                  <span className="text-[9px] font-semibold uppercase leading-relaxed tracking-[0.2em] text-white/80 sm:text-[10px]">
                    Boutique<br />Collection
                  </span>
                </div>

                <p className="mb-2 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.24em] text-amber-300 sm:text-[10px]">
                  <Sparkles size={13} /> Crafted to make you shine
                </p>
                <h1 className="max-w-xl text-3xl font-black leading-[1.08] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                  EMBRACE
                  <span className="mt-1 block font-light italic text-amber-300 sm:inline sm:pl-3">
                    Your Elegance
                  </span>
                </h1>
                <p className="mt-3 max-w-md text-[11px] leading-relaxed text-white/80 sm:mt-4 sm:text-xs md:text-sm">
                  PREMIUM ARTISTRY, TIMELESS BEAUTY.
                  <span className="mt-1 block text-white/65">
                    Discover exquisite designs and elevate every occasion with timeless craftsmanship.
                  </span>
                </p>
                <a
                  href="#shop-products"
                  className="group mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-extrabold tracking-wide shadow-lg transition duration-300 hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black sm:mt-7 sm:px-7 sm:text-sm"
                  style={{ backgroundColor: currentTheme.accent, color: "#000000" }}
                >
                  EXPLORE COLLECTION
                  <ChevronRight size={17} className="transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            <div className="pointer-events-none absolute right-4 top-4 hidden text-amber-300/80 sm:block">
              <Sparkles size={24} className="animate-pulse" />
            </div>
            <div className="pointer-events-none absolute bottom-4 left-5 hidden items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/70 sm:flex">
              <span className="h-px w-8 bg-amber-300" />
              Laxmi Sri Art Jewellers
            </div>
          </div>
        </section>

        {/* PRODUCTS CATALOG SECTION */}
        <section id="shop-products" className="mx-auto w-full max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
          
          <div className="mb-5 flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-1.5" style={{ color: currentTheme.accent }}>
                <Award size={13} /> Curated Boutique Showcase
              </p>
              <h2 className="mt-1 text-xl sm:text-3xl font-black tracking-tight">
                Exclusive Jewelry Gallery
              </h2>
              <p className="mt-0.5 text-xs opacity-70">
                {loading ? "Loading products..." : `Showing ${filteredProducts.length} luxury items`}
              </p>
            </div>

            <div className="flex w-full items-center gap-2 sm:w-auto">
              <button
                type="button"
                onClick={fetchProducts}
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 sm:py-2 text-xs font-semibold transition disabled:opacity-50"
                style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border, color: currentTheme.accent }}
              >
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>

              <label className="flex items-center gap-1.5 rounded-xl border px-3 py-1.5 sm:py-2 shadow-sm" style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
                <SlidersHorizontal size={14} style={{ color: currentTheme.accent }} />
                <span className="sr-only">Sort items</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="bg-transparent text-xs outline-none cursor-pointer"
                  style={{ color: currentTheme.text }}
                >
                  <option value="featured" style={{ backgroundColor: currentTheme.card }}>Featured First</option>
                  <option value="price-low" style={{ backgroundColor: currentTheme.card }}>Price: Low to High</option>
                  <option value="price-high" style={{ backgroundColor: currentTheme.card }}>Price: High to Low</option>
                  <option value="name" style={{ backgroundColor: currentTheme.card }}>Name: A to Z</option>
                </select>
              </label>
            </div>
          </div>

          {/* STATIC CIRCULAR CATEGORY SHOWCASE SECTION */}
          {!loading && !error && (
            <div className="mb-8">
              <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 scrollbar-none justify-start sm:justify-center">
                {STATIC_CATEGORIES.map(({ name, image }) => {
                  const isSelected = category === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setCategory(name)}
                      className="group flex flex-col items-center gap-2 shrink-0 focus:outline-none"
                    >
                      <div 
                        className={`relative h-20 w-20 sm:h-24 sm:w-24 rounded-full p-1 transition-all duration-300 ${
                          isSelected 
                            ? "scale-105 shadow-lg ring-2 ring-offset-2" 
                            : "opacity-80 hover:opacity-100 hover:scale-102"
                        }`}
                        style={{ 
                          border: `2px solid ${isSelected ? currentTheme.accent : currentTheme.border}`,
                          backgroundColor: currentTheme.card
                        }}
                      >
                        <div className="h-full w-full overflow-hidden rounded-full bg-black/20">
                          <LoadedImage
                            src={image}
                            alt={name}
                            containerClassName="h-full w-full"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            accentColor={currentTheme.accent}
                          />
                        </div>
                      </div>
                      <span 
                        className={`text-xs font-bold tracking-wide transition-colors ${
                          isSelected ? "font-extrabold" : "opacity-80"
                        }`}
                        style={{ color: isSelected ? currentTheme.accent : currentTheme.text }}
                      >
                        {name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div role="alert" className="flex flex-col items-center gap-3 border border-red-900/50 rounded-2xl p-6 my-6 text-center bg-red-950/20 text-red-300">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle size={20} />
                <p className="text-sm">{error}</p>
              </div>
              <button
                type="button"
                onClick={fetchProducts}
                className="rounded-xl px-4 py-2 text-xs font-bold text-black transition"
                style={{ backgroundColor: currentTheme.accent }}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-2 gap-2.5 min-[480px]:gap-3 sm:gap-5 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="animate-pulse p-3 rounded-2xl border" style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
                  <div className="aspect-[4/5] rounded-xl opacity-20 bg-current" />
                  <div className="mt-3 h-4 w-3/4 rounded opacity-20 bg-current" />
                  <div className="mt-2 h-4 w-1/3 rounded opacity-20 bg-current" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="border rounded-3xl py-12 text-center" style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
              <Package size={40} className="mx-auto mb-3 animate-bounce" style={{ color: currentTheme.accent }} strokeWidth={1.4} />
              <h3 className="text-base font-bold">No jewelry found</h3>
              <p className="mt-1 text-xs opacity-70">
                Try searching with different terms or reset your filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-black shadow-md transition"
                style={{ backgroundColor: currentTheme.accent }}
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Product Grid */}
          {!loading && !error && paginatedProducts.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-2.5 min-[480px]:gap-3 sm:gap-5 lg:grid-cols-4">
                {paginatedProducts.map((product, index) => {
                  const image = getImage(product);
                  const title = product.title ?? product.name ?? "Untitled product";
                  const price = getPrice(product);
                  const productCategory =
                    typeof product.category === "object"
                      ? product.category?.name
                      : product.category;

                  return (
                    <article
                      key={product._id ?? product.id ?? `${title}-${index}`}
                      onClick={() => handleOpenModal(product)}
                      className="group cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl p-2 sm:p-3.5 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                      style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-lg sm:rounded-xl bg-black/20">
                        <LoadedImage
                          src={image}
                          alt={title}
                          containerClassName="h-full w-full"
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          accentColor={currentTheme.accent}
                        />

                        {product.isFeatured && (
                          <span 
                            className="absolute left-2 top-2 rounded-md px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-black shadow"
                            style={{ backgroundColor: currentTheme.accent }}
                          >
                            Featured
                          </span>
                        )}

                        {productCategory && (
                          <span className="absolute right-2 top-2 max-w-[70%] truncate rounded-full bg-black/60 px-2 py-0.5 text-[9px] sm:text-[10px] font-medium backdrop-blur-md border border-white/10" style={{ color: currentTheme.muted }}>
                            {productCategory}
                          </span>
                        )}
                      </div>

                      <div className="pt-2.5 sm:pt-3.5 px-0.5">
                        <h3 className="truncate text-xs sm:text-sm font-semibold transition-colors group-hover:opacity-80">
                          {title}
                        </h3>

                        <div className="mt-1 sm:mt-2 flex items-baseline justify-between gap-1">
                          <p className="text-xs sm:text-base font-black tracking-tight" style={{ color: currentTheme.accent }}>
                            {formatPrice(price)}
                          </p>
                          {product.stock !== undefined && (
                            <span className={`text-[9px] sm:text-[10px] font-semibold ${product.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}
                            </span>
                          )}
                        </div>

                        {product.platingType && (
                          <p className="mt-1 truncate text-[10px] sm:text-[11px] opacity-60 font-medium">
                            {product.platingType} {product.weightGrams ? `• ${product.weightGrams}g` : ''}
                          </p>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 rounded-xl border px-3 sm:px-4 py-2 text-xs font-bold transition disabled:opacity-40"
                    style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}
                  >
                    <ChevronLeft size={15} />
                    Prev
                  </button>

                  <div className="flex items-center gap-1 px-1">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`h-8 w-8 sm:h-9 sm:w-9 rounded-xl text-xs font-bold transition`}
                          style={{
                            backgroundColor: currentPage === pageNum ? currentTheme.accent : currentTheme.card,
                            color: currentPage === pageNum ? "#000000" : currentTheme.text,
                            borderColor: currentTheme.border
                          }}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 rounded-xl border px-3 sm:px-4 py-2 text-xs font-bold transition disabled:opacity-40"
                    style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}
                  >
                    Next
                    <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* STANDALONE ALL-PRODUCTS IMAGE CAROUSEL (POSITIONED DIRECTLY ABOVE FOOTER) */}
        {!loading && allProductImages.length > 0 && (
          <section className="mx-auto max-w-7xl px-3 py-10 sm:px-6 sm:py-14">
            <div className="mb-6 text-center">
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em]" style={{ color: currentTheme.accent }}>
                ✦ Masterpiece Showcase ✦
              </p>
              <h3 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight">
                Explore All Collection Gallery
              </h3>
            </div>

            <div 
              className="relative overflow-hidden rounded-3xl border shadow-2xl max-w-5xl mx-auto"
              style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}
            >
              <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-black/40 group">
                <div 
                  className="flex h-full w-full transition-transform duration-700 ease-out"
                  style={{ transform: `translateX(-${footerGalleryIndex * 100}%)` }}
                >
                  {allProductImages.map((item, idx) => (
                    <div key={idx} className="relative h-full w-full shrink-0 grow-0 flex items-center justify-center">
                      <LoadedImage
                        src={item.url}
                        alt={item.title}
                        containerClassName="h-full w-full"
                        className="h-full w-full object-cover filter brightness-95"
                        accentColor={currentTheme.accent}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 sm:p-8">
                        <span className="text-sm sm:text-lg font-bold text-white drop-shadow-md">
                          {item.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Carousel Controllers */}
                {allProductImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setFooterGalleryIndex((prev) => (prev === 0 ? allProductImages.length - 1 : prev - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-2.5 bg-black/60 text-white backdrop-blur-md opacity-70 group-hover:opacity-100 transition hover:bg-black/80"
                      aria-label="Previous gallery image"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setFooterGalleryIndex((prev) => (prev === allProductImages.length - 1 ? 0 : prev + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2.5 bg-black/60 text-white backdrop-blur-md opacity-70 group-hover:opacity-100 transition hover:bg-black/80"
                      aria-label="Next gallery image"
                    >
                      <ChevronRight size={20} />
                    </button>

                    <div className="absolute top-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs font-bold backdrop-blur-md text-white border border-white/10">
                      {footerGalleryIndex + 1} / {allProductImages.length}
                    </div>
                  </>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {allProductImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto p-4 scrollbar-none justify-center bg-black/20">
                  {allProductImages.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFooterGalleryIndex(idx)}
                      className={`relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                        footerGalleryIndex === idx ? "scale-105 shadow-md ring-2 ring-offset-1" : "opacity-50 hover:opacity-100"
                      }`}
                      style={{ borderColor: footerGalleryIndex === idx ? currentTheme.accent : currentTheme.border }}
                    >
                      <LoadedImage
                        src={item.url}
                        alt=""
                        containerClassName="h-full w-full"
                        className="h-full w-full object-cover"
                        accentColor={currentTheme.accent}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t transition-colors duration-300" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-8">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-4">
            <div className="space-y-3 md:col-span-1">
              <span className="text-base font-black tracking-wider" style={{ color: currentTheme.accent }}>Laxmi Sri Art Jewellers</span>
              <p className="text-xs leading-relaxed opacity-70">
                Crafting timeless elegance with premium diamond collections, gemstone chokers, and handcrafted luxury designs.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">Quick Links</h4>
              <ul className="space-y-2 text-xs opacity-70">
                <li><a href="#" className="transition hover:opacity-100">Shop All Collections</a></li>
                <li><a href="#shop-products" className="transition hover:opacity-100">Diamond Chokers</a></li>
                <li><a href="#shop-products" className="transition hover:opacity-100">Gemstone Harams</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">Customer Care</h4>
              <ul className="space-y-2 text-xs opacity-70">
                <li><span className="cursor-pointer transition hover:opacity-100">Insured Shipping & Delivery</span></li>
                <li><span className="cursor-pointer transition hover:opacity-100">Returns & Exchange</span></li>
                <li><span className="cursor-pointer transition hover:opacity-100">Luxury Jewelry Care Guide</span></li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">Contact Boutique</h4>
              <div className="flex items-start gap-2 text-xs opacity-70">
                <MapPin size={15} style={{ color: currentTheme.accent }} className="shrink-0 mt-0.5" />
                <span>Boutique Hub, Main Bazaar, Hyderabad</span>
              </div>
              <div className="flex items-center gap-2 text-xs opacity-70">
                <Phone size={15} style={{ color: currentTheme.accent }} className="shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-xs opacity-70">
                <Mail size={15} style={{ color: currentTheme.accent }} className="shrink-0" />
                <span>support@laxmisrijewels.com</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t pt-5 text-xs opacity-60" style={{ borderColor: currentTheme.border }}>
            <p>© {new Date().getFullYear()} Laxmi Sri Art Jewellers. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with <Heart size={12} style={{ color: currentTheme.accent, fill: currentTheme.accent }} /> for High-End Connoisseurs
            </p>
          </div>
        </div>
      </footer>

      {/* PRODUCT DETAILS MODAL WITH CAROUSEL */}
      {selectedProduct && (() => {
        const productImages = Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0
          ? selectedProduct.images
          : [getImage(selectedProduct)].filter(Boolean);
        const prodPrice = getPrice(selectedProduct);
        const prodTitle = selectedProduct.title ?? selectedProduct.name ?? "Product Details";
        const prodCategory = typeof selectedProduct.category === "object" ? selectedProduct.category?.name : selectedProduct.category;

        return (
          <div 
            onClick={handleCloseModal}
            className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/85 p-0 backdrop-blur-md sm:items-center sm:p-4"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[94dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border shadow-2xl transition-colors duration-300 sm:max-h-[88vh] sm:rounded-2xl"
              style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}
            >
              <div className="flex items-center justify-between border-b px-4 sm:px-6 py-3.5 sm:py-4 shrink-0" style={{ borderColor: currentTheme.border }}>
                <div>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest" style={{ color: currentTheme.accent }}>
                    {prodCategory || "Product Details"}
                  </span>
                  <h2 className="text-sm sm:text-lg font-bold truncate max-w-[260px] sm:max-w-md">
                    {prodTitle}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-full p-2 transition opacity-80 hover:opacity-100"
                  style={{ backgroundColor: currentTheme.surface }}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 overflow-y-auto flex-1">
                {/* PRODUCT IMAGES CAROUSEL SECTION */}
                <div className="flex flex-col gap-3">
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-black/20 border group" style={{ borderColor: currentTheme.border }}>
                    <div 
                      className="flex h-full w-full transition-transform duration-500 ease-out"
                      style={{ transform: `translateX(-${activeImageIndex * 100}%)` }}
                    >
                      {productImages.map((img, idx) => (
                        <div key={idx} className="h-full w-full shrink-0 grow-0">
                          <LoadedImage
                            src={img}
                            alt={`${prodTitle} - Slide ${idx + 1}`}
                            containerClassName="h-full w-full"
                            className="h-full w-full object-cover"
                            accentColor={currentTheme.accent}
                          />
                        </div>
                      ))}
                    </div>

                    {productImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
                          }}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 rounded-full p-2 bg-black/50 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                          aria-label="Previous slide"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
                          }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-2 bg-black/50 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                          aria-label="Next slide"
                        >
                          <ChevronRight size={18} />
                        </button>

                        <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold backdrop-blur-md text-white border border-white/10">
                          {activeImageIndex + 1} / {productImages.length}
                        </div>
                      </>
                    )}
                  </div>

                  {productImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                      {productImages.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                            activeImageIndex === idx ? "scale-105 shadow-md" : "opacity-60 hover:opacity-100"
                          }`}
                          style={{ borderColor: activeImageIndex === idx ? currentTheme.accent : currentTheme.border }}
                        >
                          <LoadedImage
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            containerClassName="h-full w-full"
                            className="h-full w-full object-cover"
                            accentColor={currentTheme.accent}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-between gap-4 sm:gap-5">
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <h3 className="text-lg sm:text-2xl font-extrabold">
                        {prodTitle}
                      </h3>
                      <div className="mt-1.5 sm:mt-2 flex items-baseline gap-3">
                        <span className="text-xl sm:text-2xl font-black" style={{ color: currentTheme.accent }}>
                          {formatPrice(prodPrice)}
                        </span>
                        <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                          Inclusive of all taxes
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.stock > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950 border border-emerald-800 px-3 py-1 text-xs font-semibold text-emerald-300">
                          <Check size={13} /> In Stock ({selectedProduct.stock} left)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-950 border border-red-800 px-3 py-1 text-xs font-semibold text-red-300">
                          Out of stock
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 rounded-2xl p-3.5 sm:p-4 text-xs border" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                      <div>
                        <span className="opacity-70">Plating Type:</span>
                        <p className="font-semibold mt-0.5">{selectedProduct.platingType || "Standard"}</p>
                      </div>
                      <div>
                        <span className="opacity-70">Weight:</span>
                        <p className="font-semibold mt-0.5">{selectedProduct.weightGrams ? `${selectedProduct.weightGrams}g` : "N/A"}</p>
                      </div>
                      <div>
                        <span className="opacity-70">Stone Details:</span>
                        <p className="font-semibold mt-0.5">{selectedProduct.stoneDetails || "None"}</p>
                      </div>
                      <div>
                        <span className="opacity-70">Category:</span>
                        <p className="font-semibold mt-0.5">{prodCategory || "General"}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">Product Description</h4>
                      <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                        {selectedProduct.description || "No description provided."}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t" style={{ borderColor: currentTheme.border }}>
                      <div className="flex flex-col items-center text-center p-2 rounded-xl border" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                        <ShieldCheck size={16} style={{ color: currentTheme.accent }} className="mb-1" />
                        <span className="text-[10px] font-medium opacity-70">100% Certified</span>
                      </div>
                      <div className="flex flex-col items-center text-center p-2 rounded-xl border" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                        <Truck size={16} style={{ color: currentTheme.accent }} className="mb-1" />
                        <span className="text-[10px] font-medium opacity-70">Insured Shipping</span>
                      </div>
                      <div className="flex flex-col items-center text-center p-2 rounded-xl border" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                        <RotateCcw size={16} style={{ color: currentTheme.accent }} className="mb-1" />
                        <span className="text-[10px] font-medium opacity-70">Easy Returns</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3 sm:pt-4 border-t shrink-0" style={{ borderColor: currentTheme.border }}>
                    <button
                      type="button"
                      onClick={() => alert(`Added "${prodTitle}" to cart!`)}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold text-black shadow-lg transition hover:brightness-110"
                      style={{ backgroundColor: currentTheme.accent }}
                    >
                      <ShoppingBag size={17} />
                      Add to Cart
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="rounded-xl border px-4 sm:px-5 py-3 text-xs sm:text-sm font-medium transition opacity-90 hover:opacity-100"
                      style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* BANNER ANIMATIONS */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes imageEnter {
          from { opacity: 0; transform: scale(1.15); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes contentSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        .animate-imageEnter {
          animation: imageEnter 1.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .animate-contentSlideUp {
          animation: contentSlideUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .delay-300 { animation-delay: 300ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-900 { animation-delay: 900ms; }
        .delay-1000 { animation-delay: 1000ms; }

        @media (max-width: 639px) {
          #shop-products { scroll-margin-top: 76px; }
          button, a, select { -webkit-tap-highlight-color: transparent; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}