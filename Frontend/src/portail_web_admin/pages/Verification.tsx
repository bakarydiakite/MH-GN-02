import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Percent, 
  BarChart3, 
  Search, 
  QrCode, 
  History,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { apiService } from '../../services/api';

interface BirthRecord {
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
  statut: string;
}

export default function Verification() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<BirthRecord | null>(null);
  const [searching, setSearching] = useState(false);
  const [recentRecords, setRecentRecords] = useState<BirthRecord[]>([]);
  const [stats, setStats] = useState({
    verificationsToday: 0,
    successRate: 0,
    totalMonth: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les stats
        const statsData = await apiService.getDashboardStats();
        setStats({
          verificationsToday: statsData.anchoredOnBlockchain || 0,
          successRate: statsData.totalBirths > 0 ? Math.round((statsData.anchoredOnBlockchain / statsData.totalBirths) * 100) : 0,
          totalMonth: statsData.totalBirths || 0,
        });

        // Charger les enregistrements récents
        const births = await apiService.getBirths();
        setRecentRecords(births.slice(0, 5));
      } catch (error) {
        console.error('Erreur chargement données:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const result = await apiService.getBirths().then(births => 
        births.find(b => b.identifiantUniqueNational === searchQuery.trim())
      );
      setSearchResult(result || null);
    } catch (error) {
      console.error('Erreur recherche:', error);
    } finally {
      setSearching(false);
    }
  };

  const statCards = [
    { label: 'Actes vérifiés', value: stats.verificationsToday, icon: ShieldCheck, color: '#10B981' },
    { label: 'Taux de succès', value: `${stats.successRate}%`, icon: Percent, color: '#3B82F6' },
    { label: 'Total enregistrements', value: stats.totalMonth, icon: BarChart3, color: '#6366F1' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1E293B', marginBottom: 8 }}>Vérification des dossiers</h1>
          <p style={{ color: '#64748B', fontSize: 16 }}>Vérifiez instantanément l'authenticité d'un acte de naissance</p>
        </div>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: 8, background: '#ECFDF5', 
          color: '#10B981', padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600 
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
          Système opérationnel
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {statCards.map((stat, i) => (
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

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Main Verification Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: '#fff',
              borderRadius: 24,
              padding: 40,
              border: '1px solid #F1F5F9',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
              <div style={{ 
                width: 48, height: 48, borderRadius: 12, background: '#0F172A', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' 
              }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1E293B', margin: 0 }}>Vérification instantanée</h2>
                <p style={{ fontSize: 14, color: '#64748B', marginTop: 2 }}>Recherche dans la base NaissanceChain sécurisée</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 }}>Identifiant d'enregistrement</label>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ 
                  flex: 1, display: 'flex', alignItems: 'center', gap: 12, 
                  background: '#F8FAFC', padding: '16px 24px', borderRadius: 16, border: '1px solid #F1F5F9' 
                }}>
                  <Search size={20} color="#94A3B8" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ex. GN-2024-001ABC" 
                    style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: 16, color: '#1E293B' }}
                  />
                </div>
                <button 
                  onClick={handleSearch}
                  disabled={searching}
                  style={{ 
                    background: '#0D7A5F', color: '#fff', border: 'none', borderRadius: 16, 
                    padding: '0 32px', fontWeight: 600, fontSize: 16, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 10
                  }}
                >
                  {searching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />} Vérifier
                </button>
              </div>
            </div>

            {/* Résultat de la recherche */}
            {searchResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  background: searchResult.statut === 'VALIDE' ? '#ECFDF5' : '#FFFBEB',
                  padding: 24, borderRadius: 16, marginBottom: 24 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  {searchResult.statut === 'VALIDE' ? (
                    <CheckCircle2 size={24} color="#10B981" />
                  ) : (
                    <Clock size={24} color="#F59E0B" />
                  )}
                  <span style={{ fontWeight: 700, color: searchResult.statut === 'VALIDE' ? '#10B981' : '#F59E0B' }}>
                    {searchResult.statut === 'VALIDE' ? 'Acte vérifié et authentifié' : 'En attente de validation'}
                  </span>
                </div>
                <p style={{ fontSize: 18, fontWeight: 700, color: '#1E293B', marginBottom: 8 }}>
                  {searchResult.enfant?.prenoms} {searchResult.enfant?.nom}
                </p>
                <p style={{ color: '#64748B', fontSize: 14 }}>
                  ID: {searchResult.identifiantUniqueNational}
                </p>
              </motion.div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <button style={{ 
                display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 12, 
                border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', cursor: 'pointer', fontSize: 14, fontWeight: 600
              }}>
                <QrCode size={18} /> Scanner un QR code
              </button>
              <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>
                Format : <span style={{ color: '#64748B', fontWeight: 500 }}>GN-AAAA-XXXXXX</span>
              </p>
            </div>
          </motion.div>

          {/* Dossiers récents */}
          <div style={{ textAlign: 'center', position: 'relative', margin: '12px 0' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#F1F5F9', zIndex: 0 }} />
            <span style={{ position: 'relative', background: '#F8FAFC', padding: '0 20px', color: '#94A3B8', fontSize: 13, zIndex: 1 }}>Dossiers récents</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {recentRecords.slice(0, 3).map((record) => (
              <motion.div
                key={record.id}
                whileHover={{ y: -4 }}
                onClick={() => setSearchQuery(record.identifiantUniqueNational)}
                style={{
                  background: '#fff',
                  padding: 24,
                  borderRadius: 20,
                  border: '1px solid #F1F5F9',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                  cursor: 'pointer'
                }}
              >
                <p style={{ fontSize: 11, fontWeight: 700, color: '#CBD5E1', marginBottom: 12 }}>{record.identifiantUniqueNational}</p>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', margin: '0 0 4px 0' }}>
                  {record.enfant?.prenoms} {record.enfant?.nom}
                </h4>
                <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 16 }}>{record.center?.nom || 'Centre non défini'}</p>
                <div style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700,
                  color: record.statut === 'VALIDE' ? '#10B981' : '#F59E0B'
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                  {record.statut === 'VALIDE' ? 'Vérifié' : 'En attente'}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Recent Searches */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: '#fff',
              borderRadius: 24,
              padding: 32,
              border: '1px solid #F1F5F9',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <History size={20} color="#64748B" />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', margin: 0 }}>Dossiers récents</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {recentRecords.length === 0 ? (
                <p style={{ color: '#64748B', textAlign: 'center', padding: 20 }}>Aucun dossier</p>
              ) : (
                recentRecords.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => setSearchQuery(item.identifiantUniqueNational)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: 16, background: '#F8FAFC', cursor: 'pointer' }}
                  >
                    <div style={{ 
                      width: 36, height: 36, borderRadius: 10, background: '#fff', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981'
                    }}>
                      <FileText size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', margin: 0 }}>
                        {item.enfant?.prenoms} {item.enfant?.nom}
                      </p>
                      <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>{item.identifiantUniqueNational}</p>
                    </div>
                    <span style={{ 
                      fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 8,
                      background: item.statut === 'VALIDE' ? '#ECFDF5' : '#FFFBEB',
                      color: item.statut === 'VALIDE' ? '#10B981' : '#F59E0B'
                    }}>
                      {item.statut === 'VALIDE' ? 'Vérifié' : 'En attente'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* QR Scan Zone */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: '#fff',
              borderRadius: 24,
              padding: 32,
              border: '1px solid #F1F5F9',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
              flex: 1
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <QrCode size={20} color="#64748B" />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', margin: 0 }}>Scanner QR Code</h3>
            </div>
            
            <div style={{ 
              height: 240, background: '#F8FAFC', borderRadius: 20, border: '2px dashed #E2E8F0',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16
            }}>
              <div style={{ 
                width: 80, height: 80, border: '2px solid #CBD5E1', borderRadius: 12, position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{ position: 'absolute', top: -2, left: -2, width: 20, height: 20, borderTop: '4px solid #0D7A5F', borderLeft: '4px solid #0D7A5F', borderRadius: '4px 0 0 0' }} />
                <div style={{ position: 'absolute', top: -2, right: -2, width: 20, height: 20, borderTop: '4px solid #0D7A5F', borderRight: '4px solid #0D7A5F', borderRadius: '0 4px 0 0' }} />
                <div style={{ position: 'absolute', bottom: -2, left: -2, width: 20, height: 20, borderBottom: '4px solid #0D7A5F', borderLeft: '4px solid #0D7A5F', borderRadius: '0 0 0 4px' }} />
                <div style={{ position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, borderBottom: '4px solid #0D7A5F', borderRight: '4px solid #0D7A5F', borderRadius: '0 0 4px 0' }} />
                <QrCode size={32} color="#CBD5E1" />
              </div>
              <p style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500 }}>Zone de scan</p>
            </div>
            <button style={{ 
              width: '100%', marginTop: 24, background: '#F1F5F9', color: '#64748B', border: 'none', 
              borderRadius: 12, padding: '12px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s'
            }}>
              Activer la caméra
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
