import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from './features/landing/components/Navbar';
import Footer from './features/landing/components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import VerificationPage from './pages/VerificationPage';
import AdminLayout from "./portail_web_admin/layouts/AdminLayout";
import ProtectedAdminRoute from "./portail_web_admin/components/ProtectedAdminRoute";
import AdminLogin from "./portail_web_admin/pages/AdminLogin";
import AdminRegister from "./portail_web_admin/pages/AdminRegister";
import Dashboard from "./portail_web_admin/pages/Dashboard";
import Records from "./portail_web_admin/pages/Records";
import Verification from "./portail_web_admin/pages/Verification";
import Stats from "./portail_web_admin/pages/Stats";
import Users from "./portail_web_admin/pages/Users";
import Structures from "./portail_web_admin/pages/Structures";

export default function App() {
  return (
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
  );
}
