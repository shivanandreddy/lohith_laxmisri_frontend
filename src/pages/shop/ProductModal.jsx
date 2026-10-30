import { X, ChevronLeft, ChevronRight, Check, ShieldCheck, Truck, RotateCcw, ShoppingBag } from "lucide-react";
import LoadedImage from "./LoadedImage";

export default function ProductModal({
  selectedProduct,
  handleCloseModal,
  activeImageIndex,
  setActiveImageIndex,
  currentTheme,
  getImage,
  getPrice,
  formatPrice
}) {
  if (!selectedProduct) return null;

  const productImages = Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0
    ? selectedProduct.images
    : [getImage(selectedProduct)].filter(Boolean);
  const prodPrice = getPrice(selectedProduct);
  const prodTitle = selectedProduct.title ?? selectedProduct.name ?? "Product Details";
  const prodCategory = typeof selectedProduct.category === "object" ? selectedProduct.category?.name : selectedProduct.category;

  return (
    <div 
      onClick={handleCloseModal}
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto  p-0 backdrop-blur-md sm:items-center sm:p-4"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[94dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border shadow-2xl transition-colors duration-300 sm:max-h-[88vh] sm:rounded-2xl bg-white text-black"

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
          
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 overflow-y-auto flex-1">
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
                
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedProduct.stock > 0 ? (
                  <span className="inline-flex items-center gap-1 rounded-full  border border-emerald-800 px-3 py-1 text-xs font-semibold ">
                    <Check size={13} /> In Stock ({selectedProduct.stock} left)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-950 border border-red-800 px-3 py-1 text-xs font-semibold text-red-300">
                    Out of stock
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 rounded-2xl p-3.5 sm:p-4 text-xs border" style={{  borderColor: currentTheme.border }}>
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

              
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
}