import { motion } from "framer-motion";
import { Fingerprint, Link as LinkIcon, ShieldCheck, Zap, QrCode } from "lucide-react";
import SectionTitle from "../../../components/ui/SectionTitle";

const securitySteps = [
  {
    icon: <Fingerprint className="text-[#0D7A5F]" size={32} />,
    title: "Empreinte numérique",
    body: "Les informations de naissance sont transformées en une empreinte numérique unique (hash SHA-256).",
  },
  {
    icon: <LinkIcon className="text-[#0D7A5F]" size={32} />,
    title: "Enregistrement immuable",
    body: "Cette empreinte est enregistrée sur la blockchain Polygon, garantissant qu’elle ne peut pas être modifiée.",
  },
  {
    icon: <ShieldCheck className="text-[#0D7A5F]" size={32} />,
    title: "Vérification d'authenticité",
    body: "Lors d’une vérification, le système recalcul le hash et le compare avec celui enregistré pour confirmer l’authenticité.",
  },
];

export default function BlockchainSecurity() {
  return (
    <section id="securite" className="py-24 bg-[#FAFBFD]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle
          align="center"
          title="Comment fonctionne la blockchain ?"
          body="NaissanceChain utilise la blockchain pour garantir que chaque acte de naissance est authentique, vérifiable et impossible à falsifier."
        />

        <div className="mt-20 grid md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-[#0D7A5F]/20 -translate-y-8" />
          
          {securitySteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full bg-white shadow-xl shadow-[#0D7A5F]/5 flex items-center justify-center mb-8 border border-[#0D7A5F]/10 transition-transform hover:scale-110">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-[#153f6f] mb-4">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed max-w-xs">{step.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-8 rounded-3xl bg-[#153f6f] text-white flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto shadow-2xl shadow-[#153f6f]/20"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
            <Zap className="text-[#4DFFC3]" size={32} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-xl mb-2">
              Aucune donnée personnelle n’est stockée sur la blockchain, uniquement une preuve cryptographique sécurisée.
            </p>
            <div className="flex items-center gap-2 text-[#4DFFC3] font-semibold">
              <QrCode size={18} />
              <span>Vérification instantanée en moins de 3 secondes via QR code</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
