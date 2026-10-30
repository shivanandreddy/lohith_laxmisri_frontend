import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";

import Navbar from "./Navbar";
import CategoryView from "./CategoryView";
import ProductModal from "./ProductModal";

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

export default function CategoryPageRoute() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { currentTheme } = useTheme();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/products");
      const data = response.data;
      const list = Array.isArray(data) ? data : data.products ?? data.data ?? [];
      setProducts(list);
    } catch (err) {
      setError(err.message || "Could not load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = products.filter((product) => {
      const productCategory = typeof product.category === "object" ? product.category?.name : product.category;
      
      const matchesSearch = [
        product.title, product.name, product.description, productCategory, product.platingType, product.stoneDetails,
      ].some((value) => String(value ?? "").toLowerCase().includes(query));

      const matchesCategory = !categoryName || categoryName === "All" || productCategory === categoryName;
      return matchesSearch && matchesCategory;
    });

    if (sort === "price-low") result.sort((a, b) => getPrice(a) - getPrice(b));
    else if (sort === "price-high") result.sort((a, b) => getPrice(b) - getPrice(a));
    else if (sort === "name") {
      result.sort((a, b) => String(a.title ?? a.name ?? "").localeCompare(String(b.title ?? b.name ?? "")));
    }
    return result;
  }, [products, categoryName, search, sort]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}>
      
      {/* Navbar rendered here */}
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
        <CategoryView
          selectedCategory={categoryName}
          onBack={() => navigate("/")}
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
          handleOpenModal={(prod) => setSelectedProduct(prod)}
          getImage={getImage}
          getPrice={getPrice}
          formatPrice={formatPrice}
        />
      </main>

      <ProductModal
        selectedProduct={selectedProduct}
        handleCloseModal={() => setSelectedProduct(null)}
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