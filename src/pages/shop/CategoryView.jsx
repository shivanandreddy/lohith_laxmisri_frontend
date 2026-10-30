import { ArrowLeft, Package, SlidersHorizontal, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import LoadedImage from "./LoadedImage";

export default function CategoryView({
  selectedCategory,
  onBack,
  currentTheme,
  loading,
  error,
  fetchProducts,
  sort,
  setSort,
  filteredProducts,
  paginatedProducts,
  currentPage,
  setCurrentPage,
  totalPages,
  handleOpenModal,
  getImage,
  getPrice,
  formatPrice
}) {
  return (
    <section className="mx-auto w-full max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Top Header with Back Button */}
     <div 
  className="mb-6 flex flex-col gap-3 pb-4 border-b sm:flex-row sm:items-center sm:justify-between" 
  style={{ borderColor: currentTheme.border }}
>
  {/* Mobile Top Bar / Desktop Left & Right Wrappers */}
  <div className="flex items-center justify-between gap-2 sm:contents">
    
    {/* Back Button */}
    <button
      type="button"
      onClick={onBack}
      className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition hover:opacity-80 shadow-sm shrink-0"
      style={{ borderColor: currentTheme.border, color: currentTheme.accent, backgroundColor: currentTheme.card }}
    >
      <ArrowLeft size={14} />
      <span>Back</span>
    </button>

    {/* Sort Dropdown */}
    <div className="flex items-center sm:order-3">
      <label 
        className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 shadow-sm cursor-pointer" 
        style={{ borderColor: currentTheme.border, backgroundColor: currentTheme.card }}
      >
        <SlidersHorizontal size={13} style={{ color: currentTheme.accent }} />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-transparent text-[11px] sm:text-xs font-medium outline-none cursor-pointer"
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

  {/* Center: Title Header */}
  <div className="text-center sm:order-2 sm:px-4">
    <span className="block text-[13px] font-bold uppercase tracking-[0.25em] opacity-60" style={{ color: currentTheme.text }}>
      ✦ COLLECTION SHOWCASE ✦
    </span>
    <h2 className="mt-0.5 text-base sm:text-md font-black tracking-tight text-amber-300 uppercase break-words">
      {selectedCategory}
    </h2>
  </div>
</div>

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

      {/* Loading State */}
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
        <div className="border rounded-3xl py-16 text-center shadow-lg" style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
          <Package size={45} className="mx-auto mb-3 opacity-60 animate-bounce" style={{ color: currentTheme.accent }} strokeWidth={1.3} />
          <h3 className="text-lg font-bold">No products found in {selectedCategory}</h3>
          <p className="mt-1 text-xs opacity-70">Check back later for newly added items or explore other categories.</p>
          <button
            type="button"
            onClick={onBack}
            className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-black shadow-md transition"
            style={{ backgroundColor: currentTheme.accent }}
          >
            Return to Categories
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
              const productCategory = typeof product.category === "object" ? product.category?.name : product.category;

              return (
                <article
                  key={product._id ?? product.id ?? `${title}-${index}`}
                  onClick={() => handleOpenModal(product)}
                  className="group cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl p-2 sm:p-3.5 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  style={{ borderColor: currentTheme.border }}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg sm:rounded-xl bg-black/20">
                    <LoadedImage
                      src={image}
                      alt={title}
                      containerClassName="h-full w-full"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />

                    {product.isFeatured && (
                      <span className="absolute left-2 top-2 rounded-md px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-black shadow" style={{ backgroundColor: currentTheme.accent }}>
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
                    <h3 className="truncate text-xs sm:text-sm font-semibold transition-colors  group-hover:opacity-80">
                      {title}
                    </h3>
                    <div className="mt-1 sm:mt-2 flex items-baseline justify-between gap-1">
                      
                      {product.stock !== undefined && (
                        <span className={`text-[9px] sm:text-[10px] font-semibold ${product.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 rounded-xl border px-3 sm:px-4 py-2 text-xs font-bold transition disabled:opacity-40 text-black"
                style={{  borderColor: currentTheme.border }}
              >
                <ChevronLeft size={15} /> Prev
              </button>

              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl text-xs font-bold transition"
                      
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
                style={{  borderColor: currentTheme.border }}
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}