import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ amount, items, address, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;
    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:5173/confirm-order",
      },
      redirect: "if_required", // Important: Prevents redirect if not needed
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Payment successful!
      try {
        const response = await fetch(
          "http://localhost:5000/api/payment/confirm-order",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              paymentIntentId: paymentIntent.id,
              cartItems: items, // Sending items to backend
              totalAmount: amount,
              deliveryAddress: address,
            }),
          }
        );
        const data = await response.json();

        if (data.success) {
          // 3. Call parent onSuccess to clear cart/close modal
          onSuccess();
        } else {
          setErrorMessage(
            "Payment successful, but order saving failed. Contact support."
          );
        }
      } catch (err) {
        console.error(err);
        setErrorMessage("Network error saving order.");
      }
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        disabled={!stripe || isProcessing}
        className="pay-btn"
        style={{
          marginTop: "20px",
          width: "100%",
          padding: "10px",
          backgroundColor: "#3F51B5",
          color: "white",
          border: "none",
          borderRadius: "5px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        {isProcessing ? "Processing..." : `Pay ₹${amount}`}
      </button>
      {errorMessage && (
        <div style={{ color: "red", marginTop: "10px" }}>{errorMessage}</div>
      )}
    </form>
  );
};

const StripeWrapper = ({ amount, items, address, onSuccess }) => {
  const [clientSecret, setClientSecret] = useState("");

  React.useEffect(() => {
    // Fetch the clientSecret from backend
    fetch("http://localhost:5000/api/payment/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ amount }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          console.error("Failed to get clientSecret:", data);
          alert("Payment initialization failed. Check console.");
        }
      })
      .catch((err) => console.error("Error:", err));
  }, [amount]);

  if (!clientSecret) return <div>Loading Payment...</div>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm
        amount={amount}
        items={items}
        address={address}
        onSuccess={onSuccess}
      />
    </Elements>
  );
};

export default StripeWrapper;