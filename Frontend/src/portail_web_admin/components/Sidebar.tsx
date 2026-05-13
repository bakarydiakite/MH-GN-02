import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  ShieldCheck, 
  BarChart3, 
  Users, 
  Building2, 
  RefreshCcw, 
  History, 
  Settings, 
  Database,
  User
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuPrincipal = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: FileText, label: 'Enregistrements', path: '/admin/records' },
  { icon: ShieldCheck, label: 'Vérification', path: '/admin/verification', badge: 'Core' },
  { icon: BarChart3, label: 'Statistiques', path: '/admin/stats' },
  { icon: Users, label: 'Utilisateurs', path: '/admin/users' },
  { icon: Building2, label: 'Structures', path: '/admin/structures' },
  { icon: RefreshCcw, label: 'Synchronisation', path: '/admin/sync' },
  { icon: History, label: 'Historique', path: '/admin/history' },
];

const menuCompte = [
  { icon: Settings, label: 'Paramètres', path: '/admin/settings' },
];

export default function Sidebar() {
  const [isCollapsed] = useState(false);
  const location = useLocation();

  const renderNavItem = (item: any) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        key={item.path}
        to={item.path}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          borderRadius: 12,
          textDecoration: 'none',
          color: isActive ? '#fff' : '#94A3B8',
          background: isActive ? '#0D7A5F' : 'transparent',
          transition: 'all 0.2s ease',
          marginBottom: 4,
          position: 'relative'
        }}
      >
        <item.icon size={20} style={{ flexShrink: 0 }} />
        {!isCollapsed && (
          <span style={{ fontSize: 14, fontWeight: isActive ? 600 : 500, flex: 1 }}>
            {item.label}
          </span>
        )}
        {!isCollapsed && item.badge && (
          <span style={{ 
            fontSize: 10, 
            background: 'rgba(77, 255, 195, 0.1)', 
            color: '#4DFFC3', 
            padding: '2px 8px', 
            borderRadius: 10,
            fontWeight: 700,
            border: '1px solid rgba(77, 255, 195, 0.2)'
          }}>
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      style={{
        background: '#0B0F1A',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        color: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderRight: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden'
      }}
    >
      {/* Logo - Fixed */}
      <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: '#0D7A5F',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <ShieldCheck size={20} />
        </div>
        {!isCollapsed && (
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>NaissanceChain</span>
        )}
      </div>

      {/* Scrollable Navigation Area */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '0 16px',
        msOverflowStyle: 'none',  /* IE and Edge */
        scrollbarWidth: 'none'    /* Firefox */
      }}>
        {/* Hide scrollbar for Chrome, Safari and Opera */}
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <p style={{ 
          fontSize: 10, fontWeight: 700, color: '#475569', padding: '16px', 
          textTransform: 'uppercase', letterSpacing: 1 
        }}>
          {!isCollapsed ? 'Menu Principal' : '...'}
        </p>
        {menuPrincipal.map(renderNavItem)}

        <p style={{ 
          fontSize: 10, fontWeight: 700, color: '#475569', padding: '16px', 
          textTransform: 'uppercase', letterSpacing: 1, marginTop: 24 
        }}>
          {!isCollapsed ? 'Compte' : '...'}
        </p>
        {menuCompte.map(renderNavItem)}

        {/* Storage Widget */}
        {!isCollapsed && (
          <div style={{ 
            margin: '24px 0', padding: '16px', background: 'rgba(255,255,255,0.03)', 
            borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Database size={16} color="#94A3B8" />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8' }}>Stockage</span>
            </div>
            <div style={{ height: 6, background: '#1E293B', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ width: '72%', height: '100%', background: '#0D7A5F', borderRadius: 3 }} />
            </div>
            <p style={{ fontSize: 10, color: '#64748B', margin: 0 }}>72% de 50 000 dossiers utilisés</p>
          </div>
        )}
      </div>

      {/* User Profile - Fixed */}
      <div style={{ padding: '24px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px' }}>
          <div style={{ 
            width: 40, height: 40, borderRadius: 12, background: '#0D7A5F', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' 
          }}>
            <User size={20} />
          </div>
          {!isCollapsed && (
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: '#fff' }}>Admin User</p>
              <p style={{ fontSize: 11, color: '#64748B', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden' }}>admin@naissancechain.gov</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
