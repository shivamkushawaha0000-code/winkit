import React, { useEffect, useState, useCallback } from "react";
import { FiMapPin, FiSearch, FiX, FiNavigation } from "react-icons/fi"; // Better icons
import "../css/LocationModal.css";

export default function LocationModal({ open, onClose, onSelectLocation }) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY;

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  useEffect(() => {
    if (open) {
      setInput("");
      setSuggestions([]);
    }
  }, [open]);

  const fetchPredictions = useCallback(
    debounce(async (query) => {
      if (!query || query.length < 3) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await fetch(
          `https://api.locationiq.com/v1/autocomplete?key=${API_KEY}&q=${query}&limit=5&dedupe=1&addressdetails=1`
        );
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        }
      } catch (error) {
        console.error("LocationIQ Error:", error);
      }
    }, 400),
    []
  );

  useEffect(() => {
    fetchPredictions(input);
  }, [input, fetchPredictions]);

  const handleSelect = (item) => {
    const locationData = {
      formatted_address: item.display_name,
      lat: item.lat,
      lng: item.lon,
      city: item.address?.city || item.address?.town || item.address?.village,
      state: item.address?.state,
    };
    onSelectLocation(locationData);
    onClose();
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const response = await fetch(
            `https://us1.locationiq.com/v1/reverse?key=${API_KEY}&lat=${latitude}&lon=${longitude}&format=json`
          );
          if (response.ok) {
            const data = await response.json();
            onSelectLocation({
              formatted_address: data.display_name,
              lat: latitude,
              lng: longitude,
              city: data.address?.city || data.address?.town || data.address?.village,
              state: data.address?.state,
            });
            onClose();
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      },
      () => setLoading(false)
    );
  };

  if (!open) return null;

  return (
    <div className="loc-overlay" onClick={onClose}>
      <div className="loc-modal" onClick={(e) => e.stopPropagation()}>
        <div className="loc-header">
          <div>
            <h3 className="loc-title">Change Location</h3>
            <p className="loc-subtitle">To see what's available in your area</p>
          </div>
          <button className="loc-close-circle" onClick={onClose}><FiX /></button>
        </div>

        <div className="loc-body">
          <div className="loc-input-wrapper">
            <FiSearch className="search-icon-svg" />
            <input
              autoFocus
              className="loc-input-modern"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your area or apartment name..."
            />
          </div>

          <button
            className={`loc-current-btn ${loading ? 'loading' : ''}`}
            onClick={useCurrentLocation}
            disabled={loading}
          >
            <div className="btn-icon-bg"><FiNavigation /></div>
            <div className="btn-text">
              <span className="btn-main">Use current location</span>
              <span className="btn-sub">{loading ? "Detecting..." : "Using GPS"}</span>
            </div>
          </button>

          <div className="loc-results-container">
            {suggestions.length > 0 && <p className="results-label">Search Results</p>}
            {suggestions.map((s, index) => (
              <div key={index} className="loc-item-new" onClick={() => handleSelect(s)}>
                <div className="loc-pin-icon"><FiMapPin /></div>
                <div className="loc-details">
                  <span className="loc-primary">{s.display_name.split(",")[0]}</span>
                  <span className="loc-secondary">{s.display_name.split(",").slice(1).join(",")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}