import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  IndianRupee,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  Loader2,
  RefreshCw,
  Gem,
} from "lucide-react";
import { getProducts } from "../api/api"; // Adjust relative path to api.js if needed

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      // Uses the pre-configured Axios instance
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to load dashboard inventory"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Inventory metric calculations
  const totalItems = products.length;
  const totalStockUnits = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  const totalValuation = products.reduce(
    (acc, p) => acc + (Number(p.price) || 0) * (Number(p.stock) || 0),
    0
  );
  const lowStockCount = products.filter((p) => Number(p.stock) <= 5).length;
  const featuredCount = products.filter((p) => Boolean(p.isFeatured)).length;

  // Category distribution calculation
  const categoryCounts = products.reduce((acc, p) => {
    const cat = p.category || "Other";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    {
      title: "Total Designs",
      value: totalItems,
      subtext: `${totalStockUnits} units in stock`,
      icon: Package,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Inventory Value",
      value: `₹${totalValuation.toLocaleString("en-IN")}`,
      subtext: "Total stock × unit price",
      icon: IndianRupee,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950",
    },
    {
      title: "Low Stock Alert",
      value: lowStockCount,
      subtext: "≤ 5 pieces remaining",
      icon: AlertTriangle,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950",
    },
    {
      title: "Featured Items",
      value: featuredCount,
      subtext: "Showcased on home/store",
      icon: Sparkles,
      color: "text-violet-600 bg-violet-50 dark:bg-violet-950",
    },
  ];

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products Summary</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Real-time jewelry inventory and catalog analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <Link
            to="/admin/products"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Manage Products <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stat.title}
                </p>
                <span className={`rounded-md p-2 ${stat.color}`}>
                  <Icon size={19} />
                </span>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold">{stat.value}</span>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {stat.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Tables & Analytics */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent Products Table */}
        <div className="min-w-0 border border-slate-200 bg-white xl:col-span-2 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h2 className="font-semibold">Recent Products</h2>
            <Link to="/admin/products" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-900">
                <tr>
                  <th className="px-5 py-3 font-medium">Product Details</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-6 text-center text-slate-500">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.slice(0, 5).map((product) => (
                    <tr key={product._id}>
                      <td className="flex items-center gap-3 px-5 py-4">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="h-11 w-11 shrink-0 rounded border border-slate-200 object-cover dark:border-slate-800"
                          />
                        ) : (
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-slate-100 text-slate-400 dark:bg-slate-800">
                            <Package size={18} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate font-medium text-slate-900 dark:text-white">
                              {product.title}
                            </p>
                            {product.isFeatured && (
                              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {product.platingType} • {product.weightGrams}g
                            {product.stoneDetails && product.stoneDetails !== "None" && ` • ${product.stoneDetails}`}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                        {product.category}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                            product.stock <= 5
                              ? "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
                              : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                          }`}
                        >
                          {product.stock} left
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Share Distribution */}
        <div className="border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <Gem size={18} className="text-blue-600" />
            <h2 className="font-semibold">Categories Share</h2>
          </div>
          <p className="mt-1 text-xs text-slate-500">Distribution across catalog types</p>

          <div className="mt-5 space-y-4">
            {Object.keys(categoryCounts).length === 0 ? (
              <p className="text-sm text-slate-500">No categories to display.</p>
            ) : (
              Object.entries(categoryCounts).map(([cat, count]) => {
                const percent = totalItems > 0 ? Math.round((count / totalItems) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {cat}
                      </span>
                      <span className="text-slate-500">
                        {count} ({percent}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}