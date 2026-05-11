import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  ShieldCheck, 
  Loader2,
  CheckCircle2,
  ExternalLink,
  XCircle,
  Clock,
  Eye,
  X,
  FileText,
  Image,
  File
} from 'lucide-react';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

// Statuts possibles
const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  'EN_ATTENTE': { label: 'En attente', color: '#F59E0B', bgColor: '#FFFBEB', icon: <Clock size={14} /> },
  'VALIDE': { label: 'Validé', color: '#10B981', bgColor: '#ECFDF5', icon: <CheckCircle2 size={14} /> },
  'REJETE': { label: 'Rejeté', color: '#EF4444', bgColor: '#FEF2F2', icon: <XCircle size={14} /> },
  'SYNCHRONISE': { label: 'Synchronisé', color: '#3B82F6', bgColor: '#EFF6FF', icon: <CheckCircle2 size={14} /> },
  'BROUILLON': { label: 'Brouillon', color: '#6B7280', bgColor: '#F3F4F6', icon: <Clock size={14} /> },
};

// Types de pièces jointes
const ATTACHMENT_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  'PHOTO_CNI': { label: 'Photo CNI', icon: <Image size={16} /> },
  'PHOTO_CARNET': { label: 'Photo carnet', icon: <Image size={16} /> },
  'PHOTO_AUTRE': { label: 'Autre photo', icon: <Image size={16} /> },
  'PDF_AUTRE': { label: 'Document PDF', icon: <FileText size={16} /> },
};

// Permissions par rôle
const canValidate = (role: string) => ['ADMINISTRATEUR', 'SUPERVISEUR'].includes(role);
const canReject = (role: string) => ['ADMINISTRATEUR', 'SUPERVISEUR'].includes(role);
const canViewBlockchain = (role: string) => ['ADMINISTRATEUR', 'SUPERVISEUR', 'VERIFICATEUR'].includes(role);
const canViewAllRecords = (role: string) => ['ADMINISTRATEUR', 'SUPERVISEUR', 'VERIFICATEUR'].includes(role);

