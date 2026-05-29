import { useEffect, useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

export default function DriverDashboardPage() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const res = await api.dashboard.get(); // assumes driver-specific dashboard
    setDashboard(res.data.data);
  };

  if (!dashboard) return <p>Loading dashboard...</p>;

  return (
    <div className="driver-dashboard">
      <header className="driver-header">
        <h2>Welcome backkkkk{dashboard.driver.name}</h2>
        <p>
          Driving {dashboard.truck.model} - {dashboard.truck.licensePlate}
        </p>
        <button className="view-btn" onClick={() => navigate("/trips")}>
          View Trips
        </button>
      </header>

      {/* Summary Cards */}
      <div className="cards">
        <div className="card">Total Trips: {dashboard.totalTrips}</div>
        <div className="card">Active Trips: {dashboard.activeTrips}</div>
        <div className="card">Completed Trips: {dashboard.completedTrips}</div>
        <div className="card">Total Income: ${dashboard.totalIncome}</div>
        <div className="card">Net Profit: ${dashboard.netProfit}</div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <button className="action-btn">
          {dashboard.activeTrips} Active trip add expense
        </button>
      </div>

      {/* Recent Trips */}
      <div className="recent-trips">
        <h3>Recent Trips</h3>
        {dashboard.recentTrips.map((trip) => (
          <div key={trip._id} className={`trip-card ${trip.status}`}>
            <h4>
              {trip.source} → {trip.destination}
            </h4>
            <p>Load: {trip.loadType}</p>
            <p>Date: {trip.departureDate}</p>
            <p>Income: ${trip.income}</p>
            <p>Expenses: ${trip.expenses}</p>
            <p>Profit: ${trip.profit}</p>
            <p>Status: {trip.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
