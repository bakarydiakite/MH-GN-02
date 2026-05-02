import { motion } from "framer-motion";
import { WifiOff, RefreshCcw, Smartphone, Lock, Globe } from "lucide-react";
import SectionTitle from "../../../components/ui/SectionTitle";

const offlineSteps = [
  {
    icon: <Smartphone className="text-white" size={24} />,
    title: "Enregistrement local",
    body: "Les données sont enregistrées localement sur l’appareil de l’agent.",
  },
  {
    icon: <Lock className="text-white" size={24} />,
    title: "Stockage sécurisé",
    body: "Les informations sont stockées de manière sécurisée sur l'appareil.",
  },
  {
    icon: <RefreshCcw className="text-white" size={24} />,
    title: "Synchronisation auto",
    body: "Dès qu’un réseau est disponible, la synchronisation se fait automatiquement.",
  },
  {
    icon: <Globe className="text-white" size={24} />,
    title: "Ancrage final",
    body: "Les données sont ensuite envoyées vers le serveur et ancrées sur la blockchain.",
  },
];

export default function OfflineFirst() {
  return (
    <section id="offline" className="py-24 bg-[#0D7A5F] relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] border-[60px] border-white/5 rounded-full" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] border-[40px] border-white/5 rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="lg:flex items-center gap-20">
          <div className="lg:w-1/2">
            <SectionTitle
              light
              title="Fonctionne même sans connexion internet"
              body="NaissanceChain est conçu pour les zones à faible connectivité. Les agents peuvent enregistrer les naissances directement sur le terrain, même sans accès internet."
            />

            <div className="mt-12 p-8 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md">
                <div className="flex items-center gap-4 text-white mb-4">
                    <WifiOff size={32} className="text-[#4DFFC3]" />
                    <span className="font-bold text-xl uppercase tracking-wider">Mode Offline-First</span>
                </div>
                <p className="text-white/80 leading-relaxed">
                    Notre architecture garantit zéro perte de données, peu importe l'état du réseau mobile lors de l'enregistrement.
                </p>
            </div>
          </div>

          <div className="lg:w-1/2 mt-16 lg:mt-0">
            <div className="grid sm:grid-cols-2 gap-6">
              {offlineSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col gap-4 group hover:bg-white/10 transition-all cursor-default"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20 transition-transform group-hover:rotate-12">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed text-sm">
                      {step.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
