import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import { ThemeProvider } from "./ThemeContext";
import { LanguageProvider } from "./LanguageContext";
import "./styles/theme.css";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TrucksPage from "./pages/TrucksPage";
import TripsPage from "./pages/TripsPage";
import ExpensesPage from "./pages/ExpensesPage";
import DriversPage from "./pages/DriversPage";
import AddDriverPage from "./pages/addDriver..jsx";
import EditDriverPage from "./pages/editDriver";
import DriversManagementPage from "./pages/driverMgtPage";
import AddTruckPage from "./pages/addTruck";
import EditTruckPage from "./pages/editTruck";
import TruckManagementPage from "./pages/TruckMgtPage";
import AddTripPage from "./pages/addTripPage";
import TripDetailsPage from "./pages/tripDetails";
import DriverExpensePage from "./pages/driverExpensePage";
import CompletedTripPage from "./pages/completedTrip";
import FinishedTripAdminPage from "./pages/finishedTrip.admin";
import TripsManagementPage from "./pages/tripMgtPage";
import DriverDashboardPage from "./pages/driverDashboardPage";
import AdminReportPage from "./pages/adminReport";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              {/* Dashboard Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/driver"
                element={
                  <ProtectedRoute>
                    <DriverDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/admin/report"
                element={
                  <ProtectedRoute>
                    <AdminReportPage />
                  </ProtectedRoute>
                }
              />

              {/* Driver Routes */}
              <Route
                path="/drivers"
                element={
                  <ProtectedRoute>
                    <DriversPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/drivers/add"
                element={
                  <ProtectedRoute>
                    <AddDriverPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/drivers/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditDriverPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/drivers/management"
                element={
                  <ProtectedRoute>
                    <DriversManagementPage />
                  </ProtectedRoute>
                }
              />

              {/* Truck Routes */}
              <Route
                path="/trucks"
                element={
                  <ProtectedRoute>
                    <TrucksPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trucks/add"
                element={
                  <ProtectedRoute>
                    <AddTruckPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trucks/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditTruckPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trucks/management"
                element={
                  <ProtectedRoute>
                    <TruckManagementPage />
                  </ProtectedRoute>
                }
              />

              {/* Trip Routes */}
              <Route
                path="/trips"
                element={
                  <ProtectedRoute>
                    <TripsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trips/add"
                element={
                  <ProtectedRoute>
                    <AddTripPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trips/:id"
                element={
                  <ProtectedRoute>
                    <TripDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trips/:id/expenses"
                element={
                  <ProtectedRoute>
                    <DriverExpensePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trips/completed"
                element={
                  <ProtectedRoute>
                    <CompletedTripPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trips/finished"
                element={
                  <ProtectedRoute>
                    <FinishedTripAdminPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trips/management"
                element={
                  <ProtectedRoute>
                    <TripsManagementPage />
                  </ProtectedRoute>
                }
              />

              {/* Expenses Route */}
              <Route
                path="/expenses"
                element={
                  <ProtectedRoute>
                    <ExpensesPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
