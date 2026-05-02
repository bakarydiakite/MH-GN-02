import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Map, 
  Users, 
  ShieldCheck, 
  Calendar,
  ChevronRight
} from 'lucide-react';

const stats = [
  { label: 'Taux de vérification', value: '85.7%', change: '+2.1%', icon: ShieldCheck, color: '#10B981' },
  { label: 'Croissance mensuelle', value: '+12.4%', change: '+0.8%', icon: TrendingUp, color: '#3B82F6' },
  { label: 'Régions couvertes', value: '14 / 14', change: '100%', icon: Map, color: '#6366F1' },
  { label: 'Agents actifs', value: '48', change: '+3 ce mois', icon: Users, color: '#F59E0B' },
];

const regions = [
  { name: 'Conakry', count: 5420, percentage: 90, color: '#10B981' },
  { name: 'Kindia', count: 3210, percentage: 87, color: '#F59E0B' },
  { name: 'Labé', count: 2140, percentage: 90, color: '#10B981' },
  { name: 'Kankan', count: 1870, percentage: 82, color: '#F59E0B' },
  { name: "N'Zérékoré", count: 1560, percentage: 79, color: '#EF4444' },
  { name: 'Boké', count: 1340, percentage: 88, color: '#10B981' },
  { name: 'Mamou', count: 980, percentage: 84, color: '#F59E0B' },
  { name: 'Faranah', count: 760, percentage: 78, color: '#EF4444' },
];

const topAgents = [
  { name: 'Dr. Fatou Ndiaye', dossiers: 342, taux: '92.9%' },
  { name: 'Ibrahima Sow', dossiers: 287, taux: '87.5%' },
  { name: 'Mariama Kouyaté', dossiers: 265, taux: '93.6%' },
  { name: 'Ousmane Faye', dossiers: 240, taux: '89.2%' },
  { name: 'Aminata Sarr', dossiers: 215, taux: '91.1%' },
  { name: 'Dr. Cheikh Fall', dossiers: 198, taux: '88.4%' },
];

