import React, { useState, useEffect } from "react";
import {
  Upload,
  Type,
  LayoutList,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  IndianRupee,
  Package,
  Clock,
  Scale,
  ChevronDown,
  Tag,
} from "lucide-react";
import "../css/AdminAddModal.css";
import { capitalizeWords } from "../../utils/camelCase";

const AdminAddModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("category"); // 'category' or 'product'
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  // Store fetched categories for the dropdown
  const [existingCategories, setExistingCategories] = useState([]);

  // --- STATE: Category Form ---
  const initialCategoryState = {
    name: "",
    image: "",
    alt: "",
    priority: 0,
    isActive: true,
  };
  const [catFormData, setCatFormData] = useState(initialCategoryState);

  // --- STATE: Product Form ---
  const initialProductState = {
    name: "",
    brand: "Winkit",
    weight: "",
    price: "",
    mrp: "",
    image: "",
    time: "10 MINS",
    category: "",
  };
  const [prodFormData, setProdFormData] = useState(initialProductState);

  // --- HANDLERS ---

  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    setIsOpen(false);
    setStatus({ type: "", message: "" });
    setCatFormData(initialCategoryState);
    setProdFormData(initialProductState);
    setActiveTab("category");
  };

  // Fetch categories when switching to Product tab
  useEffect(() => {
    if (isOpen && activeTab === "product") {
      fetchCategories();
    }
  }, [isOpen, activeTab]);

  const fetchCategories = async () => {
    try {
      // Assuming you have a GET route for categories
      const res = await fetch("http://localhost:5000/api/category");
      const data = await res.json();
      if (data.success || Array.isArray(data)) {
        // Adjust depending on if your API returns { success: true, data: [] } or just []
        setExistingCategories(data.categories || data);
      }
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  // Generic Change Handler
  const handleChange = (e, formType) => {
    const { name, value, type, checked } = e.target;
    let val = type === "checkbox" ? checked : value;

    // Special check for priority
    if (name === "priority") {
      // If value is empty (user is typing), allow it temporarily
      if (val === "") {
        // keep val as ""
      } else {
        // Convert to number and enforce limits
        const numVal = parseInt(val, 10);
        if (numVal < 0) val = 0; // If negative, force to 0
        if (numVal > 5) val = 5; // If > 5, force to 5
      }
    }

    if (formType === "category") {
      setCatFormData((prev) => ({ ...prev, [name]: val }));
    } else {
      setProdFormData((prev) => ({ ...prev, [name]: val }));
    }
  };

  // Unified Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    const endpoint =
      activeTab === "category"
        ? "http://localhost:5000/api/category"
        : "http://localhost:5000/api/products";

    const payload = activeTab === "category" ? catFormData : prodFormData;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setStatus({
          type: "success",
          message: `${
            activeTab === "category" ? "Category" : "Product"
          } added successfully!`,
        });
        setTimeout(() => closeModal(), 2000);
      } else {
        throw new Error(data.message || "Operation failed");
      }
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openModal}
        className="add-category-trigger"
        title="Add New Item"
      >
        <Plus className="plus-icon" strokeWidth={2.5} />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              <X size={24} />
            </button>

            <h2 className="form-title">Add New Item</h2>

            {/* Tab Switcher */}
            <div className="tab-container">
              <button
                type="button"
                className={`tab-btn ${
                  activeTab === "category" ? "active" : ""
                }`}
                onClick={() => {
                  setActiveTab("category");
                  setStatus({ type: "", message: "" });
                }}
              >
                Category
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === "product" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("product");
                  setStatus({ type: "", message: "" });
                }}
              >
                Product
              </button>
            </div>

            {/* Status Message */}
            {status.message && (
              <div
                className={`status-message ${
                  status.type === "success" ? "status-success" : "status-error"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
                <span>{status.message}</span>
              </div>
            )}

            {/* === CATEGORY FORM === */}
            {activeTab === "category" && (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">
                    Category Name <span className="required-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <Type size={18} className="input-icon" />
                    <input
                      type="text"
                      name="name"
                      required
                      autoComplete="off"
                      value={catFormData.name}
                      onChange={(e) => handleChange(e, "category")}
                      className="form-input"
                      placeholder="e.g., Dairy & Bread"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Image URL <span className="required-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <Upload size={18} className="input-icon" />
                    <input
                      type="url"
                      name="image"
                      autoComplete="off"
                      required
                      value={catFormData.image}
                      onChange={(e) => handleChange(e, "category")}
                      className="form-input"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-col form-group">
                    <label className="form-label">Priority</label>
                    <div className="input-wrapper">
                      <LayoutList size={18} className="input-icon" />
                      <input
                        type="number"
                        name="priority"
                        min="0" // Prevents going below 0
                        max="5" // Prevents going above 5
                        autoComplete="off"
                        value={catFormData.priority}
                        onChange={(e) => handleChange(e, "category")}
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="form-col toggle-wrapper">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={catFormData.isActive}
                        onChange={(e) => handleChange(e, "category")}
                        className="toggle-checkbox"
                      />
                      <div className="toggle-track">
                        <div className="toggle-thumb"></div>
                      </div>
                      <span className="toggle-text">Active</span>
                    </label>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? "Processing..." : "Add Category"}
                </button>
              </form>
            )}

            {/* === PRODUCT FORM === */}
            {activeTab === "product" && (
              <form onSubmit={handleSubmit}>
                {/* Product Name */}
                <div className="form-group">
                  <label className="form-label">
                    Product Name <span className="required-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <Package size={18} className="input-icon" />
                    <input
                      type="text"
                      name="name"
                      autoComplete="off"
                      required
                      value={prodFormData.name}
                      onChange={(e) => handleChange(e, "product")}
                      className="form-input"
                      placeholder="e.g., Amul Gold Milk"
                    />
                  </div>
                </div>

                {/* Category Dropdown */}
                <div className="form-group">
                  <label className="form-label">
                    Category <span className="required-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <LayoutList size={18} className="input-icon" />
                    <select
                      name="category"
                      required
                      autoComplete="off"
                      value={prodFormData.category}
                      onChange={(e) => handleChange(e, "product")}
                      className="form-select"
                    >
                      <option value="">Select a Category</option>
                      {existingCategories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {capitalizeWords(cat.name)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="select-arrow" />
                  </div>
                </div>

                {/* Row: Brand & Weight */}
                <div className="form-row">
                  <div className="form-col form-group">
                    <label className="form-label">Brand</label>
                    <div className="input-wrapper">
                      <Tag size={18} className="input-icon" />
                      <input
                        type="text"
                        name="brand"
                        autoComplete="off"
                        value={prodFormData.brand}
                        onChange={(e) => handleChange(e, "product")}
                        className="form-input"
                        placeholder="Winkit"
                      />
                    </div>
                  </div>
                  <div className="form-col form-group">
                    <label className="form-label">
                      Weight <span className="required-star">*</span>
                    </label>
                    <div className="input-wrapper">
                      <Scale size={18} className="input-icon" />
                      <input
                        type="text"
                        name="weight"
                        autoComplete="off"
                        required
                        value={prodFormData.weight}
                        onChange={(e) => handleChange(e, "product")}
                        className="form-input"
                        placeholder="e.g., 500g"
                      />
                    </div>
                  </div>
                </div>

                {/* Row: Price & MRP */}
                <div className="form-row">
                  <div className="form-col form-group">
                    <label className="form-label">
                      Price (₹) <span className="required-star">*</span>
                    </label>
                    <div className="input-wrapper">
                      <IndianRupee size={18} className="input-icon" />
                      <input
                        type="number"
                        name="price"
                        autoComplete="off"
                        required
                        onKeyDown={(e) => {
                          // Prevent: minus, plus, e, E
                          if (["-", "+", "e", "E"].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        value={prodFormData.price}
                        onChange={(e) => handleChange(e, "product")}
                        className="form-input"
                        placeholder="Sale Price"
                      />
                    </div>
                  </div>
                  <div className="form-col form-group">
                    <label className="form-label">
                      MRP (₹) <span className="required-star">*</span>
                    </label>
                    <div className="input-wrapper">
                      <IndianRupee size={18} className="input-icon" />
                      <input
                        type="number"
                        name="mrp"
                        autoComplete="off"
                        required
                        onKeyDown={(e) => {
                          // Prevent: minus, plus, e, E
                          if (["-", "+", "e", "E"].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        value={prodFormData.mrp}
                        onChange={(e) => handleChange(e, "product")}
                        className="form-input"
                        placeholder="Max Price"
                      />
                    </div>
                  </div>
                </div>

                {/* Row: Image & Time */}
                <div className="form-group">
                  <label className="form-label">
                    Image URL <span className="required-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <Upload size={18} className="input-icon" />
                    <input
                      type="url"
                      name="image"
                      required
                      autoComplete="off"
                      value={prodFormData.image}
                      onChange={(e) => handleChange(e, "product")}
                      className="form-input"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Delivery Time</label>
                  <div className="input-wrapper">
                    <Clock size={18} className="input-icon" />
                    <input
                      type="text"
                      name="time"
                      autoComplete="off"
                      value={prodFormData.time}
                      onChange={(e) => handleChange(e, "product")}
                      className="form-input"
                      placeholder="10 MINS"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? "Processing..." : "Add Product"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminAddModal;
