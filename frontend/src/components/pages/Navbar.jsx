import React, { useEffect, useState, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { BsCart3 } from "react-icons/bs";
import { RiArrowDownSLine, RiArrowRightSFill } from "react-icons/ri";
import "../css/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { User, X, CheckCircle } from "lucide-react";
import LocationModal from "./LocationModal";
import CartSidebar from "./CartSidebar";
// import AdminAddModal from "./AdminAddModal";
import AddressPanel from "./AddressPanel";
import OrderPanel from "./OrderPanel";
import { useCart } from "../../context/CartContext";
import PaymentModal from "./PaymentModal";
import { HiOutlineExternalLink } from "react-icons/hi";

const Navbar = ({ showLogin, setShowLogin, user, handleLogout }) => {
  const [locationName, setLocationName] = useState("Detect Location");
  const [showModal, setShowModal] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  const [toast, setToast] = useState({ show: false, message: "" });
  const [isCheckingAddress, setIsCheckingAddress] = useState(false);

  const profileMenuRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 1. New State for Active Index
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const navigate = useNavigate();
  const { cartCount, cartTotal, clearCart, cartItems } = useCart();

  // --- NEW: Toast Timer Logic ---
  useEffect(() => {
    let timer;
    if (toast.show) {
      timer = setTimeout(() => {
        setToast({ show: false, message: "" });
      }, 5000); // 5 Seconds
    }
    return () => clearTimeout(timer);
  }, [toast.show]);

  // Close Profile Menu on Outside Click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Load Saved Location
  useEffect(() => {
    const saved = localStorage.getItem("selectedLocation");
    if (saved) {
      try {
        const obj = JSON.parse(saved);
        if (obj.city || obj.formatted_address) {
          setLocationName(
            obj.city
              ? `${obj.city}${obj.state ? ", " + obj.state : ""}`
              : obj.formatted_address
          );
        }
      } catch (e) {}
    }
  }, []);

  // Fetch Search Suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await fetch(
          `https://winkit-6fzf.onrender.com/api/products?search=${searchTerm}`
        );
        const result = await response.json();
        if (result.success) {
          setSuggestions(result.data.slice(0, 5));
          setActiveSuggestionIndex(-1); // Reset index on new results
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };
    const timeoutId = setTimeout(() => {
      if (searchTerm) fetchSuggestions();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    // navigate("/");
  };

  const handleSuggestionClick = (productName) => {
    setSearchTerm(productName);
    setShowSuggestions(false);
    navigate(`/s/${productName}`);
  };

  // 2. Updated Key Handler
  const handleKeyDown = (e) => {
    // A. Arrow Down
    if (e.key === "ArrowDown") {
      e.preventDefault(); // Prevent cursor moving in input
      if (suggestions.length > 0) {
        setActiveSuggestionIndex((prevIndex) =>
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
        );
      }
    }
    // B. Arrow Up
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setActiveSuggestionIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
        );
      }
    }
    // C. Enter
    else if (e.key === "Enter") {
      // If an item is selected via arrows, go there
      if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
        handleSuggestionClick(suggestions[activeSuggestionIndex].name);
      }
      // Otherwise standard search
      else if (searchTerm.trim() !== "") {
        setShowSuggestions(false);
        navigate(`/s/${searchTerm}`);
      }
    }
    // D. Escape
    else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleOpenLocation = () => setShowModal(true);
  const handleCloseLocation = () => setShowModal(false);

  const handleSelectLocation = (loc) => {
    const label = loc.city
      ? `${loc.city}${loc.state ? ", " + loc.state : ""}`
      : loc.formatted_address;
    setLocationName(label);
    localStorage.setItem("selectedLocation", JSON.stringify(loc));
  };

  // --- CHECKOUT LOGIC ---
  const handleCheckout = async () => {
    if (!user) {
      setIsCartOpen(false);
      setShowLogin(true);
      return;
    }
    // 2. Check Local Storage (Validation Removed)
    const savedLocation = localStorage.getItem("selectedLocation");
    let parsedLocation = null;
    try {
      parsedLocation = savedLocation ? JSON.parse(savedLocation) : null;
    } catch (e) {
      parsedLocation = null;
    }
    // 2. If we have a local location, we are safe to proceed.
    if (parsedLocation) {
      setIsCartOpen(false);
      setShowPaymentModal(true);
      return;
    }
    setIsCheckingAddress(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://winkit-6fzf.onrender.com/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (
        data.success &&
        data.user.savedAddresses &&
        data.user.savedAddresses.length > 0
      ) {
        setIsCartOpen(false);
        setShowPaymentModal(true);
      } else {
        setIsCartOpen(false);
        setShowModal(true);
        alert("Please select a delivery address to proceed.");
      }
    } catch (err) {
      console.error("Error checking address:", err);
      alert("Network error. Please try again.");
    } finally {
      setIsCheckingAddress(false);
    }
  };

  // --- PAYMENT SUCCESS LOGIC ---
  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    if (clearCart) clearCart();
    setToast({ show: true, message: "Order Placed" });
    // alert("Order Placed Successfully!");
  };

  const getAddress = () => {
    const loc = localStorage.getItem("selectedLocation");
    return loc ? JSON.parse(loc) : null;
  };

  return (
    <>
      {/* --- TOAST NOTIFICATION --- */}
      {toast.show && (
        <div className="toast-notification">
          <div className="toast-content">
            <div className="toast-message">
              {/* Using Lucide CheckCircle with fill to look like the image */}
              <CheckCircle fill="#3F51B5" color="white" size={24} />
              {toast.message}
            </div>
            <button
              onClick={() => setToast({ show: false, message: "" })}
              className="toast-close-btn"
            >
              &times;
            </button>
          </div>
          <div className="toast-progress-track">
            <div className="toast-progress-bar"></div>
          </div>
        </div>
      )}

      {showSuggestions && (
        <div
          className="search-backdrop"
          onClick={() => setShowSuggestions(false)}
        />
      )}

      <nav className="navbar">
        <Link to="/" className="brand-logo" onClick={clearSearch}>
          <span className="wink">Wink</span>
          <span className="it">It</span>
        </Link>

        <div
          className="location-box"
          onClick={handleOpenLocation}
          style={{ cursor: "pointer" }}
        >
          <div className="delivery-title">Delivery in 10 minutes</div>
          <div className="location-subtitle">
            {locationName} <RiArrowDownSLine className="arrow-icon" />
          </div>
        </div>

        <div className="search-container">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              id="se"
              placeholder='Search "milk"'
              className="search-input"
              autoComplete="off"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown} // Attached here
              onFocus={() => {
                if (searchTerm.length >= 2) setShowSuggestions(true);
              }}
            />
            {searchTerm && (
              <button className="clear-search-btn" onClick={clearSearch}>
                <X size={18} />
              </button>
            )}
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((product, index) => (
                <div
                  key={product._id}
                  // 3. Apply 'active' class dynamically
                  className={`suggestion-item ${
                    index === activeSuggestionIndex ? "active" : ""
                  }`}
                  onClick={() => handleSuggestionClick(product.name)}
                  // Allow mouse hover to also set active index
                  onMouseEnter={() => setActiveSuggestionIndex(index)}
                >
                  <FiSearch className="suggestion-icon" />
                  <div className="suggestion-text">
                    {product.name}
                    <span className="suggestion-category">
                      in {product.category?.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="nav-right">
          {!user ? (
            <button
              className="profile-icon-btn"
              onClick={() => setShowLogin(true)}
            >
              <span className="login-text-desktop">Login</span>
              <User className="login-icon-mobile" size={20} />
            </button>
          ) : (
            <div className="profile-container" ref={profileMenuRef}>
              <button
                className="profile-icon-btn"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                {user.name ? user.name[0].toUpperCase() : <User size={20} />}
                <RiArrowDownSLine className="arrow-icon" />
              </button>

              {showProfileMenu && (
                <div className="profile-dropdown">
                  {/* 1. Header Section */}
                  <div className="profile-card-header">
                    <div className="avatar-large">
                      {user.name ? (
                        user.name[0].toUpperCase()
                      ) : (
                        <User size={24} />
                      )}
                    </div>
                    <div className="profile-info">
                      <h3>{user.name || "My Account"}</h3>
                      <p>{user.phoneNumber}</p>
                    </div>
                  </div>

                  {/* 2. Admin Quick Link (If applicable) */}
                  {user?.role === "admin" && (
                    <div className="profile-section admin-section">
                      <button
                        className="menu-item admin-btn"
                        onClick={() => {
                          navigate("/dashboard");
                          setShowProfileMenu(false);
                        }}
                      >
                        <div className="item-icon admin-icon">
                          <CheckCircle size={18} />
                        </div>
                        <span>Admin Dashboard</span>
                        <RiArrowRightSFill className="arrow-right" />
                      </button>
                    </div>
                  )}

                  {/* 3. Main Actions */}
                  <div className="profile-section">
                    <button
                      className="menu-item"
                      onClick={() => {
                        setIsOrderOpen(true);
                        setShowProfileMenu(false);
                      }}
                    >
                      <div className="item-icon">
                        <RiArrowRightSFill size={18} />
                      </div>
                      <div className="menu-label">
                        <span>My Orders</span>
                        <small>Manage & Track</small>
                      </div>
                    </button>

                    <button
                      className="menu-item"
                      onClick={() => {
                        setIsAddressOpen(true);
                        setShowProfileMenu(false);
                      }}
                    >
                      <div className="item-icon">
                        <RiArrowRightSFill size={18} />
                      </div>
                      <div className="menu-label">
                        <span>Saved Addresses</span>
                        <small>Home, Work, Other</small>
                      </div>
                    </button>
                  </div>

                  {/* 4. Footer Section */}
                  <div className="profile-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            className="cart-btn header-cart-btn"
            onClick={() => setIsCartOpen(true)}
            disabled={isCheckingAddress}
            style={{ opacity: isCheckingAddress ? 0.7 : 1 }}
          >
            <BsCart3 className="cart-icon" />
            <div className="cart-info">
              {cartCount === 0 ? (
                <span className="cart-text">My Cart</span>
              ) : (
                <>
                  <span className="cart-items">{cartCount} items</span>
                  <span className="cart-price">₹{cartTotal}</span>
                </>
              )}
            </div>
          </button>

          {/* <AdminAddModal /> */}
        </div>
      </nav>

      <LocationModal
        open={showModal}
        onClose={handleCloseLocation}
        onSelectLocation={handleSelectLocation}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />

      <AddressPanel
        open={isAddressOpen}
        onClose={() => setIsAddressOpen(false)}
        onSelectAddress={(address) => {
          handleSelectLocation(address);
          setIsAddressOpen(false);
        }}
      />

      <OrderPanel open={isOrderOpen} onClose={() => setIsOrderOpen(false)} />

      {/* Payment Modal - Passes cartTotal explicitly */}
      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={cartTotal}
        items={cartItems}
        address={getAddress()}
        onSuccess={handlePaymentSuccess}
      />

      {cartCount > 0 && !isCartOpen && !showPaymentModal && (
        <div
          className="floating-cart-container"
          onClick={() => setIsCartOpen(true)}
        >
          <div className="floating-cart-left">
            <div className="floating-icon-bg">
              <BsCart3 size={18} />
            </div>
            <div className="floating-cart-details">
              <span className="floating-items">{cartCount} items</span>
              <span className="floating-price">₹{cartTotal}</span>
            </div>
          </div>
          <div className="floating-cart-right">
            <span>View Cart</span>
            <RiArrowRightSFill size={24} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
