import React, { useState, useEffect } from "react";
import { X, MapPin, Home, Briefcase, Plus, Trash2, Edit3, Navigation, Check } from "lucide-react";
import "../css/AddressPanel.css";

const API_BASE_URL = "http://localhost:5000/api/user";

export default function AddressPanel({ open, onClose }) {
  const [addresses, setAddresses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("LIST");

  const [newAddress, setNewAddress] = useState({
    label: "Home",
    addressLine: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    if (open) fetchAddresses();
  }, [open]);

  const fetchAddresses = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setAddresses(data.user.savedAddresses || []);
    } catch (err) {
      console.error(err);
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!newAddress.addressLine.trim()) tempErrors.addressLine = "Required";
    if (!newAddress.city.trim()) tempErrors.city = "Required";
    if (newAddress.pincode.length !== 6) tempErrors.pincode = "Invalid pincode";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    const token = localStorage.getItem("token");
    setLoading(true);

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_BASE_URL}/address/${editingId}` : `${API_BASE_URL}/address`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address: { ...newAddress, location: { type: "Point", coordinates: [0, 0] } },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAddresses(data.addresses);
        resetForm();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/address/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setAddresses(data.addresses);
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setView("LIST");
    setEditingId(null);
    setErrors({});
    setNewAddress({ label: "Home", addressLine: "", city: "", pincode: "" });
  };

  const getLabelIcon = (label) => {
    if (label === "Home") return <Home size={18} />;
    if (label === "Work") return <Briefcase size={18} />;
    return <MapPin size={18} />;
  };

  if (!open) return null;

  return (
    <div className="address-overlay" onClick={onClose}>
      <div className="address-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="ap-header-premium">
          <div className="header-title-stack">
            <Navigation size={20} className="header-icon" />
            <h3>{view === "LIST" ? "My Addresses" : editingId ? "Edit Address" : "Add Address"}</h3>
          </div>
          <button onClick={onClose} className="ap-close-btn"><X size={24} /></button>
        </div>

        <div className="ap-content-scroll">
          {view === "LIST" ? (
            <div className="ap-list-view">
              <button className="ap-add-new-trigger" onClick={() => setView("FORM")}>
                <Plus size={20} /> Add New Address
              </button>

              {addresses.length === 0 ? (
                <div className="ap-empty-state">
                  <div className="empty-map-icon"><MapPin size={40} /></div>
                  <p>No addresses found. Add one to speed up checkout.</p>
                </div>
              ) : (
                <div className="ap-cards-stack">
                  {addresses.map((addr) => (
                    <div key={addr._id} className="ap-premium-card">
                      <div className="ap-card-left">
                        <div className={`ap-type-icon-box ${addr.label.toLowerCase()}`}>
                          {getLabelIcon(addr.label)}
                        </div>
                      </div>
                      <div className="ap-card-middle">
                        <span className="ap-card-label">{addr.label}</span>
                        <p className="ap-card-full-address">
                          {addr.addressLine}, {addr.city} - {addr.pincode}
                        </p>
                      </div>
                      <div className="ap-card-actions">
                        <button className="ap-act-btn edit" onClick={() => {
                          setNewAddress(addr);
                          setEditingId(addr._id);
                          setView("FORM");
                        }}><Edit3 size={16} /></button>
                        <button className="ap-act-btn delete" onClick={() => handleDelete(addr._id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="ap-form-view">
              <div className="ap-form-group">
                <label className="ap-field-label">ADDRESS TYPE</label>
                <div className="ap-type-grid">
                  {["Home", "Work", "Other"].map((type) => (
                    <button
                      key={type}
                      className={`ap-type-selector-btn ${newAddress.label === type ? "active" : ""}`}
                      onClick={() => setNewAddress({ ...newAddress, label: type })}
                    >
                      {getLabelIcon(type)} <span>{type}</span>
                      {newAddress.label === type && <Check size={14} className="check-mark" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ap-form-group">
                <label className="ap-field-label">ADDRESS DETAILS</label>
                <div className="ap-input-wrapper">
                  <input
                    className={`ap-premium-input ${errors.addressLine ? "has-error" : ""}`}
                    placeholder="House No, Street, Landmark"
                    value={newAddress.addressLine}
                    onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                  />
                  {errors.addressLine && <span className="ap-err-text">{errors.addressLine}</span>}
                </div>

                <div className="ap-input-row">
                  <div className="ap-input-wrapper">
                    <input
                      className={`ap-premium-input ${errors.city ? "has-error" : ""}`}
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    />
                  </div>
                  <div className="ap-input-wrapper">
                    <input
                      className={`ap-premium-input ${errors.pincode ? "has-error" : ""}`}
                      placeholder="Pincode"
                      maxLength={6}
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="ap-form-footer">
                <button className="ap-cancel-trigger" onClick={resetForm}>Back to list</button>
                <button className="ap-save-trigger" onClick={handleSave} disabled={loading}>
                  {loading ? "SAVING..." : "SAVE ADDRESS"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}