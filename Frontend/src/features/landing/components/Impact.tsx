import { motion } from "framer-motion";
import { GraduationCap, Stethoscope, ShieldCheck, Fingerprint, ArrowRight, XCircle, CheckCircle } from 'lucide-react';
import SectionTitle from '../../../components/ui/SectionTitle';

const impactCards = [
  {
    icon: <GraduationCap size={28} />,
    title: 'Éducation garantie',
    body: "Un enfant enregistré a plus de chances d’accéder à l’école et de poursuivre sa scolarité.",
  },
  {
    icon: <Stethoscope size={28} />,
    title: 'Accès aux soins',
    body: "L’identification officielle permet de bénéficier des services de santé publique.",
  },
  {
    icon: <ShieldCheck size={28} />,
    title: 'Protection juridique',
    body: "Chaque enfant possède une existence légale dès la naissance.",
  },
  {
    icon: <Fingerprint size={28} />,
    title: 'Identité numérique',
    body: "Une base pour une citoyenneté numérique sécurisée et moderne.",
  },
];

const comparisons = [
  {
    label: "Délai d'obtention",
    before: "3 à 8 mois (acte tardif)",
    after: "Instantané / 24h",
  },
  {
    label: "Sécurité des données",
    before: "Registres papier fragiles",
    after: "Blockchain immuable",
  },
  {
    label: "Accès en zone rurale",
    before: "Déplacement coûteux",
    after: "Agents mobiles de proximité",
  },
  {
    label: "Vérification",
    before: "Manuelle et lente",
    after: "Scan QR Code (1 seconde)",
  }
];

export default function Impact() {
  return (
    <section id="impact" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <SectionTitle
            align="center"
            title="Un impact réel pour la population guinéenne"
            body="NaissanceChain permet de transformer un problème critique en opportunité sociale en garantissant une identité légale à chaque enfant."
          />
        </motion.div>

        {/* Section Avant / Après */}
        <div className="mb-24 grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50 p-8 rounded-[32px] border border-slate-100"
            >
              <h3 className="text-2xl font-bold text-[#153f6f] mb-8 transition-colors hover:text-[#0D7A5F]">Le changement en chiffres</h3>
              <div className="space-y-6">
                {comparisons.map((item, i) => (
                  <div key={i} className="flex items-center justify-between pb-4 border-b border-slate-200 last:border-0">
                    <span className="text-slate-500 font-medium">{item.label}</span>
                    <div className="flex items-center gap-4 text-sm font-bold">
                      <span className="text-red-500 flex items-center gap-1">
                        <XCircle size={14} /> {item.before}
                      </span>
                      <ArrowRight size={14} className="text-slate-300" />
                      <span className="text-[#0D7A5F] flex items-center gap-1">
                        <CheckCircle size={14} /> {item.after}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-bold text-[#153f6f]">Pourquoi c'est vital pour la Guinée ?</h3>
              <p className="text-slate-600 leading-relaxed">
                Sans preuve légale d'identité, un enfant n'existe pas pour l'État. Il ne peut pas passer ses examens nationaux, 
                ne peut pas voter à l'âge adulte et reste vulnérable aux trafics et aux mariages précoces.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-[#0D7A5F]/5 rounded-2xl border border-[#0D7A5F]/10 transition-transform hover:-translate-y-1">
                  <p className="text-[#0D7A5F] font-bold text-3xl">+35%</p>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mt-1">Taux de scolarité</p>
                </div>
                <div className="p-6 bg-[#0D7A5F]/5 rounded-2xl border border-[#0D7A5F]/10 transition-transform hover:-translate-y-1">
                  <p className="text-[#0D7A5F] font-bold text-3xl">-90%</p>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mt-1">Risque de fraude</p>
                </div>
              </div>
            </motion.div>
        </div>

        {/* Cards Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impactCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, borderColor: '#0D7A5F' }}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-2xl hover:shadow-[#0D7A5F]/10"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#0D7A5F]/5 flex items-center justify-center mb-6 text-[#0D7A5F]">
                {card.icon}
              </div>
              <h4 className="text-lg font-bold text-[#153f6f] mb-3">{card.title}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{card.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
