import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Printer } from 'lucide-react';
import { apiService } from '../../services/api';
import BirthCertificateView from '../../components/BirthCertificateView';

export default function FamilleActe() {
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await apiService.getBirth(id);
        if (!cancelled) setRecord(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Erreur');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <div style={{ color: '#b91c1c' }}>
        {error}{' '}
        <Link to="/famille">Retour</Link>
      </div>
    );
  }

  if (!record) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748b' }}>
        <Loader2 className="animate-spin" /> Chargement…
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        <Link to="/famille" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#0D7A5F', fontWeight: 600 }}>
          <ArrowLeft size={18} /> Retour
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 14px',
            borderRadius: 10,
            border: '1px solid #e2e8f0',
            background: '#fff',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          <Printer size={18} /> Imprimer
        </button>
      </div>
      <BirthCertificateView record={record} />
    </div>
  );
}
