import { useEffect, useState } from "react";
import { api } from "../api";
import "../styles/truckMgt.css";

export default function TruckManagementPage() {
  const [trucks, setTrucks] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTrucks();
  }, []);

  const loadTrucks = async () => {
    const res = await api.trucks.list();
    setTrucks(res.data.data);
  };

  const filteredTrucks = trucks.filter((t) =>
    [t.number, t.model, t.licensePlate]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const handleDelete = async (id) => {
    await api.trucks.delete(id);
    loadTrucks();
  };

  return (
    <div className="truck-page">
      <header className="truck-header">
        <div>
          <h2>Truck Management</h2>
          <p>Manage your fleet of truck</p>
        </div>
        <button className="add-btn">+ Add Truck</button>
      </header>

      {/* Summary */}
      <div className="summary">
        <div className="summary-card">Total Trucks: {trucks.length}</div>
        <div className="summary-card">
          Active Trucks: {trucks.filter((t) => t.active).length}
        </div>
        <div className="summary-card">
          Inactive Trucks: {trucks.filter((t) => !t.active).length}
        </div>
      </div>

      {/* Search */}
      <input
        className="search-bar"
        placeholder="Search truck by number, model, or license plate"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Truck Cards */}
      <div className="truck-grid">
        {filteredTrucks.map((t) => (
          <div
            key={t._id}
            className={`truck-card ${t.active ? "active" : "inactive"}`}
          >
            <h3>{t.number}</h3>
            <p>Model: {t.model}</p>
            <p>License Plate: {t.licensePlate}</p>
            <p>Driver: {t.driver ? t.driver.name : "Not assigned"}</p>
            <div className="actions">
              <button className="edit-btn">Edit</button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(t._id)}
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
