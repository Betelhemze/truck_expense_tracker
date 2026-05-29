import { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

export default function AddDriverPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    licenseNumber: "",
    truckId: "",
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let documentUrl = "";
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await api.upload.file(formData);
        documentUrl = res.data.url;
      } catch (err) {
        console.error("Upload failed", err);
        alert("File upload failed");
        return;
      }
    }

    await api.drivers.create({ ...form, documentUrl });
    navigate("/drivers"); // redirect back to drivers list
  };

  return (
    <div className="add-driver-page">
      <h2>Add Driver</h2>
      <p>Insert driver details</p>

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
            placeholder="0911111111"
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

        <label>
          License Document
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*,.pdf"
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
          <button type="submit" className="add-btn">
            Add Driver
          </button>
        </div>
      </form>
    </div>
  );
}
