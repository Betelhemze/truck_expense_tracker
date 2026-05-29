import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { api } from "../api";

const initialForm = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  licenseNumber: "",
};

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const loadDrivers = async () => {
    try {
      const res = await api.drivers.list({ page: 1, limit: 50 });
      setDrivers(res.data.data);
    } catch (err) {
      setError("Unable to load drivers");
    }
  };

  useEffect(() => {
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
        const payload = { ...form };
        if (!payload.password) {
          delete payload.password; // Do not update password if left blank
        }
        await api.drivers.update(editingId, payload);
        setEditingId(null);
      } else {
        await api.drivers.create(form);
      }
      setForm(initialForm);
      loadDrivers();
    } catch (err) {
      setError(err.response?.data?.message || `Unable to ${editingId ? "update" : "create"} driver`);
    }
  };

  const handleEditClick = (driver) => {
    setEditingId(driver._id);
    setForm({
      fullName: driver.fullName,
      email: driver.email,
      password: "", // Leave blank unless editing password
      phone: driver.phone || "",
      licenseNumber: driver.licenseNumber || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;
    setError(null);
    try {
      await api.drivers.delete(id);
      loadDrivers();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete driver");
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content">
        <header className="page-header">
          <h1>Drivers</h1>
          <p>Add and manage drivers who can access the system.</p>
        </header>

        {error && <div className="alert">{error}</div>}

        <section className="panel">
          <h2>{editingId ? "Edit driver" : "Create driver"}</h2>
          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              Full name
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                required
              />
            </label>
            <label>
              Password {editingId && <span style={{ color: "#8b949e", fontSize: "0.85rem" }}>(leave blank to keep current)</span>}
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                required={!editingId}
              />
            </label>
            <label>
              Phone
              <input name="phone" value={form.phone} onChange={handleChange} />
            </label>
            <label>
              License number
              <input
                name="licenseNumber"
                value={form.licenseNumber}
                onChange={handleChange}
              />
            </label>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="button primary" type="submit">
                {editingId ? "Update driver" : "Save driver"}
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
          <h2>Driver list</h2>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>License</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => (
                  <tr key={driver._id}>
                    <td>{driver.fullName}</td>
                    <td>{driver.email}</td>
                    <td>{driver.phone || "-"}</td>
                    <td>{driver.licenseNumber || "-"}</td>
                    <td>
                      <button
                        className="button secondary"
                        onClick={() => handleEditClick(driver)}
                        style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", marginRight: "0.5rem" }}
                      >
                        Edit
                      </button>
                      <button
                        className="button secondary"
                        onClick={() => handleDelete(driver._id)}
                        style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", borderColor: "#ff7b72", color: "#ff7b72" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {drivers.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", color: "#8b949e" }}>No drivers found.</td>
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
