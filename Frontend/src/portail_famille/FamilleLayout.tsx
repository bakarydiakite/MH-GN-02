import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Heart, Link2, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function FamilleLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    padding: '10px 16px',
    borderRadius: 10,
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: 14,
    color: isActive ? '#fff' : '#475569',
    background: isActive ? '#0D7A5F' : 'transparent',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <header
        style={{
          background: '#fff',
          borderBottom: '1px solid #e2e8f0',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Heart color="#0D7A5F" size={24} />
          <span style={{ fontWeight: 800, color: '#0f172a' }}>NaissanceChain — Espace famille</span>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <NavLink to="/famille" end style={linkStyle}>
            Mes actes
          </NavLink>
          <NavLink to="/famille/lier" style={linkStyle}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Link2 size={16} /> Lier un acte
            </span>
          </NavLink>
          <NavLink to="/famille/profil" style={linkStyle}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <User size={16} /> Profil
            </span>
          </NavLink>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            style={{
              padding: '10px 16px',
              borderRadius: 10,
              border: '1px solid #fecaca',
              background: '#fef2f2',
              color: '#b91c1c',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <LogOut size={16} /> Déconnexion
          </button>
        </nav>
      </header>
      <p style={{ padding: '8px 24px', margin: 0, fontSize: 13, color: '#64748b' }}>
        {user?.prenom} {user?.nom}
        {user?.telephone ? ` · ${user.telephone}` : ''}
      </p>
      <main style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
