import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Link2, Loader2 } from 'lucide-react';
import { apiService } from '../../services/api';

export default function FamilleLinkActe() {
  const [iun, setIun] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setLoading(true);
    try {
      const res = await apiService.linkBirthIun(iun.trim());
      setMsg(`${res.message} — ${res.childName ?? ''}`);
      setIun('');
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800 }}>Lier un acte validé</h1>
      <p style={{ color: '#64748b', lineHeight: 1.6 }}>
        Saisissez l’identifiant unique national (IUN) figurant sur l’acte après validation. Votre numéro de téléphone du compte sera enregistré sur le parent correspondant pour vous donner accès à l’acte numérique.
        Renseignez d’abord votre téléphone dans <Link to="/famille/profil">Profil</Link> si besoin.
      </p>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 20 }}>
        {err && <div style={{ padding: 12, background: '#fef2f2', color: '#b91c1c', borderRadius: 10 }}>{err}</div>}
        {msg && <div style={{ padding: 12, background: '#ecfdf5', color: '#047857', borderRadius: 10 }}>{msg}</div>}
        <input
          value={iun}
          onChange={(e) => setIun(e.target.value)}
          placeholder="ex. GN-2026-XXXXXX"
          style={{ padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 15 }}
        />
        <button
          type="submit"
          disabled={loading || !iun.trim()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: 12,
            borderRadius: 10,
            border: 'none',
            background: '#0D7A5F',
            color: '#fff',
            fontWeight: 700,
            cursor: loading ? 'wait' : 'pointer',
          }}
        >
          {loading ? <Loader2 className="animate-spin" /> : <Link2 size={18} />}
          Lier
        </button>
      </form>
    </div>
  );
}
