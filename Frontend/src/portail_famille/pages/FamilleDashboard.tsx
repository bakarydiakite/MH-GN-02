import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Loader2 } from 'lucide-react';
import { apiService } from '../../services/api';

export default function FamilleDashboard() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await apiService.getBirths();
        if (!cancelled) setRecords(Array.isArray(data) ? data : []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748b' }}>
        <Loader2 className="animate-spin" /> Chargement…
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, border: '1px solid #e2e8f0' }}>
        <h2 style={{ marginTop: 0 }}>Aucun acte validé pour le moment</h2>
        <p style={{ color: '#64748b', lineHeight: 1.6 }}>
          Les actes apparaissent ici lorsqu’ils sont <strong>validés</strong> par un superviseur et que votre numéro de téléphone figure comme parent sur l’acte.
          Vous pouvez aussi <Link to="/famille/lier">lier un acte</Link> avec son identifiant (IUN) après validation.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Mes actes de naissance</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>{records.length} acte(s) disponible(s)</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {records.map((r) => (
          <div
            key={r.id}
            style={{
              background: '#fff',
              borderRadius: 14,
              padding: 20,
              border: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, color: '#0f172a' }}>
                {r.enfant?.prenoms} {r.enfant?.nom}
              </div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>IUN : {r.identifiantUniqueNational || '—'}</div>
            </div>
            <Link
              to={`/famille/acte/${r.id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                background: '#0D7A5F',
                color: '#fff',
                borderRadius: 10,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <FileText size={18} /> Voir l’acte numérique
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
