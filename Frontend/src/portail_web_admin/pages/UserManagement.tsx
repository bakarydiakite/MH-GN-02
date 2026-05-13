import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Search, 
  ChevronDown, 
  Edit2, 
  Users as UsersIcon, 
  UserCheck, 
  ShieldAlert, 
  UserX,
  X,
  Loader2,
  Trash2
} from 'lucide-react';
import { useAuth, UserRole } from '../../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: UserRole;
  telephone?: string;
  centreId?: string;
  centreNom?: string;
  actif: boolean;
  createdAt: string;
}

interface Center {
  id: string;
  nom: string;
}

const roleLabels: Record<UserRole, string> = {
  'ADMINISTRATEUR': 'Administrateur',
  'SUPERVISEUR': 'Superviseur',
  'VERIFICATEUR': 'Vérificateur',
  'AGENT': 'Agent',
  'FAMILLE': 'Famille',
};

const getRoleStyle = (role: UserRole) => {
  const styles: Record<UserRole, { bg: string; color: string }> = {
    'ADMINISTRATEUR': { bg: '#F5F3FF', color: '#7C3AED' },
    'SUPERVISEUR': { bg: '#ECFDF5', color: '#0D7A5F' },
    'VERIFICATEUR': { bg: '#EFF6FF', color: '#3B82F6' },
    'AGENT': { bg: '#FFFBEB', color: '#F59E0B' },
    'FAMILLE': { bg: '#F8FAFC', color: '#64748B' },
  };
  return styles[role] || { bg: '#F8FAFC', color: '#64748B' };
};

