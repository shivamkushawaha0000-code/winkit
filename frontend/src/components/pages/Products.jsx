import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, Filter, ShoppingBag } from "lucide-react";
import Sidebar from "./Sidebar";
import ProductCard from "./ProductCard";
import SeoFooter from "./SeoFooter";
import { slugify } from "../../utils/urlHelper";
import "../css/Products.css";

function Products() {
  const { categoryId, searchTerm } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/category");
        const result = await response.json();
        if (result.success) setCategories(result.categories);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchCategories();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setActiveCategory(null);
      fetchProducts(`http://localhost:5000/api/products?search=${searchTerm}`);
    } else if (categories.length > 0) {
      if (categoryId) {
        const match = categories.find((c) => c._id === categoryId);
        if (match) {
          setActiveCategory(match);
          fetchProducts(`http://localhost:5000/api/products?categoryId=${categoryId}`);
        }
      } else {
        const first = categories[0];
        navigate(`/cn/${slugify(first.name)}/cid/${first._id}`, { replace: true });
      }
    }
  }, [categoryId, searchTerm, categories, navigate]);

  const fetchProducts = async (url) => {
    setLoading(true);
    try {
      const response = await fetch(url);
      const result = await response.json();
      setProducts(result.success ? result.data : []);
    } catch (error) {
      setProducts([]);
    } finally {
      setTimeout(() => setLoading(false), 400); // Smooth transition
    }
  };

  return (
    <div className="products-layout-wrapper">
      <div className="products-container">
        {/* Sidebar */}
        <aside className="category-sidebar">
          <div className="sidebar-sticky-inner">
            <Sidebar categories={categories} activeCategoryId={activeCategory?._id} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="products-main-content">
          <header className="category-view-header">
            <div className="header-context">
              <span className="breadcrumb-text">
                {searchTerm ? "Search Results" : "Category"}
              </span>
              <h1 className="category-title">
                {searchTerm ? `"${searchTerm}"` : activeCategory?.name || "Loading..."}
              </h1>
            </div>
            <div className="header-actions">
              <button className="filter-pill">
                <Filter size={14} /> Sort
              </button>
            </div>
          </header>

          <div className="product-listing-section">
            {loading ? (
              <div className="products-grid">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="skeleton-card" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon-circle">
                  <ShoppingBag size={48} />
                </div>
                <h3>No items found</h3>
                <p>Try checking a different category or adjusting your search.</p>
              </div>
            )}
          </div>

          <footer className="products-page-footer">
            <SeoFooter activeCategory={activeCategory} categories={categories} />
          </footer>
        </main>
      </div>
    </div>
  );
}

export default Products;