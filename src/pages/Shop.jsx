
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  ShoppingBag,
  RefreshCw,
  Package,
  AlertCircle,
  ArrowUpRight,
  SlidersHorizontal,
  X,
} from "lucide-react";
import api from "../api/axios";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const formatPrice = (price) =>
    price == null
      ? "Price unavailable"
      : new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 2,
        }).format(price);

  return (
    <main className="min-h-full overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
     

      {/* Shop content */}
      <section
        id="shop-products"
        className="mx-auto max-w-7xl scroll-mt-6 px-4 py-8 sm:px-8 sm:py-10"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              The collection
            </p>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
              Shop products
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {loading
                ? "Finding products for you..."
                : `${filteredProducts.length} products to explore`}
            </p>
          </div>

          <button
            type="button"
            onClick={fetchProducts}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium transition hover:border-violet-300 hover:text-violet-700 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:text-violet-300"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Search and sort */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by product name, brand, or category..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-900"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-900">
            <SlidersHorizontal size={16} className="text-slate-500" />
            <span className="sr-only">Sort products</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="min-w-36 bg-transparent py-3 text-sm outline-none"
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
          <div className="mb-7 flex gap-2 overflow-x-auto pb-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition duration-200 ${
                  category === item
                    ? "border-violet-600 bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                    : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-violet-300"
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
          <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[4/5] rounded-2xl bg-slate-200 dark:bg-slate-800" />
                <div className="mt-4 h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="mt-3 h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
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
              className="mt-4 text-sm font-semibold text-violet-600 hover:underline dark:text-violet-400"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Product grid */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, index) => {
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
                  style={{ animationDelay: `${Math.min(index, 12) * 65}ms` }}
                  className="shop-product group min-w-0 animate-[shopFadeIn_500ms_ease_both]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900">
                    {image ? (
                      <img
                        src={image}
                        alt={name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-400">
                        <Package size={42} strokeWidth={1.2} />
                        <span className="text-xs">No product image</span>
                      </div>
                    )}

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-50 transition-opacity duration-300 group-hover:opacity-100" />

                    {productCategory && (
                      <span className="absolute left-3 top-3 max-w-[80%] truncate rounded-full border border-white/40 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur">
                        {productCategory}
                      </span>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      <button
                        type="button"
                        onClick={() =>
                          window.alert(
                            `${name}\n\n${product.description || "No description available."}`
                          )
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/95 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg backdrop-blur transition hover:bg-white"
                      >
                        Quick view
                        <ArrowUpRight size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="px-1 pt-4">
                    <h3 className="truncate text-base font-semibold transition-colors group-hover:text-violet-600 dark:group-hover:text-violet-400">
                      {name}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-lg font-bold tracking-tight">
                        {formatPrice(price)}
                      </p>

                      {product.brand && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {product.brand}
                        </span>
                      )}
                    </div>

                    {product.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-500 dark:text-slate-400">
                        {product.description}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

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

        @media (prefers-reduced-motion: reduce) {
          .shop-product {
            animation: none !important;
          }

          .shop-product *,
          .shop-hero * {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}
