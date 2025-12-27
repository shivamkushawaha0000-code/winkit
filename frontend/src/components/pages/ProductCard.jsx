import React from "react";
import "../css/ProductCard.css";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import { slugify } from "../../utils/urlHelper"; // Assumes you have this helper

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, getItemQuantity } = useCart();
  const navigate = useNavigate(); // 2. Initialize hook

  if (!product) return null;

  const quantity = getItemQuantity(product._id);

  const discount = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  // 3. Handle Card Click
  const handleCardClick = () => {
    // Navigate to the detail page.
    // Construct URL like: /prn/amul-milk/pid/12345
    navigate(`/prn/${slugify(product.name)}/pid/${product._id}`);
  };

  // 4. Handle Add Button Click (Stop Propagation)
  const handleAddClick = (e) => {
    e.stopPropagation(); // Prevents clicking the card background
    addToCart(product);
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    removeFromCart(product._id);
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      {" "}
      {/* 5. Add onClick to wrapper */}
      <div className="image-container">
        <img src={product.image} alt={product.name} loading="lazy" />
        <div className="delivery-badge">
          <span className="clock-icon">⏱</span> {product.time || "10 MINS"}
        </div>
        {discount > 0 && <div className="discount-badge">{discount}% OFF</div>}
      </div>
      <div className="product-details">
        <div className="product-header">
          <h3 className="product-name" title={product.name}>
            {product.name}
          </h3>
          <p className="product-weight">{product.weight}</p>
        </div>

        <div className="price-action">
          <div className="price-info">
            <span className="current-price">₹{product.price}</span>
            {product.mrp && product.mrp > product.price && (
              <span className="mrp">₹{product.mrp}</span>
            )}
          </div>

          <div className="add-btn-container">
            {quantity === 0 ? (
              <button
                className="add-btn"
                onClick={handleAddClick} // 6. Use new handler
              >
                ADD
              </button>
            ) : (
              <div className="qty-counter">
                <button onClick={handleRemoveClick}>-</button>{" "}
                {/* 7. Use new handler */}
                <span>{quantity}</span>
                <button onClick={handleAddClick}>+</button>{" "}
                {/* 8. Use new handler */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
