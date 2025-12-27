import React, { useState } from "react";
import {
  Upload,
  Type,
  LayoutList,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Eye,
  Layers
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../css/AdminAddModal.css";

const AdminCategory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const initialCategoryState = {
    name: "",
    image: "",
    alt: "",
    priority: 0,
    isActive: true,
  };
  const [catFormData, setCatFormData] = useState(initialCategoryState);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === "checkbox" ? checked : value;

    if (name === "priority") {
      if (val !== "") {
        const numVal = parseInt(val, 10);
        val = Math.max(0, Math.min(5, numVal));
      }
    }
    setCatFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("https://winkit-6fzf.onrender.com/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(catFormData),
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ type: "success", message: "Category added successfully!" });
        setCatFormData(initialCategoryState);
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
          <h2 className="admin-title">Add New Category</h2>
          <p className="admin-subtitle">Organize your products by creating descriptive categories</p>
        </div>
      </div>

      <div className="admin-content-grid">
        {/* Form Section */}
        <div className="admin-form-card">
          {status.message && (
            <div className={`status-banner ${status.type}`}>
              {status.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span>{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="modern-form">
            <div className="form-section-title">Category Details</div>
            
            <div className="form-group">
              <label>Category Name *</label>
              <div className="input-box">
                <Type className="icon" size={18} />
                <input
                  type="text"
                  name="name"
                  required
                  value={catFormData.name}
                  onChange={handleChange}
                  placeholder="e.g., Dairy, Bread & Eggs"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Display Priority (0-5)</label>
                <div className="input-box">
                  <LayoutList className="icon" size={18} />
                  <input
                    type="number"
                    name="priority"
                    value={catFormData.priority}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Status</label>
                <div className="toggle-wrapper" style={{ paddingTop: '8px' }}>
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={catFormData.isActive}
                      onChange={handleChange}
                      className="toggle-checkbox"
                    />
                    <div className="toggle-track">
                      <div className="toggle-thumb"></div>
                    </div>
                    <span className="toggle-text">{catFormData.isActive ? "Active" : "Disabled"}</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="form-section-title">Media & SEO</div>
            
            <div className="form-group">
              <label>Image URL *</label>
              <div className="input-box">
                <Upload className="icon" size={18} />
                <input
                  type="url"
                  name="image"
                  required
                  value={catFormData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.png"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Alt Text (SEO)</label>
              <div className="input-box">
                <Layers className="icon" size={18} />
                <input
                  type="text"
                  name="alt"
                  value={catFormData.alt}
                  onChange={handleChange}
                  placeholder="e.g., Fresh organic vegetables"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="main-submit-btn">
              {loading ? "Creating..." : "Create Category"}
            </button>
          </form>
        </div>

        {/* Live Preview Section */}
        <div className="admin-preview-section">
          <div className="preview-label"><Eye size={16} /> Shop Interface Preview</div>
          
          <div className="category-preview-container">
            {/* Circle Preview (Common in Blinkit/Zepto) */}
            <div className="cat-circle-card">
              <div className={`cat-img-wrapper ${!catFormData.isActive ? 'disabled' : ''}`}>
                {catFormData.image ? (
                  <img src={catFormData.image} alt="Preview" />
                ) : (
                  <div className="img-placeholder"><Layers size={24} /></div>
                )}
              </div>
              <span className="cat-preview-name">
                {catFormData.name || "New Category"}
              </span>
            </div>

            {/* Banner Preview */}
            <div className="cat-banner-preview">
                <small>Small Tile View</small>
                <div className="mini-tile">
                    {catFormData.image && <img src={catFormData.image} alt="" />}
                    <span>{catFormData.name || "Category"}</span>
                </div>
            </div>
          </div>

          <div className="preview-help">
            <p>Priority <strong>{catFormData.priority}</strong> will determine where this appears in the list.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCategory;