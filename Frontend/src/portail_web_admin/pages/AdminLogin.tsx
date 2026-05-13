import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, LogIn, ShieldCheck } from 'lucide-react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (authService.isAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname || '/admin';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connexion impossible');
    } finally {
      setLoading(false);
    }
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
        <div style={{ padding: '48px 56px', display: 'flex', flexDirection: 'column' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: '#64748B',
              fontSize: 13,
              fontWeight: 700,
              textDecoration: 'none',
              marginBottom: 56,
            }}
          >
            <ArrowLeft size={16} />
            Retour au site
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 42 }}>
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

          <div style={{ maxWidth: 390 }}>
            <p style={{ color: '#0D7A5F', fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', margin: '0 0 14px' }}>
              PORTAIL ADMIN
            </p>
            <h1 style={{ color: '#0F172A', fontSize: 38, lineHeight: 1.08, margin: '0 0 12px', letterSpacing: 0 }}>
              Accès sécurisé
            </h1>
            <p style={{ color: '#64748B', fontSize: 15, lineHeight: 1.7, margin: '0 0 34px' }}>
              Connectez-vous pour gérer les dossiers, valider les actes et suivre les vérifications.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 390 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 8 }}>
              Email ou téléphone
            </label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="username"
              placeholder="admin@naissancechain.gov"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                border: '1px solid #D7E0DC',
                borderRadius: 8,
                padding: '13px 15px',
                marginBottom: 16,
                fontSize: 14,
                color: '#0F172A',
                outlineColor: '#0D7A5F',
                background: '#FAFCFB',
              }}
            />

            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 8 }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                border: '1px solid #D7E0DC',
                borderRadius: 8,
                padding: '13px 15px',
                marginBottom: 12,
                fontSize: 14,
                color: '#0F172A',
                outlineColor: '#0D7A5F',
                background: '#FAFCFB',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748B', fontSize: 12, fontWeight: 600 }}>
                <input type="checkbox" defaultChecked style={{ accentColor: '#0D7A5F' }} />
                Garder la session
              </label>
              <span style={{ color: '#0D7A5F', fontSize: 12, fontWeight: 700 }}>Compte officiel requis</span>
            </div>

            {error && (
              <p
                style={{
                  background: '#FEF2F2',
                  color: '#B91C1C',
                  border: '1px solid #FECACA',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 13,
                  fontWeight: 600,
                  margin: '0 0 16px',
                }}
              >
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
                minWidth: 190,
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
              <LogIn size={17} />
              {loading ? 'Connexion...' : 'Accéder au portail'}
            </button>

            <p style={{ margin: '22px 0 0', color: '#64748B', fontSize: 12, fontWeight: 600 }}>
              Première installation ?{' '}
              <Link to="/admin/register" style={{ color: '#0D7A5F', fontWeight: 800, textDecoration: 'none' }}>
                Créer le compte admin
              </Link>
            </p>
          </form>
        </div>

        <aside style={{ margin: 12, borderRadius: 8, overflow: 'hidden', background: '#0D7A5F' }}>
          <img
            src="/images/admin-auth-illustration.svg"
            alt="Connexion sécurisée au portail NaissanceChain"
            style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
          />
        </aside>
      </motion.section>
    </main>
  );
}
