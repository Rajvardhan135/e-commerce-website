import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import app from "../../utils/firebase/firebase.utils";
import { useDispatch } from "react-redux";
import { clearCart } from "../../store/cart/cart.action";

const db = getFirestore(app);

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [orderSaved, setOrderSaved] = useState(false);

  const query = new URLSearchParams(location.search);
  const txnid = query.get("txnid");
  const status = query.get("status");

  useEffect(() => {
    const saveOrder = async () => {
      try {
        const currentOrder = JSON.parse(localStorage.getItem("currentOrder") || "{}");
        if (!currentOrder.products) return;

        await addDoc(collection(db, "orders"), {
          txnid,
          amount: currentOrder.amount,
          status,
          products: currentOrder.products,
          user: currentOrder.user,
          createdAt: serverTimestamp()
        });

        localStorage.removeItem("currentOrder");
        dispatch(clearCart());
        setOrderSaved(true);
      } catch (err) {
        console.error("Error saving order:", err);
      }
    };

    if (status === "success" && txnid) saveOrder();
  }, [txnid, status, dispatch]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>✅ Payment Successful!</h2>
      <p>Transaction ID: {txnid}</p>
      <p>Amount Paid: ₹{JSON.parse(localStorage.getItem("currentOrder") || "{}").amount}</p>
      <p>Status: {status}</p>
      {orderSaved ? <p>Order saved successfully ✅</p> : <p>Saving order...</p>}
      <button onClick={() => navigate("/")}>Go Home</button>
    </div>
  );
};

export default PaymentSuccess;
