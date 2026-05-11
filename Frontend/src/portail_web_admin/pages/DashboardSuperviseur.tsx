import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Building2,
  AlertCircle,
  ArrowRight,
  FileText
} from 'lucide-react';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface PendingRecord {
  id: string;
  enfant: {
    prenoms: string;
    nom: string;
    dateNaissance: string;
  };
  agent?: {
    user?: {
      nom: string;
      prenom: string;
    };
  };
  createdAt: string;
}

export default function DashboardSuperviseur() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    enAttente: 0,
    validesAujourdhui: 0,
    rejetesAujourdhui: 0,
    totalCentre: 0,
  });
  const [pendingRecords, setPendingRecords] = useState<PendingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les stats
        const statsData = await apiService.getDashboardStats();
        setStats({
          enAttente: statsData.pendingValidations || 0,
          validesAujourdhui: statsData.validated || 0,
          rejetesAujourdhui: 0, // TODO: ajouter dans l'API
          totalCentre: statsData.totalBirths || 0,
        });

        // Récupérer les dossiers en attente
        const pending = await apiService.getPendingBirths();
        setPendingRecords(pending.slice(0, 5)); // 5 derniers
      } catch (error) {
        console.error('Erreur chargement dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      label: 'En attente de validation',
      value: stats.enAttente,
      icon: Clock,
      color: '#F59E0B',
      bgColor: '#FFFBEB',
      urgent: stats.enAttente > 10,
    },
    {
      label: 'Validés aujourd\'hui',
      value: stats.validesAujourdhui,
      icon: CheckCircle2,
      color: '#10B981',
      bgColor: '#ECFDF5',
    },
    {
      label: 'Rejetés aujourd\'hui',
      value: stats.rejetesAujourdhui,
      icon: XCircle,
      color: '#EF4444',
      bgColor: '#FEF2F2',
    },
    {
      label: 'Actes du centre',
      value: stats.totalCentre,
      icon: Building2,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin" style={{ width: 40, height: 40, border: '3px solid #E5E7EB', borderTopColor: '#0D7A5F', borderRadius: '50%', margin: '0 auto 16px' }} />
          <p style={{ color: '#64748B' }}>Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1E293B', marginBottom: 8 }}>
          Tableau de bord Superviseur
        </h1>
        <p style={{ color: '#64748B', fontSize: 15 }}>
          Bienvenue, {user?.prenom} {user?.nom} • Centre: {user?.centreNom || 'Non assigné'}
        </p>
      </div>

      {/* Alerte si beaucoup de dossiers en attente */}
      {stats.enAttente > 10 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#FEF3C7',
            border: '1px solid #FCD34D',
            borderRadius: 12,
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <AlertCircle color="#D97706" size={24} />
          <div>
            <p style={{ fontWeight: 600, color: '#92400E' }}>
              {stats.enAttente} dossiers en attente de validation
            </p>
            <p style={{ color: '#B45309', fontSize: 14 }}>
              Veuillez traiter ces dossiers dans les meilleurs délais.
            </p>
          </div>
          <Link
            to="/admin/records"
            style={{
              marginLeft: 'auto',
              padding: '8px 16px',
              background: '#D97706',
              color: '#fff',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Voir les dossiers
          </Link>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: 24,
              border: stat.urgent ? '2px solid #F59E0B' : '1px solid #F1F5F9',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 48,
                height: 48,
                background: stat.bgColor,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <stat.icon color={stat.color} size={24} />
              </div>
            </div>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#1E293B', marginBottom: 4 }}>
              {stat.value}
            </p>
            <p style={{ color: '#64748B', fontSize: 14 }}>
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Dossiers en attente */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #F1F5F9', overflow: 'hidden' }}>
        <div style={{ 
          padding: '20px 24px', 
          borderBottom: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FileText color="#0D7A5F" size={20} />
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1E293B' }}>
              Dossiers en attente de validation
            </h2>
          </div>
          <Link
            to="/admin/records"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: '#0D7A5F',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Voir tout <ArrowRight size={16} />
          </Link>
        </div>

        {pendingRecords.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>
            <CheckCircle2 color="#10B981" size={48} style={{ marginBottom: 12 }} />
            <p>Aucun dossier en attente de validation</p>
          </div>
        ) : (
          <div>
            {pendingRecords.map((record) => (
              <div 
                key={record.id}
                style={{ 
                  padding: '16px 24px', 
                  borderBottom: '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <p style={{ fontWeight: 600, color: '#1E293B', marginBottom: 4 }}>
                    {record.enfant?.prenoms} {record.enfant?.nom}
                  </p>
                  <p style={{ color: '#64748B', fontSize: 13 }}>
                    Né(e) le {new Date(record.enfant?.dateNaissance).toLocaleDateString('fr-FR')} • 
                    Agent: {record.agent?.user?.prenom} {record.agent?.user?.nom}
                  </p>
                </div>
                <Link
                  to={`/admin/records`}
                  style={{
                    padding: '8px 16px',
                    background: '#0D7A5F',
                    color: '#fff',
                    borderRadius: 8,
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  Traiter
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions rapides */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
        <Link
          to="/admin/records"
          style={{
            background: 'linear-gradient(135deg, #0D7A5F 0%, #10B981 100%)',
            borderRadius: 16,
            padding: 24,
            color: '#fff',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <CheckCircle2 size={32} />
          <div>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Valider des dossiers</p>
            <p style={{ opacity: 0.8, fontSize: 14 }}>Traiter les actes en attente</p>
          </div>
        </Link>

        <Link
          to="/admin/verification"
          style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
            borderRadius: 16,
            padding: 24,
            color: '#fff',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <FileText size={32} />
          <div>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Vérifier un acte</p>
            <p style={{ opacity: 0.8, fontSize: 14 }}>Rechercher par IUN ou nom</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
