import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  ShoppingBag,
  RefreshCw,
  Package,
  AlertCircle,
  SlidersHorizontal,
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Gem,
  Phone,
  Mail,
  MapPin,
  Heart,
  User,
  Menu,
  Coins,
  Globe

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
  return Number.isFinite(price) && price >= 0 ? price : null;
};

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State for Amazon/Flipkart style details view
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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
          "Could not load products."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = products.filter((product) => {
      const productCategory =
        typeof product.category === "object"
          ? product.category?.name
          : product.category;

      const matchesSearch = [
        product.name,
        product.title,
        product.description,
        productCategory,
        product.brand,
        product.sku,
        product.platingType,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      );

      const matchesCategory =
        category === "All" || productCategory === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "price-low") {
      result.sort(
        (a, b) => (getPrice(a) ?? Infinity) - (getPrice(b) ?? Infinity)
      );
    } else if (sort === "price-high") {
      result.sort(
        (a, b) => (getPrice(b) ?? -Infinity) - (getPrice(a) ?? -Infinity)
      );
    } else if (sort === "name") {
      result.sort((a, b) =>
        String(a.name ?? a.title ?? "").localeCompare(
          String(b.name ?? b.title ?? "")
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
    price == null
      ? "Price unavailable"
      : new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 2,
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* TOPBAR (Joyalukkas Style) */}
      <header className="sticky top-0 z-40 w-full bg-white shadow-sm border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        {/* Top Decorative Red Accent Bar */}
        <div className="h-1 w-full" />

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8 gap-4">
          
          {/* Left: Logo & Subtitle */}
          <a href="/shop" className="flex items-center gap-3 shrink-0 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-red-600 text-white shadow-md shadow-amber-600/20 group-hover:scale-105 transition">
              <Gem size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-tight text-red-700 dark:text-red-500 leading-none">
                Laxmi Sri
              </span>
              <span className="text-[10px] font-bold tracking-widest text-slate-600 dark:text-slate-400 mt-1 uppercase">
                World's favourite jeweller
              </span>
            </div>
          </a>

          {/* Center-Left: Store locator & Phone */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <button
              type="button"
              onClick={() => window.alert("Store locator clicked!")}
              className="flex items-center gap-1.5 hover:text-red-700 transition"
            >
              <MapPin size={16} className="text-red-600" />
              <span>Store</span>
            </button>
            <a
              href="tel:+919876543210"
              className="flex items-center gap-1.5 hover:text-red-700 transition"
            >
              <Phone size={16} className="text-red-600" />
              <span>+91 98765 43210</span>
            </a>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search for Jewelry, Necklaces, Bangles..."
                className="w-full rounded-full border border-amber-500/60 bg-white py-2 pl-4 pr-11 text-xs outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/10 dark:border-slate-700 dark:bg-slate-900"
              />
              <button
                type="button"
                aria-label="Search"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-600 transition"
              >
                <Search size={16} />
              </button>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 text-slate-700 dark:text-slate-200">
            {/* Mobile Menu Toggle Icon */}
            <button
              type="button"
              onClick={() => window.alert("Menu clicked!")}
              className="p-1.5 hover:text-red-600 transition lg:hidden"
              aria-label="Open Menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="px-4 pb-3 md:hidden">
          <div className="relative">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search for Jewelry..."
              className="w-full rounded-full border border-amber-500/60 bg-white py-2 pl-4 pr-10 text-xs outline-none dark:border-slate-700 dark:bg-slate-900"
            />
            <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1">
        
        {/* HERO BANNER SECTION */}
        <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-8">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-black border border-amber-500/30">
            <div className="relative w-full aspect-[21/9] sm:aspect-[2.8/1] overflow-hidden">
              <img
  src="/Gemini_Generated_Image_ks0n4bks0n4bks0n.png"
  alt="Laxmi Sri Art Jewellers Women's Arts Collection"
  className="w-full h-full object-cover object-center"
/>
            </div>
          </div>
        </section>

        {/* Shop Section */}
        <section
          id="shop-products"
          className="mx-auto max-w-7xl scroll-mt-6 px-4 py-6 sm:px-8 sm:py-8"
        >
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
                The Collection
              </p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                Explore Products
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {loading
                  ? "Finding products for you..."
                  : `Showing ${filteredProducts.length} results`}
              </p>
            </div>

            <button
              type="button"
              onClick={fetchProducts}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium transition hover:border-red-300 hover:text-red-700 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:text-red-300"
            >
              <RefreshCw
                size={15}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {/* Sort bar */}
          <div className="mb-6 flex justify-end">
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-900">
              <SlidersHorizontal size={16} className="text-slate-500" />
              <span className="sr-only">Sort products</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="min-w-36 bg-transparent py-3 text-sm outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </label>
          </div>

          {/* Category filters */}
          {!loading && !error && categories.length > 1 && (
            <div className="mb-7 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition duration-200 ${
                    category === item
                      ? "border-red-600 bg-red-600 text-white shadow-lg shadow-red-600/20"
                      : "border-slate-200 bg-white text-slate-600 hover:border-red-300 hover:text-red-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-red-300"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          )}

          {/* Error state */}
          {error && (
            <div
              role="alert"
              className="flex flex-col items-start gap-3 border-y border-red-200 py-6 text-red-700 dark:border-red-900 dark:text-red-300"
            >
              <div className="flex items-center gap-2">
                <AlertCircle size={20} />
                <p className="text-sm">{error}</p>
              </div>
              <button
                type="button"
                onClick={fetchProducts}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Try again
              </button>
            </div>
          )}

          {/* Animated loading skeletons */}
          {loading && (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[4/5] rounded-2xl bg-slate-200 dark:bg-slate-800" />
                  <div className="mt-3 h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="mt-2 h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="border-y border-slate-200 py-16 text-center dark:border-slate-800">
              <Package
                size={40}
                className="mx-auto mb-4 text-slate-400"
                strokeWidth={1.4}
              />
              <h3 className="text-lg font-semibold">No products found</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Try another search or choose a different category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
                className="mt-4 text-sm font-semibold text-red-600 hover:underline dark:text-red-400"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Product grid */}
          {!loading && !error && paginatedProducts.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                {paginatedProducts.map((product, index) => {
                  const image = getImage(product);
                  const name = product.name ?? product.title ?? "Untitled product";
                  const price = getPrice(product);
                  const productCategory =
                    typeof product.category === "object"
                      ? product.category?.name
                      : product.category;

                  return (
                    <article
                      key={product._id ?? product.id ?? `${name}-${index}`}
                      onClick={() => handleOpenModal(product)}
                      className="shop-product group cursor-pointer overflow-hidden rounded-2xl bg-white p-2 sm:p-3 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-950">
                        {image ? (
                          <img
                            src={image}
                            alt={name}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                            <Package size={32} strokeWidth={1.2} />
                            <span className="text-[10px]">No image</span>
                          </div>
                        )}

                        {product.isFeatured && (
                          <span className="absolute left-2 top-2 rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                            Featured
                          </span>
                        )}

                        {productCategory && (
                          <span className="absolute right-2 top-2 max-w-[70%] truncate rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                            {productCategory}
                          </span>
                        )}
                      </div>

                      <div className="pt-3">
                        <h3 className="truncate text-xs sm:text-sm font-semibold transition-colors group-hover:text-red-600 dark:group-hover:text-red-400">
                          {name}
                        </h3>

                        <div className="mt-1.5 flex items-baseline justify-between gap-1">
                          <p className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white">
                            {formatPrice(price)}
                          </p>
                          {product.stock !== undefined && (
                            <span className={`text-[10px] font-medium ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              {product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}
                            </span>
                          )}
                        </div>

                        {product.platingType && (
                          <p className="mt-1 truncate text-[11px] text-slate-500 dark:text-slate-400">
                            {product.platingType} {product.weightGrams ? `• ${product.weightGrams}g` : ''}
                          </p>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition hover:border-red-300 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <ChevronLeft size={16} />
                    Prev
                  </button>

                  <div className="flex items-center gap-1 px-2">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => setCurrentPage(pageNum)}
                            className={`h-9 w-9 rounded-xl text-sm font-semibold transition ${
                              currentPage === pageNum
                                ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                                : "border border-slate-200 bg-white hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === currentPage - 2 ||
                        pageNum === currentPage + 2
                      ) {
                        return <span key={pageNum} className="px-1 text-slate-400">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition hover:border-red-300 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Brand Info */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-700 text-white shadow-md">
                  <Gem size={18} />
                </div>
                <span className="text-base font-black tracking-tight">Laxmi Sri Jewels</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Crafting timeless elegance with premium 1 gram gold plating, American diamonds, and handcrafted traditional designs.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Quick Links</h4>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <li><a href="/shop" className="hover:text-red-600 dark:hover:text-red-400 transition">Shop All Collections</a></li>
                <li><a href="#shop-products" className="hover:text-red-600 dark:hover:text-red-400 transition">Necklaces & Sets</a></li>
                <li><a href="#shop-products" className="hover:text-red-600 dark:hover:text-red-400 transition">Bangles & Earrings</a></li>
                <li><a href="/login" className="hover:text-red-600 dark:hover:text-red-400 transition">Admin Portal</a></li>
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Customer Care</h4>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <li><span className="hover:text-red-600 cursor-pointer">Shipping & Delivery</span></li>
                <li><span className="hover:text-red-600 cursor-pointer">Returns & Exchange</span></li>
                <li><span className="hover:text-red-600 cursor-pointer">Jewelry Care Guide</span></li>
                <li><span className="hover:text-red-600 cursor-pointer">Terms & Conditions</span></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Contact Us</h4>
              <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                <MapPin size={16} className="text-red-600 shrink-0 mt-0.5" />
                <span>Jewelry Hub, Main Bazaar, India</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                <Phone size={16} className="text-red-600 shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                <Mail size={16} className="text-red-600 shrink-0" />
                <span>support@laxmisrijewels.com</span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <p>© {new Date().getFullYear()} Laxmi Sri Jewels. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with <Heart size={13} className="text-red-500 fill-red-500" /> for Jewelry Connoisseurs
            </p>
          </div>
        </div>
      </footer>

      {/* Flipkart / Amazon Style Product Details Modal */}
      {selectedProduct && (() => {
        const productImages = Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0
          ? selectedProduct.images
          : [getImage(selectedProduct)].filter(Boolean);
        const currentImg = productImages[activeImageIndex] || productImages[0];
        const prodPrice = getPrice(selectedProduct);
        const prodCategory = typeof selectedProduct.category === "object" ? selectedProduct.category?.name : selectedProduct.category;

        return (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto animate-[shopFadeIn_200ms_ease_both]">
            <div 
              className="relative w-full max-w-4xl rounded-t-3xl sm:rounded-2xl bg-white dark:bg-slate-900 shadow-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800 shrink-0">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                    {prodCategory || "Product Details"}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold truncate max-w-md">
                    {selectedProduct.title || selectedProduct.name}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-full p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 sm:p-6 overflow-y-auto flex-1">
                {/* Left Column: Image Gallery */}
                <div className="flex flex-col gap-3">
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200 dark:border-slate-800 dark:bg-slate-950">
                    {currentImg ? (
                      <img
                        src={currentImg}
                        alt={selectedProduct.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400">
                        <Package size={48} strokeWidth={1} />
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Row */}
                  {productImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                      {productImages.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                            activeImageIndex === idx ? "border-red-600 scale-95" : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img src={img} alt="" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column: Details & Specs */}
                <div className="flex flex-col justify-between gap-5">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold">
                        {selectedProduct.title || selectedProduct.name}
                      </h3>
                      <div className="mt-2 flex items-baseline gap-3">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">
                          {formatPrice(prodPrice)}
                        </span>
                        <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                          Inclusive of all taxes
                        </span>
                      </div>
                    </div>

                    {/* Stock & Badge Info */}
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.stock > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          <Check size={13} /> In Stock ({selectedProduct.stock} left)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
                          Out of stock
                        </span>
                      )}
                      {selectedProduct.isFeatured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                          Featured Item
                        </span>
                      )}
                    </div>

                    {/* Specifications Grid */}
                    <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 text-xs dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-slate-500">Plating Type:</span>
                        <p className="font-semibold mt-0.5">{selectedProduct.platingType || "Standard"}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Weight:</span>
                        <p className="font-semibold mt-0.5">{selectedProduct.weightGrams ? `${selectedProduct.weightGrams}g` : "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Stone Details:</span>
                        <p className="font-semibold mt-0.5">{selectedProduct.stoneDetails || "None"}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Category:</span>
                        <p className="font-semibold mt-0.5">{prodCategory || "General"}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Product Description</h4>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {selectedProduct.description || "No description provided for this item."}
                      </p>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex flex-col items-center text-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/30">
                        <ShieldCheck size={18} className="text-red-600 mb-1" />
                        <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">100% Certified</span>
                      </div>
                      <div className="flex flex-col items-center text-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/30">
                        <Truck size={18} className="text-red-600 mb-1" />
                        <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">Fast Shipping</span>
                      </div>
                      <div className="flex flex-col items-center text-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/30">
                        <RotateCcw size={18} className="text-red-600 mb-1" />
                        <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">Easy Returns</span>
                      </div>
                    </div>
                  </div>

                  {/* Modal Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        window.alert(`Added "${selectedProduct.title || selectedProduct.name}" to cart!`);
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-700"
                    >
                      <ShoppingBag size={18} />
                      Add to Cart
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
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
        @keyframes shopFadeIn {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

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