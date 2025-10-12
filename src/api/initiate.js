import express from "express";
import crypto from "crypto";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const MERCHANT_KEY = "stC980";
const MERCHANT_SALT = "oA7WVALtBJj3FEQPEkwr8tbGcavLMWLp";
const PAYU_BASE_URL = "https://test.payu.in/_payment"; // Sandbox
// <https://test.payu.in/_payment>
app.post("/payu/initiate", (req, res) => {
  const { amount, firstname, email, phone, productinfo } = req.body;

  const txnid = "txn_" + new Date().getTime();

  // Hash sequence
  const hashString = `${MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${MERCHANT_SALT}`;
  const hash = crypto.createHash("sha512").update(hashString).digest("hex");

  const payuParams = {
    key: MERCHANT_KEY,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    phone,
    surl: "http://localhost:3000/payment-success",
    furl: "http://localhost:3000/payment-fail",
    hash,
  };

  res.json({ action: PAYU_BASE_URL, params: payuParams });
});

app.listen(5000, () => console.log("Server running on 5000"));