export default function UserManagement() {
  const { user: currentUser, token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    nom: '',
    prenom: '',
    role: 'AGENT' as UserRole,
    telephone: '',
    password: '',
    centerId: '',
    matricule: '',
    fonction: '',
  });
  const [centers, setCenters] = useState<Center[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Charger les utilisateurs et centres au montage
  useEffect(() => {
    loadUsers();
    loadCenters();
  }, []);

  // Charger les utilisateurs depuis l'API
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les centres
  const loadCenters = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/centers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCenters(data);
      }
    } catch (error) {
      console.error('Erreur chargement centres:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingUser 
        ? `${API_BASE_URL}/users/${editingUser.id}`
        : `${API_BASE_URL}/users`;
      
      const response = await fetch(url, {
        method: editingUser ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(false);
        setEditingUser(null);
        setFormData({
          email: '',
          nom: '',
          prenom: '',
          role: 'AGENT',
          telephone: '',
          password: '',
          centerId: '',
          matricule: '',
          fonction: '',
        });
        loadUsers();
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors de l\'enregistrement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      email: '',
      nom: '',
      prenom: '',
      role: 'AGENT',
      telephone: '',
      password: '',
      centerId: '',
      matricule: '',
      fonction: '',
    });
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
      telephone: user.telephone || '',
      password: '',
      centerId: user.centreId || '',
      matricule: '',
      fonction: '',
    });
    setShowModal(true);
  };

  const stats = [
    { label: 'Total utilisateurs', value: users.length, icon: UsersIcon, color: '#6366F1' },
    { label: 'Actifs', value: users.filter(u => u.actif).length, icon: UserCheck, color: '#10B981' },
    { label: 'Administrateurs', value: users.filter(u => u.role === 'ADMINISTRATEUR').length, icon: ShieldAlert, color: '#7C3AED' },
    { label: 'Inactifs', value: users.filter(u => !u.actif).length, icon: UserX, color: '#EF4444' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Modal Création/Édition */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#fff',
                borderRadius: 20,
                padding: 32,
                width: 500,
                maxWidth: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1E293B' }}>
                  {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151', fontSize: 14 }}>
                        Prénom
                      </label>
                      <input
                        type="text"
                        value={formData.prenom}
                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: 12,
                          border: '1px solid #E5E7EB',
                          borderRadius: 8,
                          fontSize: 15,
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151', fontSize: 14 }}>
                        Nom
                      </label>
                      <input
                        type="text"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: 12,
                          border: '1px solid #E5E7EB',
                          borderRadius: 8,
                          fontSize: 15,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151', fontSize: 14 }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: 12,
                        border: '1px solid #E5E7EB',
                        borderRadius: 8,
                        fontSize: 15,
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151', fontSize: 14 }}>
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                      placeholder="+224 620 00 00 00"
                      style={{
                        width: '100%',
                        padding: 12,
                        border: '1px solid #E5E7EB',
                        borderRadius: 8,
                        fontSize: 15,
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151', fontSize: 14 }}>
                      Rôle
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                      style={{
                        width: '100%',
                        padding: 12,
                        border: '1px solid #E5E7EB',
                        borderRadius: 8,
                        fontSize: 15,
                        background: '#fff',
                      }}
                    >
                      <option value="ADMINISTRATEUR">Administrateur</option>
                      <option value="SUPERVISEUR">Superviseur</option>
                      <option value="VERIFICATEUR">Vérificateur</option>
                      <option value="AGENT">Agent</option>
                    </select>
                  </div>

                  {/* Centre - Obligatoire pour Superviseur et Agent */}
                  {(formData.role === 'SUPERVISEUR' || formData.role === 'AGENT') && (
                    <div>
                      <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151', fontSize: 14 }}>
                        Centre d'affectation <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <select
                        value={formData.centerId}
                        onChange={(e) => setFormData({ ...formData, centerId: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: 12,
                          border: '1px solid #E5E7EB',
                          borderRadius: 8,
                          fontSize: 15,
                          background: '#fff',
                        }}
                      >
                        <option value="">Sélectionner un centre</option>
                        {centers.map(center => (
                          <option key={center.id} value={center.id}>{center.nom}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Matricule et Fonction - Pour Agent */}
                  {formData.role === 'AGENT' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151', fontSize: 14 }}>
                          Matricule
                        </label>
                        <input
                          type="text"
                          value={formData.matricule}
                          onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
                          placeholder="AG-2024-001"
                          style={{
                            width: '100%',
                            padding: 12,
                            border: '1px solid #E5E7EB',
                            borderRadius: 8,
                            fontSize: 15,
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151', fontSize: 14 }}>
                          Fonction
                        </label>
                        <input
                          type="text"
                          value={formData.fonction}
                          onChange={(e) => setFormData({ ...formData, fonction: e.target.value })}
                          placeholder="Officier d'état civil"
                          style={{
                            width: '100%',
                            padding: 12,
                            border: '1px solid #E5E7EB',
                            borderRadius: 8,
                            fontSize: 15,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {!editingUser && (
                    <div>
                      <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151', fontSize: 14 }}>
                        Mot de passe initial
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required={!editingUser}
                        placeholder="Minimum 8 caractères"
                        style={{
                          width: '100%',
                          padding: 12,
                          border: '1px solid #E5E7EB',
                          borderRadius: 8,
                          fontSize: 15,
                        }}
                      />
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      padding: '12px 24px',
                      border: '1px solid #E5E7EB',
                      background: '#fff',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      padding: '12px 24px',
                      border: 'none',
                      background: submitting ? '#9CA3AF' : '#0D7A5F',
                      color: '#fff',
                      borderRadius: 8,
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    {submitting && <Loader2 size={16} className="animate-spin" />}
                    {editingUser ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1E293B', marginBottom: 8 }}>
            Gestion des utilisateurs
          </h1>
          <p style={{ color: '#64748B', fontSize: 16 }}>
            Créez et gérez les comptes utilisateurs du système
          </p>
        </div>
        <button
          onClick={openCreateModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: '#0D7A5F',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '12px 24px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <UserPlus size={20} /> Nouvel utilisateur
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              background: '#fff',
              padding: 20,
              borderRadius: 16,
              border: '1px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: `${stat.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: stat.color,
            }}>
              <stat.icon size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: '#1E293B', margin: 0 }}>{stat.value}</h3>
              <p style={{ fontSize: 13, color: '#64748B', fontWeight: 500, marginTop: 2 }}>{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: '#fff', borderRadius: 16, border: '1px solid #F1F5F9', overflow: 'hidden' }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                <th style={{ padding: '16px 24px', color: '#94A3B8', fontSize: 12, fontWeight: 700 }}>UTILISATEUR</th>
                <th style={{ padding: '16px 16px', color: '#94A3B8', fontSize: 12, fontWeight: 700 }}>RÔLE</th>
                <th style={{ padding: '16px 16px', color: '#94A3B8', fontSize: 12, fontWeight: 700 }}>CENTRE</th>
                <th style={{ padding: '16px 16px', color: '#94A3B8', fontSize: 12, fontWeight: 700 }}>STATUT</th>
                <th style={{ padding: '16px 24px', color: '#94A3B8', fontSize: 12, fontWeight: 700, textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: 40, textAlign: 'center' }}>
                    <Loader2 size={24} className="animate-spin" style={{ color: '#0D7A5F' }} />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>
                    Aucun utilisateur. Cliquez sur "Nouvel utilisateur" pour commencer.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: getRoleStyle(user.role).color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: 14,
                          fontWeight: 700,
                        }}>
                          {user.prenom[0]}{user.nom[0]}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: '#1E293B', margin: 0 }}>
                            {user.prenom} {user.nom}
                          </p>
                          <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 600,
                        background: getRoleStyle(user.role).bg,
                        color: getRoleStyle(user.role).color,
                      }}>
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td style={{ padding: '16px 16px' }}>
                      <span style={{
                        fontSize: 13,
                        color: user.centreNom ? '#374151' : '#94A3B8',
                      }}>
                        {user.centreNom || (user.role === 'SUPERVISEUR' || user.role === 'AGENT' ? 'Non assigné' : '-')}
                      </span>
                    </td>
                    <td style={{ padding: '16px 16px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        color: user.actif ? '#10B981' : '#94A3B8',
                        fontSize: 13,
                        fontWeight: 600,
                      }}>
                        <span style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: user.actif ? '#10B981' : '#94A3B8',
                        }} />
                        {user.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button
                        onClick={() => openEditModal(user)}
                        style={{
                          padding: 8,
                          border: 'none',
                          background: '#F1F5F9',
                          borderRadius: 8,
                          cursor: 'pointer',
                          color: '#64748B',
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
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
