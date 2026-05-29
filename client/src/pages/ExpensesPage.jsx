import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { api } from "../api";

const initialForm = {
  tripId: "",
  type: "",
  amount: "",
  date: "",
  paidBy: "admin",
  description: "",
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [trips, setTrips] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(null);

  const loadExpenses = async () => {
    try {
      const res = await api.expenses.list({ page: 1, limit: 50 });
      setExpenses(res.data.data); // Fixed: was res.data.data.expenses (undefined)
    } catch (err) {
      setError("Unable to load expenses");
    }
  };

  const loadTrips = async () => {
    try {
      const res = await api.trips.list({ page: 1, limit: 50 });
      setTrips(res.data.data);
    } catch (err) {
      setError("Unable to load trips");
    }
  };

  useEffect(() => {
    loadExpenses();
    loadTrips();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      await api.expenses.create({
        ...form,
        amount: Number(form.amount),
      });
      setForm(initialForm);
      loadExpenses(); // Fixed: reload the list after creation
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add expense");
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content">
        <header className="page-header">
          <h1>Expenses</h1>
          <p>Record trip expenses and keep payments organized.</p>
        </header>

        {error && <div className="alert">{error}</div>}

        <section className="panel">
          <h2>Add expense</h2>
          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              Trip
              <select
                name="tripId"
                value={form.tripId}
                onChange={handleChange}
                required
              >
                <option value="">Select trip</option>
                {trips.map((trip) => (
                  <option key={trip._id} value={trip._id}>
                    {trip.source} → {trip.destination}{trip.truckId?.number ? ` (${trip.truckId.number})` : ""}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Type
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
              >
                <option value="">Select type</option>
                <option value="fuel">Fuel</option>
                <option value="maintenance">Maintenance</option>
                <option value="food">Food</option>
                <option value="toll">Toll</option>
                <option value="other">Other</option>
                <option value="driver_payment">Driver payment</option>
              </select>
            </label>
            <label>
              Amount
              <input
                name="amount"
                value={form.amount}
                onChange={handleChange}
                type="number"
                required
              />
            </label>
            <label>
              Date
              <input
                name="date"
                value={form.date}
                onChange={handleChange}
                type="date"
                required
              />
            </label>
            <label>
              Paid by
              <select name="paidBy" value={form.paidBy} onChange={handleChange}>
                <option value="admin">Admin</option>
                <option value="driver">Driver</option>
              </select>
            </label>
            <label className="full-width">
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
              />
            </label>
            <button className="button primary" type="submit">
              Save expense
            </button>
          </form>
        </section>

        <section className="panel">
          <h2>Expense list</h2>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Trip</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Paid by</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>
                      {expense.tripId?.source} → {expense.tripId?.destination}
                    </td>
                    <td style={{ textTransform: "capitalize" }}>{expense.type.replace("_", " ")}</td>
                    <td>${expense.amount}</td>
                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                    <td style={{ textTransform: "capitalize" }}>{expense.paidBy}</td>
                    <td style={{ color: "#8b949e" }}>{expense.description || "-"}</td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", color: "#8b949e" }}>No expenses found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
