import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Statistics from './Statistics';

const carouselImages = [
  { url: '/assets/caroussel-1.png', alt: 'Mère et enfant en Guinée' },
  { url: '/assets/hero-bg.png', alt: 'Scène de maternité sereine' },
];

export default function Hero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="accueil"
      style={{
        backgroundImage: 'linear-gradient(135deg, rgba(13, 122, 95, 0.6) 0%, rgba(10, 92, 71, 0.5) 100%), url("/assets/hero-bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
        padding: '100px 40px 140px',
        position: 'relative',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'center',
        }}
      >
        <div>

          <h1
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.05,
              letterSpacing: '-2px',
              margin: '0 0 16px',
            }}
          >
            Naissance
            <br />Chain
          </h1>

          <p
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: '#4DFFC3',
              margin: '0 0 24px',
              lineHeight: 1.3,
            }}
          >
            Parce que chaque existence mérite d'être reconnue.
          </p>

          <p
            style={{
              fontSize: 16.5,
              color: 'rgba(255,255,255,0.82)',
              lineHeight: 1.75,
              margin: '0 0 44px',
              maxWidth: 520,
            }}
          >
            Digitaliser l'état civil guinéen avec la puissance de la blockchain 
            pour offrir une identité juridique éternelle et infalsifiable à chaque enfant.
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <button
              onClick={() => scrollTo('solution')}
              style={{
                background: '#fff',
                color: '#0D7A5F',
                border: 'none',
                borderRadius: 10,
                padding: '14px 32px',
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'transform 0.15s, box-shadow 0.15s',
                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.18)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)';
              }}
            >
              Découvrir la solution
            </button>

            <button
              onClick={() => scrollTo('offline')}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 10,
                padding: '14px 32px',
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Comment ça marche ?
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ImageCarousel />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: -40,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <Statistics isFloating />
      </div>
    </section>
  );
}

function ImageCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 500,
        aspectRatio: '16/10',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 32,
        padding: 12,
        boxShadow: '0 40px 80px rgba(0,0,0,0.35)',
        border: '1px solid rgba(255,255,255,0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 24, overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={carouselImages[index].url}
            alt={carouselImages[index].alt}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </AnimatePresence>

        {/* Overlay gradient for depth */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)',
          pointerEvents: 'none'
        }} />

        {/* Indicators */}
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 8,
          zIndex: 2
        }}>
          {carouselImages.map((_, i) => (
            <div
              key={i}
              onClick={() => setIndex(i)}
              style={{
                width: i === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === index ? '#4DFFC3' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
