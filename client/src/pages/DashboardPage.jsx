import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { api } from "../api";
import { Bar, Line, Pie } from "react-chartjs-2";
import { useAuth } from "../AuthContext";
import "../styles/adminDashboard.css";
import "chart.js/auto";

export default function DashboardPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [expenseForm, setExpenseForm] = useState({
    type: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });
  const [expenseError, setExpenseError] = useState(null);
  const [expenseSuccess, setExpenseSuccess] = useState(null);

  const loadDashboard = () => {
    api.dashboard.get()
      .then((res) => {
        setMetrics(res.data.data);
      })
      .catch((err) => {
        console.error("Error loading dashboard data", err);
      });
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (!metrics) {
    return (
      <div className="app-shell">
        <Sidebar />
        <main className="content" style={{ display: "grid", placeItems: "center", minHeight: "80vh" }}>
          <p>Loading dashboard...</p>
        </main>
      </div>
    );
  }

  // --- DRIVER HANDLERS ---
  const activeTrip = metrics.recentTrips?.find((t) => t.status === "active");

  const handleLogExpense = async (e) => {
    e.preventDefault();
    setExpenseError(null);
    setExpenseSuccess(null);
    try {
      await api.expenses.create({
        tripId: activeTrip._id,
        type: expenseForm.type,
        amount: Number(expenseForm.amount),
        date: expenseForm.date,
        paidBy: "driver",
        description: expenseForm.description,
      });
      setExpenseForm({
        type: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });
      setExpenseSuccess("Expense logged successfully!");
      loadDashboard();
    } catch (err) {
      setExpenseError(err.response?.data?.message || "Failed to log expense");
    }
  };

  const handleCompleteTrip = async () => {
    setExpenseError(null);
    setExpenseSuccess(null);
    if (!window.confirm("Are you sure you want to mark this trip as completed?")) return;
    try {
      await api.trips.update(activeTrip._id, { status: "completed" });
      setExpenseSuccess("Trip marked as completed!");
      loadDashboard();
    } catch (err) {
      setExpenseError(err.response?.data?.message || "Failed to update trip status");
    }
  };

  // --- ADMIN RENDER LOGIC ---
  if (user?.role === "admin") {
    const latestMonthRevenue = metrics.monthly?.revenue?.length
      ? metrics.monthly.revenue[metrics.monthly.revenue.length - 1]
      : 0;

    // Line chart: Monthly Revenue & Profit
    const lineData = {
      labels: metrics.monthly?.labels || [],
      datasets: [
        {
          label: "Revenue",
          data: metrics.monthly?.revenue || [],
          borderColor: "#f39c12",
          tension: 0.3,
          fill: false,
        },
        {
          label: "Profit",
          data: metrics.monthly?.profit || [],
          borderColor: "#3498db",
          tension: 0.3,
          fill: false,
        },
      ],
    };

    // Pie chart: Expense Breakdown
    const pieData = {
      labels: Object.keys(metrics.expensesBreakdown || {}),
      datasets: [
        {
          data: Object.values(metrics.expensesBreakdown || {}).map((item) => item.amount),
          backgroundColor: ["#f39c12", "#e74c3c", "#3498db", "#2ecc71", "#9b59b6", "#1abc9c"],
        },
      ],
    };

    // Bar chart: Profit per Truck
    const barData = {
      labels: (metrics.truckProfits || []).map((t) => t.truck),
      datasets: [
        {
          label: "Profit",
          data: (metrics.truckProfits || []).map((t) => t.profit),
          backgroundColor: "#1abc9c",
        },
      ],
    };

    return (
      <div className="app-shell">
        <Sidebar />
        <main className="content">
          <header className="page-header">
            <h1>Admin Dashboard</h1>
            <p>Overview of your truck business</p>
          </header>

          {/* Summary Cards */}
          <div className="cards" style={{ marginBottom: "2rem" }}>
            <div className="card">
              <h2>Total Revenue</h2>
              <p>${metrics.totalRevenue}</p>
            </div>
            <div className="card">
              <h2>Total Expense</h2>
              <p>${metrics.totalExpense}</p>
            </div>
            <div className="card">
              <h2>Net Profit</h2>
              <p>${metrics.netProfit}</p>
            </div>
            <div className="card">
              <h2>Monthly Revenue (Latest)</h2>
              <p>${latestMonthRevenue}</p>
            </div>
            <div className="card">
              <h2>Active Trucks</h2>
              <p>{metrics.activeTrucks}</p>
            </div>
            <div className="card">
              <h2>Total Drivers</h2>
              <p>{metrics.totalDrivers}</p>
            </div>
            <div className="card">
              <h2>Total Trips</h2>
              <p>{metrics.totalTrips}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="charts" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            <div className="chart" style={{ padding: "1.5rem", borderRadius: "14px" }}>
              <h3>Monthly Revenue & Profit</h3>
              <Line data={lineData} />
            </div>

            <div className="chart" style={{ padding: "1.5rem", borderRadius: "14px" }}>
              <h3>Expense Breakdown</h3>
              <Pie data={pieData} />
            </div>

            <div className="chart" style={{ padding: "1.5rem", borderRadius: "14px" }}>
              <h3>Profit per Truck</h3>
              <Bar data={barData} />
            </div>
          </div>

          {/* Driver Performance */}
          <section className="panel" style={{ marginTop: "2rem" }}>
            <h2>Driver Performance</h2>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Driver</th>
                    <th>Trips</th>
                    <th>Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {(metrics.driverPerformance || []).map((d, index) => (
                    <tr key={index}>
                      <td>{d.driver}</td>
                      <td>{d.trips}</td>
                      <td>${d.profit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // --- DRIVER RENDER LOGIC ---
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content">
        <header className="page-header">
          <h1>Driver Dashboard!!</h1>
          <p>Manage your assigned trips and expenses</p>
        </header>

        {/* Welcome Banner */}
        <div
          className="panel"
          style={{
            marginBottom: "2rem",
            background: "linear-gradient(135deg, #0e2b5c 0%, #173b75 100%)",
            border: "1px solid rgba(56, 139, 253, 0.2)",
          }}
        >
          <h2 style={{ margin: 0 }}>Welcome back, {user?.fullName}!</h2>
          {metrics.truck ? (
            <p style={{ margin: "0.5rem 0 0", color: "#8b949e" }}>
              Assigned Truck: <strong>{metrics.truck.number}</strong> (
              {metrics.truck.model} • {metrics.truck.licensePlate})
            </p>
          ) : (
            <p style={{ margin: "0.5rem 0 0", color: "#ff7b72" }}>
              You do not have an assigned truck currently. Please contact
              administration.
            </p>
          )}
        </div>

        {/* Metrics Cards */}
        <div className="cards" style={{ marginBottom: "2rem" }}>
          <div className="card">
            <h2>Total Trips</h2>
            <p>{metrics.totalTrips}</p>
          </div>
          <div className="card">
            <h2>Active Trips</h2>
            <p>{metrics.activeTrips}</p>
          </div>
          <div className="card">
            <h2>Completed Trips</h2>
            <p>{metrics.completedTrips}</p>
          </div>
          <div className="card">
            <h2>Total Earnings</h2>
            <p>${metrics.totalIncome}</p>
          </div>
          <div className="card">
            <h2>Net Profit</h2>
            <p>${metrics.netProfit}</p>
          </div>
        </div>

        {/* Active Trip Quick Log Form */}
        {activeTrip ? (
          <section className="panel" style={{ marginBottom: "2rem" }}>
            <h2>
              Active Trip: {activeTrip.source} → {activeTrip.destination}
            </h2>
            <p
              style={{
                color: "#8b949e",
                marginTop: "-0.5rem",
                marginBottom: "1.5rem",
              }}
            >
              Log expenses or complete this trip.
            </p>

            {expenseError && <div className="alert">{expenseError}</div>}
            {expenseSuccess && (
              <div
                className="alert"
                style={{
                  background: "rgba(46, 164, 79, 0.15)",
                  color: "#2ea44f",
                }}
              >
                {expenseSuccess}
              </div>
            )}

            <form onSubmit={handleLogExpense} className="form-grid">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                }}
              >
                <label>
                  Expense Type
                  <select
                    value={expenseForm.type}
                    onChange={(e) =>
                      setExpenseForm({ ...expenseForm, type: e.target.value })
                    }
                    required
                  >
                    <option value="">Select type</option>
                    <option value="fuel">Fuel</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="food">Food</option>
                    <option value="toll">Toll</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <label>
                  Amount ($)
                  <input
                    type="number"
                    value={expenseForm.amount}
                    onChange={(e) =>
                      setExpenseForm({ ...expenseForm, amount: e.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  Date
                  <input
                    type="date"
                    value={expenseForm.date}
                    onChange={(e) =>
                      setExpenseForm({ ...expenseForm, date: e.target.value })
                    }
                    required
                  />
                </label>
              </div>
              <label>
                Description
                <input
                  type="text"
                  placeholder="e.g. Fuel refill at Adama station"
                  value={expenseForm.description}
                  onChange={(e) =>
                    setExpenseForm({
                      ...expenseForm,
                      description: e.target.value,
                    })
                  }
                />
              </label>
              <div
                style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}
              >
                <button className="button primary" type="submit">
                  Log Expense
                </button>
                <button
                  className="button secondary"
                  type="button"
                  onClick={handleCompleteTrip}
                  style={{ borderColor: "#ff7b72", color: "#ff7b72" }}
                >
                  Complete Trip
                </button>
              </div>
            </form>
          </section>
        ) : (
          <div
            className="panel"
            style={{
              marginBottom: "2rem",
              textAlign: "center",
              padding: "3rem 1.5rem",
            }}
          >
            <h3 style={{ margin: 0 }}>No Active Trip</h3>
            <p style={{ color: "#8b949e", margin: "0.5rem 0 0" }}>
              You currently have no active trip. Contact your manager for
              assignments.
            </p>
          </div>
        )}

        {/* Recent Trips Table */}
        <section className="panel">
          <h2>My Recent Trips</h2>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Load Type</th>
                  <th>Departure Date</th>
                  <th>Income</th>
                  <th>Expenses</th>
                  <th>Profit</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(metrics.recentTrips || []).map((trip) => (
                  <tr key={trip._id}>
                    <td>
                      {trip.source} → {trip.destination}
                    </td>
                    <td>{trip.loadType}</td>
                    <td>{new Date(trip.departureDate).toLocaleDateString()}</td>
                    <td>${trip.income}</td>
                    <td>${trip.expenses}</td>
                    <td>${trip.profit}</td>
                    <td>
                      <span
                        className={`status-badge ${trip.status}`}
                        style={{
                          padding: "0.25rem 0.5rem",
                          borderRadius: "6px",
                          fontSize: "0.85rem",
                          textTransform: "capitalize",
                          background:
                            trip.status === "active"
                              ? "rgba(56, 139, 253, 0.15)"
                              : "rgba(46, 164, 79, 0.15)",
                          color:
                            trip.status === "active" ? "#58a6ff" : "#2ecc71",
                        }}
                      >
                        {trip.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!metrics.recentTrips || metrics.recentTrips.length === 0) && (
                  <tr>
                    <td
                      colSpan="7"
                      style={{ textAlign: "center", color: "#8b949e" }}
                    >
                      No trips recorded.
                    </td>
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
