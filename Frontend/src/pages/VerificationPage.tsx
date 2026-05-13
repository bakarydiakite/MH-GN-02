import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, Search, Database, 
  ShieldCheck, Download, 
  ArrowRight, Shield, Lock, Server
} from 'lucide-react';
import { apiService } from '../services/api';

export default function VerificationPage() {
  const [activeTab, setActiveTab] = useState<'numero' | 'qr'>('numero');
  const [inputValue, setInputValue] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [error, setError] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);

      // Simulate a successful scan after 4 seconds
      setTimeout(() => {
        if (streamRef.current && isCameraActive) {
          stopCamera();
          handleVerify();
        }
      }, 4000);
    } catch (err) {
      console.error("Camera error:", err);
      alert("Impossible d'accéder à la caméra. Veuillez vérifier les autorisations dans votre navigateur.");
    }
  };

  const handleVerify = async () => {
    if (!inputValue.trim() && activeTab === 'numero') return;
    
    setShowResult(false);
    setIsScanning(true);
    setError('');
    setVerificationResult(null);
    
    try {
      const data = await apiService.verifyBirth(inputValue.trim());
      setVerificationResult(data);
      setIsScanning(false);
      setShowResult(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification impossible');
      setIsScanning(false);
    }
  };

  return (
    <div style={{ background: '#FAFBFD', minHeight: '100vh', paddingTop: 80 }}>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0D7A5F 0%, #0A5C47 100%)',
          padding: '80px 40px 140px',
          fontFamily: 'Inter, sans-serif',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          opacity: 0.5
        }} />
        
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span style={{ 
              background: 'rgba(77,255,195,0.15)', 
              color: '#4DFFC3', 
              padding: '8px 20px', 
              borderRadius: 100, 
              fontSize: 12, 
              fontWeight: 800, 
              letterSpacing: '0.1em',
              marginBottom: 20,
              display: 'inline-block',
              border: '1px solid rgba(77,255,195,0.2)'
            }}>
              PORTAIL OFFICIEL DE VÉRIFICATION
            </span>
            <h1 style={{ fontSize: 52, fontWeight: 900, color: '#fff', letterSpacing: '-2px', margin: '0 0 20px', lineHeight: 1 }}>
              Vérifiez l'Authenticité <br /> en un Instant.
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', maxWidth: 650, margin: '0 auto', lineHeight: 1.6 }}>
              L'infrastructure NaissanceChain garantit que chaque acte est infalsifiable et ancré dans la blockchain Polygon.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Verification Tool Area */}
      <section style={{ marginTop: '-100px', padding: '0 40px 100px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: 850, margin: '0 auto' }}>
          <div style={{
            background: '#fff',
            borderRadius: 32,
            boxShadow: '0 30px 80px rgba(0,0,0,0.12)',
            border: '1px solid #E5E7EB',
            overflow: 'hidden',
          }}>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #F3F4F6', background: '#F9FAFB' }}>
              {(['numero', 'qr'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { 
                    setActiveTab(tab); 
                    setShowResult(false); 
                    setIsScanning(false);
                    setError('');
                    setVerificationResult(null);
                    stopCamera();
                  }}
                  style={{
                    flex: 1,
                    padding: '28px',
                    border: 'none',
                    background: activeTab === tab ? '#fff' : 'transparent',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: 'pointer',
                    color: activeTab === tab ? '#0D7A5F' : '#9CA3AF',
                    borderBottom: activeTab === tab ? '4px solid #0D7A5F' : '4px solid transparent',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12
                  }}
                >
                  {tab === 'numero' ? <Search size={20} /> : <QrCode size={20} />}
                  {tab === 'numero' ? 'Saisir un numéro' : 'Scanner QR code'}
                </button>
              ))}
            </div>

            <div style={{ padding: '60px' }}>
              <AnimatePresence mode="wait">
                {isScanning ? (
                  <motion.div
                    key="scanning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ textAlign: 'center', padding: '40px 0' }}
                  >
                    <div style={{ 
                      width: 80, height: 80, borderRadius: '50%', border: '4px solid #F3F4F6', 
                      borderTopColor: '#0D7A5F', margin: '0 auto 24px', animation: 'spin 1s linear infinite'
                    }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <h3 style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 8 }}>Recherche en cours...</h3>
                    <p style={{ color: '#6B7280' }}>Interrogating the Polygon Blockchain Ledger</p>
                  </motion.div>
                ) : activeTab === 'numero' ? (
                  <motion.div
                    key="numero"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div style={{ display: 'flex', gap: 16, marginBottom: 12, alignItems: 'center' }}>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Référence de l'acte
                      </label>
                      <span style={{ fontSize: 11, background: '#E0E7FF', color: '#4338CA', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>ID UNIQUE</span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => { setInputValue(e.target.value.toUpperCase()); setShowResult(false); setError(''); }}
                        placeholder="Ex: GN-2026-ABC123"
                        style={{
                          flex: 1,
                          border: '2px solid #E5E7EB',
                          borderRadius: 16,
                          padding: '20px 24px',
                          fontSize: 18,
                          fontFamily: 'Inter, sans-serif',
                          color: '#111827',
                          outline: 'none',
                          transition: 'all 0.2s',
                          background: '#F9FAFB'
                        }}
                      />
                      <button
                        onClick={handleVerify}
                        style={{
                          background: '#0D7A5F',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 16,
                          padding: '0 40px',
                          fontWeight: 800,
                          fontSize: 16,
                          cursor: 'pointer',
                          fontFamily: 'Inter, sans-serif',
                          transition: 'all 0.2s',
                          boxShadow: '0 10px 25px rgba(13,122,95,0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10
                        }}
                      >
                        Vérifier <ArrowRight size={18} />
                      </button>
                    </div>

                    {error && (
                      <div style={{ background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA', borderRadius: 14, padding: '14px 18px', fontWeight: 700, marginTop: 10 }}>
                        {error}
                      </div>
                    )}

                    {showResult && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                          marginTop: 40,
                          background: '#fff',
                          borderRadius: 24,
                          border: '2px solid #D1FAE5',
                          overflow: 'hidden',
                          boxShadow: '0 20px 50px rgba(13,122,95,0.08)',
                        }}
                      >
                        <div style={{ background: 'linear-gradient(to right, #F0FDF9, #fff)', padding: '32px', borderBottom: '1px solid #D1FAE5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#0D7A5F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4DFFC3' }}>
                              <ShieldCheck size={32} />
                            </div>
                            <div>
                              <p style={{ fontWeight: 900, fontSize: 26, color: verificationResult?.valid ? '#0D7A5F' : '#B45309', margin: 0 }}>
                                {verificationResult?.valid ? 'Acte Authentique' : 'Acte non validé'}
                              </p>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
                                <p style={{ fontSize: 13, color: '#0D7A5F', fontWeight: 600, margin: 0 }}>
                                  {verificationResult?.blockchainVerified ? 'Vérification blockchain réussie' : 'Référence trouvée, preuve blockchain non confirmée'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div style={{ padding: '40px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px 48px' }}>
                            {[
                              { label: 'Identité de l\'enfant', value: verificationResult?.record?.enfant ? `${verificationResult.record.enfant.prenoms} ${verificationResult.record.enfant.nom}` : '-' },
                              { label: 'Identité de la mère', value: (() => {
                                const mother = verificationResult?.record?.parents?.find((parent: any) => parent.type === 'MERE');
                                return mother ? `${mother.prenom || ''} ${mother.nom}`.trim() : '-';
                              })() },
                              { label: 'Lieu de naissance', value: verificationResult?.record?.enfant?.lieuNaissanceLibelle || '-' },
                              { label: 'Date de naissance', value: verificationResult?.record?.enfant?.dateNaissance ? new Date(verificationResult.record.enfant.dateNaissance).toLocaleDateString('fr-FR') : '-' },
                              { label: 'Numéro d\'enregistrement', value: verificationResult?.record?.identifiantUniqueNational || verificationResult?.reference || '-' },
                              { label: 'Statut Civil', value: verificationResult?.record?.statut || verificationResult?.status || '-' },
                            ].map((row, i) => (
                              <div key={i}>
                                <span style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 4, textTransform: 'uppercase' }}>{row.label}</span>
                                <span style={{ fontSize: 17, color: '#111827', fontWeight: 800 }}>{row.value}</span>
                              </div>
                            ))}
                          </div>
                          <div style={{ marginTop: 40, paddingTop: 40, borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ background: '#F3F4F6', padding: '10px', borderRadius: 10, color: '#0D7A5F' }}>
                                   <Database size={20} />
                                </div>
                                <div>
                                   <span style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#9CA3AF' }}>PREUVE BLOCKCHAIN (TX HASH)</span>
                                   <span style={{ fontFamily: 'monospace', fontSize: 14, color: '#111827', fontWeight: 600 }}>
                                    {verificationResult?.record?.blockchainTx?.txHash
                                      ? `${verificationResult.record.blockchainTx.txHash.slice(0, 10)}...${verificationResult.record.blockchainTx.txHash.slice(-6)}`
                                      : 'Non disponible'}
                                   </span>
                                </div>
                             </div>
                             <button style={{ background: '#111827', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Download size={18} /> Télécharger l'Acte
                             </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="qr"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{ textAlign: 'center', padding: '10px 0' }}
                  >
                    {!isCameraActive ? (
                      <div
                        onClick={startCamera}
                        style={{
                          border: '2px dashed #0D7A5F',
                          borderRadius: 32,
                          padding: '100px 40px',
                          marginBottom: 40,
                          background: 'rgba(13,122,95,0.02)',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ 
                          width: 90, height: 90, borderRadius: '50%', background: 'rgba(13,122,95,0.1)', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' 
                        }}>
                          <QrCode size={48} color="#0D7A5F" />
                        </div>
                        <h3 style={{ fontSize: 24, fontWeight: 800, color: '#111827', margin: '0 0 12px' }}>
                          Scan Intelligent
                        </h3>
                        <p style={{ fontSize: 16, color: '#6B7280', maxWidth: 400, margin: '0 auto' }}>
                          Cliquez pour activer votre caméra et scanner le QR code.
                        </p>
                      </div>
                    ) : (
                      <div style={{ position: 'relative', borderRadius: 32, overflow: 'hidden', background: '#000', height: 450, marginBottom: 30 }}>
                        <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <motion.div 
                          animate={{ top: ['10%', '90%', '10%'] }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                          style={{
                            position: 'absolute',
                            left: '5%',
                            width: '90%',
                            height: 2,
                            background: '#0D7A5F',
                            boxShadow: '0 0 15px #0D7A5F',
                            zIndex: 10
                          }}
                        />
                        <button 
                          onClick={stopCamera}
                          style={{
                            position: 'absolute',
                            bottom: 20,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            color: '#fff',
                            padding: '8px 20px',
                            borderRadius: 100,
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Arrêter la caméra
                        </button>
                      </div>
                    )}
                    <button style={{ background: 'transparent', border: '2px solid #E5E7EB', borderRadius: 12, padding: '14px 28px', color: '#111827', fontWeight: 700, fontSize: 15, cursor: 'pointer', transition: 'all 0.2s' }}>
                      Importer une image QR
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Cards */}
      <section style={{ padding: '80px 40px 140px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
           <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <h2 style={{ fontSize: 40, fontWeight: 900, color: '#111827', marginBottom: 16 }}>Pourquoi nous faire confiance ?</h2>
              <p style={{ color: '#6B7280', fontSize: 18 }}>L'infrastructure la plus sécurisée pour l'état civil en Guinée.</p>
           </div>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
              {[
                { icon: <Shield size={32} />, title: 'Immuabilité Totale', desc: 'Une fois ancré dans la blockchain, aucun acte ne peut être supprimé ou modifié.' },
                { icon: <Lock size={32} />, title: 'Preuve Cryptographique', desc: 'Chaque vérification utilise des algorithmes avancés pour garantir l\'originalité.' },
                { icon: <Server size={32} />, title: 'Disponibilité 24/7', desc: 'Le réseau décentralisé assure que le service est toujours accessible.' },
              ].map((item, i) => (
                <div key={i} style={{ background: '#fff', padding: '48px 32px', borderRadius: 24, border: '1px solid #F3F4F6' }}>
                   <div style={{ color: '#0D7A5F', marginBottom: 24 }}>{item.icon}</div>
                   <h3 style={{ fontSize: 20, fontWeight: 800, color: '#111827', marginBottom: 16 }}>{item.title}</h3>
                   <p style={{ color: '#6B7280', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
}
