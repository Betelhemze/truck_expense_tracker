import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { api } from "../api";

const initialForm = { number: "", model: "", licensePlate: "", driverId: "" };

export default function TrucksPage() {
  const [trucks, setTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const loadTrucks = async () => {
    try {
      const res = await api.trucks.list({ page: 1, limit: 50 });
      setTrucks(res.data.data);
    } catch (err) {
      setError("Unable to load trucks");
    }
  };

  const loadDrivers = async () => {
    try {
      const res = await api.drivers.list({ page: 1, limit: 50 });
      setDrivers(res.data.data);
    } catch (err) {
      setError("Unable to load drivers");
    }
  };

  useEffect(() => {
    loadTrucks();
    loadDrivers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await api.trucks.update(editingId, form);
        setEditingId(null);
      } else {
        await api.trucks.create(form);
      }
      setForm(initialForm);
      loadTrucks();
    } catch (err) {
      setError(err.response?.data?.message || `Unable to ${editingId ? "update" : "create"} truck`);
    }
  };

  const handleEditClick = (truck) => {
    setEditingId(truck._id);
    setForm({
      number: truck.number,
      model: truck.model,
      licensePlate: truck.licensePlate,
      driverId: truck.driverId?._id || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this truck?")) return;
    setError(null);
    try {
      await api.trucks.delete(id);
      loadTrucks();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete truck");
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content">
        <header className="page-header">
          <h1>Trucks</h1>
          <p>Manage your fleet and assign trucks to drivers.</p>
        </header>
        {error && <div className="alert">{error}</div>}

        <section className="panel">
          <h2>{editingId ? "Edit truck" : "Create truck"}</h2>
          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              Number
              <input
                name="number"
                value={form.number}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Model
              <input
                name="model"
                value={form.model}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              License plate
              <input
                name="licensePlate"
                value={form.licensePlate}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Driver
              <select
                name="driverId"
                value={form.driverId}
                onChange={handleChange}
              >
                <option value="">Unassigned</option>
                {drivers.map((driver) => (
                  <option key={driver._id} value={driver._id}>
                    {driver.fullName}
                  </option>
                ))}
              </select>
            </label>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="button primary" type="submit">
                {editingId ? "Update truck" : "Save truck"}
              </button>
              {editingId && (
                <button className="button secondary" type="button" onClick={handleCancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="panel">
          <h2>Truck list</h2>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Model</th>
                  <th>License plate</th>
                  <th>Driver</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trucks.map((truck) => (
                  <tr key={truck._id}>
                    <td>{truck.number}</td>
                    <td>{truck.model}</td>
                    <td>{truck.licensePlate}</td>
                    <td>{truck.driverId?.fullName || "Unassigned"}</td>
                    <td style={{ textTransform: "capitalize" }}>{truck.status}</td>
                    <td>
                      <button
                        className="button secondary"
                        onClick={() => handleEditClick(truck)}
                        style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", marginRight: "0.5rem" }}
                      >
                        Edit
                      </button>
                      <button
                        className="button secondary"
                        onClick={() => handleDelete(truck._id)}
                        style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", borderColor: "#ff7b72", color: "#ff7b72" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {trucks.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", color: "#8b949e" }}>No trucks found.</td>
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
