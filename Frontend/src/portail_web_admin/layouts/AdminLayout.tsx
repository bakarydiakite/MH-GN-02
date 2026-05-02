import Sidebar from '../components/Sidebar';
import { Bell, Search, Settings, Grid } from 'lucide-react';
import { Outlet, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch(location.pathname) {
      case '/admin': return 'Dashboard';
      case '/admin/records': return 'Enregistrements';
      case '/admin/verification': return 'Vérification';
      case '/admin/stats': return 'Statistiques';
      case '/admin/users': return 'Utilisateurs';
      case '/admin/structures': return 'Structures';
      default: return 'Portail Admin';
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Admin Header */}
        <header style={{
          height: 80,
          background: '#fff',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1E293B', margin: 0 }}>
            {getPageTitle()}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {/* Search Bar */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12, 
              background: '#F8FAFC',
              padding: '10px 16px',
              borderRadius: 12,
              border: '1px solid #F1F5F9',
              width: 320
            }}>
              <Search size={18} color="#94A3B8" />
              <input 
                type="text" 
                placeholder="Search..." 
                style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: 14, color: '#1E293B' }}
              />
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: 2, padding: '2px 6px', 
                background: '#fff', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 10, color: '#94A3B8' 
              }}>
                <span style={{ fontSize: 12 }}>⌘</span>
                <span>K</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B', position: 'relative' }}>
                <Bell size={22} />
                <div style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, background: '#10B981', borderRadius: '50%', border: '2px solid #fff' }} />
              </button>
              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B' }}>
                <Settings size={22} />
              </button>
              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B' }}>
                <Grid size={22} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ padding: '40px', flex: 1, maxWidth: 1600, margin: '0 auto', width: '100%' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
