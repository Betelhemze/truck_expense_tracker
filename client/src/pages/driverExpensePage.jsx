import { useEffect, useState } from "react";
import { api } from "../api";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/driverExpense.css";

export default function DriverExpensePage() {
  const { id } = useParams(); // trip id
  const navigate = useNavigate();
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
    const res = await api.trips.get(id);
    setTrip(res.data.data);
  };

  const handleChange = (e) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    await api.expenses.create({ ...newExpense, tripId: id });
    setNewExpense({ type: "", amount: "", description: "", date: "" });
    loadTrip();
  };

  const handleFinishTrip = async () => {
    await api.trips.finish(id);
    navigate("/trips");
  };

  if (!trip) return <p>Loading trip...</p>;

  return (
    <div className="driver-expense-page">
      <h2>Add Expense</h2>
      <p>
        {trip.source} → {trip.destination}
      </p>

      {/* Trip Information */}
      <div className="info-section">
        <h3>Trip Information</h3>
        <p>Truck: {trip.truck?.number}</p>
        <p>Driver: {trip.driver?.name}</p>
        <p>Load Type: {trip.loadType}</p>
        <p>Departure Date: {trip.departureDate}</p>
      </div>

      {/* Add New Expense */}
      <div className="info-section">
        <h3>Add New Expense</h3>
        <form onSubmit={handleAddExpense} className="expense-form">
          <input
            type="text"
            name="type"
            placeholder="Expense Type (Fuel, Toll, etc.)"
            value={newExpense.type}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description (e.g., driver payment)"
            value={newExpense.description}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date"
            value={newExpense.date}
            onChange={handleChange}
            required
          />
          <button type="submit" className="add-btn">
            Add Expense
          </button>
        </form>
      </div>

      {/* Expense Added */}
      <div className="info-section">
        <h3>Expenses Added ({trip.expenses.length})</h3>
        <ul>
          {trip.expenses.map((exp, idx) => (
            <li key={idx}>
              <strong>{exp.type}</strong> — {exp.description}, {exp.date},
              <span className="expense-amount">${exp.amount}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Completion Section */}
      <div className="info-section finish-section">
        <h3>Trip Completed?</h3>
        <p>Review all expenses and mark this trip as finished</p>
        <button className="finish-btn" onClick={handleFinishTrip}>
          Mark as Finished
        </button>
      </div>
    </div>
  );
}
