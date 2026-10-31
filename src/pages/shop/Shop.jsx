import { useState, useMemo, useEffect, useCallback } from "react";
import { ChevronRight, ChevronLeft, Phone, Mail, MapPin, Heart } from "lucide-react";
import api from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";

import LoadedImage from "./LoadedImage";
import Navbar from "./Navbar";
import HeroBanner from "./HeroBanner";
import ProductGrid from "./ProductGrid";
import CategoryView from "./CategoryView";
import ProductModal from "./ProductModal";
import CategoryCollectionShowcase from "./CategoryCollectionShowcase"; // <--- Imported Hexagon Mosaic Component
import InstagramVideos from "./InstagramVideos";

const ITEMS_PER_PAGE = 8;

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

export default function Shop() {
  const { currentTheme } = useTheme();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null); // null shows category selection grid; string shows CategoryView grid
  const [sort, setSort] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [footerGalleryIndex, setFooterGalleryIndex] = useState(0);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/products");
      const data = response.data;
      const list = Array.isArray(data) ? data : data.products ?? data.data ?? [];

      if (!Array.isArray(list)) {
        throw new Error("Unexpected products response format.");
      }
      setProducts(list);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Could not load products from backend."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categoryShowcases = useMemo(() => {
    const categoriesMap = {};

    products.forEach((prod) => {
      const catName = typeof prod.category === "object" ? prod.category?.name : prod.category;
      if (!catName) return;

      if (!categoriesMap[catName]) {
        categoriesMap[catName] = [];
      }

      if (Array.isArray(prod.images) && prod.images.length > 0) {
        prod.images.forEach((img) => {
          const url = typeof img === "string" ? img : img?.url;
          if (url && !categoriesMap[catName].includes(url)) {
            categoriesMap[catName].push(url);
          }
        });
      } else {
        const singleImg = getImage(prod);
        if (singleImg && !categoriesMap[catName].includes(singleImg)) {
          categoriesMap[catName].push(singleImg);
        }
      }
    });

    return Object.entries(categoriesMap).map(([name, images]) => ({
      name,
      subtitle: `Our Exclusive ${name} Collection`,
      images: images,
    })).filter((cat) => cat.images.length > 0);
  }, [products]);

  const allProductImages = useMemo(() => {
    const list = [];
    products.forEach((prod) => {
      if (Array.isArray(prod.images) && prod.images.length > 0) {
        prod.images.forEach((imgUrl) => {
          if (typeof imgUrl === "string" && imgUrl.trim() !== "") {
            list.push({ url: imgUrl.trim(), title: prod.title ?? prod.name ?? "Exquisite Jewelry" });
          }
        });
      } else {
        const singleImg = getImage(prod);
        if (singleImg) {
          list.push({ url: singleImg, title: prod.title ?? prod.name ?? "Exquisite Jewelry" });
        }
      }
    });
    return list;
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = products.filter((product) => {
      const productCategory = typeof product.category === "object" ? product.category?.name : product.category;
      const matchesSearch = [
        product.title, product.name, product.description, productCategory, product.platingType, product.stoneDetails,
      ].some((value) => String(value ?? "").toLowerCase().includes(query));

      const matchesCategory = !selectedCategory || selectedCategory === "All" || productCategory === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sort === "price-low") result.sort((a, b) => getPrice(a) - getPrice(b));
    else if (sort === "price-high") result.sort((a, b) => getPrice(b) - getPrice(a));
    else if (sort === "name") {
      result.sort((a, b) => String(a.title ?? a.name ?? "").localeCompare(String(b.title ?? b.name ?? "")));
    }
    return result;
  }, [products, search, selectedCategory, sort]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, sort]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

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
    <div className="min-h-screen flex flex-col transition-colors duration-300" style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}>
      
      <Navbar
        currentTheme={currentTheme}
        search={search}
        setSearch={setSearch}
        mobileSearchOpen={mobileSearchOpen}
        setMobileSearchOpen={setMobileSearchOpen}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <main className="flex-1">
        <HeroBanner currentTheme={currentTheme} />

        {/* View Switcher: Shows category selection grid or filtered product grid */}
        {!selectedCategory ? (
          <ProductGrid
            currentTheme={currentTheme}
            loading={loading}
            error={error}
            fetchProducts={fetchProducts}
            staticCategories={STATIC_CATEGORIES}
            onSelectCategory={(categoryName) => setSelectedCategory(categoryName)}
            setSearch={setSearch}
          />
        ) : (
          <CategoryView
            selectedCategory={selectedCategory}
            onBack={() => setSelectedCategory(null)}
            currentTheme={currentTheme}
            loading={loading}
            error={error}
            fetchProducts={fetchProducts}
            sort={sort}
            setSort={setSort}
            filteredProducts={filteredProducts}
            paginatedProducts={paginatedProducts}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            handleOpenModal={handleOpenModal}
            getImage={getImage}
            getPrice={getPrice}
            formatPrice={formatPrice}
          />
        )}

        {/* HEXAGON MOSAIC SHOWCASE SECTION (Replaced old 4-card list) */}
        {!loading && categoryShowcases.length > 0 && (
          <CategoryCollectionShowcase 
            categories={categoryShowcases} 
            onImageClick={(categoryName) => {
              setSelectedCategory(categoryName);
            }} 
          />
        )}



        {!loading && allProductImages.length > 0 && (
          <section className="mx-auto max-w-7xl px-3 py-10 sm:px-6 sm:py-14">
            <div className="mb-6 text-center">
              
               <h2 className="text-3xl font-serif text-[#d4af37] tracking-widest mb-1 font-bold">Explore All Collection Gallery</h2>
               <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-black" >✦ Masterpiece Showcase ✦</p>
            </div>

            <div className="relative overflow-hidden rounded-3xl border shadow-2xl max-w-5xl mx-auto" >
              <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-black/40 group">
                <div className="flex h-full w-full transition-transform duration-700 ease-out" style={{ transform: `translateX(-${footerGalleryIndex * 100}%)` }}>
                  {allProductImages.map((item, idx) => (
                    <div key={idx} className="relative h-full w-full shrink-0 grow-0 flex items-center justify-center">
                      <LoadedImage src={item.url} alt={item.title} containerClassName="h-full w-full" className="h-full w-full object-cover filter brightness-95" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 sm:p-8">
                        <span className="text-sm sm:text-lg font-bold text-white drop-shadow-md">{item.title}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {allProductImages.length > 1 && (
                  <>
                    <button type="button" onClick={() => setFooterGalleryIndex((prev) => (prev === 0 ? allProductImages.length - 1 : prev - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-2.5 bg-black/60 text-white backdrop-blur-md opacity-70 group-hover:opacity-100 transition hover:bg-black/80">
                      <ChevronLeft size={20} />
                    </button>
                    <button type="button" onClick={() => setFooterGalleryIndex((prev) => (prev === allProductImages.length - 1 ? 0 : prev + 1))} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2.5 bg-black/60 text-white backdrop-blur-md opacity-70 group-hover:opacity-100 transition hover:bg-black/80">
                      <ChevronRight size={20} />
                    </button>
                    <div className="absolute top-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs font-bold backdrop-blur-md text-white border border-white/10">
                      {footerGalleryIndex + 1} / {allProductImages.length}
                    </div>
                  </>
                )}
              </div>

              {allProductImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto p-4 scrollbar-none justify-center bg-black/20">
                  {allProductImages.map((item, idx) => (
                    <button key={idx} type="button" onClick={() => setFooterGalleryIndex(idx)} className={`relative h-12 w-14 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${footerGalleryIndex === idx ? "scale-105 shadow-md ring-2 ring-offset-1" : "opacity-50 hover:opacity-100"}`} style={{ borderColor: footerGalleryIndex === idx ? currentTheme.accent : currentTheme.border }}>
                      <LoadedImage src={item.url} alt="" containerClassName="h-full w-full" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        <InstagramVideos />
      </main>

      <footer className="border-t transition-colors duration-300 bg-gray-200" style={{ borderColor: currentTheme.border }}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
            
            <div className="space-y-4 sm:space-y-0 md:col-span-2 sm:flex sm:items-start sm:gap-4">
              <div className="shrink-0">
                <img
                  src="/logo.png"
                  alt="Laxmi Sri Art Jewellers Logo" 
                  className="h-20 sm:h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="space-y-1.5 mt-3 sm:mt-0">
                <span className="text-sm sm:text-base font-black tracking-wider uppercase font-serif" style={{ color: currentTheme.accent }}>
                  Laxmi Sri Art Jewellers
                </span>
                <p className="text-xs leading-relaxed opacity-70 text-black">
                  Crafting timeless elegance with premium diamond collections, gemstone chokers, and handcrafted luxury designs.
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">Quick Links</h4>
              <ul className="space-y-2 text-xs opacity-70">
                <li><a href="#" className="transition hover:opacity-100 text-black">Shop All Collections</a></li>
                <li><a href="#shop-products" className="transition hover:opacity-100 text-black">Diamond Chokers</a></li>
                <li><a href="#shop-products" className="transition hover:opacity-100 text-black">Gemstone Harams</a></li>
              </ul>
            </div>
            
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">Contact Boutique</h4>
              <div className="flex items-start gap-2 text-xs opacity-70">
                <MapPin size={15} style={{ color: currentTheme.accent }} className="shrink-0 mt-0.5" />
                <span className="text-black">15-8-431/1&2, New, Feelkhana Rd, near Santhoshimata Temple, Begum Bazar, Afzal Gunj, Hyderabad, Telangana 500012</span>
              </div>
              <div className="flex items-center gap-2 text-xs opacity-70">
                <Phone size={15} style={{ color: currentTheme.accent }} className="shrink-0" />
                <span className="text-black">+91 99495 51967</span>
              </div>
              <div className="flex items-center gap-2 text-xs opacity-70">
                <Mail size={15} style={{ color: currentTheme.accent }} className="shrink-0" />
                <span className="text-black">support@laxmisrijewels.com</span>
              </div>
            </div>

          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t pt-5 text-xs opacity-60 text-black" style={{ borderColor: currentTheme.border }}>
            <p>© {new Date().getFullYear()} Laxmi Sri Art Jewellers. All rights reserved.</p>
            <p className="flex items-center gap-1">Built with <Heart size={12} style={{ color: currentTheme.accent, fill: currentTheme.accent }} /> for High-End Connoisseurs</p>
          </div>
        </div>
      </footer>

      <ProductModal
        selectedProduct={selectedProduct}
        handleCloseModal={handleCloseModal}
        activeImageIndex={activeImageIndex}
        setActiveImageIndex={setActiveImageIndex}
        currentTheme={currentTheme}
        getImage={getImage}
        getPrice={getPrice}
        formatPrice={formatPrice}
      />
    </div>
  );
}