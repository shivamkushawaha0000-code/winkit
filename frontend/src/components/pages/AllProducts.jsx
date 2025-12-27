import React, { useEffect, useState } from "react";
import { Trash2, Edit, PackageOpen, Search, Plus, Filter, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../css/AllProducts.css";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    window.scrollTo(0, 0);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://winkit-6fzf.onrender.com/api/products");
      const result = await response.json();
      if (result.success && result.data) {
        setProducts(result.data);
        setFilteredProducts(result.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Real-time Search Logic
  useEffect(() => {
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleDelete = async (id) => {
    if (window.confirm("Move this product to trash?")) {
      try {
        const res = await fetch(
          `https://winkit-6fzf.onrender.com/api/products/${id}`,
          {
            method: "DELETE",
          }
        );
        const data = await res.json();
        if (data.success) {
          setProducts(products.filter((product) => product._id !== id));
        } else {
          alert("Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  if (loading) return <div className="admin-loader"><span></span></div>;

  return (
    <div className="admin-page-container">
      {/* Header Section */}
      <header className="admin-view-header">
        <div className="header-left">
          <h1>Inventory Management</h1>
          <p>{filteredProducts.length} items total</p>
        </div>
        <button className="add-product-btn" onClick={() => navigate("/dashboard/add-products")}>
          <Plus size={18} /> Add New Product
        </button>
      </header>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <PackageOpen size={64} />
          <h3>No matching products found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="admin-product-grid">
          {filteredProducts.map((product) => (
            <div key={product._id} className="admin-product-card">
              {/* Top: Image & Badges */}
              <div className="card-media">
                <img src={product.image} alt={product.name} />
                {product.mrp > product.price && (
                  <span className="discount-badge">
                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                  </span>
                )}
              </div>

              {/* Middle: Info */}
              <div className="card-details">
                <span className="brand-tag">{product.brand}</span>
                <h3 className="product-name">{product.name}</h3>
                <div className="meta-row">
                  <span className="weight-label">{product.weight}</span>
                </div>
                
                <div className="price-container">
                  <span className="selling-price">₹{product.price}</span>
                  {product.mrp > product.price && (
                    <span className="mrp-price">₹{product.mrp}</span>
                  )}
                </div>
              </div>

              {/* Bottom: Actions */}
              <div className="card-footer-actions">
                <button className="action-btn edit" onClick={() => navigate("/dashboard/add-products", { state: { productToEdit: product } })}>
                  <Edit size={16} />
                </button>
                <button className="action-btn delete" onClick={() => handleDelete(product._id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProducts;