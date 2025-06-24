import React, { useState } from "react"; // Import React and useState hook for managing local component state

// Define a list of supported currencies (fiat + crypto)
const currencies = [
  "USD", "EUR", "GBP", "CAD", "AUD", "JPY", "MAD", "ZAR", "INR", "BRL",
  "TRY", "HUF", "MXN", "THB", "NGN", "COP", "PEN",
  "BTC", "ETH", "USDT", "BNB", "SOL", "ADA", "AVAX", "XMR", "MATIC", "TRX", "LTC", "NEAR"
];

// Main app component
function App() {
  // State hooks to track user input and API results
  const [amount, setAmount] = useState(0); // Input amount from the user
  const [fromCurrency, setFromCurrency] = useState("BTC"); // Currency buyer pays in
  const [toCurrency, setToCurrency] = useState("USD"); // Currency seller wants
  const [result, setResult] = useState(null); // Full conversion result (optimization, commission, savings, etc.)
  const [preQuote, setPreQuote] = useState(null); // Direct pre-quote only (simple quote)
  const [loading, setLoading] = useState(false); // UI loading flag for async actions

  // Base URL for the backend API (served via ngrok or similar)
  const API_BASE = "https://9d28-80-115-236-238.ngrok-free.app";

  // Handle full conversion logic — this calls the /api/convert endpoint
  const handleConvert = async () => {
    setLoading(true);      // Start loading
    setPreQuote(null);     // Clear any existing pre-quote
    try {
      const response = await fetch(`${API_BASE}/api/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          from_currency: fromCurrency,
          to_currency: toCurrency,
        }),
      });
      const data = await response.json();
      setResult(data); // Set full result with optimization
    } catch (err) {
      console.error("Conversion failed", err); // Error logging
    }
    setLoading(false); // Stop loading
  };

  // Handle direct rate preview (pre-quote) — this calls the /api/prequote endpoint
  const handlePreQuote = async () => {
    setLoading(true);     // Start loading
    setResult(null);      // Clear any previous result
    try {
      const response = await fetch(`${API_BASE}/api/prequote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          from_currency: fromCurrency,
          to_currency: toCurrency,
        }),
      });
      const data = await response.json();
      if (data.direct_amount) {
        setPreQuote(data.direct_amount); // Set the pre-quoted amount (direct rate)
      } else {
        console.error("Unexpected prequote response:", data);
      }
    } catch (err) {
      console.error("Pre-quote failed", err); // Error logging
    }
    setLoading(false); // Stop loading
  };

  // Main render block
  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        padding: 30,
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#ffffff",
        color: "#1e1b4b",
        borderRadius: 10,
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <img
        src="/bridge-logo.png" // Local image path in /public folder
        alt="Bridge Logo"
        style={{
          height: 60,
          marginBottom: 20,
          backgroundColor: "#fff",
          padding: 6,
          borderRadius: 8,
        }}
      />
      <h1 style={{ fontSize: 26, color: "#6d28d9" }}>
        Bridge: Crypto/Fiat Converter
      </h1>

      {/* Buyer section */}
      <h2 style={{ marginTop: 30 }}>Buyer</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)} // Capture amount
        placeholder="Amount"
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 5,
          border: "1px solid #6d28d9",
          backgroundColor: "#f3f0ff",
          marginBottom: 10,
        }}
      />
      <select
        value={fromCurrency}
        onChange={(e) => setFromCurrency(e.target.value)} // Buyer currency selection
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 5,
          border: "1px solid #6d28d9",
          backgroundColor: "#f3f0ff",
          marginBottom: 10,
        }}
      >
        {currencies.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Seller section */}
      <h2>Seller</h2>
      <select
        value={toCurrency}
        onChange={(e) => setToCurrency(e.target.value)} // Seller currency selection
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 5,
          border: "1px solid #6d28d9",
          backgroundColor: "#f3f0ff",
        }}
      >
        {currencies.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Buttons for Pre-Quote and Convert actions */}
      <div style={{ display: "flex", gap: "10px", marginTop: 20 }}>
        <button
          onClick={handlePreQuote} // Trigger direct quote
          disabled={loading}
          style={{
            flex: 1,
            padding: 14,
            backgroundColor: "#ede9fe",
            color: "#6d28d9",
            border: "1px solid #6d28d9",
            borderRadius: 5,
            fontWeight: "bold",
          }}
        >
          {loading ? "Loading..." : "Get Pre-Quote"}
        </button>
        <button
          onClick={handleConvert} // Trigger full optimized conversion
          disabled={loading}
          style={{
            flex: 1,
            padding: 14,
            backgroundColor: "#6d28d9",
            color: "white",
            border: "none",
            borderRadius: 5,
            fontWeight: "bold",
          }}
        >
          {loading ? "Converting..." : "Convert & Pay"}
        </button>
      </div>

      {/* Pre-quote result display */}
      {preQuote && (
        <div
          style={{
            marginTop: 30,
            padding: 20,
            backgroundColor: "#fdf4ff",
            borderRadius: 8,
            color: "#1e1b4b",
            border: "1px dashed #c084fc",
          }}
        >
          <p>
            <strong>Pre-Quoted Amount:</strong> {preQuote} {toCurrency}
          </p>
        </div>
      )}

      {/* Full conversion result display */}
      {result && (
        <div
          style={{
            marginTop: 30,
            padding: 20,
            backgroundColor: "#f3f0ff",
            borderRadius: 8,
            color: "#1e1b4b",
          }}
        >
          <p>
            <strong>Amount Sent:</strong> {amount} {fromCurrency}
          </p>
          <p>
            <strong>Direct Rate Amount:</strong> {result.direct_amount} {toCurrency}
          </p>
          <p>
            <strong>Actual Amount (Optimized):</strong> {result.converted_amount} {toCurrency}
          </p>
          <p>
            <strong>Optimized Exchange Rate:</strong> {result.optimized_rate || "N/A"}
          </p>
          <p>
            <strong>Direct Path:</strong> {fromCurrency} → USD → {toCurrency}
          </p>
          <p>
            <strong>Full Optimized Path:</strong> {result.exchange_path?.join(" → ") || "N/A"}
          </p>
          <p>
            <strong>Savings:</strong> {result.savings}
          </p>
          <p>
            <strong>Commission:</strong> {result.commission}
          </p>
        </div>
      )}

      {/* Arbitrage profit badge (only shown if profit exists) */}
      {result && result.arbitrage_profit > 0 && (
        <div
          style={{
            marginTop: 20,
            padding: 20,
            backgroundColor: "#fee2e2",
            borderRadius: 8,
            color: "#991b1b",
            fontWeight: "bold",
            border: "1px solid #dc2626",
          }}
        >
          Arbitrage Profit Earned: {result.arbitrage_profit} {toCurrency}
        </div>
      )}
    </div>
  );
}

export default App;
