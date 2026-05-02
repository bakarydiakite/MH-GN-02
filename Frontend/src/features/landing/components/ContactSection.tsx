import { RevealOnScroll } from "../../../components/ui/RevealOnScroll";
import { Card } from "../../../components/ui/Card";
import HomeContactForm from "../../../components/HomeContactForm";
import { 
  MailIcon, 
  PinIcon, 
  PhoneIcon 
} from "../../../components/BrandIllustrations";

const contactIcons: Record<string, any> = {
  Email: MailIcon,
  Localisation: PinIcon,
  Telephone: PhoneIcon,
};

interface ContactSectionProps {
  contactChannels: Array<{ label: string; value: string }>;
}

export const ContactSection = ({ contactChannels }: ContactSectionProps) => {
  return (
    <section className="shell py-20" id="contact">
      <div className="grid gap-16 lg:grid-cols-[0.88fr_1.12fr]">
        <RevealOnScroll variant="reveal-left">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-accent-600">Contact</p>
            <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-[#153f6f] md:text-6xl">
              Parlons de votre implication.
            </h2>
            <p className="mt-6 max-w-2xl text-xl leading-9 text-slate-500">
              Vous êtes une institution, une ONG ou un partenaire technique ? Contactez-nous pour 
              explorer comment NaissanceChain peut s&apos;intégrer à vos programmes.
            </p>

            <div className="mt-10 space-y-4">
              {contactChannels.map((item, index) => (
                <RevealOnScroll key={item.label} delay={index * 90}>
                  <Card variant="medium" className="flex items-start gap-5 p-6 hover:bg-brand-surface/30 transition-colors">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ebf8f4] text-accent-600">
                      {(() => {
                        const Icon = contactIcons[item.label];
                        return Icon ? <Icon /> : <div className="h-3 w-3 rounded-full bg-accent-500" />;
                      })()}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.label}</p>
                      <p className="mt-1 text-2xl font-bold text-[#153f6f]">{item.value}</p>
                    </div>
                  </Card>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        <Card variant="high" padding="xl">
          <HomeContactForm />
        </Card>
      </div>
    </section>
  );
};

export default ContactSection;
