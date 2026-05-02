import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Search, 
  ChevronDown, 
  MoreVertical, 
  Edit2, 
  Users as UsersIcon, 
  UserCheck, 
  ShieldAlert, 
  UserX
} from 'lucide-react';

const stats = [
  { label: 'Total utilisateurs', value: '8', icon: UsersIcon, color: '#6366F1' },
  { label: 'Actifs', value: '6', icon: UserCheck, color: '#10B981' },
  { label: 'Administrateurs', value: '1', icon: ShieldAlert, color: '#8B5CF6' },
  { label: 'Suspendus', value: '1', icon: UserX, color: '#EF4444' },
];

const users = [
  { 
    name: 'Amadou Kouyaté', 
    email: 'a.kouyate@naissancechain.gov', 
    role: 'Administrateur', 
    structure: 'Ministère de la Santé', 
    region: 'Conakry', 
    status: 'Actif', 
    lastLogin: '13 avr., 08:30' 
  },
  { 
    name: 'Fatoumata Bah', 
    email: 'f.bah@hopital-ignace.gov', 
    role: 'Agent', 
    structure: 'Hôpital Ignace Deen', 
    region: 'Conakry', 
    status: 'Actif', 
    lastLogin: '13 avr., 07:15' 
  },
  { 
    name: 'Mamadou Diallo', 
    email: 'm.diallo@mairie-kindia.gov', 
    role: 'Vérificateur', 
    structure: 'Mairie de Kindia', 
    region: 'Kindia', 
    status: 'Actif', 
    lastLogin: '12 avr., 14:22' 
  },
  { 
    name: 'Aissatou Camara', 
    email: 'a.camara@ecole-kaloum.edu', 
    role: 'Lecteur', 
    structure: 'École Primaire Kaloum', 
    region: 'Conakry', 
    status: 'Inactif', 
    lastLogin: '10 avr., 09:00' 
  },
];

const getRoleStyle = (role: string) => {
  switch(role) {
    case 'Administrateur': return { bg: '#F5F3FF', color: '#8B5CF6' };
    case 'Agent': return { bg: '#ECFDF5', color: '#10B981' };
    case 'Vérificateur': return { bg: '#EFF6FF', color: '#3B82F6' };
    case 'Lecteur': return { bg: '#F8FAFC', color: '#64748B' };
    default: return { bg: '#F8FAFC', color: '#64748B' };
  }
};

export default function Users() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1E293B', marginBottom: 8 }}>Gestion des utilisateurs</h1>
          <p style={{ color: '#64748B', fontSize: 16 }}>Gérez les accès et les rôles des utilisateurs du système</p>
        </div>
        <button style={{ 
          display: 'flex', alignItems: 'center', gap: 10, background: '#0F172A', color: '#fff', 
          border: 'none', borderRadius: 12, padding: '12px 24px', fontWeight: 600, cursor: 'pointer',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
        }}>
          <UserPlus size={20} /> Ajouter un utilisateur
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              background: '#fff',
              padding: 24,
              borderRadius: 24,
              border: '1px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ 
              width: 56, height: 56, borderRadius: 16, background: `${stat.color}10`, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color
            }}>
              <stat.icon size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: 28, fontWeight: 800, color: '#1E293B', margin: 0 }}>{stat.value}</h3>
              <p style={{ fontSize: 14, color: '#64748B', fontWeight: 500, marginTop: 2 }}>{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ 
        background: '#fff', padding: '24px', borderRadius: 24, border: '1px solid #F1F5F9',
        display: 'flex', gap: 16, alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
      }}>
        <div style={{ 
          flex: 1, display: 'flex', alignItems: 'center', gap: 12, background: '#F8FAFC', 
          padding: '12px 20px', borderRadius: 12, border: '1px solid #F1F5F9' 
        }}>
          <Search size={20} color="#94A3B8" />
          <input 
            type="text" 
            placeholder="Rechercher un utilisateur..." 
            style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: 15, color: '#1E293B' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <select style={{ 
              appearance: 'none', padding: '12px 40px 12px 20px', borderRadius: 12, border: '1px solid #F1F5F9',
              background: '#fff', fontSize: 14, fontWeight: 600, color: '#1E293B', cursor: 'pointer', outline: 'none'
            }}>
              <option>Tous les rôles</option>
              <option>Administrateur</option>
              <option>Agent</option>
              <option>Vérificateur</option>
            </select>
            <ChevronDown size={18} style={{ position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }} />
          </div>

          <div style={{ position: 'relative' }}>
            <select style={{ 
              appearance: 'none', padding: '12px 40px 12px 20px', borderRadius: 12, border: '1px solid #F1F5F9',
              background: '#fff', fontSize: 14, fontWeight: 600, color: '#1E293B', cursor: 'pointer', outline: 'none'
            }}>
              <option>Tous les statuts</option>
              <option>Actif</option>
              <option>Inactif</option>
              <option>Suspendu</option>
            </select>
            <ChevronDown size={18} style={{ position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }} />
          </div>
          <div style={{ color: '#94A3B8', fontSize: 13, fontWeight: 500, padding: '12px 0' }}>8 résultat(s)</div>
        </div>
      </div>

      {/* Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: '#fff', borderRadius: 24, border: '1px solid #F1F5F9', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                <th style={{ padding: '20px 32px', color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Utilisateur</th>
                <th style={{ padding: '20px 20px', color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Rôle</th>
                <th style={{ padding: '20px 20px', color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Structure</th>
                <th style={{ padding: '20px 20px', color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Région</th>
                <th style={{ padding: '20px 20px', color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Statut</th>
                <th style={{ padding: '20px 20px', color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Dernière connexion</th>
                <th style={{ padding: '20px 32px', color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr 
                  key={user.email} 
                  style={{ 
                    borderBottom: i === users.length - 1 ? 'none' : '1px solid #F8FAFC',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '20px 32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ 
                        width: 40, height: 40, borderRadius: '50%', background: i % 2 === 0 ? '#6366F1' : '#10B981', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                        fontSize: 14, fontWeight: 700
                      }}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, color: '#1E293B', fontSize: 15, margin: 0 }}>{user.name}</p>
                        <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '20px 20px' }}>
                    <span style={{ 
                      padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 700,
                      background: getRoleStyle(user.role).bg,
                      color: getRoleStyle(user.role).color
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '20px 20px', color: '#64748B', fontSize: 14 }}>{user.structure}</td>
                  <td style={{ padding: '20px 20px', color: '#64748B', fontSize: 14 }}>{user.region}</td>
                  <td style={{ padding: '20px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: user.status === 'Actif' ? '#10B981' : '#94A3B8', fontSize: 13, fontWeight: 600 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                      {user.status}
                    </div>
                  </td>
                  <td style={{ padding: '20px 20px', color: '#64748B', fontSize: 14 }}>{user.lastLogin}</td>
                  <td style={{ padding: '20px 32px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                      <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#CBD5E1' }}><Edit2 size={18} /></button>
                      <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#CBD5E1' }}><MoreVertical size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
