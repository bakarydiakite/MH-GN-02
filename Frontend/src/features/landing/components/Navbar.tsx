import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const navLinks = [
  { label: 'Accueil', href: '/#accueil' },
  { label: 'Problème', href: '/#probleme' },
  { label: 'Solution', href: '/#solution' },
  { label: 'Impact', href: '/#impact' },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('accueil');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      
      if (location.pathname === '/') {
        const sections = ['accueil', 'probleme', 'solution', 'impact'];
        for (const section of sections) {
          const el = document.getElementById(section);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top >= 0 && rect.top <= 200) {
              setActiveSection(section);
              break;
            }
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleNavClick = (href: string) => {
    const isHash = href.includes('#');
    const [path, hash] = href.split('#');

    if (location.pathname === path || (path === '/' && location.pathname === '/')) {
      if (isHash) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          setActiveSection(hash);
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#fff',
        boxShadow: scrolled ? '0 2px 16px rgba(13,122,95,0.10)' : '0 1px 0 #e5e7eb',
        transition: 'box-shadow 0.3s',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 68,
        }}
      >
        <Link
          to="/"
          onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          style={{
            fontWeight: 800,
            fontSize: 22,
            color: '#0D7A5F',
            textDecoration: 'none',
            letterSpacing: '-0.5px',
          }}
        >
          NaissanceChain
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          {navLinks.map((link) => {
            const targetHash = link.href.split('#')[1];
            const isActive = location.pathname === '/' && activeSection === targetHash;
            
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                style={{
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 14.5,
                  color: isActive ? '#0D7A5F' : '#374151',
                  textDecoration: 'none',
                  position: 'relative',
                  paddingBottom: 4,
                  transition: 'color 0.2s',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {link.label}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: -2,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#0D7A5F',
                    }}
                  />
                )}
              </a>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => handleNavClick('/#solution')}
            style={{
              background: 'transparent',
              color: '#374151',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: '10px 18px',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#0D7A5F')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
          >
            Découvrir la solution
          </button>
          
          <button
            onClick={() => navigate('/verification')}
            style={{
              background: '#fff',
              color: '#0D7A5F',
              border: '1.5px solid #0D7A5F',
              borderRadius: 8,
              padding: '10px 22px',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0D7A5F';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.color = '#0D7A5F';
            }}
          >
            Vérifier un acte
          </button>

          <button
            onClick={() => navigate('/admin')}
            style={{
              background: '#0D7A5F',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 22px',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'background 0.2s, transform 0.1s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#0A5C47')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#0D7A5F')}
          >
            Accès Portail
          </button>
        </div>
      </div>
    </nav>
  );
}
