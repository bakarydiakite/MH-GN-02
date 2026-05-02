import SectionTitle from "../components/ui/SectionTitle";
import {
  GovernmentIcon,
  HealthIcon,
  MailIcon,
  MobileIcon,
  PhoneIcon,
  PinIcon,
  SchoolIcon,
} from "../components/BrandIllustrations";
import { contactChannels, partners, principles, teamMoments } from "../data/siteContent";

const principleIcons = [MobileIcon, PinIcon, GovernmentIcon];
const partnerIcons = [HealthIcon, GovernmentIcon, SchoolIcon, MailIcon];
const contactIcons: Record<string, any> = {
  Email: MailIcon,
  Localisation: PinIcon,
  Telephone: PhoneIcon,
};

function AboutPage() {
  return (
    <div className="shell pt-10">
      <section className="grid gap-8 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
        <div>
          <span className="eyebrow">A propos du projet</span>
          <h1 className="mt-6 max-w-4xl font-display text-4xl font-bold tracking-tight text-[#153f6f] md:text-6xl">
            Un projet de confiance publique, pense comme une plateforme nationale.
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-9 text-slate-500">
            Cette page raconte le cadre de vision, les principes de conception et la dynamique
            partenariale du projet. Elle s&apos;aligne maintenant sur le style des captures avec des
            surfaces propres, une hierarchie forte et un ton institutionnel moderne.
          </p>
        </div>

        <div className="rounded-[32px] bg-[#174a7f] p-8 text-white shadow-[0_26px_60px_rgba(15,53,99,0.24)]">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-white/70">
            Vision deploiement
          </p>
          <div className="mt-6 grid gap-4">
            {teamMoments.map((moment, index) => (
              <div key={moment.title} className="rounded-[24px] bg-white/6 p-5">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold text-white ${
                      index % 2 === 0 ? "bg-accent-500" : "bg-white/15"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-white/60">
                      {moment.when}
                    </p>
                    <p className="mt-1 text-2xl font-bold">{moment.title}</p>
                  </div>
                </div>
                <p className="mt-4 text-base leading-8 text-slate-200">{moment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10 soft-section p-8 md:p-10">
        <SectionTitle
          eyebrow="Principes"
          title="Des choix de design et de produit qui servent le terrain."
          body="NaissanceChain doit rester comprehensible, deployable et digne de confiance. Ces principes sont la base du langage produit et du futur systeme."
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {principles.map((item, index) => (
            <article key={item.title} className="rounded-[26px] border border-[#edf1f6] bg-white p-6">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold text-white ${
                  index % 2 === 0 ? "bg-[#174a7f]" : "bg-accent-500"
                }`}
              >
                {(() => {
                  const Icon = principleIcons[index];
                  return Icon ? <Icon className="h-6 w-6" /> : index + 1;
                })()}
              </div>
              <h3 className="mt-6 font-display text-3xl font-bold text-[#153f6f]">{item.title}</h3>
              <p className="mt-4 text-base leading-8 text-slate-500">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="soft-section p-8 md:p-10">
          <SectionTitle
            eyebrow="Partenaires cibles"
            title="Une coalition d'acteurs publics, sociaux et techniques."
            body="Le projet doit parler a l'Etat, aux structures de sante, aux partenaires de terrain et aux bailleurs dans une meme narration claire."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {partners.map((partner) => (
              <div key={partner.name} className="rounded-[24px] border border-[#dceee8] bg-[#f2faf7] p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-accent-600">
                  {(() => {
                    const index = partners.findIndex((item) => item.name === partner.name);
                    const Icon = partnerIcons[index];
                    return Icon ? <Icon className="h-6 w-6" /> : null;
                  })()}
                </div>
                <p className="text-2xl font-bold text-[#153f6f]">{partner.name}</p>
                <p className="mt-3 text-base leading-8 text-slate-500">{partner.role}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="soft-section p-8 md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-accent-600">
            Coordination
          </p>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-[#153f6f]">
            Points de contact pour porter le projet.
          </h2>
          <div className="mt-8 space-y-4">
            {contactChannels.map((item) => (
              <div
                key={item.label}
                className="rounded-[24px] border border-[#edf1f6] bg-white px-5 py-5 shadow-[0_14px_34px_rgba(15,53,99,0.04)]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef8f4] text-accent-600">
                  {(() => {
                    const Icon = contactIcons[item.label];
                    return Icon ? <Icon className="h-6 w-6" /> : null;
                  })()}
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-600">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-[#153f6f]">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[24px] bg-[#174a7f] p-6 text-white">
            <p className="text-2xl font-bold">Objectif de la page</p>
            <p className="mt-3 text-base leading-8 text-slate-200">
              Donner a un jury, un ministere ou un partenaire une lecture immediate du serieux,
              de la vision et du niveau de preparation de NaissanceChain.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
