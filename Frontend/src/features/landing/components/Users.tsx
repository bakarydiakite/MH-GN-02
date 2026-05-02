import { motion, Variants } from 'framer-motion';
import { Activity, Users as UsersIcon, Building2, Shield } from 'lucide-react';

const users = [
  {
    icon: <Activity size={24} />,
    title: 'Agents de santé',
    body: "Sages-femmes et agents d'état civil enregistrent les naissances directement sur le terrain, même hors ligne.",
  },
  {
    icon: <UsersIcon size={24} />,
    title: 'Familles',
    body: "Les parents accèdent à l'acte numérique de leur enfant et peuvent le télécharger ou le partager en toute sécurité.",
  },
  {
    icon: <Building2 size={24} />,
    title: 'Écoles et hôpitaux',
    body: "Vérification instantanée de l'authenticité d'un acte de naissance par simple scan du QR code intégré.",
  },
  {
    icon: <Shield size={24} />,
    title: 'Ministères',
    body: 'Supervision nationale with tableaux de bord, statistiques en temps réel et planification de la couverture.',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function Users() {
  return (
    <section
      style={{
        background: '#F9FAFB',
        padding: '120px 40px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 80 }}
        >
          <h2
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: '#111827',
              margin: '0 0 16px',
              letterSpacing: '-1.5px',
            }}
          >
            Qui utilise NaissanceChain ?
          </h2>
          <p style={{ fontSize: 18, color: '#6B7280', margin: 0, fontWeight: 400, maxWidth: 600, marginInline: 'auto' }}>
            Un écosystème collaboratif pensé pour tous les acteurs de l'enregistrement civil en Guinée.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
            marginBottom: 48,
          }}
        >
          {users.map((user, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{
                y: -6,
                boxShadow: '0 12px 30px rgba(13,122,95,0.08)',
                borderColor: '#0D7A5F',
              }}
              style={{
                background: '#fff',
                borderRadius: 24,
                padding: '32px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                border: '1px solid #F3F4F6',
                cursor: 'default',
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'rgba(13,122,95,0.05)',
                color: '#0D7A5F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24
              }}>
                {user.icon}
              </div>
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: 19,
                  color: '#111827',
                  margin: '0 0 12px',
                }}
              >
                {user.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: '#6B7280',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {user.body}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination Dots (Decorative) */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 10
        }}>
          {[1, 2, 3, 4].map((dot, i) => (
            <div
              key={dot}
              style={{
                width: i === 0 ? 32 : 8,
                height: 8,
                borderRadius: 4,
                background: i === 0 ? '#0D7A5F' : '#E5E7EB',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
