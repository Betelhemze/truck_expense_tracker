import { useEffect, useState } from "react";
import { api } from "../api";
import "../styles/finishedTrip.css";

export default function TripDetailsPage({ tripId }) {
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    loadTrip();
  }, []);

  const loadTrip = async () => {
    const res = await api.trips.get(tripId); // assumes api.trips.get exists
    setTrip(res.data.data);
  };

  if (!trip) return <p>Loading trip details...</p>;

  return (
    <div className="trip-details-page">
      <header className="trip-header">
        <div>
          <h2>Trip Details</h2>
          <p>
            {trip.source} → {trip.destination}
          </p>
        </div>
        <button className="export-btn">Export to Excel</button>
      </header>

      {/* Summary */}
      <div className="summary">
        <div className="summary-card">Trip Income: ${trip.income}</div>
        <div className="summary-card">Total Expense: ${trip.totalExpense}</div>
        <div className="summary-card">
          Driver: ${trip.driverExpense} / Admin: ${trip.adminExpense}
        </div>
        <div className="summary-card">Net Profit: ${trip.netProfit}</div>
      </div>

      {/* Trip Information */}
      <div className="info-section">
        <h3>Trip Information</h3>
        <p>Truck: {trip.truck?.number}</p>
        <p>Driver: {trip.driver?.name}</p>
        <p>Load Type: {trip.loadType}</p>
        <p>Departure Date: {trip.departureDate}</p>
      </div>

      {/* Payment Tracking */}
      <div className="info-section">
        <h3>Payment Tracking</h3>
        <p>Total Income: ${trip.income}</p>
        <p>Payment Received: ${trip.paymentReceived}</p>
        <p>Payment Pending: ${trip.paymentPending}</p>
        <p>Status: {trip.status}</p>
      </div>

      {/* Driver Expenses */}
      <div className="info-section">
        <h3>Driver Expenses ({trip.driverExpenses.length})</h3>
        <ul>
          {trip.driverExpenses.map((exp, idx) => (
            <li key={idx}>
              ${exp.amount} — {exp.type} ({exp.detail}) — {exp.date}
            </li>
          ))}
        </ul>
      </div>

      {/* Admin Expenses */}
      <div className="info-section">
        <h3>Admin Expenses ({trip.adminExpenses.length})</h3>
        <ul>
          {trip.adminExpenses.map((exp, idx) => (
            <li key={idx}>
              ${exp.amount} — {exp.type} ({exp.detail}) — {exp.date}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
