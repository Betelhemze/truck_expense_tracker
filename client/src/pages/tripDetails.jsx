import { useEffect, useState } from "react";
import { api } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/tripDetails.css";
export default function TripDetailsPage() {
  const { id } = useParams(); // trip id from route
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    loadTrip();
  }, []);

  const loadTrip = async () => {
    const res = await api.trips.get(id); // assumes api.trips.get exists
    setTrip(res.data.data);
  };

  const handleSave = async () => {
    await api.trips.update(id, trip);
    navigate("/trips");
  };

  if (!trip) return <p>Loading trip details...</p>;

  return (
    <div className="trip-details-page">
      <h2>Trip Details</h2>
      <p>
        {trip.source} → {trip.destination}
      </p>

      {/* Summary */}
      <div className="summary">
        <div className="summary-card">Load Type: {trip.loadType}</div>
        <div className="summary-card">Status: {trip.status}</div>
        <div className="summary-card">Departure Date: {trip.departureDate}</div>
        <div className="summary-card">Income: ${trip.income}</div>
      </div>

      {/* Expenses */}
      <div className="info-section">
        <h3>Expenses ({trip.expenses.length})</h3>
        <ul>
          {trip.expenses.map((exp, idx) => (
            <li key={idx}>
              <strong>{exp.type}</strong> — {exp.detail}, {exp.date}, $
              {exp.amount}
            </li>
          ))}
        </ul>
      </div>

      {/* Totals */}
      <div className="info-section">
        <p>
          <strong>Total Income:</strong> ${trip.totalIncome}
        </p>
        <p>
          <strong>Total Expense:</strong> ${trip.totalExpense}
        </p>
        <p>
          <strong>Net Profit:</strong> ${trip.netProfit}
        </p>
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button
          type="button"
          className="cancel-btn"
          onClick={() => navigate("/trips")}
        >
          Cancel
        </button>
        <button type="button" className="save-btn" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
