import React, { useState } from "react"; // Import React and useState hook 

//set the currencies array with a mix of fiat and crypto currencies
const currencies = [
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "JPY",
  "MAD",
  "ZAR",
  "INR",
  "BRL",
  "TRY",
  "HUF",
  "MXN",
  "THB",
  "NGN",
  "COP",
  "PEN",
  "BTC",
  "ETH",
  "USDT",
  "BNB",
  "SOL",
  "ADA",
  "AVAX",
  "XMR",
  "MATIC",
  "TRX",
  "LTC",
  "NEAR",
];

// Main App components, being the input fields, buttons, and result display
function App() {
  const [amount, setAmount] = useState(0);
  const [fromCurrency, setFromCurrency] = useState("BTC");
  const [toCurrency, setToCurrency] = useState("USD");
  const [result, setResult] = useState(null);
  const [preQuote, setPreQuote] = useState(null);
  const [loading, setLoading] = useState(false);

  // Base API URL for the conversion service
  const API_BASE = "https://8720-80-115-236-238.ngrok-free.app";

  // Function to handle the conversion process through the API and if successful, set the result state
  // If the conversion fails, it will log the error to the console
  const handleConvert = async () => {
    setLoading(true);
    setPreQuote(null);
    try {
      const response = await fetch(`${API_BASE}/api/convert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          from_currency: fromCurrency,
          to_currency: toCurrency,
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Conversion failed", err);
    }
    setLoading(false);
  };

  const handlePreQuote = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(`${API_BASE}/api/convert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          from_currency: fromCurrency,
          to_currency: toCurrency,
        }),
      });
      const data = await response.json();
      setPreQuote(data.direct_amount);
    } catch (err) {
      console.error("Pre-quote failed", err);
    }
    setLoading(false);
  };

  // Main render function that displays the UI components
  // It includes input fields for amount and currency selection, buttons for actions, and displays results
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
        src="/bridge-logo.png" // Ensure you have the bridge logo image in the public folder - this loads the image
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

      <h2 style={{ marginTop: 30 }}>Buyer</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)} // Handle amount input 
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
        onChange={(e) => setFromCurrency(e.target.value)} // Handle currency selection for buyer
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

      <h2>Seller</h2>
      <select
        value={toCurrency}
        onChange={(e) => setToCurrency(e.target.value)} // Handle currency selection for seller
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

      <div style={{ display: "flex", gap: "10px", marginTop: 20 }}>
        <button
          onClick={handlePreQuote} // Handle pre-quote request
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
          onClick={handleConvert} // Handle conversion request
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
            <strong>Direct Rate Amount:</strong> {result.direct_amount}{" "}
            {toCurrency}
          </p>
          <p>
            <strong>Actual Amount (Optimized):</strong>{" "}
            {result.converted_amount} {toCurrency}
          </p>
          <p>
            <strong>Optimized Exchange Rate:</strong>{" "}
            {result.optimized_rate || "N/A"}
          </p>
          <p>
            <strong>Direct Path:</strong> {fromCurrency} → USD → {toCurrency}
          </p>
          <p>
            <strong>Full Optimized Path:</strong>{" "}
            {result.exchange_path?.join(" → ") || "N/A"}
          </p>
          <p>
            <strong>Savings:</strong> {result.savings}
          </p>
          <p>
            <strong>Commission:</strong> {result.commission}
          </p>
        </div>
      )}

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
        </div> // Display arbitrage profit if available
      )}
    </div>
  );
}

export default App;
