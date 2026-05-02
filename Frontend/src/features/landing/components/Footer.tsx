import { Twitter, Linkedin, Github, Youtube, Shield, Lock, Fingerprint } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: '#0B1120',
        padding: '100px 40px 40px',
        fontFamily: 'Inter, sans-serif',
        color: '#94A3B8',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Main Footer Content */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
            gap: 60,
            marginBottom: 80,
          }}
        >
          {/* Column 1: Brand & Socials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ 
                width: 40, height: 40, borderRadius: 10, background: '#0D7A5F', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' 
              }}>
                <Fingerprint size={24} />
              </div>
              <span style={{ fontWeight: 800, fontSize: 24, color: '#fff', letterSpacing: '-1px' }}>
                NaissanceChain
              </span>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 300 }}>
              Garantir une identité numérique immuable pour chaque enfant guinéen grâce à la puissance de la blockchain.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {[Twitter, Linkedin, Github, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8',
                    transition: 'all 0.2s', border: '1px solid rgba(255,255,255,0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#0D7A5F';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = '#94A3B8';
                  }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Products */}
          <div>
            <h4 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 28 }}>Produits</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {['Solution', 'Impact', 'Vérification', 'Blockchain', 'API Platform'].map((item) => (
                <li key={item}>
                  <a href="#" style={{ textDecoration: 'none', color: 'inherit', fontSize: 14, transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')} onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 28 }}>Société</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {['À propos', 'Hackathon MIABE', 'Partenaires', 'Carrières', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" style={{ textDecoration: 'none', color: 'inherit', fontSize: 14, transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')} onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div>
            <h4 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 28 }}>Ressources</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {['Documentation', 'Centre d\'aide', 'Études de cas', 'Note technique', 'Sécurité'].map((item) => (
                <li key={item}>
                  <a href="#" style={{ textDecoration: 'none', color: 'inherit', fontSize: 14, transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')} onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ 
          paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.05)', 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
            <p style={{ fontSize: 13, margin: 0 }}>© {currentYear} NaissanceChain. Tous droits réservés.</p>
            <div style={{ display: 'flex', gap: 24 }}>
              {['Confidentialité', 'CGU', 'Cookies'].map((item) => (
                <a key={item} href="#" style={{ textDecoration: 'none', color: 'inherit', fontSize: 13, transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')} onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}>
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: 8, background: '#fff', color: '#111827', 
              padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700 
            }}>
              <Shield size={14} style={{ color: '#0D7A5F' }} />
              GDPR COMPLIANT
            </div>
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', color: '#fff', 
              padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700, border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <Lock size={14} style={{ color: '#0D7A5F' }} />
              BLOCKCHAIN SECURED
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