export default function Records() {
  const { user } = useAuth();
  const userRole = user?.role || 'VERIFICATEUR';
  
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [validatingId, setValidatingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectMotif, setRejectMotif] = useState('');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      let data;
      if (statusFilter === 'ALL') {
        data = await apiService.getBirths();
      } else if (statusFilter === 'EN_ATTENTE') {
        data = await apiService.getPendingBirths();
      } else {
        data = await apiService.getBirthsByStatus(statusFilter);
      }
      setRecords(data);
    } catch (error) {
      console.error("Erreur chargement dossiers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [statusFilter]);

  const handleValidate = async (id: string) => {
    if (!window.confirm("Voulez-vous valider cet acte et l'ancrer sur la blockchain ?")) return;
    
    setValidatingId(id);
    try {
      const result = await apiService.validateBirth(id);
      setNotification(`✅ Acte validé et ancré sur Polygon ! Tx: ${result.blockchainTx?.txHash?.slice(0, 10)}...`);
      fetchRecords();
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      alert("Erreur lors de la validation sur la blockchain.");
    } finally {
      setValidatingId(null);
    }
  };

  const openRejectModal = (id: string) => {
    setSelectedRecordId(id);
    setRejectMotif('');
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectMotif.trim()) {
      alert("Veuillez saisir un motif de rejet.");
      return;
    }
    
    try {
      await apiService.rejectBirth(selectedRecordId!, rejectMotif);
      setNotification("❌ Acte rejeté avec succès.");
      setShowRejectModal(false);
      fetchRecords();
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      alert("Erreur lors du rejet.");
    } finally {
      setSelectedRecordId(null);
    }
  };

  const openDetailModal = (record: any) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
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

      {/* Modal de rejet */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', zIndex: 1000
            }}
            onClick={() => setShowRejectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#fff', borderRadius: 16, padding: 24, width: 400,
                maxWidth: '90%'
              }}
            >
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#1E293B' }}>
                Motif de rejet
              </h3>
              <textarea
                value={rejectMotif}
                onChange={(e) => setRejectMotif(e.target.value)}
                placeholder="Expliquez la raison du rejet..."
                style={{
                  width: '100%', minHeight: 100, padding: 12, borderRadius: 8,
                  border: '1px solid #E2E8F0', fontSize: 14, marginBottom: 16,
                  resize: 'vertical'
                }}
              />
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowRejectModal(false)}
                  style={{
                    padding: '10px 20px', borderRadius: 8, border: '1px solid #E2E8F0',
                    background: '#fff', cursor: 'pointer', fontWeight: 600
                  }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleReject}
                  style={{
                    padding: '10px 20px', borderRadius: 8, border: 'none',
                    background: '#EF4444', color: '#fff', cursor: 'pointer', fontWeight: 600
                  }}
                >
                  Confirmer le rejet
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de détails */}
      <AnimatePresence>
        {showDetailModal && selectedRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', zIndex: 1000, padding: 20
            }}
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#fff', borderRadius: 24, padding: 32, 
                width: 700, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1E293B', margin: 0 }}>
                  Détails du dossier
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
                >
                  <X size={24} color="#64748B" />
                </button>
              </div>

              {/* Informations de l'enfant */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 12 }}>
                  Enfant
                </h3>
                <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 12 }}>
                  <p style={{ fontSize: 18, fontWeight: 700, color: '#1E293B', margin: '0 0 8px 0' }}>
                    {selectedRecord.enfant?.prenoms} {selectedRecord.enfant?.nom}
                  </p>
                  <p style={{ color: '#64748B', margin: '4px 0' }}>
                    <strong>Né(e) le:</strong> {selectedRecord.enfant?.dateNaissance ? new Date(selectedRecord.enfant.dateNaissance).toLocaleDateString('fr-FR') : 'Non spécifié'}
                  </p>
                  <p style={{ color: '#64748B', margin: '4px 0' }}>
                    <strong>Sexe:</strong> {selectedRecord.enfant?.sexe || 'Non spécifié'}
                  </p>
                  <p style={{ color: '#64748B', margin: '4px 0' }}>
                    <strong>Lieu:</strong> {selectedRecord.enfant?.lieuNaissanceLibelle || selectedRecord.center?.nom || 'Non spécifié'}
                  </p>
                </div>
              </div>

              {/* Parents */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 12 }}>
                  Parents
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {selectedRecord.parents?.map((parent: any) => (
                    <div key={parent.id} style={{ background: '#F8FAFC', padding: 16, borderRadius: 12 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: parent.type === 'PERE' ? '#3B82F6' : '#EC4899', marginBottom: 8 }}>
                        {parent.type === 'PERE' ? 'Père' : 'Mère'}
                      </p>
                      <p style={{ fontWeight: 600, color: '#1E293B', margin: '0 0 4px 0' }}>
                        {parent.prenom} {parent.nom}
                      </p>
                      {parent.profession && <p style={{ color: '#64748B', fontSize: 13, margin: '2px 0' }}>{parent.profession}</p>}
                      {parent.telephone && <p style={{ color: '#64748B', fontSize: 13, margin: '2px 0' }}>📞 {parent.telephone}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pièces jointes */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 12 }}>
                  Pièces justificatives ({selectedRecord.attachments?.length || 0})
                </h3>
                {selectedRecord.attachments?.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
                    {selectedRecord.attachments.map((att: any) => (
                      <a
                        key={att.id}
                        href={att.urlFichier}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center',
                          background: '#F8FAFC', padding: 16, borderRadius: 12,
                          textDecoration: 'none', border: '1px solid #E2E8F0',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ 
                          width: 48, height: 48, borderRadius: 12, background: '#EFF6FF',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          marginBottom: 8, color: '#3B82F6'
                        }}>
                          {ATTACHMENT_LABELS[att.type]?.icon || <File size={20} />}
                        </div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#1E293B', textAlign: 'center', margin: 0 }}>
                          {ATTACHMENT_LABELS[att.type]?.label || att.type}
                        </p>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div style={{ background: '#FEF3C7', padding: 16, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <XCircle size={20} color="#F59E0B" />
                    <p style={{ color: '#92400E', margin: 0, fontWeight: 500 }}>
                      Aucune pièce jointe fournie
                    </p>
                  </div>
                )}
              </div>

              {/* Blockchain */}
              {selectedRecord.statut === 'VALIDE' && selectedRecord.blockchainTx && canViewBlockchain(userRole) && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 12 }}>
                    🔗 Ancrage Blockchain
                  </h3>
                  <div style={{ background: '#F0FDF4', padding: 16, borderRadius: 12, border: '1px solid #BBF7D0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <CheckCircle2 size={20} color="#10B981" />
                      <span style={{ fontWeight: 600, color: '#166534' }}>Acte ancré sur Polygon Amoy</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#64748B', margin: '4px 0' }}>
                      <strong>IUN:</strong> {selectedRecord.identifiantUniqueNational}
                    </p>
                    <p style={{ fontSize: 12, color: '#64748B', margin: '4px 0', wordBreak: 'break-all' }}>
                      <strong>Hash:</strong> {selectedRecord.hashBlockchain?.substring(0, 32)}...
                    </p>
                    <a
                      href={`https://amoy.polygonscan.com/tx/${selectedRecord.blockchainTx.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        marginTop: 12, padding: '8px 16px', borderRadius: 8,
                        background: '#10B981', color: '#fff', textDecoration: 'none',
                        fontWeight: 600, fontSize: 13
                      }}
                    >
                      <ExternalLink size={14} /> Voir sur PolygonScan
                    </a>
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedRecord.statut === 'EN_ATTENTE' && canValidate(userRole) && (
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', borderTop: '1px solid #E2E8F0', paddingTop: 24 }}>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      openRejectModal(selectedRecord.id);
                    }}
                    style={{
                      padding: '12px 24px', borderRadius: 12, border: '1px solid #FCA5A5',
                      background: '#FEF2F2', color: '#DC2626', cursor: 'pointer', fontWeight: 600
                    }}
                  >
                    Rejeter
                  </button>
                  <button
                    onClick={async () => {
                      setShowDetailModal(false);
                      await handleValidate(selectedRecord.id);
                    }}
                    style={{
                      padding: '12px 24px', borderRadius: 12, border: 'none',
                      background: '#0D7A5F', color: '#fff', cursor: 'pointer', fontWeight: 600
                    }}
                  >
                    Valider ce dossier
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1E293B', marginBottom: 8 }}>Dossiers d'enregistrement</h1>
          <p style={{ color: '#64748B', fontSize: 16 }}>
            {loading ? 'Chargement...' : `${records.length} dossiers au total`}
          </p>
        </div>
        <button style={{ 
          display: 'flex', alignItems: 'center', gap: 10, background: '#0F172A', color: '#fff', 
          border: 'none', borderRadius: 12, padding: '12px 24px', fontWeight: 600, cursor: 'pointer'
        }}>
          <Download size={20} /> Exporter
        </button>
      </div>

      {/* Filtres par statut */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button
          onClick={() => setStatusFilter('ALL')}
          style={{
            padding: '8px 16px', borderRadius: 20, border: statusFilter === 'ALL' ? 'none' : '1px solid #E2E8F0',
            background: statusFilter === 'ALL' ? '#0F172A' : '#fff',
            color: statusFilter === 'ALL' ? '#fff' : '#64748B',
            cursor: 'pointer', fontWeight: 600, fontSize: 13
          }}
        >
          Tous
        </button>
        <button
          onClick={() => setStatusFilter('EN_ATTENTE')}
          style={{
            padding: '8px 16px', borderRadius: 20, border: statusFilter === 'EN_ATTENTE' ? 'none' : '1px solid #E2E8F0',
            background: statusFilter === 'EN_ATTENTE' ? '#F59E0B' : '#fff',
            color: statusFilter === 'EN_ATTENTE' ? '#fff' : '#64748B',
            cursor: 'pointer', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6
          }}
        >
          <Clock size={14} /> En attente
        </button>
        <button
          onClick={() => setStatusFilter('VALIDE')}
          style={{
            padding: '8px 16px', borderRadius: 20, border: statusFilter === 'VALIDE' ? 'none' : '1px solid #E2E8F0',
            background: statusFilter === 'VALIDE' ? '#10B981' : '#fff',
            color: statusFilter === 'VALIDE' ? '#fff' : '#64748B',
            cursor: 'pointer', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6
          }}
        >
          <CheckCircle2 size={14} /> Validés
        </button>
        <button
          onClick={() => setStatusFilter('REJETE')}
          style={{
            padding: '8px 16px', borderRadius: 20, border: statusFilter === 'REJETE' ? 'none' : '1px solid #E2E8F0',
            background: statusFilter === 'REJETE' ? '#EF4444' : '#fff',
            color: statusFilter === 'REJETE' ? '#fff' : '#64748B',
            cursor: 'pointer', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6
          }}
        >
          <XCircle size={14} /> Rejetés
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
              ) : records.map((record) => (
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
                      background: STATUS_CONFIG[record.statut]?.bgColor || '#F3F4F6',
                      color: STATUS_CONFIG[record.statut]?.color || '#6B7280',
                      display: 'inline-flex', alignItems: 'center', gap: 6
                    }}>
                      {STATUS_CONFIG[record.statut]?.icon}
                      {STATUS_CONFIG[record.statut]?.label || record.statut}
                    </span>
                  </td>
                  <td style={{ padding: '20px 32px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => openDetailModal(record)}
                        style={{ 
                          padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', 
                          background: '#fff', color: '#64748B', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600
                        }}
                      >
                        <Eye size={16} />
                        Voir
                      </button>
                      {record.statut === 'EN_ATTENTE' && canValidate(userRole) && (
                        <>
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
                          <button 
                            onClick={() => openRejectModal(record.id)}
                            style={{ 
                              padding: '8px 16px', borderRadius: 8, border: '1px solid #FCA5A5', 
                              background: '#FEF2F2', color: '#DC2626', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600
                            }}
                          >
                            <XCircle size={16} />
                            Rejeter
                          </button>
                        </>
                      )}
                      {record.statut === 'VALIDE' && canViewBlockchain(userRole) && (
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
                      {record.statut === 'REJETE' && record.commentaireRejet && (
                        <span style={{ fontSize: 12, color: '#64748B', fontStyle: 'italic' }}>
                          Motif: {record.commentaireRejet}
                        </span>
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
