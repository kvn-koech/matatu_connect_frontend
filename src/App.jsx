import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Homepage from "./pages/Homepage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Commutersignup from "./pages/Commutersignup.jsx";
import DriverSignup from "./pages/DriverSignup.jsx";
import ManagerSignup from "./pages/ManagerSignup.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import CommuterDashboard from "./pages/CommuterDashboard.jsx";
import DriverDashboard from "./pages/DriverDashboard.jsx";
import DashboardOverview from "./pages/SaccoManagementDashboard.jsx";

// Layouts
import MainLayout from "./components/layout/MainLayout.jsx";
import PublicLayout from "./components/layout/PublicLayout.jsx";

/* ===== DEV AUTH MOCK ===== */
const isAuthenticated = true;

function App() {
  return (
    <Routes>
      {/* ===== PUBLIC ROUTES (WITH NAVBAR) ===== */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <Homepage />
          </PublicLayout>
        }
      />
      <Route
        path="/login"
        element={
          <PublicLayout>
            <LoginPage />
          </PublicLayout>
        }
      />
      <Route
        path="/commuter-signup"
        element={
          <PublicLayout>
            <Commutersignup />
          </PublicLayout>
        }
      />
      <Route
        path="/driver-signup"
        element={
          <PublicLayout>
            <DriverSignup />
          </PublicLayout>
        }
      />
      <Route
        path="/manager-signup"
        element={
          <PublicLayout>
            <ManagerSignup />
          </PublicLayout>
        }
      />
      <Route
        path="/admin"
        element={
          <PublicLayout>
            <AdminLogin />
          </PublicLayout>
        }
      />

      {/* ===== DASHBOARDS (WITH SIDEBAR + NAVBAR) ===== */}
      <Route
        path="/commuter-dashboard"
        element={
          isAuthenticated ? (
            <MainLayout role="commuter">
              <CommuterDashboard />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/driver-dashboard"
        element={
          isAuthenticated ? (
            <MainLayout role="driver">
              <DriverDashboard driverId={101} />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/dashboard-overview"
        element={
          isAuthenticated ? (
            <MainLayout role="manager">
              <DashboardOverview />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* ===== FALLBACK ===== */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
