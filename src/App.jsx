import LoginPage from "./pages/LoginPage.jsx";
import Commutersignup from "./pages/Commutersignup.jsx";
import ManagerSignup from  "./pages/ManagerSignup.jsx";
import DriverSignup from "./pages/DriverSignup.jsx";
import AdminDashboard from "./pages/AdminLogin.jsx";
import Homepage from "./pages/Homepage.jsx"
import {Routes, Route} from "react-router-dom";
import AdminLogin from "./pages/AdminLogin.jsx";
import DashboardOverview from "./pages/SaccoManagementDashboard.jsx";

function App() {
  return (
  <Routes>
  
  < Route path="/admin" element={<AdminLogin />}  />
  < Route LoginPage path="/Login-Page" element={<LoginPage />} />
  < Route Commutersignup path= "/Commuter-signup" element={<Commutersignup />} />
  < Route ManagerSignup path="/Manager-Signup" element={< ManagerSignup/> }/>
  < Route DriverSignup path="/Driver-Signup" element={<DriverSignup />} />
  < Route Homepage path="/" element={<Homepage />} />
  < Route DashboardOverview path="/Dashboard-overview" element={<DashboardOverview />} />
  </Routes>
);}

export default App;
