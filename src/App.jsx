import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { Suspense, lazy } from "react";
const LogIn = lazy(() => import("./components/LogIn"));
const UserManagement = lazy(() => import("./components/UserManagement"));
const QRCodeManagement = lazy(() => import("./components/QRCodeManagement"));

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <div>
      {/* Render the navbar only if not on the login page */}
      {!isLoginPage && (
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/user-management">User Management</Link>
            </li>
            <li>
              <Link to="/qr-code-management">QR Code Management</Link>
            </li>
          </ul>
        </nav>
      )}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/qr-code-management" element={<QRCodeManagement />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
