import { useEffect, useState } from 'react';
import { User, Save, Loader2 } from 'lucide-react';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileSettings() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const me = await apiService.getMe();
        if (cancelled) return;
        setPrenom(me.prenom || '');
        setNom(me.nom || '');
        setTelephone(me.telephone || '');
        setPhotoUrl(me.photoUrl || '');
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Erreur de chargement');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const body: Record<string, string> = { prenom, nom, telephone, photoUrl };
      if (password.trim()) body.password = password.trim();
      await apiService.patchMe(body);
      setPassword('');
      setMessage('Profil enregistré…');
      window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur à l’enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 420,
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #e2e8f0',
    fontSize: 14,
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
        <User size={28} color="#0D7A5F" />
        Paramètres du profil
      </h1>
      <p style={{ color: '#64748b', marginBottom: 28 }}>
        Compte : <strong>{user?.email}</strong> · Rôle : <strong>{user?.role}</strong>
      </p>

      {loading ? (
        <Loader2 className="animate-spin" style={{ color: '#0D7A5F' }} />
      ) : (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {error && (
            <div style={{ padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, color: '#b91c1c' }}>
              {error}
            </div>
          )}
          {message && (
            <div style={{ padding: 12, background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10, color: '#047857' }}>
              {message}
            </div>
          )}

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: '#475569' }}>Prénom</span>
            <input value={prenom} onChange={(e) => setPrenom(e.target.value)} style={inputStyle} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: '#475569' }}>Nom</span>
            <input value={nom} onChange={(e) => setNom(e.target.value)} style={inputStyle} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: '#475569' }}>Téléphone</span>
            <input value={telephone} onChange={(e) => setTelephone(e.target.value)} style={inputStyle} placeholder="+224 …" />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: '#475569' }}>Photo (URL)</span>
            <input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} style={inputStyle} placeholder="https://…" />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: '#475569' }}>Nouveau mot de passe (optionnel)</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} autoComplete="new-password" />
          </label>

          <button
            type="submit"
            disabled={saving}
            style={{
              alignSelf: 'flex-start',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 22px',
              borderRadius: 12,
              border: 'none',
              background: '#0D7A5F',
              color: '#fff',
              fontWeight: 700,
              cursor: saving ? 'wait' : 'pointer',
            }}
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Enregistrer
          </button>
        </form>
      )}

      <p style={{ marginTop: 32, fontSize: 12, color: '#94a3b8' }}>
        Après modification du profil, vous pouvez devoir vous reconnecter si vous changez le mot de passe ailleurs.
        <button type="button" onClick={() => logout()} style={{ marginLeft: 8, color: '#b91c1c', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
          Déconnexion
        </button>
      </p>
    </div>
  );
}
