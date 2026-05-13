import type { CSSProperties } from 'react';

/** Affichage type acte de naissance (République de Guinée) — données dossier / acte numérique. */
export default function BirthCertificateView({ record }: { record: Record<string, any> }) {
  const enfant = record.enfant;
  const parents: { type: string; nom: string; prenom?: string; dateNaissance?: string; numeroIdentification?: string; cniOuAutre?: string; nationalite?: string; profession?: string; telephone?: string; regionAdresse?: string; quartierDistrict?: string; secteurVillage?: string }[] = record.parents || [];
  const mere = parents.find((p) => p.type === 'MERE');
  const pere = parents.find((p) => p.type === 'PERE');
  const decl = record.declarant;
  const center = record.center;
  const pref = center?.prefecture;
  const acte = record.acteNumerique;
  const iun = record.identifiantUniqueNational || acte?.qrCodeData || '—';
  const qrPayload = acte?.qrCodeData || iun;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(qrPayload)}`;

  const fmtDate = (d: string | Date | undefined | null) => {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleDateString('fr-GN', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return '—';
    }
  };

  const fmtTime = (t: string | Date | undefined | null) => {
    if (!t) return '—';
    try {
      return new Date(t).toLocaleTimeString('fr-GN', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '—';
    }
  };

  const lieuNaissance =
    [
      enfant?.regionNaissance,
      enfant?.prefecture?.nom,
      enfant?.sousPrefecture?.nom,
      enfant?.commune?.nom,
      enfant?.village?.nom,
      enfant?.lieuNaissanceLibelle,
    ]
      .filter(Boolean)
      .join(' · ') || '—';

  const villePref = pref?.region || pref?.nom || '—';
  const commune = center?.commune?.nom || pref?.nom || '—';
  const officier =
    record.officierEtatCivilNom ||
    [record.agent?.user?.prenom, record.agent?.user?.nom].filter(Boolean).join(' ') ||
    '—';

  const approuve =
    [record.approbateurPrenom, record.approbateurNom].filter(Boolean).join(' ') || '—';

  const borderStyle: CSSProperties = {
    border: '4px solid #5b21b6',
    borderImage: 'none',
    boxShadow: 'inset 0 0 0 2px #a78bfa, 0 8px 32px rgba(91,33,182,0.15)',
    background: 'linear-gradient(180deg, #faf5ff 0%, #ffffff 40%)',
  };

  const row = (label: string, value: string) => (
    <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 8, fontSize: 12, marginBottom: 6 }}>
      <span style={{ color: '#64748b', fontWeight: 600 }}>{label}</span>
      <span style={{ color: '#0f172a', fontWeight: 600 }}>{value}</span>
    </div>
  );

  return (
    <div
      className="birth-certificate-print"
      style={{
        ...borderStyle,
        padding: 28,
        maxWidth: 720,
        margin: '0 auto',
        fontFamily: 'Georgia, "Times New Roman", serif',
        color: '#1e1b4b',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          fontSize: 10,
          letterSpacing: 4,
          color: '#6d28d9',
          marginBottom: 8,
          fontWeight: 700,
        }}
      >
        RÉPUBLIQUE DE GUINÉE
      </div>
      <h1 style={{ textAlign: 'center', fontSize: 22, margin: '0 0 4px', fontWeight: 800 }}>Acte de naissance</h1>
      <p style={{ textAlign: 'center', fontSize: 11, margin: '0 0 16px', color: '#64748b' }}>Certificate of Birth</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 11 }}>
          {row('N° certificat', record.numeroCertificat || acte?.numeroActe || '—')}
          {row('N° identification national', record.numeroIdentificationNational || iun)}
        </div>
        <div style={{ fontSize: 11 }}>
          {row('Ville / Préfecture', String(villePref))}
          {row('Commune', String(commune))}
        </div>
      </div>

      <p style={{ fontSize: 12, marginBottom: 16 }}>
        Je soussigné : <strong>{officier}</strong>
      </p>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 13, borderBottom: '2px solid #7c3aed', paddingBottom: 4, marginBottom: 10 }}>ENFANT</h2>
        {row('Prénoms', enfant?.prenoms || '—')}
        {row('Nom', enfant?.nom || '—')}
        {row('Lieu de naissance', lieuNaissance)}
        {row('Date et heure de naissance', `${fmtDate(enfant?.dateNaissance)} — ${fmtTime(enfant?.heureNaissance)}`)}
        {row('Sexe', enfant?.sexe || '—')}
        {row('Nationalité', enfant?.nationalite || '—')}
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 13, borderBottom: '2px solid #7c3aed', paddingBottom: 4, marginBottom: 10 }}>PÈRE</h2>
        {row('Nom', pere ? `${pere.prenom || ''} ${pere.nom}`.trim() : '—')}
        {row('Date de naissance', fmtDate(pere?.dateNaissance))}
        {row('N° identification', pere?.numeroIdentification || '—')}
        {row('CNI ou autres', pere?.cniOuAutre || '—')}
        {row('Nationalité', pere?.nationalite || '—')}
        {row('Profession', pere?.profession || '—')}
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 13, borderBottom: '2px solid #7c3aed', paddingBottom: 4, marginBottom: 10 }}>MÈRE</h2>
        {row('Nom', mere ? `${mere.prenom || ''} ${mere.nom}`.trim() : '—')}
        {row('Date de naissance', fmtDate(mere?.dateNaissance))}
        {row('N° identification', mere?.numeroIdentification || '—')}
        {row('CNI ou autres', mere?.cniOuAutre || '—')}
        {row('Nationalité', mere?.nationalite || '—')}
        {row('Profession', mere?.profession || '—')}
        {row('Adresse (région / quartier)', [mere?.regionAdresse, mere?.quartierDistrict, mere?.secteurVillage].filter(Boolean).join(' · ') || '—')}
      </section>

      {decl && (
        <section style={{ marginBottom: 18 }}>
          <h2 style={{ fontSize: 13, borderBottom: '2px solid #7c3aed', paddingBottom: 4, marginBottom: 10 }}>DÉCLARANT</h2>
          {row('Nom', decl.nom || '—')}
          {row('N° identification', decl.numeroIdentification || '—')}
          {row('CNI ou autres', decl.cniOuAutre || '—')}
          {row('Lien de parenté', decl.lienParente || '—')}
        </section>
      )}

      <div
        style={{
          marginTop: 24,
          paddingTop: 16,
          borderTop: '1px solid #e9d5ff',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div style={{ fontSize: 11 }}>
          <p style={{ margin: '0 0 4px' }}>
            <strong>Approuvé par</strong> : {approuve}
          </p>
          <p style={{ margin: 0 }}>
            Dressé le : {fmtDate(record.dateValidation || record.dateDresse || record.createdAt)}
          </p>
          <p style={{ margin: '8px 0 0', fontSize: 10, color: '#64748b' }}>Officier de l&apos;État civil délégué</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <img src={qrUrl} alt="QR code de vérification" width={112} height={112} style={{ display: 'block' }} />
          <span style={{ fontSize: 10, fontFamily: 'monospace' }}>{String(qrPayload).slice(0, 18)}…</span>
        </div>
      </div>
    </div>
  );
}
