import { motion } from "framer-motion";
import { MapPin, ShieldAlert, Clock, FileWarning } from "lucide-react";
import SectionTitle from "../../../components/ui/SectionTitle";
import Card from "../../../components/ui/Card";

const problemPoints = [
  {
    icon: <MapPin className="text-[#0D7A5F]" />,
    title: "Accès rural limité",
    body: "Moins de 40% des enfants sont enregistrés en zone rurale.",
  },
  {
    icon: <ShieldAlert className="text-[#0D7A5F]" />,
    title: "Centres éloignés",
    body: "Les centres d’état civil sont souvent éloignés ou difficilement accessibles.",
  },
  {
    icon: <FileWarning className="text-[#0D7A5F]" />,
    title: "Fragilité du papier",
    body: "Le système papier entraîne des pertes, des erreurs et des falsifications.",
  },
  {
    icon: <Clock className="text-[#0D7A5F]" />,
    title: "Complexité administrative",
    body: "Les démarches administratives sont longues et complexes pour les familles.",
  },
];

export default function ProblemSection() {
  return (
    <section id="probleme" className="relative py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Texte et Statistique */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <SectionTitle
              title="Le problème en Guinée"
              body="En Guinée, plus de 1,8 million d’enfants ne sont pas enregistrés à la naissance. Cela signifie qu’ils n’existent pas juridiquement."
            />

            <div className="mt-12 p-8 rounded-[32px] bg-[#0D7A5F]/5 border border-[#0D7A5F]/10 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[#0D7A5F] font-bold text-6xl md:text-7xl tracking-tighter">
                  1,8M
                </p>
                <p className="mt-2 text-[#153f6f] font-bold text-xl md:text-2xl">
                  D'enfants invisibles
                </p>
                <p className="mt-2 text-slate-600 max-w-sm">
                  C'est la population d'enfants qui ne possèdent aucune existence légale aux yeux de l'État.
                </p>
              </div>
              <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#0D7A5F]/10 rounded-full blur-3xl" />
            </div>
          </motion.div>

          {/* Points clés */}
          <div className="grid sm:grid-cols-2 gap-6">
            {problemPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card variant="medium" padding="lg" className="h-full border-none shadow-sm bg-slate-50 transition-all hover:bg-white hover:shadow-xl hover:shadow-[#0D7A5F]/5">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                    {point.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#153f6f] mb-3">{point.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{point.body}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
