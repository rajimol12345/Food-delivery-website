// src/Components/UpiPayment.jsx
import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import "./UpiPayment.css";

function UpiPayment({ amount, onSuccess }) {
  const [isGPayReady, setIsGReady] = useState(false);
  const [gpayError, setGPayError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const paymentAmount = Number(amount);

  const upiLink = `upi://pay?pa=yourupiid@bank&pn=DemoShop&am=${paymentAmount}&cu=INR&tn=Order123`;

  useEffect(() => {
    if (isNaN(paymentAmount) || paymentAmount <= 0) return;

    let script;
    if (document.getElementById("gpay-script")) {
      setIsGReady(true);
    } else {
      script = document.createElement("script");
      script.id = "gpay-script";
      script.src = "https://pay.google.com/gp/p/js/pay.js";
      script.async = true;
      script.onload = () => setIsGReady(true);
      script.onerror = () => setGPayError(true);
      document.body.appendChild(script);
    }

    return () => {
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [paymentAmount]);

  useEffect(() => {
    if (!isGPayReady || gpayError || isNaN(paymentAmount) || paymentAmount <= 0 || !window.google) return;

    try {
      const paymentsClient = new window.google.payments.api.PaymentsClient({ environment: "TEST" });
      const baseRequest = { apiVersion: 2, apiVersionMinor: 0 };
      const allowedPaymentMethods = [{
        type: "CARD",
        parameters: { allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"], allowedCardNetworks: ["VISA", "MASTERCARD"] },
        tokenizationSpecification: { type: "PAYMENT_GATEWAY", parameters: { gateway: "example", gatewayMerchantId: "exampleMerchantId" } }
      }];

      paymentsClient.isReadyToPay({ ...baseRequest, allowedPaymentMethods })
        .then(response => {
          if (response.result) {
            const container = document.getElementById("gpay-container");
            if (container && container.childNodes.length === 0) {
              container.appendChild(paymentsClient.createButton({
                onClick: () => {
                  paymentsClient.loadPaymentData({
                    ...baseRequest, allowedPaymentMethods,
                    transactionInfo: { totalPriceStatus: "FINAL", totalPrice: paymentAmount.toFixed(2), currencyCode: "INR", countryCode: "IN" },
                    merchantInfo: { merchantId: "BCR2DN6TVH6K6K6K", merchantName: "Demo Shop" }
                  }).then(() => onSuccess("Google Pay")).catch(console.error);
                },
                buttonColor: "black"
              }));
            }
          } else setGPayError(true);
        }).catch(() => setGPayError(true));
    } catch (e) { console.error(e); }
  }, [isGPayReady, gpayError, paymentAmount, onSuccess]);

  return (
    <div className="upi-payment-container">
      <h2>Pay with Google Pay / UPI</h2>
      <div id="gpay-container" style={{ margin: "20px 0" }}></div>
      {gpayError && <p style={{ color: "red" }}>Google Pay unavailable. Use QR code.</p>}
      <p style={{ textAlign: "center" }}>OR</p>
      <div className="upi-qr">
        <QRCodeSVG value={upiLink} size={200} />
        <button className="confirm-payment-btn" onClick={() => onSuccess("QR")} disabled={isVerifying}>
          {isVerifying ? "Verifying..." : "I Have Paid via QR"}
        </button>
      </div>
      <div className="demo-bypass">
        <button className="bypass-btn" onClick={() => onSuccess("Bypass")}>Simulate Success</button>
      </div>
    </div>
  );
}

export default UpiPayment;
