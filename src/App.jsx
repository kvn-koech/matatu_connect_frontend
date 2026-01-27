import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

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
import MpesaConfirmation from "./pages/MpesaConfirmation.jsx";
import NotFound from "./pages/NotFound.jsx";
import FleetPage from "./pages/FleetPage.jsx";
import DriversPage from "./pages/DriversPage.jsx";
import ManageRoutesPage from "./pages/ManageRoutesPage.jsx";
import ReviewsPage from "./pages/ReviewsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
// Layouts
import MainLayout from "./components/layout/MainLayout.jsx";
import PublicLayout from "./components/layout/PublicLayout.jsx";

function AppRoutes() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-emerald-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-current"></div>
      </div>
    );
  }

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
        path="/Mpesa-confirmation"
        element={
          <PublicLayout>
            <MpesaConfirmation />
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

      <Route
        path="/manager/fleet"
        element={
          isAuthenticated ? (
            <MainLayout role="manager">
              <FleetPage />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/manager/drivers"
        element={
          isAuthenticated ? (
            <MainLayout role="manager">
              <DriversPage />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/manager/routes"
        element={
          isAuthenticated ? (
            <MainLayout role="manager">
              <ManageRoutesPage />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/manager/reviews"
        element={
          isAuthenticated ? (
            <MainLayout role="manager">
              <ReviewsPage />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/settings"
        element={
          isAuthenticated ? (
            <MainLayout role={user?.role || "commuter"}>
              <SettingsPage />
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

import { SocketProvider } from "./context/SocketContext";
import { BookingProvider } from "./context/BookingContext";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BookingProvider>
          <AppRoutes />
        </BookingProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
