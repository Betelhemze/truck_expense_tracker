import { useEffect, useState } from "react";
import { api } from "../api";
import { useNavigate, useParams } from "react-router-dom";

export default function EditDriverPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // driver id from route
  const [form, setForm] = useState({
    name: "",
    phone: "",
    licenseNumber: "",
    truckId: "",
  });

  useEffect(() => {
    loadDriver();
  }, []);

  const loadDriver = async () => {
    const res = await api.drivers.get(id); // assumes api.drivers.get exists
    const d = res.data.data;
    setForm({
      name: d.name,
      phone: d.phone,
      licenseNumber: d.licenseNumber,
      truckId: d.truck?._id || "",
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.drivers.update(id, form);
    navigate("/drivers"); // back to drivers list
  };

  return (
    <div className="edit-driver-page">
      <h2>Edit Driver</h2>
      <p>Update the driver details</p>

      <form onSubmit={handleSubmit} className="driver-form">
        <label>
          Full Name *
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Phone Number *
          <input
            type="text"
            name="phone"
            placeholder="091111111"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          License Number *
          <input
            type="text"
            name="licenseNumber"
            placeholder="113-327-34"
            value={form.licenseNumber}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Assign Truck
          <input
            type="text"
            name="truckId"
            placeholder="Truck ID or Driver Name"
            value={form.truckId}
            onChange={handleChange}
          />
        </label>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/drivers")}
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
