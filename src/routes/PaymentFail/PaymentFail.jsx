import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentFail = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>❌ Payment Failed / Cancelled</h2>
      <p>Something went wrong. Please try again.</p>
      <button onClick={() => navigate("/checkout")}>Back to Checkout</button>
    </div>
  );
};

export default PaymentFail;
