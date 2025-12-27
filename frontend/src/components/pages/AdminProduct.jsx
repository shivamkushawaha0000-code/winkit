import React, { useState, useEffect } from "react";
import {
  Upload, LayoutList, CheckCircle, AlertCircle, IndianRupee,
  Package, Clock, Scale, ChevronDown, Tag, ArrowLeft, Eye
} from "lucide-react";
import "../css/AdminAddModal.css";
import { capitalizeWords } from "../../utils/camelCase";
import { useLocation, useNavigate } from "react-router-dom";

const AdminProduct = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [existingCategories, setExistingCategories] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const productToEdit = location.state?.productToEdit;
  const isEditMode = !!productToEdit;

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/category");
        const data = await res.json();
        if (data.success || Array.isArray(data)) {
          setExistingCategories(data.categories || data);
        }
      } catch (error) { console.error("Failed to load categories", error); }
    };
    fetchCategories();

    if (isEditMode && productToEdit) {
      setProdFormData({
        ...productToEdit,
        category: typeof productToEdit.category === "object" ? productToEdit.category._id : productToEdit.category || "",
      });
    }
  }, [location, isEditMode, productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProdFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const url = isEditMode ? `http://localhost:5000/api/products/${productToEdit._id}` : "http://localhost:5000/api/products";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prodFormData),
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ type: "success", message: isEditMode ? "Product updated!" : "Product added!" });
        if (!isEditMode) setProdFormData(initialProductState);
        else setTimeout(() => navigate("/dashboard/all-products"), 1500);
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
    <div className="admin-container">
      {/* Header Section */}
      <div className="admin-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="admin-title">{isEditMode ? "Edit Product" : "New Product"}</h2>
          <p className="admin-subtitle">Fill in the details to {isEditMode ? "update" : "list"} your product</p>
        </div>
      </div>

      <div className="admin-content-grid">
        {/* Form Section */}
        <div className="admin-form-card">
          {status.message && (
            <div className={`status-banner ${status.type}`}>
              {status.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="modern-form">
            <div className="form-section-title">General Information</div>
            
            <div className="form-group">
              <label>Product Name *</label>
              <div className="input-box">
                <Package className="icon" size={18} />
                <input type="text" name="name" required value={prodFormData.name} onChange={handleChange} placeholder="e.g. Fresh Mangoes" />
              </div>
            </div>

            <div className="form-row-three">
              <div className="form-group">
                <label>Category *</label>
                <div className="input-box">
                  <LayoutList className="icon" size={18} />
                  <select name="category" required value={prodFormData.category} onChange={handleChange}>
                    <option value="">Select</option>
                    {existingCategories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{capitalizeWords(cat.name)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Weight *</label>
                <div className="input-box">
                  <Scale className="icon" size={18} />
                  <input type="text" name="weight" required value={prodFormData.weight} onChange={handleChange} placeholder="500g" />
                </div>
              </div>
              <div className="form-group">
                <label>Brand</label>
                <div className="input-box">
                  <Tag className="icon" size={18} />
                  <input type="text" name="brand" value={prodFormData.brand} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="form-section-title">Pricing & Delivery</div>
            <div className="form-row">
              <div className="form-group">
                <label>Selling Price (₹)</label>
                <div className="input-box price">
                  <IndianRupee className="icon" size={18} />
                  <input type="number" name="price" required value={prodFormData.price} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label>MRP (₹)</label>
                <div className="input-box mrp">
                  <IndianRupee className="icon" size={18} />
                  <input type="number" name="mrp" required value={prodFormData.mrp} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Delivery</label>
                <div className="input-box">
                  <Clock className="icon" size={18} />
                  <input type="text" name="time" value={prodFormData.time} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="form-section-title">Media</div>
            <div className="form-group">
              <label>Image URL</label>
              <div className="input-box">
                <Upload className="icon" size={18} />
                <input type="url" name="image" required value={prodFormData.image} onChange={handleChange} placeholder="https://..." />
              </div>
            </div>

            <button type="submit" disabled={loading} className="main-submit-btn">
              {loading ? "Saving Changes..." : isEditMode ? "Update Product" : "Publish Product"}
            </button>
          </form>
        </div>

        {/* Live Preview Card */}
        <div className="admin-preview-section">
          <div className="preview-label"><Eye size={16} /> Live Preview</div>
          <div className="product-preview-card">
            <div className="preview-img-container">
              {prodFormData.image ? (
                <img src={prodFormData.image} alt="Preview" />
              ) : (
                <div className="img-placeholder"><Package size={40} /></div>
              )}
              <span className="preview-time">{prodFormData.time}</span>
            </div>
            <div className="preview-details">
              <h4 className="preview-name">{prodFormData.name || "Product Name"}</h4>
              <p className="preview-weight">{prodFormData.weight || "0 units"}</p>
              <div className="preview-price-row">
                <div className="price-stack">
                  <span className="curr-price">₹{prodFormData.price || 0}</span>
                  {prodFormData.mrp && <span className="old-price">₹{prodFormData.mrp}</span>}
                </div>
                <button className="preview-add-btn">ADD</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProduct;