import { motion, Variants } from 'framer-motion';
import { Smartphone, RefreshCw, ShieldCheck } from 'lucide-react';

const steps = [
  {
    icon: <Smartphone size={24} />,
    title: '01. Enregistrement',
    body: "L'agent saisit les informations sur son téléphone ou tablette, même sans connexion internet.",
  },
  {
    icon: <RefreshCw size={24} />,
    title: '02. Synchronisation',
    body: 'Dès qu\'un réseau est disponible, les données sont transmises et ancrées de façon immuable sur la blockchain.',
  },
  {
    icon: <ShieldCheck size={24} />,
    title: '03. Vérification',
    body: "Les administrations (écoles, hôpitaux, services d'état civil) scannent le QR code pour confirmer l'authenticité en 3 secondes.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function Solution() {
  return (
    <section
      id="solution"
      style={{
        background: '#fff',
        padding: '200px 40px 120px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1.15fr',
          gap: 100,
          alignItems: 'center',
        }}
      >
        {/* Colonne de Gauche : Image Illustrative */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            position: 'relative',
            borderRadius: 32,
            overflow: 'hidden',
            aspectRatio: '5/6',
            boxShadow: '0 30px 70px rgba(0,0,0,0.12)',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Image Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url("/assets/solution-final.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 1,
          }} />
        </motion.div>

        {/* Colonne de Droite : Contenu & Etapes */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.h2
            variants={itemVariants}
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: '#111827',
              margin: '0 0 24px',
              letterSpacing: '-1.5px',
              lineHeight: 1.1,
            }}
          >
            Pourquoi Choisir NaissanceChain ?
          </motion.h2>
          <motion.p
            variants={itemVariants}
            style={{
              fontSize: 17,
              color: '#4B5563',
              lineHeight: 1.75,
              margin: '0 0 48px',
              maxWidth: 580,
            }}
          >
            Nous digitalisons l'enregistrement civil avec une approche terrain 
            et une sécurité blockchain de grade industriel pour assurer que chaque 
            enfant ait une identité durable.
          </motion.p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                style={{
                  display: 'flex',
                  gap: 24,
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: 'rgba(13,122,95,0.08)',
                    color: '#0D7A5F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: '1px solid rgba(13,122,95,0.15)'
                  }}
                >
                  {step.icon}
                </div>
                <div>
                  <h3
                    style={{
                      fontWeight: 700,
                      fontSize: 19,
                      color: '#111827',
                      margin: '0 0 8px',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 15,
                      color: '#6B7280',
                      margin: 0,
                      lineHeight: 1.65,
                      maxWidth: 480
                    }}
                  >
                    {step.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
