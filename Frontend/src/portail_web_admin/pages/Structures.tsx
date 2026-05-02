import { motion } from 'framer-motion';
import { 
  Building2, 
  Plus, 
  Search, 
  ChevronDown, 
  LayoutGrid, 
  List, 
  MoreVertical, 
  Edit2, 
  Building, 
  ShieldCheck, 
  MapPin
} from 'lucide-react';

const stats = [
  { label: 'Total structures', value: '10', icon: Building2, color: '#64748B' },
  { label: 'Hôpitaux', value: '4', icon: Building2, color: '#EF4444' },
  { label: 'Mairies / Préfectures', value: '5', icon: Building, color: '#3B82F6' },
  { label: 'Actives', value: '8', icon: ShieldCheck, color: '#10B981' },
];

const structures = [
  { 
    name: 'Hôpital Ignace Deen', 
    location: 'Conakry', 
    type: 'Hôpital', 
    region: 'Conakry', 
    agents: 12, 
    dossiers: '4 820', 
    status: 'Active', 
    lastSync: '13 avr., 08:00' 
  },
  { 
    name: 'Mairie de Conakry', 
    location: 'Conakry', 
    type: 'Mairie', 
    region: 'Conakry', 
    agents: 8, 
    dossiers: '12 450', 
    status: 'Active', 
    lastSync: '13 avr., 07:30' 
  },
  { 
    name: 'Hôpital Régional de Kindia', 
    location: 'Kindia', 
    type: 'Hôpital', 
    region: 'Kindia', 
    agents: 6, 
    dossiers: '2 310', 
    status: 'Active', 
    lastSync: '12 avr., 18:00' 
  },
  { 
    name: 'Préfecture de Labé', 
    location: 'Labé', 
    type: 'Préfecture', 
    region: 'Labé', 
    agents: 4, 
    dossiers: '1 890', 
    status: 'Active', 
    lastSync: '12 avr., 16:45' 
  },
];

const getTypeStyle = (type: string) => {
  switch(type) {
    case 'Hôpital': return { bg: '#FEF2F2', color: '#EF4444' };
    case 'Mairie': return { bg: '#EFF6FF', color: '#3B82F6' };
    case 'Préfecture': return { bg: '#F5F3FF', color: '#8B5CF6' };
    default: return { bg: '#F8FAFC', color: '#64748B' };
  }
};

export default function Structures() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1E293B', marginBottom: 8 }}>Structures partenaires</h1>
          <p style={{ color: '#64748B', fontSize: 16 }}>Hôpitaux, mairies, écoles et préfectures connectés au système</p>
        </div>
        <button style={{ 
          display: 'flex', alignItems: 'center', gap: 10, background: '#0F172A', color: '#fff', 
          border: 'none', borderRadius: 12, padding: '12px 24px', fontWeight: 600, cursor: 'pointer',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
        }}>
          <Plus size={20} /> Ajouter une structure
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
            placeholder="Rechercher une structure..." 
            style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: 15, color: '#1E293B' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <select style={{ 
              appearance: 'none', padding: '12px 40px 12px 20px', borderRadius: 12, border: '1px solid #F1F5F9',
              background: '#fff', fontSize: 14, fontWeight: 600, color: '#1E293B', cursor: 'pointer', outline: 'none'
            }}>
              <option>Tous les types</option>
              <option>Hôpital</option>
              <option>Mairie</option>
              <option>Préfecture</option>
            </select>
            <ChevronDown size={18} style={{ position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }} />
          </div>

          <div style={{ position: 'relative' }}>
            <select style={{ 
              appearance: 'none', padding: '12px 40px 12px 20px', borderRadius: 12, border: '1px solid #F1F5F9',
              background: '#fff', fontSize: 14, fontWeight: 600, color: '#1E293B', cursor: 'pointer', outline: 'none'
            }}>
              <option>Toutes les régions</option>
              <option>Conakry</option>
              <option>Kindia</option>
              <option>Labé</option>
            </select>
            <ChevronDown size={18} style={{ position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }} />
          </div>

          <div style={{ display: 'flex', background: '#F1F5F9', padding: 4, borderRadius: 10, border: '1px solid #E2E8F0' }}>
            <button style={{ padding: 8, borderRadius: 8, border: 'none', background: '#fff', color: '#0F172A', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}><List size={18} /></button>
            <button style={{ padding: 8, borderRadius: 8, border: 'none', background: 'transparent', color: '#94A3B8', cursor: 'pointer' }}><LayoutGrid size={18} /></button>
          </div>
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
                <th style={{ padding: '20px 32px', color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Structure</th>
                <th style={{ padding: '20px 20px', color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Type</th>
                <th style={{ padding: '20px 20px', color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Région</th>
                <th style={{ padding: '20px 20px', color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Agents</th>
                <th style={{ padding: '20px 20px', color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Dossiers</th>
                <th style={{ padding: '20px 20px', color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Statut</th>
                <th style={{ padding: '20px 20px', color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Dernière sync.</th>
                <th style={{ padding: '20px 32px', color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {structures.map((s, i) => (
                <tr 
                  key={s.name} 
                  style={{ 
                    borderBottom: i === structures.length - 1 ? 'none' : '1px solid #F8FAFC',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '20px 32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ 
                        width: 40, height: 40, borderRadius: 10, background: getTypeStyle(s.type).bg, 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: getTypeStyle(s.type).color
                      }}>
                        {s.type === 'Hôpital' ? <Building2 size={20} /> : s.type === 'Mairie' ? <Building size={20} /> : <Building2 size={20} />}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, color: '#1E293B', fontSize: 15, margin: 0 }}>{s.name}</p>
                        <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>{s.location}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '20px 20px' }}>
                    <span style={{ 
                      padding: '4px 12px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                      background: getTypeStyle(s.type).bg,
                      color: getTypeStyle(s.type).color
                    }}>
                      {s.type}
                    </span>
                  </td>
                  <td style={{ padding: '20px 20px', color: '#64748B', fontSize: 14 }}>{s.region}</td>
                  <td style={{ padding: '20px 20px', color: '#1E293B', fontSize: 14, fontWeight: 600 }}>{s.agents}</td>
                  <td style={{ padding: '20px 20px', color: '#1E293B', fontSize: 14, fontWeight: 600 }}>{s.dossiers}</td>
                  <td style={{ padding: '20px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10B981', fontSize: 13, fontWeight: 600 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                      {s.status}
                    </div>
                  </td>
                  <td style={{ padding: '20px 20px', color: '#64748B', fontSize: 14 }}>{s.lastSync}</td>
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
