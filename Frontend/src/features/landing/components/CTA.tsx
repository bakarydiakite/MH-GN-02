import { motion } from 'framer-motion';

export default function CTA() {
  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #0D7A5F 0%, #0A5C47 100%)',
        padding: '100px 40px',
        fontFamily: 'Inter, sans-serif',
        textAlign: 'center',
        overflow: 'hidden'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ maxWidth: 760, margin: '0 auto' }}
      >
        <h2
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: '#fff',
            margin: '0 0 20px',
            letterSpacing: '-1.5px',
            lineHeight: 1.1,
          }}
        >
          Prêt à enregistrer
          <br />chaque naissance ?
        </h2>
        <p
          style={{
            fontSize: 17,
            color: 'rgba(255,255,255,0.78)',
            lineHeight: 1.7,
            margin: '0 0 48px',
            maxWidth: 540,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Rejoignez NaissanceChain et donnez une existence juridique aux 1,8
          million d'enfants non enregistrés.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <button
            style={{
              background: '#fff',
              color: '#0D7A5F',
              border: 'none',
              borderRadius: 10,
              padding: '15px 36px',
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'transform 0.15s, box-shadow 0.15s',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)';
            }}
          >
            Voir la démonstration
          </button>

          <button
            style={{
              background: 'transparent',
              color: '#4DFFC3',
              border: '2px solid #4DFFC3',
              borderRadius: 10,
              padding: '15px 36px',
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'background 0.2s, transform 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(77,255,195,0.12)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Télécharger l'application
          </button>
        </div>
      </motion.div>
    </section>
  );
}
