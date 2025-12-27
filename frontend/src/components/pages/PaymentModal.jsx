import React from "react";
import { X, Lock, ShieldCheck, CreditCard, MapPin } from "lucide-react";
import StripeWrapper from "./StripeCheckout";
import "../css/PaymentModal.css";

const PaymentModal = ({ open, onClose, amount, items, address, onSuccess }) => {
  if (!open) return null;

  return (
    <div className="payment-overlay" onClick={onClose}>
      <div className="payment-modal-v2" onClick={(e) => e.stopPropagation()}>
        {/* Header with Security Badge */}
        <div className="pm-header-v2">
          <div className="pm-security-status">
            <div className="lock-circle">
              <Lock size={16} />
            </div>
            <div>
              <h3>Secure Checkout</h3>
              <p>PCI-DSS Compliant • 256-bit Encryption</p>
            </div>
          </div>
          <button onClick={onClose} className="pm-close-v2">
            <X size={20} />
          </button>
        </div>

        <div className="pm-scroll-area">
          {/* Order Briefing */}
          <div className="pm-summary-section">
            <div className="pm-summary-card">
              <div className="pm-summary-row">
                <span className="summary-label">Amount to Pay</span>
                <span className="summary-amount">₹{amount}</span>
              </div>
              <div className="pm-delivery-preview">
                <MapPin size={14} />
                <span>Delivering to <strong>{address?.label || "Home"}</strong></span>
              </div>
            </div>
          </div>

          {/* Stripe Container */}
          <div className="pm-payment-section">
            <div className="payment-label">
              <CreditCard size={18} />
              <span>Card Details</span>
            </div>
            <div className="pm-stripe-container">
              <StripeWrapper
                amount={amount}
                items={items}
                address={address}
                onSuccess={onSuccess}
              />
            </div>
          </div>

          {/* Trust Badges */}
          <div className="pm-trust-footer">
            <div className="trust-badge">
              <ShieldCheck size={14} />
              <span>Secure Payment Powered by Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;