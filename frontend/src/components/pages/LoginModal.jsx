import React, { useEffect, useRef, useState } from "react";
import { FiPhone, FiLock, FiX, FiArrowLeft } from "react-icons/fi";
import "../css/LoginModal.css";

const API_BASE_URL = "https://winkit-6fzf.onrender.com/api/auth";

export default function LoginModal({ open, onClose, onLoginSuccess }) {
  const [step, setStep] = useState("PHONE"); // PHONE or OTP
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  // Auto-focus and state reset
  useEffect(() => {
    if (open) {
      setStep("PHONE");
      setMobile("");
      setOtp("");
      setError("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Resend Timer Logic
  useEffect(() => {
    let interval;
    if (step === "OTP" && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!open) return null;

  const isBtnDisabled = 
    loading || 
    (step === "PHONE" && mobile.length !== 10) || 
    (step === "OTP" && otp.length !== 4);

  const handleInputChange = (e) => {
    setError("");
    const val = e.target.value.replace(/\D/g, "");
    if (step === "PHONE") setMobile(val);
    else setOtp(val);
  };

  const sendOtpApi = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: mobile }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("OTP");
        setTimer(30);
      } else {
        setError(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    if (step === "PHONE") return sendOtpApi();
    
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: mobile, otp }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLoginSuccess?.(data.user);
        onClose();
      } else {
        setError("Invalid OTP code.");
      }
    } catch (err) {
      setError("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        {/* Navigation Actions */}
        <button className="auth-close" onClick={onClose} aria-label="Close"><FiX /></button>
        {step === "OTP" && (
          <button className="auth-back" onClick={() => setStep("PHONE")} aria-label="Back">
            <FiArrowLeft />
          </button>
        )}

        <div className="auth-logo">Wink<span>it</span></div>

        <div className="auth-header">
          <h2>{step === "PHONE" ? "Login or Signup" : "Verify Number"}</h2>
          <p>
            {step === "PHONE" 
              ? "Enter your mobile number to continue" 
              : `We've sent a 4-digit code to +91 ${mobile}`}
          </p>
        </div>

        <div className={`auth-input-wrapper ${error ? "has-error" : ""}`}>
          <div className="auth-icon-box">
            {step === "PHONE" ? <FiPhone /> : <FiLock />}
          </div>
          {step === "PHONE" && <span className="auth-prefix">+91</span>}
          <input
            ref={inputRef}
            type="tel"
            className="auth-input-field"
            placeholder={step === "PHONE" ? "Mobile Number" : "0 0 0 0"}
            maxLength={step === "PHONE" ? 10 : 4}
            value={step === "PHONE" ? mobile : otp}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && !isBtnDisabled && handleContinue()}
          />
        </div>

        {error && <p className="auth-error-msg">{error}</p>}

        <button 
          className="auth-primary-btn" 
          disabled={isBtnDisabled} 
          onClick={handleContinue}
        >
          {loading ? "Please wait..." : step === "PHONE" ? "Next" : "Verify & Login"}
        </button>

        {step === "OTP" && (
          <div className="auth-resend-container">
            {timer > 0 ? (
              <p>Resend code in <span>{timer}s</span></p>
            ) : (
              <button onClick={sendOtpApi} className="resend-btn">Resend OTP</button>
            )}
          </div>
        )}

        <p className="auth-legal-text">
          By continuing, you agree to our <a href="/terms">Terms</a> & <a href="/privacy">Privacy</a>
        </p>
      </div>
    </div>
  );
}