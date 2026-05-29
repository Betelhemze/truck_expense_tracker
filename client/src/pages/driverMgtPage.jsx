import { useEffect, useState } from "react";
import { api } from "../api";
import "../styles/driverMgt.css";

export default function DriversManagementPage() {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    const res = await api.drivers.list();
    setDrivers(res.data.data);
  };

  const filteredDrivers = drivers.filter((d) =>
    [d.name, d.phone].join(" ").toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id) => {
    await api.drivers.delete(id);
    loadDrivers();
  };

  return (
    <div className="drivers-page">
      <header className="drivers-header">
        <div>
          <h2>Drivers Management</h2>
          <p>Manage your drivers</p>
        </div>
        <button className="add-btn">+ Add Driver</button>
      </header>

      {/* Summary */}
      <div className="summary">
        <div className="summary-card">Total Drivers: {drivers.length}</div>
        <div className="summary-card">
          Assigned Drivers: {drivers.filter((d) => d.assigned).length}
        </div>
        <div className="summary-card">
          Unassigned Drivers: {drivers.filter((d) => !d.assigned).length}
        </div>
      </div>

      {/* Search */}
      <input
        className="search-bar"
        placeholder="Search driver by name, phone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Driver Cards */}
      <div className="driver-grid">
        {filteredDrivers.map((d) => (
          <div
            key={d._id}
            className={`driver-card ${d.assigned ? "assigned" : "unassigned"}`}
          >
            <h3>{d.name}</h3>
            <p>Truck Model: {d.truck?.model || "N/A"}</p>
            <p>Phone: {d.phone}</p>
            <p>
              Truck ID:{" "}
              {d.truck
                ? `${d.truck.number} - ${d.truck.licensePlate}`
                : "Not assigned"}
            </p>
            <p>Status: {d.assigned ? "Assigned" : "Unassigned"}</p>
            <div className="actions">
              <button className="edit-btn">Edit</button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(d._id)}
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
