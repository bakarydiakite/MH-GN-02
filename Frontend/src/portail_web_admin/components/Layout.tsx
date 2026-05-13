import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Building2, 
  BarChart3, 
  Shield, 
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
  MapPin,
  Settings,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

const menuItems = [
  { path: '/admin/profile', icon: Settings, label: 'Profil', roles: ['ADMINISTRATEUR', 'SUPERVISEUR', 'VERIFICATEUR'] },
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', roles: ['ADMINISTRATEUR', 'SUPERVISEUR', 'VERIFICATEUR'] },
  { path: '/admin/records', icon: FileText, label: 'Dossiers', roles: ['ADMINISTRATEUR', 'SUPERVISEUR', 'VERIFICATEUR'] },
  { path: '/admin/users', icon: Users, label: 'Utilisateurs', roles: ['ADMINISTRATEUR'] },
  { path: '/admin/structures', icon: Building2, label: 'Structures', roles: ['ADMINISTRATEUR', 'SUPERVISEUR'] },
  { path: '/admin/stats', icon: BarChart3, label: 'Statistiques', roles: ['ADMINISTRATEUR', 'SUPERVISEUR'] },
  { path: '/admin/field-map', icon: MapPin, label: 'Couverture terrain', roles: ['ADMINISTRATEUR', 'SUPERVISEUR'] },
  { path: '/admin/verification', icon: Shield, label: 'Vérification', roles: ['ADMINISTRATEUR', 'SUPERVISEUR', 'VERIFICATEUR'] },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      'ADMINISTRATEUR': '#7C3AED',
      'SUPERVISEUR': '#0D7A5F',
      'VERIFICATEUR': '#3B82F6',
      'AGENT': '#F59E0B',
      'FAMILLE': '#6B7280',
    };
    return colors[role] || '#6B7280';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: 0 }}
        style={{
          width: 280,
          background: '#0F172A',
          position: 'fixed',
          height: '100vh',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          left: 0,
          top: 0,
        }}
      >
        {/* Logo */}
        <div style={{ padding: 24, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, #0D7A5F 0%, #10B981 100%)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Shield color="#fff" size={20} />
            </div>
            <div>
              <h1 style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>NaissanceChain</h1>
              <p style={{ color: '#64748B', fontSize: 11 }}>Portail Admin</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
          {filteredMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 12,
                marginBottom: 4,
                color: isActive ? '#fff' : '#94A3B8',
                background: isActive ? 'rgba(13, 122, 95, 0.3)' : 'transparent',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'all 0.2s',
              })}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              background: '#1E293B',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <User color="#94A3B8" size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>
                {user?.prenom} {user?.nom}
              </p>
              <span style={{
                background: getRoleBadge(user?.role || ''),
                color: '#fff',
                padding: '2px 8px',
                borderRadius: 4,
                fontSize: 10,
                fontWeight: 600,
              }}>
                {user?.role}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: 10,
              background: 'rgba(239, 68, 68, 0.2)',
              border: 'none',
              borderRadius: 8,
              color: '#F87171',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontWeight: 500,
            }}
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div style={{ flex: 1, marginLeft: 280 }}>
        {/* Header */}
        <header style={{
          background: '#fff',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #F1F5F9',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              display: 'none',
              padding: 8,
              background: '#F1F5F9',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1E293B' }}>
              Bienvenue, {user?.prenom || 'Utilisateur'}
            </h2>
            <p style={{ color: '#64748B', fontSize: 13 }}>
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: 32,
                height: 32,
                background: '#0D7A5F',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <User color="#fff" size={16} />
              </div>
              <ChevronDown size={16} />
            </button>

            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 8,
                  background: '#fff',
                  borderRadius: 12,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  minWidth: 200,
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: 12, borderBottom: '1px solid #F1F5F9' }}>
                  <p style={{ fontWeight: 600, color: '#1E293B' }}>{user?.email}</p>
                  <span style={{ fontSize: 12, color: '#64748B' }}>{user?.centreNom || 'N/A'}</span>
                </div>
                <NavLink
                  to="/admin/profile"
                  onClick={() => setUserMenuOpen(false)}
                  style={({ isActive }) => ({
                    display: 'block',
                    width: '100%',
                    padding: 12,
                    textAlign: 'left',
                    background: isActive ? '#f1f5f9' : 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #F1F5F9',
                    cursor: 'pointer',
                    fontWeight: 600,
                    color: '#0f172a',
                    textDecoration: 'none',
                  })}
                >
                  Paramètres du profil
                </NavLink>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: 12,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    color: '#EF4444',
                    fontWeight: 500,
                  }}
                >
                  <LogOut size={18} />
                  Déconnexion
                </button>
              </motion.div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main style={{ padding: 32 }}>
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 40,
          }}
        />
      )}
    </div>
  );
}
