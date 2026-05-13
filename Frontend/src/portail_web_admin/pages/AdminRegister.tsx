import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, UserPlus } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';

export default function AdminRegister() {
  const navigate = useNavigate();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (authService.isAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    try {
      await authService.registerAdmin({
        nom,
        prenom: prenom || undefined,
        email,
        telephone: telephone || undefined,
        password,
      });
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Creation du compte impossible');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box' as const,
    border: '1px solid #D7E0DC',
    borderRadius: 8,
    padding: '12px 14px',
    fontSize: 14,
    color: '#0F172A',
    outlineColor: '#0D7A5F',
    background: '#FAFCFB',
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#EEF3F1',
        fontFamily: 'Inter, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
      }}
    >
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{
          width: '100%',
          maxWidth: 1120,
          minHeight: 640,
          background: '#fff',
          borderRadius: 8,
          border: '1px solid #DDE7E3',
          boxShadow: '0 24px 80px rgba(15, 23, 42, 0.12)',
          display: 'grid',
          gridTemplateColumns: '0.9fr 1.1fr',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '36px 56px', display: 'flex', flexDirection: 'column' }}>
          <Link
            to="/admin/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: '#64748B',
              fontSize: 13,
              fontWeight: 700,
              textDecoration: 'none',
              marginBottom: 32,
            }}
          >
            <ArrowLeft size={16} />
            Retour connexion
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 26 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: '#0D7A5F',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={21} />
            </div>
            <strong style={{ color: '#0D7A5F', fontSize: 20, letterSpacing: -0.4 }}>NaissanceChain</strong>
          </div>

          <p style={{ color: '#0D7A5F', fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', margin: '0 0 12px' }}>
            CREATION ADMIN
          </p>
          <h1 style={{ color: '#0F172A', fontSize: 34, lineHeight: 1.1, margin: '0 0 10px', letterSpacing: 0 }}>
            Premier compte
          </h1>
          <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.6, margin: '0 0 24px', maxWidth: 410 }}>
            Cette page initialise le portail. Une fois un administrateur créé, l'inscription publique est fermée.
          </p>

          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 410 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 7 }}>Nom</label>
                <input value={nom} onChange={(event) => setNom(event.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 7 }}>Prénom</label>
                <input value={prenom} onChange={(event) => setPrenom(event.target.value)} style={inputStyle} />
              </div>
            </div>

            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 7 }}>Email</label>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="username" style={{ ...inputStyle, marginBottom: 14 }} />

            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 7 }}>Téléphone</label>
            <input value={telephone} onChange={(event) => setTelephone(event.target.value)} style={{ ...inputStyle, marginBottom: 14 }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 7 }}>Mot de passe</label>
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete="new-password" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 7 }}>Confirmation</label>
                <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={8} autoComplete="new-password" style={inputStyle} />
              </div>
            </div>

            {error && (
              <p style={{ background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA', borderRadius: 8, padding: 12, fontSize: 13, fontWeight: 600, margin: '0 0 16px' }}>
                {error}
              </p>
            )}

            <button
              disabled={loading}
              style={{
                border: 'none',
                borderRadius: 8,
                background: loading ? '#94A3B8' : '#0D7A5F',
                color: '#fff',
                padding: '13px 22px',
                minWidth: 210,
                fontWeight: 800,
                fontSize: 14,
                cursor: loading ? 'wait' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                boxShadow: '0 12px 24px rgba(13, 122, 95, 0.2)',
              }}
            >
              <UserPlus size={17} />
              {loading ? 'Création...' : 'Créer le compte admin'}
            </button>
          </form>
        </div>

        <aside style={{ margin: 12, borderRadius: 8, overflow: 'hidden', background: '#0D7A5F' }}>
          <img
            src="/images/admin-auth-illustration.svg"
            alt="Création sécurisée du compte administrateur NaissanceChain"
            style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
          />
        </aside>
      </motion.section>
    </main>
  );
}
