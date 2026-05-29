import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../LanguageContext";
import { getTranslation } from "../i18n";
import { api } from "../api";

const initialForm = {
  truckId: "",
  driverId: "",
  source: "",
  destination: "",
  loadType: "",
  income: "",
  departureDate: "",
};

export default function TripsPage() {
   const { language } = useLanguage();
   const t = (key) => getTranslation(key, language);
  const [trips, setTrips] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const loadTrips = async () => {
    try {
      const res = await api.trips.list({ page: 1, limit: 50 });
      setTrips(res.data.data);
    } catch (err) {
      setError(t("unableToLoad"));
    }
  };

  const loadTrucks = async () => {
    try {
      const res = await api.trucks.list({ page: 1, limit: 50 });
      setTrucks(res.data.data);
    } catch (err) {
      setError(t("unableToLoad"));
    }
  };

  const loadDrivers = async () => {
    try {
      const res = await api.drivers.list({ page: 1, limit: 50 });
      setDrivers(res.data.data);
    } catch (err) {
      setError(t("unabletouplaod"));
    }
  };

  useEffect(() => {
    loadTrips();
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
      const payload = {
        ...form,
        income: Number(form.income),
      };

      if (editingId) {
        await api.trips.update(editingId, payload);
        setEditingId(null);
      } else {
        await api.trips.create(payload);
      }
      setForm(initialForm);
      loadTrips();
    } catch (err) {
      setError(err.response?.data?.message || `Unable to ${editingId ? "update" : "create"} trip`);
    }
  };

  const handleEditClick = (trip) => {
    setEditingId(trip._id);
    setForm({
      truckId: trip.truckId?._id || "",
      driverId: trip.driverId?._id || "",
      source: trip.source,
      destination: trip.destination,
      loadType: trip.loadType,
      income: trip.income,
      departureDate: trip.departureDate ? new Date(trip.departureDate).toISOString().split("T")[0] : "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
    setError(null);
  };

  const handleComplete = async (id) => {
    setError(null);
    try {
      await api.trips.finish(id);
      loadTrips();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to complete trip");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    setError(null);
    try {
      await api.trips.delete(id);
      loadTrips();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete trip");
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content">
        <header className="page-header">
          <h1>{t("trips")}</h1>
          <p>{t("tripsmessage")}</p>
        </header>

        {error && <div className="alert">{error}</div>}

        <section className="panel">
          <h2>{editingId ? "Edit trip" : "New trip"}</h2>
          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              {t("truck")}
              <select
                name="truckId"
                value={form.truckId}
                onChange={handleChange}
                required
              >
                <option value="">{t("selectTruck")}</option>
                {trucks.map((truck) => (
                  <option key={truck._id} value={truck._id}>
                    {truck.number} • {truck.model}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t("driver")}
              <select
                name="driverId"
                value={form.driverId}
                onChange={handleChange}
                required
              >
                <option value="">{t("selectDriver")}</option>
                {drivers.map((driver) => (
                  <option key={driver._id} value={driver._id}>
                    {driver.fullName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t("source")}
              <input
                name="source"
                value={form.source}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              {t("destination")}
              <input
                name="destination"
                value={form.destination}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              {t("loadType")}
              <input
                name="loadType"
                value={form.loadType}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              {t("income")}
              <input
                name="income"
                value={form.income}
                onChange={handleChange}
                type="number"
                required
              />
            </label>
            <label>
              {t("departureDate")}
              <input
                name="departureDate"
                value={form.departureDate}
                onChange={handleChange}
                type="date"
                required
              />
            </label>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="button primary" type="submit">
                {editingId ? t("updateTrip") : t("createTrip")}
              </button>
              {editingId && (
                <button className="button secondary" type="button" onClick={handleCancelEdit}>
                  {t("cancel")}
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="panel">
          <h2>{t("triplist")}</h2>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>{t("truck")}</th>
                  <th>{t("driver")}</th>
                  <th>{t("route")}</th>
                  <th>{t("income")}</th>
                  <th>{t("status")}</th>
                  <th>{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((trip) => (
                  <tr key={trip._id}>
                    <td>{trip.truckId?.number || "-"}</td>
                    <td>{trip.driverId?.fullName || "-"}</td>
                    <td>
                      {trip.source} → {trip.destination}
                    </td>
                    <td>${trip.income}</td>
                    <td style={{ textTransform: "capitalize" }}>{trip.status}</td>
                    <td>
                      {trip.status === "active" && (
                        <button
                          className="button secondary"
                          onClick={() => handleComplete(trip._id)}
                          style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", marginRight: "0.5rem", borderColor: "#2ea44f", color: "#2ea44f" }}
                        >
                          {t("complete")}
                        </button>
                      )}
                      <button
                        className="button secondary"
                        onClick={() => handleEditClick(trip)}
                        style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", marginRight: "0.5rem" }}
                      >
                        {t("edit")}
                      </button>
                      <button
                        className="button secondary"
                        onClick={() => handleDelete(trip._id)}
                        style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", borderColor: "#ff7b72", color: "#ff7b72" }}
                      >
                        {t("delete")}
                      </button>
                    </td>
                  </tr>
                ))}
                {trips.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", color: "#8b949e" }}>{t("noTripsmessage")}</td>
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
