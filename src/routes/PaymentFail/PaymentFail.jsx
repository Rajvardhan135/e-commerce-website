import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentFail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get params from URL
  const txnid = searchParams.get("txnid") || "N/A";
  const status = searchParams.get("status") || "fail";

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>❌ Payment {status === "fail" ? "Failed / Cancelled" : "Status Unknown"}</h2>
      <p>Transaction ID: {txnid}</p>
      <p>Something went wrong. Please try again.</p>
      <button onClick={() => navigate("/checkout")}>Back to Checkout</button>
    </div>
  );
};

export default PaymentFail;
