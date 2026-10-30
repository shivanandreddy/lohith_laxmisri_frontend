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

const ITEMS_PER_PAGE = 8;

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

// Reusable Image Component with smooth loading skeleton effect & reveal animation
function LoadedImage({ src, alt, className = "", containerClassName = "" }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Reset loading state if src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-slate-900 ${containerClassName}`}>
      {/* Skeleton Shimmer Loader while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-[length:200%_100%]" />
      )}

      {/* Actual Image */}
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
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-slate-500">
          <Package size={30} strokeWidth={1.2} />
          <span className="text-[10px]">No image</span>
        </div>
      )}
    </div>
  );
}

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Mobile Menu & Search Toggle States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Modal State for Product Details view
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fetch Products from Backend API
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

  // Categories derived dynamically from backend data
  const categories = useMemo(() => {
    const values = products
      .map((product) =>
        typeof product.category === "object"
          ? product.category?.name
          : product.category
      )
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [products]);

  // Filtering & Sorting Logic
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

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, sort]);

  // Pagination calculation
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
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-[#F9FAFB] selection:bg-[#D4AF37] selection:text-black">
      
      {/* LUXURY NAVBAR */}
      <header className="sticky top-0 z-40 w-full bg-[#0B0F19]/95 backdrop-blur-xl border-b border-[#D4AF37]/20 shadow-2xl">
        <div className="h-1 w-full  from-[#D4AF37] via-[#E8B4B8] to-[#D4AF37]" />

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8 gap-4">
          
          {/* Logo & Brand Identity */}
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
            <img 
              src="/logo.png" 
              alt="Laxmi Sri Art Jewellers Logo" 
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-sm sm:text-xl font-black text-[#D4AF37] truncate max-w-[160px] sm:max-w-none">
                Laxmi Sri Art Jewellers
              </span>
              <span className="hidden sm:block text-[10px] font-bold tracking-[0.25em] text-[#E8B4B8] uppercase mt-0.5">
                High-End Boutique & Diamond Collection
              </span>
            </div>
          </a>

          {/* Desktop Contact & Store Locator */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300">
            <button
              type="button"
              onClick={() => alert("Store Location: Main Bazaar, Hyderabad")}
              className="flex items-center gap-2 hover:text-[#D4AF37] transition"
            >
              <MapPin size={16} className="text-[#D4AF37]" />
              <span>Hyderabad Boutique</span>
            </button>
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 hover:text-[#D4AF37] transition"
            >
              <Phone size={16} className="text-[#D4AF37]" />
              <span>+91 98765 43210</span>
            </a>
          </div>

          {/* Desktop Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative group">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search diamond harams, gemstone chokers..."
                className="w-full rounded-full border border-[#D4AF37]/30 bg-[#1A1A1A] py-2.5 pl-4 pr-11 text-xs text-[#F9FAFB] placeholder-slate-400 outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 shadow-inner"
              />
              <button
                type="button"
                aria-label="Search"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-[#D4AF37] transition"
              >
                <Search size={16} />
              </button>
            </div>
          </div>

          {/* Mobile Actions: Search Toggle & Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="p-2 rounded-xl bg-[#1A1A1A] text-[#D4AF37] hover:bg-slate-800 transition"
              aria-label="Toggle Search"
            >
              <Search size={18} />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#1A1A1A] text-[#D4AF37] hover:bg-slate-800 transition"
              aria-label="Toggle Menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className="px-4 pb-3 pt-1 md:hidden animate-[fadeIn_0.2s_ease-out]">
            <div className="relative">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search jewelry collections..."
                className="w-full rounded-full border border-[#D4AF37]/50 bg-[#1A1A1A] py-2.5 pl-4 pr-10 text-xs text-[#F9FAFB] placeholder-slate-400 outline-none shadow-md"
                autoFocus
              />
              <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
            </div>
          </div>
        )}

        {/* Collapsible Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-800 bg-[#1A1A1A] px-4 py-4 space-y-3 md:hidden animate-[fadeIn_0.2s_ease-out]">
            <div className="flex flex-col gap-2.5 text-xs text-slate-300">
              <button
                type="button"
                onClick={() => {
                  alert("Store Location: Main Bazaar, Hyderabad");
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2.5 py-1.5 hover:text-[#D4AF37] text-left"
              >
                <MapPin size={16} className="text-[#D4AF37]" />
                <span>Hyderabad Boutique</span>
              </button>
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2.5 py-1.5 hover:text-[#D4AF37]"
              >
                <Phone size={16} className="text-[#D4AF37]" />
                <span>+91 98765 43210</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1">
        
        {/* HERO BANNER WITH VIDEO */}
        <section className="mx-auto max-w-7xl px-4 pt-4 sm:pt-6 sm:px-8">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl bg-[#1A1A1A] border border-[#D4AF37]/30">
            <div className="relative w-full aspect-[16/9] sm:aspect-[3/1] overflow-hidden flex items-center justify-center">
              
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover opacity-50 filter brightness-90"
              >
                <source 
                  src="https://assets.mixkit.co/videos/preview/mixkit-hands-wearing-gold-bracelets-and-rings-41583-large.mp4" 
                  type="video/mp4" 
                />
                Your browser does not support the video tag.
              </video>

              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/85" />

              <div className="relative z-10 px-4 py-8 sm:py-16 text-center max-w-3xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#D4AF37] mb-3 sm:mb-4 shadow-lg backdrop-blur-md">
                  <Sparkles size={13} /> Bridal & Evening Collections
                </span>
                <h1 className="text-xl sm:text-5xl font-extrabold tracking-tight text-[#F9FAFB] leading-tight drop-shadow-md">
                  Exquisite Diamond & <span className="text-[#D4AF37]">Gemstone Masterpieces</span>
                </h1>
                <p className="mt-2 sm:mt-4 text-[11px] sm:text-sm text-slate-200 max-w-lg mx-auto leading-relaxed drop-shadow">
                  Elevate your presence with stunning rose-gold accents, hand-cut gemstones, and premier traditional jewelry collections.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCTS CATALOG SECTION */}
        <section id="shop-products" className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
          
          {/* Header & Sorting Bar */}
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] flex items-center gap-1.5">
                <Award size={13} /> Curated Boutique Showcase
              </p>
              <h2 className="mt-1 text-xl sm:text-3xl font-black tracking-tight text-[#F9FAFB]">
                Exclusive Jewelry Gallery
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                {loading ? "Loading products..." : `Showing ${filteredProducts.length} luxury items`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchProducts}
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#D4AF37]/30 bg-[#1A1A1A] px-3 py-1.5 sm:py-2 text-xs font-semibold text-[#D4AF37] hover:bg-slate-800 transition disabled:opacity-50"
              >
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>

              <label className="flex items-center gap-1.5 rounded-xl border border-[#D4AF37]/30 bg-[#1A1A1A] px-3 py-1.5 sm:py-2 shadow-sm">
                <SlidersHorizontal size={14} className="text-[#D4AF37]" />
                <span className="sr-only">Sort items</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="bg-transparent text-xs text-[#F9FAFB] outline-none cursor-pointer"
                >
                  <option value="featured" className="bg-[#1A1A1A]">Featured First</option>
                  <option value="price-low" className="bg-[#1A1A1A]">Price: Low to High</option>
                  <option value="price-high" className="bg-[#1A1A1A]">Price: High to Low</option>
                  <option value="name" className="bg-[#1A1A1A]">Name: A to Z</option>
                </select>
              </label>
            </div>
          </div>

          {/* Category Filter Pills */}
          {!loading && !error && categories.length > 1 && (
            <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
                    category === item
                      ? "border-[#D4AF37] bg-gradient-to-r from-[#D4AF37] to-[#E8B4B8] text-black shadow-md shadow-[#D4AF37]/20 font-bold"
                      : "border-slate-800 bg-[#1A1A1A] text-slate-300 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
                  }`}
                >
                  {item}
                </button>
              ))}
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
                className="rounded-xl bg-[#D4AF37] px-4 py-2 text-xs font-bold text-black hover:bg-[#E8B4B8] transition"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="animate-pulse bg-[#1A1A1A] p-3 rounded-2xl border border-slate-800">
                  <div className="aspect-[4/5] rounded-xl bg-slate-800" />
                  <div className="mt-3 h-4 w-3/4 rounded bg-slate-800" />
                  <div className="mt-2 h-4 w-1/3 rounded bg-slate-800" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="border border-slate-800 rounded-3xl py-12 text-center bg-[#1A1A1A]/50">
              <Package size={40} className="mx-auto mb-3 text-[#D4AF37] animate-bounce" strokeWidth={1.4} />
              <h3 className="text-base font-bold text-[#F9FAFB]">No jewelry found</h3>
              <p className="mt-1 text-xs text-slate-400">
                Try searching with different terms or reset your filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2 text-xs font-bold text-black shadow-md hover:bg-[#E8B4B8] transition"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Product Grid */}
          {!loading && !error && paginatedProducts.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
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
                      className="group cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl bg-[#1A1A1A] p-2 sm:p-3.5 border border-slate-800 transition-all duration-300 hover:border-[#D4AF37]/60 hover:shadow-xl hover:-translate-y-1"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-lg sm:rounded-xl bg-slate-950">
                        <LoadedImage
                          src={image}
                          alt={title}
                          containerClassName="h-full w-full"
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />

                        {product.isFeatured && (
                          <span className="absolute left-2 top-2 rounded-md bg-[#D4AF37] px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-black shadow">
                            Featured
                          </span>
                        )}

                        {productCategory && (
                          <span className="absolute right-2 top-2 max-w-[70%] truncate rounded-full bg-black/70 px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-[#E8B4B8] backdrop-blur-md border border-[#D4AF37]/20">
                            {productCategory}
                          </span>
                        )}
                      </div>

                      <div className="pt-2.5 sm:pt-3.5 px-0.5">
                        <h3 className="truncate text-xs sm:text-sm font-semibold text-[#F9FAFB] group-hover:text-[#D4AF37] transition-colors">
                          {title}
                        </h3>

                        <div className="mt-1 sm:mt-2 flex items-baseline justify-between gap-1">
                          <p className="text-xs sm:text-base font-black tracking-tight text-white">
                            {formatPrice(price)}
                          </p>
                          {product.stock !== undefined && (
                            <span className={`text-[9px] sm:text-[10px] font-semibold ${product.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}
                            </span>
                          )}
                        </div>

                        {product.platingType && (
                          <p className="mt-1 truncate text-[10px] sm:text-[11px] text-slate-400 font-medium">
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
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-800 bg-[#1A1A1A] px-3 sm:px-4 py-2 text-xs font-bold transition hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:opacity-40"
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
                          className={`h-8 w-8 sm:h-9 sm:w-9 rounded-xl text-xs font-bold transition ${
                            currentPage === pageNum
                              ? "bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20"
                              : "border border-slate-800 bg-[#1A1A1A] text-slate-300 hover:bg-slate-800"
                          }`}
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
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-800 bg-[#1A1A1A] px-3 sm:px-4 py-2 text-xs font-bold transition hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:opacity-40"
                  >
                    Next
                    <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-[#1A1A1A]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-8">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-4">
            <div className="space-y-3 md:col-span-1">
              <span className="text-base font-black tracking-wider text-[#D4AF37]">Laxmi Sri Art Jewellers</span>
              <p className="text-xs leading-relaxed text-slate-400">
                Crafting timeless elegance with premium diamond collections, gemstone chokers, and handcrafted luxury designs.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F9FAFB] mb-3 sm:mb-4">Quick Links</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#" className="hover:text-[#D4AF37] transition">Shop All Collections</a></li>
                <li><a href="#shop-products" className="hover:text-[#D4AF37] transition">Diamond Chokers</a></li>
                <li><a href="#shop-products" className="hover:text-[#D4AF37] transition">Gemstone Harams</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F9FAFB] mb-3 sm:mb-4">Customer Care</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><span className="hover:text-[#D4AF37] cursor-pointer">Insured Shipping & Delivery</span></li>
                <li><span className="hover:text-[#D4AF37] cursor-pointer">Returns & Exchange</span></li>
                <li><span className="hover:text-[#D4AF37] cursor-pointer">Luxury Jewelry Care Guide</span></li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F9FAFB] mb-3 sm:mb-4">Contact Boutique</h4>
              <div className="flex items-start gap-2 text-xs text-slate-400">
                <MapPin size={15} className="text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Boutique Hub, Main Bazaar, Hyderabad</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Phone size={15} className="text-[#D4AF37] shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Mail size={15} className="text-[#D4AF37] shrink-0" />
                <span>support@laxmisrijewels.com</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 pt-5 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Laxmi Sri Art Jewellers. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with <Heart size={12} className="text-[#E8B4B8] fill-[#E8B4B8]" /> for High-End Connoisseurs
            </p>
          </div>
        </div>
      </footer>

      {/* PRODUCT DETAILS MODAL */}
      {selectedProduct && (() => {
        const productImages = Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0
          ? selectedProduct.images
          : [getImage(selectedProduct)].filter(Boolean);
        const currentImg = productImages[activeImageIndex] || productImages[0];
        const prodPrice = getPrice(selectedProduct);
        const prodTitle = selectedProduct.title ?? selectedProduct.name ?? "Product Details";
        const prodCategory = typeof selectedProduct.category === "object" ? selectedProduct.category?.name : selectedProduct.category;

        return (
          <div 
            onClick={handleCloseModal}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 overflow-y-auto"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl rounded-t-3xl sm:rounded-2xl bg-[#1A1A1A] border border-slate-800 shadow-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-800 px-4 sm:px-6 py-3.5 sm:py-4 shrink-0">
                <div>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                    {prodCategory || "Product Details"}
                  </span>
                  <h2 className="text-sm sm:text-lg font-bold truncate max-w-[260px] sm:max-w-md text-[#F9FAFB]">
                    {prodTitle}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-full p-2 bg-slate-800 hover:bg-slate-700 transition text-slate-300"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 overflow-y-auto flex-1">
                <div className="flex flex-col gap-3">
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-800">
                    <LoadedImage
                      src={currentImg}
                      alt={prodTitle}
                      containerClassName="h-full w-full"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Thumbnail Row */}
                  {productImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                      {productImages.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                            activeImageIndex === idx ? "border-[#D4AF37] scale-95" : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                        >
                          <LoadedImage
                            src={img}
                            alt=""
                            containerClassName="h-full w-full"
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-between gap-4 sm:gap-5">
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <h3 className="text-lg sm:text-2xl font-extrabold text-[#F9FAFB]">
                        {prodTitle}
                      </h3>
                      <div className="mt-1.5 sm:mt-2 flex items-baseline gap-3">
                        <span className="text-xl sm:text-2xl font-black text-[#D4AF37]">
                          {formatPrice(prodPrice)}
                        </span>
                        <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/50 border border-emerald-800/50 px-2 py-0.5 rounded">
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

                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 rounded-2xl bg-slate-950 p-3.5 sm:p-4 text-xs border border-slate-800">
                      <div>
                        <span className="text-slate-400">Plating Type:</span>
                        <p className="font-semibold mt-0.5 text-white">{selectedProduct.platingType || "Standard"}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Weight:</span>
                        <p className="font-semibold mt-0.5 text-white">{selectedProduct.weightGrams ? `${selectedProduct.weightGrams}g` : "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Stone Details:</span>
                        <p className="font-semibold mt-0.5 text-white">{selectedProduct.stoneDetails || "None"}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Category:</span>
                        <p className="font-semibold mt-0.5 text-white">{prodCategory || "General"}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Product Description</h4>
                      <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
                        {selectedProduct.description || "No description provided."}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                      <div className="flex flex-col items-center text-center p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <ShieldCheck size={16} className="text-[#D4AF37] mb-1" />
                        <span className="text-[10px] font-medium text-slate-400">100% Certified</span>
                      </div>
                      <div className="flex flex-col items-center text-center p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <Truck size={16} className="text-[#D4AF37] mb-1" />
                        <span className="text-[10px] font-medium text-slate-400">Insured Shipping</span>
                      </div>
                      <div className="flex flex-col items-center text-center p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <RotateCcw size={16} className="text-[#D4AF37] mb-1" />
                        <span className="text-[10px] font-medium text-slate-400">Easy Returns</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3 sm:pt-4 border-t border-slate-800 shrink-0">
                    <button
                      type="button"
                      onClick={() => alert(`Added "${prodTitle}" to cart!`)}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E8B4B8] px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold text-black shadow-lg shadow-[#D4AF37]/20 transition hover:brightness-110"
                    >
                      <ShoppingBag size={17} />
                      Add to Cart
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="rounded-xl border border-slate-800 bg-slate-800 px-4 sm:px-5 py-3 text-xs sm:text-sm font-medium transition hover:bg-slate-700 text-white"
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
      `}</style>
    </div>
  );
}