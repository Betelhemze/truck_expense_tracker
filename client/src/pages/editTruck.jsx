import { useEffect, useState } from "react";
import { api } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/editTruck.css";

export default function EditTruckPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // truck id from route
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState({
    number: "",
    model: "",
    licensePlate: "",
    driverId: "",
    status: "active",
  });

  useEffect(() => {
    loadTruck();
    loadDrivers();
  }, []);

  const loadTruck = async () => {
    const res = await api.trucks.get(id); // assumes api.trucks.get exists
    const t = res.data.data;
    setForm({
      number: t.number,
      model: t.model,
      licensePlate: t.licensePlate,
      driverId: t.driver?._id || "",
      status: t.active ? "active" : "inactive",
    });
  };

  const loadDrivers = async () => {
    const res = await api.drivers.list();
    setDrivers(res.data.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.trucks.update(id, form);
    navigate("/trucks"); // back to trucks list
  };

  return (
    <div className="edit-truck-page">
      <h2>Edit Truck</h2>
      <p>Update the truck details</p>

      <form onSubmit={handleSubmit} className="truck-form">
        <label>
          Truck Number *
          <input
            type="text"
            name="number"
            placeholder="TRK-001"
            value={form.number}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Model *
          <input
            type="text"
            name="model"
            placeholder="Volvo FH16"
            value={form.model}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          License Plate *
          <input
            type="text"
            name="licensePlate"
            placeholder="MH-23-21-32"
            value={form.licensePlate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Assign Driver *
          <select
            name="driverId"
            value={form.driverId}
            onChange={handleChange}
            required
          >
            <option value="">Select Driver</option>
            {drivers.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Status
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/trucks")}
          >
            Cancel
          </button>
          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
