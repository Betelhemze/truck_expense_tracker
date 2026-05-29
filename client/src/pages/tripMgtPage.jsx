import { useEffect, useState } from "react";
import { api } from "../api";
import "../styles/tripMgt.css";

export default function TripsManagementPage() {
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    const res = await api.trips.list();
    setTrips(res.data.data);
  };

  const filteredTrips = trips.filter((t) => {
    if (filter === "all") return true;
    if (filter === "active") return t.status === "active";
    if (filter === "completed") return t.status === "completed";
    return true;
  });

  const handleDelete = async (id) => {
    await api.trips.delete(id);
    loadTrips();
  };

  return (
    <div className="trips-page">
      <header className="trips-header">
        <div>
          <h2>Trips Management</h2>
          <p>Create and manage trips</p>
        </div>
        <button className="add-btn">+ Add Trips</button>
      </header>

      {/* Summary */}
      <div className="summary">
        <div className="summary-card">Total Trips: {trips.length}</div>
        <div className="summary-card">
          Active: {trips.filter((t) => t.status === "active").length}
        </div>
        <div className="summary-card">
          Completed: {trips.filter((t) => t.status === "completed").length}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="tabs">
        <button
          className={filter === "all" ? "tab active" : "tab"}
          onClick={() => setFilter("all")}
        >
          All ({trips.length})
        </button>
        <button
          className={filter === "active" ? "tab active" : "tab"}
          onClick={() => setFilter("active")}
        >
          Active ({trips.filter((t) => t.status === "active").length})
        </button>
        <button
          className={filter === "completed" ? "tab active" : "tab"}
          onClick={() => setFilter("completed")}
        >
          Completed ({trips.filter((t) => t.status === "completed").length})
        </button>
      </div>

      {/* Trip Cards */}
      <div className="trip-grid">
        {filteredTrips.map((trip) => (
          <div key={trip._id} className={`trip-card ${trip.status}`}>
            <h3>
              {trip.source} → {trip.destination}
            </h3>
            <p>Truck ID: {trip.truck?.number}</p>
            <p>Driver: {trip.driver?.name}</p>
            <p>Load Type: {trip.loadType}</p>
            <p>Date: {trip.departureDate}</p>
            <p>Income: {trip.income}</p>
            <p>Expenses: {trip.expenses}</p>
            <p>Net Profit: {trip.income - trip.expenses}</p>
            <p>Status: {trip.status}</p>
            <div className="actions">
              <button className="details-btn">View Details</button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(trip._id)}
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
