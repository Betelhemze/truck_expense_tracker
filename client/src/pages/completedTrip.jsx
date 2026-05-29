import { useEffect, useState } from "react";
import { api } from "../api";

export default function TripDetailsPage({ tripId }) {
  const [trip, setTrip] = useState(null);
  const [newExpense, setNewExpense] = useState({
    type: "",
    amount: "",
    description: "",
    date: "",
  });

  useEffect(() => {
    loadTrip();
  }, []);

  const loadTrip = async () => {
    const res = await api.trips.get(tripId); // assumes api.trips.get exists
    setTrip(res.data.data);
  };

  const handlePaymentUpdate = async () => {
    await api.trips.updatePayment(tripId, { received: trip.paymentReceived });
    loadTrip();
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    await api.expenses.create({ ...newExpense, tripId, createdBy: "admin" });
    setNewExpense({ type: "", amount: "", description: "", date: "" });
    loadTrip();
  };

  const handleFinishTrip = async () => {
    await api.trips.finish(tripId);
    loadTrip();
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
        <button className="update-btn" onClick={handlePaymentUpdate}>
          Update Payment Received
        </button>
      </div>

      {/* Add Admin Expense */}
      <div className="info-section">
        <h3>Add Admin Expense</h3>
        <form onSubmit={handleAddExpense} className="expense-form">
          <input
            placeholder="Expense Type"
            value={newExpense.type}
            onChange={(e) =>
              setNewExpense({ ...newExpense, type: e.target.value })
            }
            required
          />
          <input
            placeholder="Amount"
            type="number"
            value={newExpense.amount}
            onChange={(e) =>
              setNewExpense({ ...newExpense, amount: e.target.value })
            }
            required
          />
          <input
            placeholder="Description"
            value={newExpense.description}
            onChange={(e) =>
              setNewExpense({ ...newExpense, description: e.target.value })
            }
            required
          />
          <input
            type="date"
            value={newExpense.date}
            onChange={(e) =>
              setNewExpense({ ...newExpense, date: e.target.value })
            }
            required
          />
          <button type="submit" className="add-btn">
            Add Expense
          </button>
        </form>
      </div>

      {/* Driver Expenses */}
      <div className="info-section">
        <h3>Driver Expenses ({trip.driverExpenses.length})</h3>
        <ul>
          {trip.driverExpenses.map((exp, idx) => (
            <li key={idx}>
              ${exp.amount} — {exp.type}, {exp.detail}, {exp.date}
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
              ${exp.amount} — {exp.type}, {exp.detail}, {exp.date}
            </li>
          ))}
        </ul>
      </div>

      {/* Completion Section */}
      <div className="info-section finish-section">
        <h3>Ready to finish?</h3>
        <p>Review all expenses and mark this trip as finished</p>
        <button className="finish-btn" onClick={handleFinishTrip}>
          Mark as Finished
        </button>
      </div>
    </div>
  );
}
