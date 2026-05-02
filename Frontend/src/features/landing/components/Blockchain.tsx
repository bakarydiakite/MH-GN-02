import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, Server, Zap } from 'lucide-react';

export default function Blockchain() {
  return (
    <section
      id="blockchain"
      style={{
        background: '#FAFBFD',
        padding: '140px 40px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: 100,
          alignItems: 'center',
        }}
      >
        {/* Left Column: Text & Stats */}
        <motion.div
           initial={{ opacity: 0, x: -30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: '#111827',
              margin: '0 0 28px',
              letterSpacing: '-1.5px',
              lineHeight: 1.1,
            }}
          >
            Une Fondation <span style={{ color: '#0D7A5F' }}>Immuable</span> pour la Sécurité de l'Enfant.
          </h2>
          
          <p
            style={{
              fontSize: 17,
              color: '#4B5563',
              lineHeight: 1.8,
              margin: '0 0 44px',
              maxWidth: 600
            }}
          >
            NaissanceChain s'appuie sur la technologie Polygon pour garantir que chaque enregistrement est définitif, 
            vérifiable mondialement et protégé contre toute altération administrative ou physique.
          </p>

          {/* Feature Highlight Boxes */}
          <div style={{ display: 'flex', gap: 20, marginBottom: 44 }}>
            {[
              { title: 'Zéro Manipulation', icon: <CheckCircle2 size={18} /> },
              { title: 'Données Immuables', icon: <CheckCircle2 size={18} /> },
            ].map((box, i) => (
              <div 
                key={i} 
                style={{ 
                  flex: 1, background: '#fff', padding: '16px 20px', borderRadius: 14, 
                  display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #E5E7EB',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ color: '#0D7A5F' }}>{box.icon}</div>
                <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>{box.title}</span>
              </div>
            ))}
          </div>

          {/* Progress Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {[
              { label: 'Disponibilité du Réseau', value: 100, icon: <Server size={14} /> },
              { label: 'Sécurité de l\'Ancrage', value: 99.9, icon: <ShieldCheck size={14} /> },
            ].map((stat, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#0D7A5F' }}>{stat.icon}</span>
                    <span style={{ fontWeight: 600, fontSize: 14, color: '#374151' }}>{stat.label}</span>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: 14, color: '#111827' }}>{stat.value}%</span>
                </div>
                <div style={{ height: 6, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${stat.value}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      style={{ height: '100%', background: '#0D7A5F', borderRadius: 3 }}
                    />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Circular Image Visual */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <motion.div 
              style={{
                position: 'relative',
                width: 480,
                height: 480,
                borderRadius: '50%',
                padding: 15,
                border: '2px dashed rgba(13,122,95,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            >
              <div 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '50%', 
                  overflow: 'hidden',
                  position: 'relative',
                  border: '8px solid #fff',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.15)'
                }}
              >
                <img 
                  src="/assets/blockchain-circle.png" 
                  alt="Blockchain Foundation" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'rotate(-360deg)' }}
                  /* Note: rotate(-360) counters the parent rotation for the image content */
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 50%)' }} />
              </div>

              {/* Decorative Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: 40,
                  left: -20,
                  background: '#0D7A5F',
                  color: '#fff',
                  padding: '12px 24px',
                  borderRadius: 100,
                  fontWeight: 800,
                  fontSize: 12,
                  letterSpacing: '0.1em',
                  boxShadow: '0 10px 25px rgba(13,122,95,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  zIndex: 10,
                  transform: 'rotate(-15deg)'
                }}
              >
                <Zap size={14} fill="currentColor" />
                IMMUTABLE DATA
              </div>
            </motion.div>
        </div>
      </div>
    </section>
  );
}
