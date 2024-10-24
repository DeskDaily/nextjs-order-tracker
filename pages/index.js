import { useState } from 'react';

export default function Home() {
  const [customerID, setCustomerID] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/query-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerID, orderNumber })
      });

      const data = await response.json();
      setResult(data.data);
      setShowContact(true);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <img src="/public/TSFLOGO.png" alt="The Signage Factory Logo" />

      <h1>Order Tracker</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="customerID">Unique Customer ID:</label>
        <input
          type="text"
          id="customerID"
          value={customerID}
          onChange={(e) => setCustomerID(e.target.value)}
          required
        />

        <label htmlFor="orderNumber">Order Number:</label>
        <input
          type="text"
          id="orderNumber"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          required
        />

        <button type="submit">Submit</button>
      </form>

      {loading && (
        <div id="loading" className="loading">
          <div className="loader"></div>
          <p>Loading...</p>
        </div>
      )}

      {result && (
        <div id="orderResult" className="result">
          <p><strong>Customer Company Name:</strong> {result.customerCompanyName}</p>
          <p><strong>Project Name:</strong> {result.projectName}</p>
          <p><strong>Order Number:</strong> {result.orderNumber}</p>
          <p><strong>Order Status:</strong> {result.orderStatus}</p>

          {result.depositInvoice && (
            <>
              <div style={{ height: '20px' }}></div>
              <p><strong>Deposit Invoice:</strong> <a href={result.depositInvoice} target="_blank">View PDF</a></p>
              <p><strong>Balance Invoice:</strong> <a href={result.balanceInvoice} target="_blank">View PDF</a></p>
            </>
          )}

          {result.expectedShipDate && (
            <>
              <div style={{ height: '20px' }}></div>
              <p><strong>Expected Ship Date:</strong> {result.expectedShipDate}</p>
              <p><strong>Actual Ship Date:</strong> {result.actualShipDate}</p>
              <p><strong>Courier:</strong> {result.courier}</p>
              <p><strong>Tracking Number:</strong> {result.trackingNumber}</p>
              <p><strong>Ship to Address:</strong> {result.shipToAddress}</p>
            </>
          )}
        </div>
      )}

      {showContact && (
        <div id="contactInfo" className="contact">
          <p>If you have questions or concerns about your order, email <a href="mailto:jj@thesignagefactory.com">jj@thesignagefactory.com</a> / cc: <a href="mailto:quotes@thesignagefactory.co">quotes@thesignagefactory.co</a></p>
          <p>Indicate the order number and/or the project name on the subject line.</p>
        </div>
      )}

      <style jsx>{`
        body {
          font-family: Arial, sans-serif;
          background-color: #f0f2f5;
          padding: 20px;
          margin: 0;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }
        .container {
          text-align: center;
          width: 100%;
          max-width: 400px;
        }
        h1 {
          color: #333;
          font-size: 24px;
        }
        img {
          max-width: 350px;
          display: block;
          margin: 0 auto 10px;
        }
        form {
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-top: 10px;
          color: #555;
        }
        input {
          padding: 10px;
          margin-top: 5px;
          width: 100%;
          max-width: 300px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        button {
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        button:hover {
          background-color: #218838;
        }
        .result {
          margin-top: 20px;
          padding: 20px;
          background-color: #fff;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          text-align: left;
        }
        .loading {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .loader {
          border: 8px solid #f3f3f3;
          border-top: 8px solid #3498db;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .contact {
          margin-top: 20px;
          padding: 20px;
          background-color: #fff;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          text-align: left;
          color: #555;
        }
      `}</style>
    </div>
  );
}
