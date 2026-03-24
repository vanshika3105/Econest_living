import { useState, useEffect, useRef } from "react";

export default function RazorpayMock({ amount, userDetails, onSuccess, onClose }) {
  const [method, setMethod] = useState("upi");
  const [step, setStep] = useState("input"); // input, processing, success
  const [cardNumber, setCardNumber] = useState("");
  const [upiId, setUpiId] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    // Prevent scrolling on body when modal is open
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const handlePay = () => {
    if (method === "card" && cardNumber.length < 16) return;
    if (method === "upi" && !upiId.includes("@")) return;

    setStep("processing");
    setTimeout(() => {
      setStep("success");
      setTimeout(() => {
        onSuccess({
          razorpay_payment_id: "pay_" + Math.random().toString(36).substring(2, 10).toUpperCase(),
          razorpay_order_id: "order_" + Math.random().toString(36).substring(2, 10).toUpperCase(),
          razorpay_signature: "mock_signature_abc123"
        });
      }, 1500);
    }, 2000);
  };

  const formatPrice = (p) => `₹${Number(p).toLocaleString("en-IN")}`;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
      fontFamily: "'-apple-system', BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    }}>
      <div 
        ref={modalRef}
        style={{
          width: 380, height: 620, background: "#ffffff",
          borderRadius: 8, overflow: "hidden", display: "flex", flexDirection: "column",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          position: "relative",
          animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1)"
        }}
      >
        {/* Header - Razorpay styled */}
        <div style={{ background: "#2B82F6", color: "white", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>EcoNest Living</div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>Order #{(Math.random()*100000).toFixed(0)}</div>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: "white", opacity: 0.8, cursor: "pointer", padding: 0, fontSize: 24, lineHeight: 1
          }}>&times;</button>
        </div>

        {/* Amount Strip */}
        <div style={{ background: "#1b6ee6", color: "white", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 13, opacity: 0.9 }}>{userDetails?.email || "guest@example.com"}</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{formatPrice(amount)}</div>
        </div>

        {/* Test Mode Banner */}
        <div style={{ background: "#FFF3CD", color: "#856404", padding: "8px", fontSize: 12, textAlign: "center", fontWeight: 600 }}>
          TEST MODE
        </div>

        {/* Content Area */}
        {step === "input" && (
          <div style={{ display: "flex", flex: 1, backgroundColor: "#F7F8F9" }}>
            {/* Sidebar Methods */}
            <div style={{ width: 110, background: "#ffffff", borderRight: "1px solid #EAEAEA" }}>
              {[
                { id: "upi", label: "UPI", icon: "📱" },
                { id: "card", label: "Card", icon: "💳" },
                { id: "netbanking", label: "Netbanking", icon: "🏦" },
                { id: "wallet", label: "Wallet", icon: "💼" },
              ].map(m => (
                <div 
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  style={{
                    padding: "16px 12px", fontSize: 13, fontWeight: 600,
                    cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                    color: method === m.id ? "#2B82F6" : "#555",
                    background: method === m.id ? "#F2F7FF" : "transparent",
                    borderLeft: `3px solid ${method === m.id ? "#2B82F6" : "transparent"}`,
                    transition: "all 0.2s"
                  }}
                >
                  <span style={{ fontSize: 20 }}>{m.icon}</span>
                  {m.label}
                </div>
              ))}
            </div>

            {/* Form Area */}
            <div style={{ flex: 1, padding: 24, background: "#F7F8F9", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#222", marginBottom: 20 }}>
                {method === "upi" && "Pay using UPI"}
                {method === "card" && "Add New Card"}
                {method === "netbanking" && "Select Bank"}
                {method === "wallet" && "Select Wallet"}
              </div>

              {method === "upi" && (
                <div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>Enter UPI ID</div>
                  <input 
                    type="text" 
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="name@okhdfcbank"
                    style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: 4, outline: "none", fontSize: 14, boxSizing: "border-box" }}
                  />
                  <div style={{ fontSize: 11, color: "#888", marginTop: 8 }}>A payment request will be sent to this UPI ID</div>
                </div>
              )}

              {method === "card" && (
                <div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>Card Number</div>
                  <input 
                    type="text" 
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').substring(0, 16))}
                    placeholder="4111 1111 1111 1111"
                    style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: 4, outline: "none", fontSize: 14, boxSizing: "border-box", marginBottom: 12 }}
                  />
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>Expiry</div>
                      <input type="text" placeholder="MM/YY" style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: 4, outline: "none", fontSize: 14, boxSizing: "border-box" }}/>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>CVV</div>
                      <input type="password" placeholder="123" maxLength="3" style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: 4, outline: "none", fontSize: 14, boxSizing: "border-box" }}/>
                    </div>
                  </div>
                </div>
              )}

              {(method === "netbanking" || method === "wallet") && (
                <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>
                  Please select any bank/wallet from the list. (Mock simulation: just click Pay Now)
                </div>
              )}

              <div style={{ marginTop: "auto" }}>
                <button 
                  onClick={handlePay}
                  style={{
                    width: "100%", padding: 14, background: "#2B82F6", color: "white",
                    border: "none", borderRadius: 4, fontSize: 15, fontWeight: 700,
                    cursor: "pointer", boxShadow: "0 4px 12px rgba(43,130,246,0.3)"
                  }}
                >
                  Pay {formatPrice(amount)}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Processing State */}
        {step === "processing" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#fff" }}>
            <div style={{ 
              width: 50, height: 50, border: "4px solid #f3f3f3", borderTop: "4px solid #2B82F6",
              borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: 20
            }} />
            <div style={{ fontSize: 16, fontWeight: 600, color: "#333", marginBottom: 8 }}>Processing Payment...</div>
            <div style={{ fontSize: 13, color: "#666" }}>Please do not close this window</div>
            
            <style>{`
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
          </div>
        )}

        {/* Success State */}
        {step === "success" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#fff" }}>
            <div style={{ 
              width: 70, height: 70, borderRadius: "50%", background: "#22c55e",
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
              boxShadow: "0 0 0 10px rgba(34,197,94,0.1)"
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#22c55e", marginBottom: 8 }}>Payment Successful</div>
            <div style={{ fontSize: 14, color: "#666" }}>Redirecting you back...</div>
          </div>
        )}

        {/* Footer */}
        <div style={{ padding: "12px", background: "#f8f9fa", borderTop: "1px solid #eaeaea", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#888" }}>Powered by</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#113c7a", letterSpacing: 0.5 }}>Razorpay</span>
        </div>
      </div>
    </div>
  );
}
