import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // PayU may send transaction details in query params or form POST
  // You can extract them like this (for query string case):
  const query = new URLSearchParams(location.search);
  const txnid = query.get("txnid");
  const amount = query.get("amount");
  const status = query.get("status");

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>✅ Payment Successful!</h2>
      <p>Transaction ID: {txnid}</p>
      <p>Amount Paid: ₹{amount}</p>
      <p>Status: {status}</p>
      <button onClick={() => navigate("/")}>Go Home</button>
    </div>
  );
};

export default PaymentSuccess;
