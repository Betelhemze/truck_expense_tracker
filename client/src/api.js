import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const instance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.setToken = (token) => {
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common["Authorization"];
  }
};

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("truck_expense_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.auth = {
  login: (payload) => instance.post("/auth/login", payload),
  register: (payload) => instance.post("/auth/register", payload),
  me: () => instance.get("/auth/me"),
};

instance.drivers = {
  list: (query) => instance.get("/drivers", { params: query }),
  get: (id) => instance.get(`/drivers/${id}`),
  create: (payload) => instance.post("/drivers", payload),
  update: (id, payload) => instance.put(`/drivers/${id}`, payload),
  delete: (id) => instance.delete(`/drivers/${id}`),
};

instance.trucks = {
  list: (query) => instance.get("/trucks", { params: query }),
  get: (id) => instance.get(`/trucks/${id}`),
  create: (payload) => instance.post("/trucks", payload),
  update: (id, payload) => instance.put(`/trucks/${id}`, payload),
  delete: (id) => instance.delete(`/trucks/${id}`),
};

instance.trips = {
  list: (query) => instance.get("/trips", { params: query }),
  get: (id) => instance.get(`/trips/${id}`),
  create: (payload) => instance.post("/trips", payload),
  update: (id, payload) => instance.put(`/trips/${id}`, payload),
  delete: (id) => instance.delete(`/trips/${id}`),
  finish: (id) => instance.put(`/trips/${id}`, { status: "completed" }),
  updatePayment: (id, payload) =>
    instance.put(`/trips/${id}`, {
      paymentReceived: payload.received ?? payload.paymentReceived,
    }),
};

instance.expenses = {
  list: (query) => instance.get("/expenses", { params: query }),
  create: (payload) => instance.post("/expenses", payload),
  getTripExpenses: (tripId, query) =>
    instance.get(`/expenses/trip/${tripId}`, { params: query }),
};

instance.dashboard = {
  get: () => instance.get("/dashboard"),
  summary: () => instance.get("/dashboard/summary"),
  expenseBreakdown: () => instance.get("/dashboard/expense-breakdown"),
  tripProfit: (tripId) => instance.get(`/dashboard/trip-profit/${tripId}`),
  recentTrips: () => instance.get("/dashboard/recent-trips"),
};

instance.reports = {
  exportToExcel: () => instance.get("/reports/export", { responseType: "blob" }),
};

instance.upload = {
  file: (formData) => instance.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),
};

export const api = instance;
