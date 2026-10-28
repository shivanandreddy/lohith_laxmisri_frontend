import { useCallback, useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  Package,
  Trash2,
  Edit,
  Eye,
  Plus,
  X,
  AlertCircle,
  Video,
  Upload,
} from "lucide-react";
import api from "../api/axios";

const CATEGORIES = [
  "Necklaces",
  "Bangles",
  "Earrings",
  "Rings",
  "Mangalsutra",
  "Combo Sets",
];

const INITIAL_FORM_STATE = {
  title: "",
  description: "",
  price: "",
  category: "Necklaces",
  stock: "",
  weightGrams: "",
  platingType: "1 Gram Gold Plated",
  stoneDetails: "None",
  youtubeVideoId: "",
  isFeatured: false,
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/products");
      const data = response.data;
      const productList = Array.isArray(data)
        ? data
        : data.products ?? data.data ?? [];

      if (!Array.isArray(productList)) {
        throw new Error("Unexpected products response format.");
      }

      setProducts(productList);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setModalMode("create");
    setFormData(INITIAL_FORM_STATE);
    setSelectedFiles([]);
    setImagePreviews([]);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (product) => {
    setModalMode("edit");
    setSelectedProduct(product);
    setFormData({
      title: product.title || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "Necklaces",
      stock: product.stock || "",
      weightGrams: product.weightGrams || "",
      platingType: product.platingType || "1 Gram Gold Plated",
      stoneDetails: product.stoneDetails || "None",
      youtubeVideoId: product.youtubeVideoId || "",
      isFeatured: product.isFeatured || false,
    });
    setSelectedFiles([]);
    // Preload existing images as previews when editing
    setImagePreviews(product.images || []);
    setIsModalOpen(true);
  };

  // Open View Modal
  const handleOpenView = (product) => {
    setSelectedProduct(product);
    setIsViewOpen(true);
  };

  // Handle Form Input Changes
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle File Selection & Generate Previews
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    if (files.length > 0) {
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    } else {
      setImagePreviews(modalMode === "edit" ? selectedProduct?.images || [] : []);
    }
  };

  // Handle Submit (Create or Update with FormData)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("stock", formData.stock);
      data.append("weightGrams", formData.weightGrams);
      data.append("platingType", formData.platingType);
      data.append("stoneDetails", formData.stoneDetails);
      data.append("youtubeVideoId", formData.youtubeVideoId);
      data.append("isFeatured", formData.isFeatured);

      // Append image files if selected
      if (selectedFiles && selectedFiles.length > 0) {
        for (let i = 0; i < selectedFiles.length; i++) {
          data.append("images", selectedFiles[i]);
        }
      }

      // If editing and no new files chosen, pass existing images back
      if (modalMode === "edit" && selectedFiles.length === 0 && selectedProduct?.images) {
        data.append("images", JSON.stringify(selectedProduct.images));
      }

      if (modalMode === "create") {
        await api.post("/products", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.put(`/products/${selectedProduct._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          `Failed to ${modalMode} product.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (product) => {
    const id = product._id ?? product.id;
    if (!window.confirm(`Delete "${product.title ?? "this product"}"?`)) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts((current) => current.filter((item) => item._id !== id));
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete this product.");
    }
  };

  // Filter Search
  const filteredProducts = products.filter((product) => {
    const query = search.trim().toLowerCase();
    return [
      product.title,
      product.description,
      product.category,
      product.platingType,
    ].some((value) => String(value ?? "").toLowerCase().includes(query));
  });

  return (
    <main className="min-h-full bg-slate-50 p-4 text-slate-900 sm:p-6 dark:bg-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products Inventory</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your jewelry catalog, prices, and stock details[cite: 5, 6].
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchProducts}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      {/* Search and count */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title, category..."
            className="w-full rounded-md border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950"
          />
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Error Notification */}
      {error && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span className="flex-1">{error}</span>
          <button type="button" onClick={() => setError("")} className="font-medium underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Products Table */}
      <div className="overflow-x-auto border-y border-slate-200 dark:border-slate-800">
        <table className="w-full min-w-[750px] text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Specs</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <RefreshCw size={22} className="mx-auto mb-2 animate-spin text-blue-600" />
                  <span className="text-slate-500">Loading products...</span>
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <Package size={30} className="mx-auto mb-2 text-slate-400" />
                  <p className="font-medium">No products found</p>
                  <p className="mt-1 text-slate-500">
                    {search ? "Try a different search term." : "Click 'Add Product' to get started."}
                  </p>
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product._id} className="transition-colors hover:bg-slate-100/70 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="h-10 w-10 rounded-md object-cover border border-slate-200 dark:border-slate-700"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-200 dark:bg-slate-800">
                          <Package size={18} className="text-slate-400" />
                        </div>
                      )}
                      <div>
                        <span className="font-medium">{product.title}</span>
                        {product.isFeatured && (
                          <span className="ml-2 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium dark:bg-slate-800">
                      {product.category}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">
                    <div>{product.platingType}</div>
                    <div>{product.weightGrams}g</div>
                  </td>

                  <td className="px-4 py-4 font-medium">
                    <span className={product.stock > 0 ? "text-emerald-600" : "text-red-600"}>
                      {product.stock} left
                    </span>
                  </td>

                  <td className="px-4 py-4 font-medium">
                    {Number(product.price).toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </td>

                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenView(product)}
                        title="View details"
                        className="rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Eye size={17} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(product)}
                        title="Edit product"
                        className="rounded-md p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                      >
                        <Edit size={17} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        title="Delete product"
                        className="rounded-md p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE / UPDATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
              <h2 className="text-lg font-bold">
                {modalMode === "create" ? "Add New Product" : "Edit Product"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Product Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="e.g., Antique Gold Necklace"
                    className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Description *</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Detailed description of the jewelry..."
                  className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleFormChange}
                    className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Stock Qty *</label>
                  <input
                    type="number"
                    name="stock"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={handleFormChange}
                    className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Weight (Grams) *</label>
                  <input
                    type="number"
                    name="weightGrams"
                    required
                    min="0"
                    step="0.1"
                    value={formData.weightGrams}
                    onChange={handleFormChange}
                    className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Plating Type</label>
                  <input
                    type="text"
                    name="platingType"
                    value={formData.platingType}
                    onChange={handleFormChange}
                    placeholder="e.g., 1 Gram Gold Plated"
                    className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Stone Details</label>
                  <input
                    type="text"
                    name="stoneDetails"
                    value={formData.stoneDetails}
                    onChange={handleFormChange}
                    placeholder="e.g., American Diamonds (CZ)"
                    className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700"
                  />
                </div>
              </div>

              {/* Cloudinary File Upload Input with Small Previews */}
              <div>
                <label className="mb-1 block text-sm font-medium">Upload Images (Max 5)</label>
                <div className="flex items-center gap-2 rounded-md border border-dashed border-slate-300 p-3 dark:border-slate-700">
                  <Upload size={20} className="text-slate-400 shrink-0" />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-sm text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-950 dark:file:text-blue-300"
                  />
                </div>

                {/* Small Image Previews Grid */}
                {imagePreviews.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-1.5 text-xs font-medium text-slate-500">Image Previews:</p>
                    <div className="flex flex-wrap gap-2">
                      {imagePreviews.map((src, idx) => (
                        <div key={idx} className="relative h-16 w-16 overflow-hidden rounded-md border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                          <img
                            src={src}
                            alt={`Preview ${idx + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">YouTube Video ID or URL</label>
                  <input
                    type="text"
                    name="youtubeVideoId"
                    value={formData.youtubeVideoId}
                    onChange={handleFormChange}
                    placeholder="e.g., dQw4w9WgXcQ"
                    className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleFormChange}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Feature this product</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : modalMode === "create" ? "Create Product" : "Update Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {isViewOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
              <h2 className="text-lg font-bold">Product Details</h2>
              <button
                type="button"
                onClick={() => setIsViewOpen(false)}
                className="rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Images Carousel / Grid */}
              {selectedProduct.images?.length > 0 && (
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase text-slate-500">Images</h4>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedProduct.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${selectedProduct.title} ${idx}`}
                        className="h-24 w-24 rounded-lg object-cover border dark:border-slate-700 shrink-0"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium dark:bg-slate-800">
                  {selectedProduct.category}
                </span>
                <h3 className="mt-2 text-xl font-bold">{selectedProduct.title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {selectedProduct.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50 text-sm">
                <div>
                  <span className="text-slate-500">Price:</span>
                  <p className="font-semibold">
                    {Number(selectedProduct.price).toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Stock:</span>
                  <p className="font-semibold">{selectedProduct.stock} units</p>
                </div>
                <div>
                  <span className="text-slate-500">Weight:</span>
                  <p className="font-semibold">{selectedProduct.weightGrams}g</p>
                </div>
                <div>
                  <span className="text-slate-500">Plating:</span>
                  <p className="font-semibold">{selectedProduct.platingType}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500">Stone Details:</span>
                  <p className="font-semibold">{selectedProduct.stoneDetails}</p>
                </div>
              </div>

              {selectedProduct.youtubeVideoId && (
                <div>
                  <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase text-slate-500">
                    <Video size={14} /> Video Showcase
                  </h4>
                  <div className="aspect-video w-full overflow-hidden rounded-lg border dark:border-slate-700">
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedProduct.youtubeVideoId}`}
                      title="Product Video"
                      className="h-full w-full"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end border-t pt-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsViewOpen(false)}
                className="rounded-md bg-slate-200 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}