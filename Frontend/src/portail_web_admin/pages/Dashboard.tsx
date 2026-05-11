import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  MoreVertical,
  Filter,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface RecentRecord {
  id: string;
  identifiantUniqueNational: string;
  enfant: {
    prenoms: string;
    nom: string;
  };
  center?: {
    nom: string;
    prefecture?: {
      nom: string;
      region: string;
    };
  };
  agent?: {
    user?: {
      nom: string;
      prenom: string;
    };
  };
  statut: string;
  createdAt: string;
}

// Permissions par rôle
const isAdmin = (role: string) => role === 'ADMINISTRATEUR';
const isSuperviseur = (role: string) => role === 'SUPERVISEUR';
const isVerificateur = (role: string) => role === 'VERIFICATEUR';

export default function Dashboard() {
  const { user } = useAuth();
  const userRole = user?.role || 'VERIFICATEUR';
  
  const [stats, setStats] = useState<any[]>([]);
  const [recentRecords, setRecentRecords] = useState<RecentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les stats
        const data = await apiService.getDashboardStats();
        const mappedStats = [
          {
            label: 'Total Enregistrements',
            value: data.totalBirths?.toLocaleString() || '0',
            change: '+12.4% ce mois',
            isPositive: true,
            icon: Users,
            color: '#6366F1',
            path: '/admin/records'
          },
          {
            label: 'Dossiers Vérifiés',
            value: data.validated?.toLocaleString() || '0',
            change: '+8.2% ce mois',
            isPositive: true,
            icon: ShieldCheck,
            color: '#10B981',
            path: '/admin/verification'
          },
          {
            label: 'En Attente',
            value: data.pendingValidations?.toLocaleString() || '0',
            change: '-3.1% cette semaine',
            isPositive: false,
            icon: Clock,
            color: '#F59E0B',
            path: '/admin/records'
          }
        ];
        setStats(mappedStats);

        // Charger les enregistrements récents
        const births = await apiService.getBirths();
        const recent = births.slice(0, 5); // 5 derniers
        setRecentRecords(recent);
      } catch (error) {
        console.error("Erreur chargement données:", error);
        setStats([
          { label: 'Total Enregistrements', value: '0', change: '...', isPositive: true, icon: Users, color: '#6366F1', path: '/admin/records' },
          { label: 'Dossiers Vérifiés', value: '0', change: '...', isPositive: true, icon: ShieldCheck, color: '#10B981', path: '/admin/verification' },
          { label: 'En Attente', value: '0', change: '...', isPositive: false, icon: Clock, color: '#F59E0B', path: '/admin/records' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Welcome Header */}
      <div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 32, fontWeight: 800, color: '#1E293B', marginBottom: 8 }}
        >
          Bonjour, {user?.prenom || user?.nom || 'Utilisateur'} !
        </motion.h1>
        <p style={{ color: '#64748B', fontSize: 16 }}>
          {userRole === 'ADMINISTRATEUR' && 'Gérez le système et supervisez les opérations.'}
          {userRole === 'SUPERVISEUR' && 'Validez les actes en attente et supervisez les agents.'}
          {userRole === 'VERIFICATEUR' && 'Consultez et vérifiez les dossiers d\'actes.'}
        </p>
      </div>

      {/* Top Section: Stats + Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24 }}>
        {/* Stats Cards Column */}
        <div style={{ gridColumn: 'span 8', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {stats.map((stat, i) => (
            <Link key={stat.label} to={stat.path} style={{ textDecoration: 'none' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, boxShadow: '0 12px 20px rgba(0,0,0,0.05)' }}
                style={{
                  background: '#fff',
                  padding: 24,
                  borderRadius: 24,
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -2px rgba(0,0,0,0.02)',
                  border: '1px solid #F1F5F9',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                  <div style={{ 
                    width: 48, height: 48, borderRadius: 16, background: `${stat.color}10`, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color
                  }}>
                    <stat.icon size={24} />
                  </div>
                  <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#CBD5E1' }}>
                    <MoreVertical size={20} />
                  </button>
                </div>
                
                <div style={{ marginBottom: 16 }}>
                  <h3 style={{ fontSize: 36, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: -1 }}>
                    {loading ? '...' : stat.value}
                  </h3>
                  <p style={{ fontSize: 14, color: '#64748B', fontWeight: 500, marginTop: 4 }}>{stat.label}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {stat.isPositive ? (
                    <div style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600 }}>
                      <TrendingUp size={16} />
                      <span>{stat.change}</span>
                    </div>
                  ) : (
                    <div style={{ color: '#EF4444', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600 }}>
                      <TrendingDown size={16} />
                      <span>{stat.change}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Chart Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            gridColumn: 'span 4',
            background: '#fff',
            borderRadius: 24,
            padding: 24,
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
            border: '1px solid #F1F5F9',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>Aperçu des données</h2>
            <div style={{ display: 'flex', background: '#F8FAFC', padding: 4, borderRadius: 10, border: '1px solid #F1F5F9' }}>
              <button style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: '#fff', fontSize: 11, fontWeight: 700, color: '#0F172A', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>7j</button>
              <button style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: 'transparent', fontSize: 11, fontWeight: 700, color: '#64748B', cursor: 'pointer' }}>30j</button>
              <button style={{ padding: '6px 8px', borderRadius: 8, border: 'none', background: 'transparent', color: '#94A3B8', cursor: 'pointer' }}><Calendar size={14} /></button>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 10, height: 140, paddingBottom: 10, position: 'relative' }}>
            {[40, 70, 90, 60, 30, 75, 85].map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 2 }}>
                <div style={{ width: '100%', display: 'flex', gap: 4, alignItems: 'flex-end', height: 120 }}>
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    style={{ flex: 1, background: '#0D7A5F', borderRadius: '4px 4px 2px 2px' }} 
                  />
                </div>
                <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>{['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: '#fff',
          borderRadius: 24,
          padding: 32,
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
          border: '1px solid #F1F5F9'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>Tableau des enregistrements récents</h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link 
              to="/admin/records"
              style={{ border: 'none', background: 'transparent', color: '#0D7A5F', fontWeight: 700, fontSize: 14, cursor: 'pointer', paddingLeft: 12, textDecoration: 'none' }}
            >
              Voir tout
            </Link>
          </div>
        </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <th style={{ padding: '16px 8px', color: '#94A3B8', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Nom</th>
                  <th style={{ padding: '16px 8px', color: '#94A3B8', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>ID</th>
                  <th style={{ padding: '16px 8px', color: '#94A3B8', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Statut</th>
                  <th style={{ padding: '16px 8px', color: '#94A3B8', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentRecords.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>
                      Aucun enregistrement trouvé
                    </td>
                  </tr>
                ) : (
                  recentRecords.map((record, i) => (
                    <tr key={record.id} style={{ borderBottom: i === recentRecords.length - 1 ? 'none' : '1px solid #F8FAFC' }}>
                      <td style={{ padding: '20px 8px' }}>
                        <span style={{ fontWeight: 600, color: '#1E293B' }}>
                          {record.enfant?.prenoms} {record.enfant?.nom}
                        </span>
                      </td>
                      <td style={{ padding: '20px 8px', color: '#64748B', fontSize: 14 }}>
                        {record.identifiantUniqueNational}
                      </td>
                      <td style={{ padding: '20px 8px' }}>
                        <span style={{ 
                          padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                          background: record.statut === 'VALIDE' ? '#ECFDF5' : record.statut === 'EN_ATTENTE' ? '#FFFBEB' : '#FEF2F2',
                          color: record.statut === 'VALIDE' ? '#10B981' : record.statut === 'EN_ATTENTE' ? '#F59E0B' : '#EF4444'
                        }}>
                          {record.statut === 'VALIDE' ? 'Vérifié' : record.statut === 'EN_ATTENTE' ? 'En attente' : 'Rejeté'}
                        </span>
                      </td>
                      <td style={{ padding: '20px 8px', color: '#64748B', fontSize: 14 }}>
                        {new Date(record.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

    </div>
  );
}
