import { motion, Variants } from 'framer-motion';

const stats = [
  {
    value: '58%',
    label: 'Naissances enregistrées',
    sub: 'en Guinée',
  },
  {
    value: '40%',
    label: 'Taux en zones rurales',
    sub: 'Forestières et reculées',
  },
  {
    value: '1,8M',
    label: 'Enfants sans acte',
    sub: 'Invisibles juridiquement',
  },
  {
    value: '35%',
    label: 'Moins de chances',
    sub: "D'être scolarisé sans acte",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const statVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function Statistics({ isFloating = false }: { isFloating?: boolean }) {
  const content = (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 24,
      }}
    >
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          variants={statVariants}
          style={{
            background: '#fff',
            borderRadius: 16,
            padding: isFloating ? '24px 20px' : '36px 28px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            borderTop: '4px solid #0D7A5F',
            cursor: 'default',
          }}
          whileHover={{
            y: -4,
            boxShadow: '0 8px 32px rgba(13,122,95,0.14)',
          }}
        >
          <p
            style={{
              fontSize: isFloating ? 38 : 52,
              fontWeight: 900,
              color: '#0D7A5F',
              margin: '0 0 8px',
              letterSpacing: '-2px',
              lineHeight: 1,
            }}
          >
            {stat.value}
          </p>
          <p
            style={{
              fontSize: isFloating ? 14 : 16,
              fontWeight: 600,
              color: '#111827',
              margin: '0 0 4px',
            }}
          >
            {stat.label}
          </p>
          <p
            style={{
              fontSize: 12,
              color: '#9CA3AF',
              margin: 0,
              fontWeight: 400,
            }}
          >
            {stat.sub}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );

  if (isFloating) {
    return <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>{content}</div>;
  }

  return (
    <section
      style={{
        background: '#fff',
        padding: '100px 40px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <h2
            style={{
              fontSize: 42,
              fontWeight: 800,
              color: '#111827',
              margin: '0 0 12px',
              letterSpacing: '-1px',
            }}
          >
            Le problème en chiffres
          </h2>
          <p style={{ fontSize: 15, color: '#9CA3AF', margin: 0, fontWeight: 400 }}>
            Source : UNICEF Guinée 2022
          </p>
        </motion.div>
        {content}
      </div>
    </section>
  );
}
