import { Sparkles, ChevronRight } from "lucide-react";
import LoadedImage from "./LoadedImage";

export default function HeroBanner({ currentTheme }) {
  return (
    <section className="w-full px-3 pt-3 sm:px-6 sm:pt-6 lg:px-8">
      <div
        className="relative isolate mx-auto min-h-[430px] w-full max-w-7xl overflow-hidden rounded-2xl border shadow-xl sm:min-h-0 sm:aspect-[16/7] sm:rounded-3xl lg:aspect-[16/6]"
        style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}
      >
        <div className="absolute inset-0">
          <LoadedImage
            src="/banner.png"
            alt="Luxury jewellery collection"
            containerClassName="h-full w-full"
            className="h-full w-full object-cover object-[58%_center] sm:object-center"
          />
        </div>

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
              className="group mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-extrabold tracking-wide shadow-lg transition duration-300 hover:-translate-y-0.5 hover:brightness-110 sm:mt-7 sm:px-7 sm:text-sm"
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
      </div>
    </section>
  );
}