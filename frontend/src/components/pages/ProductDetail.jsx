import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Clock, 
  ShieldCheck, 
  RotateCcw, 
  ChevronRight, 
  Info,
  Star
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import ProductCard from "./ProductCard";
import "../css/ProductDetail.css";
import { slugify } from "../../utils/urlHelper";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, removeFromCart, getItemQuantity } = useCart();

  const [product, setProduct] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const prodRes = await fetch(`http://localhost:5000/api/products/${id}`);
        const prodResult = await prodRes.json();

        if (prodResult.success) {
          const currentProduct = prodResult.data;
          setProduct(currentProduct);

          if (currentProduct.category) {
            const catId = typeof currentProduct.category === "object" 
              ? currentProduct.category._id 
              : currentProduct.category;

            const suggRes = await fetch(`http://localhost:5000/api/products?categoryId=${catId}`);
            const suggResult = await suggRes.json();

            if (suggResult.success) {
              const filtered = suggResult.data.filter((p) => p._id !== id);
              setSuggestions(filtered.slice(0, 6));
            }
          }
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };

    if (id) fetchProductData();
  }, [id]);

  if (loading) return (
    <div className="pd-skeleton-container">
      <div className="skeleton-image"></div>
      <div className="skeleton-content"></div>
    </div>
  );
  
  if (!product) return <div className="pd-error">Product not found</div>;

  const quantity = getItemQuantity(product._id);
  const discount = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  return (
    <div className="pdp-wrapper">
      <div className="pdp-container">
        {/* Breadcrumb Navigation */}
        <nav className="pdp-breadcrumb">
          <Link to="/">Home</Link> <ChevronRight size={14} />
          {product.category && (
            <>
              <Link to={`/cn/${slugify(product.category.name)}/cid/${product.category._id}`}>
                {product.category.name}
              </Link>
              <ChevronRight size={14} />
            </>
          )}
          <span>{product.name}</span>
        </nav>

        <div className="pdp-main-grid">
          {/* Left Column: Media */}
          <section className="pdp-media">
            <div className="pdp-image-viewer">
              <img src={product.image} alt={product.name} />
              {discount > 0 && <div className="pdp-promo-badge">{discount}% OFF</div>}
            </div>
          </section>

          {/* Right Column: Information */}
          <section className="pdp-details">
            <header className="pdp-header">
              <div className="pdp-brand-label">{product.brand || "Premium Quality"}</div>
              <h1 className="pdp-title">{product.name}</h1>
              <div className="pdp-meta-top">
                <span className="pdp-time"><Clock size={16} /> {product.time || "10 MINS"}</span>
                <span className="pdp-divider">|</span>
                <span className="pdp-weight">{product.weight}</span>
              </div>
            </header>

            <div className="pdp-pricing-card">
              <div className="price-row">
                <span className="pdp-sale-price">₹{product.price}</span>
                {product.mrp > product.price && (
                  <span className="pdp-mrp-price">MRP ₹{product.mrp}</span>
                )}
              </div>
              <p className="pdp-tax-info">Inclusive of all taxes</p>

              <div className="pdp-cta-block">
                {quantity === 0 ? (
                  <button className="pdp-main-add-btn" onClick={() => addToCart(product)}>
                    ADD TO CART
                  </button>
                ) : (
                  <div className="pdp-main-qty-selector">
                    <button onClick={() => removeFromCart(product._id)}>−</button>
                    <span>{quantity}</span>
                    <button onClick={() => addToCart(product)}>+</button>
                  </div>
                )}
              </div>
            </div>

            {/* Features/Trust Section */}
            <div className="pdp-trust-grid">
              <div className="trust-item">
                <ShieldCheck size={20} className="trust-icon" />
                <div>
                  <h6>100% Authentic</h6>
                  <p>Guaranteed quality</p>
                </div>
              </div>
              <div className="trust-item">
                <RotateCcw size={20} className="trust-icon" />
                <div>
                  <h6>Easy Return</h6>
                  <p>Doorstep pickup</p>
                </div>
              </div>
            </div>

            <div className="pdp-description-section">
              <h3 className="section-label"><Info size={18} /> Product Description</h3>
              <p>{product.description || "No description available for this product."}</p>
            </div>
          </section>
        </div>

        {/* Suggestions Section */}
        {suggestions.length > 0 && (
          <section className="pdp-recommendations">
            <div className="section-header">
              <h2>You Might Also Need</h2>
              <Link to={`/cn/${slugify(product.category.name)}/cid/${product.category._id}`} className="view-all-link">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="suggestions-grid">
              {suggestions.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;