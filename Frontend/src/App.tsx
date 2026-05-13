import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from './features/landing/components/Navbar';
import Footer from './features/landing/components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import VerificationPage from './pages/VerificationPage';
<<<<<<< HEAD
import AdminLayout from "./portail_web_admin/layouts/AdminLayout";
import ProtectedAdminRoute from "./portail_web_admin/components/ProtectedAdminRoute";
import AdminLogin from "./portail_web_admin/pages/AdminLogin";
import AdminRegister from "./portail_web_admin/pages/AdminRegister";
=======
import Login from "./portail_web_admin/pages/Login";
import Layout from "./portail_web_admin/components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
>>>>>>> 147c53fee3b35f3abc4900c392072781bff9eb1e
import Dashboard from "./portail_web_admin/pages/Dashboard";
import DashboardSuperviseur from "./portail_web_admin/pages/DashboardSuperviseur";
import Records from "./portail_web_admin/pages/Records";
import Verification from "./portail_web_admin/pages/Verification";
import Stats from "./portail_web_admin/pages/Stats";
import Users from "./portail_web_admin/pages/UserManagement";
import Structures from "./portail_web_admin/pages/Structures";
import FieldMap from "./portail_web_admin/pages/FieldMap";
import ProfileSettings from "./portail_web_admin/pages/ProfileSettings";
import Register from "./portail_web_admin/pages/Register";
import { useAuth, WEB_PORTAL_ROLES } from "./contexts/AuthContext";

// Composant pour choisir le dashboard selon le rôle
function DashboardRouter() {
  const { user } = useAuth();
  
  // Chaque rôle a son propre dashboard
  switch (user?.role) {
    case 'ADMINISTRATEUR':
      return <Dashboard />;
    case 'SUPERVISEUR':
      return <DashboardSuperviseur />;
    case 'VERIFICATEUR':
      return <Dashboard />;
    default:
      return <Dashboard />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Pages */}
          <Route path="/" element={
            <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <HomePage />
              </main>
              <Footer />
            </div>
          } />
          
          <Route path="/verification" element={
            <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <VerificationPage />
              </main>
              <Footer />
            </div>
          } />

          <Route path="/a-propos" element={
            <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <AboutPage />
              </main>
              <Footer />
            </div>
          } />

<<<<<<< HEAD
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* Admin Portal */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="records" element={<Records />} />
            <Route path="verification" element={<Verification />} />
            <Route path="stats" element={<Stats />} />
            <Route path="users" element={<Users />} />
            <Route path="structures" element={<Structures />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
=======
          {/* Login & inscription web (institutions = vérificateurs) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Portail web : admin, superviseur, vérificateur uniquement */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={WEB_PORTAL_ROLES}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardRouter />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="records" element={<Records />} />
            <Route path="verification" element={<Verification />} />
            <Route path="stats" element={
              <ProtectedRoute allowedRoles={['ADMINISTRATEUR', 'SUPERVISEUR']}>
                <Stats />
              </ProtectedRoute>
            } />
            <Route path="users" element={
              <ProtectedRoute allowedRoles={['ADMINISTRATEUR']}>
                <Users />
              </ProtectedRoute>
            } />
            <Route path="structures" element={
              <ProtectedRoute allowedRoles={['ADMINISTRATEUR']}>
                <Structures />
              </ProtectedRoute>
            } />
            <Route path="field-map" element={
              <ProtectedRoute allowedRoles={['ADMINISTRATEUR', 'SUPERVISEUR']}>
                <FieldMap />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
>>>>>>> 147c53fee3b35f3abc4900c392072781bff9eb1e
  );
}