export default function Stats() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1E293B', marginBottom: 8 }}>Statistiques & Couverture</h1>
          <p style={{ color: '#64748B', fontSize: 16 }}>Analyse des enregistrements de naissances par région et par période</p>
        </div>
        <div style={{ display: 'flex', background: '#fff', padding: 4, borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          {['7 jours', '30 jours', '6 mois', '1 an'].map((p) => (
            <button 
              key={p}
              style={{ 
                padding: '8px 16px', borderRadius: 8, border: 'none', 
                background: p === '6 mois' ? '#0F172A' : 'transparent',
                color: p === '6 mois' ? '#fff' : '#64748B',
                fontSize: 13, fontWeight: 600, cursor: 'pointer'
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
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
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ 
                width: 48, height: 48, borderRadius: 14, background: `${stat.color}10`, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color
              }}>
                <stat.icon size={24} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: stat.color }}>{stat.change}</span>
            </div>
            <h3 style={{ fontSize: 28, fontWeight: 800, color: '#1E293B', margin: 0 }}>{stat.value}</h3>
            <p style={{ fontSize: 14, color: '#64748B', fontWeight: 500, marginTop: 4 }}>{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: 24 }}>
        {/* Tendance Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ background: '#fff', borderRadius: 24, padding: 32, border: '1px solid #F1F5F9' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1E293B', margin: 0 }}>Tendance des enregistrements</h2>
              <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>Enregistrements vs vérifiés par mois</p>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, background: '#0F172A', borderRadius: 3 }} />
                <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Enregistrés</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, background: '#10B981', borderRadius: 3 }} />
                <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Vérifiés</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, height: 240, paddingBottom: 20 }}>
            {[
              { e: 65, v: 50 },
              { e: 75, v: 60 },
              { e: 85, v: 70 },
              { e: 70, v: 55 },
              { e: 80, v: 65 },
              { e: 95, v: 80 },
              { e: 85, v: 70 }
            ].map((data, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{ width: '100%', display: 'flex', gap: 6, alignItems: 'flex-end', height: 200 }}>
                  {/* Bar Enregistrés */}
                  <div style={{ flex: 1, height: '100%', background: '#F1F5F9', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: `${data.e}%` }} 
                      style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#0F172A', borderRadius: 4 }} 
                    />
                  </div>
                  {/* Bar Vérifiés */}
                  <div style={{ flex: 1, height: '100%', background: '#ECFDF5', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: `${data.v}%` }} 
                      style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#10B981', borderRadius: 4 }} 
                    />
                  </div>
                </div>
                <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>{['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul'][i]}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingTop: 24, borderTop: '1px solid #F1F5F9' }}>
            <span style={{ fontSize: 14, color: '#1E293B', fontWeight: 600 }}>Total période : <span style={{ fontWeight: 800 }}>14,570</span></span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10B981', fontSize: 13, fontWeight: 700 }}>
              <TrendingUp size={16} />
              +18.3% vs période précédente
            </div>
          </div>
        </motion.div>

        {/* Répartition Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ background: '#fff', borderRadius: 24, padding: 32, border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column' }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1E293B', margin: 0 }}>Répartition des statuts</h2>
          <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>Distribution globale</p>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '32px 0', position: 'relative' }}>
            <svg width="180" height="180" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" strokeWidth="12" strokeDasharray={`${85.7 * 2.51} 251`} strokeDashoffset="0" transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F59E0B" strokeWidth="12" strokeDasharray={`${12.7 * 2.51} 251`} strokeDashoffset={`-${85.7 * 2.51}`} transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#EF4444" strokeWidth="12" strokeDasharray={`${1.6 * 2.51} 251`} strokeDashoffset={`-${(85.7 + 12.7) * 2.51}`} transform="rotate(-90 50 50)" />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: 24, fontWeight: 800, color: '#1E293B' }}>85.7%</span>
              <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>vérifié</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Vérifiés', count: '15 839', percent: '85.7%', color: '#10B981' },
              { label: 'En attente', count: '2 341', percent: '12.7%', color: '#F59E0B' },
              { label: 'Invalides', count: '292', percent: '1.6%', color: '#EF4444' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#64748B' }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>{item.count}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', width: 40, textAlign: 'right' }}>{item.percent}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Region and Agents Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Couverture par région */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: '#fff', borderRadius: 24, padding: 32, border: '1px solid #F1F5F9' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1E293B', margin: 0 }}>Couverture par région</h2>
              <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>Enregistrements et taux de vérification</p>
            </div>
            <button style={{ border: 'none', background: 'transparent', color: '#10B981', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Voir tout</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {regions.map((region) => (
              <div key={region.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>{region.name}</span>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#94A3B8' }}>{region.count}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: region.color, padding: '2px 8px', background: `${region.color}10`, borderRadius: 8 }}>{region.percentage}%</span>
                  </div>
                </div>
                <div style={{ height: 6, background: '#F8FAFC', borderRadius: 3, overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${region.percentage}%` }}
                    style={{ height: '100%', background: '#0F172A', borderRadius: 3 }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Performance des agents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ background: '#fff', borderRadius: 24, padding: 32, border: '1px solid #F1F5F9' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1E293B', margin: 0 }}>Performance des agents</h2>
              <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>Top agents par taux de vérification</p>
            </div>
            <div style={{ padding: '6px 12px', background: '#F8FAFC', borderRadius: 10, fontSize: 11, fontWeight: 700, color: '#64748B' }}>Ce mois</div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                <th style={{ padding: '0 0 16px 0', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Agent</th>
                <th style={{ padding: '0 0 16px 0', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Dossiers</th>
                <th style={{ padding: '0 0 16px 0', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Taux</th>
              </tr>
            </thead>
            <tbody>
              {topAgents.map((agent, i) => (
                <tr key={i} style={{ borderBottom: i === topAgents.length - 1 ? 'none' : '1px solid #F8FAFC' }}>
                  <td style={{ padding: '20px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#CBD5E1', width: 16 }}>{i + 1}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{agent.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '20px 0', textAlign: 'right', fontSize: 14, color: '#64748B' }}>{agent.dossiers}</td>
                  <td style={{ padding: '20px 0', textAlign: 'right', fontSize: 13, fontWeight: 800, color: '#10B981' }}>{agent.taux}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}
