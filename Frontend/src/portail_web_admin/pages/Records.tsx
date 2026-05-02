import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Download, 
  Filter, 
  ChevronDown, 
  ShieldCheck, 
  Eye,
  MoreHorizontal,
  Loader2,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { apiService } from '../../services/api';

export default function Records() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [validatingId, setValidatingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const data = await apiService.getBirths();
      setRecords(data);
    } catch (error) {
      console.error("Erreur chargement dossiers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleValidate = async (id: string) => {
    if (!window.confirm("Voulez-vous valider cet acte et l'ancrer sur la blockchain ?")) return;
    
    setValidatingId(id);
    try {
      const result = await apiService.validateBirth(id);
      setNotification(`L'acte a été ancré avec succès sur Polygon ! Tx: ${result.blockchainTx?.txHash?.slice(0, 10)}...`);
      fetchRecords(); // Recharger la liste
      
      // Faire disparaître la notification après 5 secondes
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      alert("Erreur lors de la validation sur la blockchain.");
    } finally {
      setValidatingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            style={{ 
              position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 1000,
              background: '#0F172A', color: '#fff', padding: '16px 24px', borderRadius: 16,
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 12
            }}
          >
            <CheckCircle2 color="#10B981" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1E293B', marginBottom: 8 }}>Dossiers d'enregistrement</h1>
          <p style={{ color: '#64748B', fontSize: 16 }}>
            {loading ? 'Chargement...' : `${records.length} dossiers au total dans le système`}
          </p>
        </div>
        <button style={{ 
          display: 'flex', alignItems: 'center', gap: 10, background: '#0F172A', color: '#fff', 
          border: 'none', borderRadius: 12, padding: '12px 24px', fontWeight: 600, cursor: 'pointer'
        }}>
          <Download size={20} /> Exporter
        </button>
      </div>

      {/* Table Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: '#fff', borderRadius: 24, border: '1px solid #F1F5F9', overflow: 'hidden' }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                <th style={{ padding: '16px 32px', color: '#94A3B8', fontSize: 12, fontWeight: 700 }}>NOM DE L'ENFANT</th>
                <th style={{ padding: '16px 20px', color: '#94A3B8', fontSize: 12, fontWeight: 700 }}>REGION</th>
                <th style={{ padding: '16px 20px', color: '#94A3B8', fontSize: 12, fontWeight: 700 }}>IUN</th>
                <th style={{ padding: '16px 20px', color: '#94A3B8', fontSize: 12, fontWeight: 700 }}>STATUT</th>
                <th style={{ padding: '16px 32px', color: '#94A3B8', fontSize: 12, fontWeight: 700, textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>
                    <Loader2 className="animate-spin" style={{ margin: '0 auto', marginBottom: 12 }} />
                    Chargement des dossiers...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>
                    Aucun dossier trouvé.
                  </td>
                </tr>
              ) : records.map((record, i) => (
                <tr key={record.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '20px 32px' }}>
                    <span style={{ fontWeight: 600, color: '#1E293B' }}>
                      {record.enfant?.prenoms} {record.enfant?.nom}
                    </span>
                  </td>
                  <td style={{ padding: '20px 20px', color: '#64748B' }}>
                    {record.enfant?.lieuNaissanceLibelle || 'Non spécifié'}
                  </td>
                  <td style={{ padding: '20px 20px', color: '#0D7A5F', fontWeight: 700, fontFamily: 'monospace' }}>
                    {record.identifiantUniqueNational || '---'}
                  </td>
                  <td style={{ padding: '20px 20px' }}>
                    <span style={{ 
                      padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                      background: record.statut === 'VALIDE' ? '#ECFDF5' : '#FFFBEB',
                      color: record.statut === 'VALIDE' ? '#10B981' : '#F59E0B'
                    }}>
                      {record.statut}
                    </span>
                  </td>
                  <td style={{ padding: '20px 32px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      {record.statut === 'EN_ATTENTE' && (
                        <button 
                          onClick={() => handleValidate(record.id)}
                          disabled={validatingId === record.id}
                          style={{ 
                            padding: '8px 16px', borderRadius: 8, border: 'none', 
                            background: '#0D7A5F', color: '#fff', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600
                          }}
                        >
                          {validatingId === record.id ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                          Valider
                        </button>
                      )}
                      {record.statut === 'VALIDE' && (
                        <a 
                          href={`https://amoy.polygonscan.com/tx/${record.blockchainTx?.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ 
                            padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', 
                            background: '#fff', color: '#64748B', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', fontSize: 13
                          }}
                        >
                          <ExternalLink size={14} /> Blockchain
                        </a>
                      )}
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
