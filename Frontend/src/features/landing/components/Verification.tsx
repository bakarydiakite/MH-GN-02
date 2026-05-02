import { useState } from 'react';

export default function Verification() {
  const [activeTab, setActiveTab] = useState<'numero' | 'qr'>('numero');
  const [inputValue, setInputValue] = useState('NC-2026-00847');
  const [showResult, setShowResult] = useState(true);

  const handleVerify = () => {
    if (inputValue.trim()) setShowResult(true);
  };

  return (
    <section
      id="verification"
      style={{
        background: 'linear-gradient(135deg, #0D7A5F 0%, #0A5C47 100%)',
        padding: '100px 40px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: '#fff',
              margin: '0 0 16px',
              letterSpacing: '-1.5px',
            }}
          >
            Verifier un acte de naissance
          </h2>
          <p
            style={{
              fontSize: 17,
              color: 'rgba(255,255,255,0.78)',
              maxWidth: 540,
              margin: '0 auto',
              lineHeight: 1.65,
            }}
          >
            Scannez le QR code ou saisissez le numero d'acte pour verifier son
            authenticite instantanement.
          </p>
        </div>

        <div
          style={{
            maxWidth: 600,
            margin: '0 auto',
            background: '#fff',
            borderRadius: 20,
            boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid #E5E7EB',
            }}
          >
            {(['numero', 'qr'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '18px',
                  border: 'none',
                  background: 'transparent',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  color: activeTab === tab ? '#0D7A5F' : '#9CA3AF',
                  borderBottom: activeTab === tab ? '2px solid #0D7A5F' : '2px solid transparent',
                  transition: 'color 0.2s, border-color 0.2s',
                  marginBottom: -1,
                }}
              >
                {tab === 'numero' ? 'Saisir un numero' : 'Scanner QR code'}
              </button>
            ))}
          </div>

          <div style={{ padding: '32px 32px 36px' }}>
            {activeTab === 'numero' ? (
              <div>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => { setInputValue(e.target.value); setShowResult(false); }}
                  placeholder="Numero d'acte: NC-2026-00847"
                  style={{
                    width: '100%',
                    border: '2px solid #E5E7EB',
                    borderRadius: 10,
                    padding: '14px 16px',
                    fontSize: 15,
                    fontFamily: 'Inter, sans-serif',
                    color: '#111827',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                    marginBottom: 16,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#0D7A5F')}
                  onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
                />

                <button
                  onClick={handleVerify}
                  style={{
                    width: '100%',
                    background: '#0D7A5F',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    padding: '15px',
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#0A5C47')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#0D7A5F')}
                >
                  Verifier maintenant
                </button>

                {showResult && (
                  <div
                    style={{
                      marginTop: 24,
                      background: '#F0FDF9',
                      borderRadius: 14,
                      borderLeft: '4px solid #4DFFC3',
                      padding: '24px 24px',
                      animation: 'fadeIn 0.3s ease',
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 800,
                        fontSize: 22,
                        color: '#0D7A5F',
                        margin: '0 0 20px',
                      }}
                    >
                      Acte valide
                    </p>

                    {[
                      { label: 'Enfant', value: 'Fatoumata Diallo' },
                      { label: 'Nee le', value: '12 janvier 2026 a Kindia' },
                      { label: 'Mere', value: 'Mariama Diallo' },
                      { label: 'Valide le', value: '15 janvier 2026' },
                    ].map((row, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 0',
                          borderBottom: i < 3 ? '1px solid rgba(13,122,95,0.1)' : 'none',
                        }}
                      >
                        <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 400 }}>{row.label}</span>
                        <span style={{ fontSize: 14, color: '#111827', fontWeight: 600 }}>{row.value}</span>
                      </div>
                    ))}

                    <div style={{ marginTop: 20 }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          background: 'rgba(77,255,195,0.25)',
                          color: '#0D7A5F',
                          borderRadius: 100,
                          padding: '6px 14px',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        Ancre blockchain
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontSize: 11,
                            color: '#0A5C47',
                            fontWeight: 500,
                          }}
                        >
                          0x3a7f...d92e
                        </span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div
                  style={{
                    border: '2px dashed #0D7A5F',
                    borderRadius: 16,
                    padding: '60px 40px',
                    marginBottom: 20,
                    background: 'rgba(13,122,95,0.02)',
                  }}
                >
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      margin: '0 auto 20px',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 8,
                    }}
                  >
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        style={{
                          background: '#0D7A5F',
                          borderRadius: 4,
                          opacity: 0.4 + i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                  <p style={{ fontSize: 15, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>
                    Pointez votre camera vers le QR code
                  </p>
                </div>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  style={{
                    fontSize: 14,
                    color: '#0D7A5F',
                    fontWeight: 600,
                    textDecoration: 'none',
                    borderBottom: '1px solid #0D7A5F',
                    paddingBottom: 2,
                  }}
                >
                  Ou telechargez une image du QR code
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
