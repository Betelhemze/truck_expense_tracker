import { useState, useEffect } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/addTrip.css";
export default function AddTripPage() {
  const navigate = useNavigate();
  const [trucks, setTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState({
    truckId: "",
    driverId: "",
    source: "",
    destination: "",
    loadType: "",
    income: "",
    departureDate: "",
  });

  useEffect(() => {
    loadTrucks();
    loadDrivers();
  }, []);

  const loadTrucks = async () => {
    const res = await api.trucks.list();
    setTrucks(res.data.data);
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
    await api.trips.create(form);
    navigate("/trips"); // redirect back to trips list
  };

  return (
    <div className="add-trip-page">
      <h2>Add New Trip</h2>
      <p>Create a trip and assign driver</p>

      <form onSubmit={handleSubmit} className="trip-form">
        <label>
          Select Truck *
          <select
            name="truckId"
            value={form.truckId}
            onChange={handleChange}
            required
          >
            <option value="">Select Truck</option>
            {trucks.map((t) => (
              <option key={t._id} value={t._id}>
                {t.number} - {t.model}
              </option>
            ))}
          </select>
        </label>

        <label>
          Select Driver *
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
          Source *
          <input
            type="text"
            name="source"
            placeholder="Addis Ababa"
            value={form.source}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Destination *
          <input
            type="text"
            name="destination"
            placeholder="Djibouti"
            value={form.destination}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Load Type *
          <input
            type="text"
            name="loadType"
            placeholder="Electronics, textile"
            value={form.loadType}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Income *
          <input
            type="number"
            name="income"
            placeholder="400000"
            value={form.income}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Departure Date *
          <input
            type="date"
            name="departureDate"
            value={form.departureDate}
            onChange={handleChange}
            required
          />
        </label>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/trips")}
          >
            Cancel
          </button>
          <button type="submit" className="create-btn">
            Create Trip
          </button>
        </div>
      </form>
    </div>
  );
}
