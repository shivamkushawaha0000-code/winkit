import React from "react";
import { IoClose } from "react-icons/io5";
import { useCart } from "../../context/CartContext"; // Import Context
import "../css/CartSidebar.css";

const CartSidebar = ({ isOpen, onClose, onCheckout }) => {
  // 1. Get Real Data from Context
  const { cartItems, addToCart, removeFromCart, cartTotal } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      ></div>

      {/* Sidebar Drawer */}
      <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="cart-header">
          <h3>My Cart</h3>
          <button onClick={onClose} className="close-btn">
            <IoClose size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <img
                src="https://cdn.grofers.com/assets/ui/empty_states/emp_empty_cart.png"
                alt="Empty Cart"
                className="empty-img"
              />
              <h4>You don't have any items in your cart</h4>
              <p>Your favourite items are just a click away</p>
              <button className="start-shopping-btn" onClick={onClose}>
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items-container">
              {/* Loop through Real Cart Items */}
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item">
                  <div className="item-img-box">
                    <img
                      src={item.image || "https://placehold.co/60"}
                      alt={item.name}
                    />
                  </div>

                  <div className="item-details">
                    <p className="item-name">{item.name}</p>
                    <p className="item-weight">{item.weight}</p>

                    <div className="item-price-action">
                      <span className="price">₹{item.price}</span>

                      {/* Quantity Controls */}
                      <div className="qty-controls">
                        <button onClick={() => removeFromCart(item._id)}>
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => addToCart(item)}>+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Bill Details Section */}
              <div className="bill-details">
                <h4>Bill Details</h4>
                <div className="bill-row">
                  <span>Item Total</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="bill-row">
                  <span>Delivery Charge</span>
                  <span className="free-text">FREE</span>
                </div>
                <div className="bill-row grand-total">
                  <span>Grand Total</span>
                  <span>₹{cartTotal}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer (Checkout Button) */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <button
              className="checkout-btn"
              onClick={() =>
                onCheckout({ items: cartItems, totalAmount: cartTotal })
              }
            >
              <div className="btn-content">
                <span className="total-text">₹{cartTotal}</span>
                <span className="proceed-text">Proceed to Pay &gt;</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
