import { useEffect, useState } from "react";
import RevealOnScroll from "./ui/RevealOnScroll";

const contactDraftKey = "naissancechain_contact_draft";
const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  organisation: "",
  role: "",
  message: "",
};

function HomeContactForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const savedDraft = window.localStorage.getItem(contactDraftKey);
    if (savedDraft) {
      try {
        setForm(JSON.parse(savedDraft));
      } catch {
        window.localStorage.removeItem(contactDraftKey);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(contactDraftKey, JSON.stringify(form));
  }, [form]);

  const handleChange = (field) => (event) => {
    const value = field === "message" ? event.target.value.slice(0, 500) : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setFeedback("");
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.firstName.trim()) nextErrors.firstName = "Le prenom est requis.";
    if (!form.lastName.trim()) nextErrors.lastName = "Le nom est requis.";
    if (!form.email.trim()) {
      nextErrors.email = "L'email est requis.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Entre un email valide.";
    }
    if (!form.role.trim()) nextErrors.role = "Selectionne votre role.";
    if (!form.message.trim()) {
      nextErrors.message = "Le message est requis.";
    } else if (form.message.trim().length < 20) {
      nextErrors.message = "Ajoute un peu plus de contexte dans le message.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      setStatus("error");
      setFeedback("Le formulaire contient encore quelques champs a corriger.");
      return;
    }

    setStatus("submitting");

    const subject = `NaissanceChain - ${form.role} - ${form.firstName} ${form.lastName}`;
    const body = [
      `Prenom: ${form.firstName}`,
      `Nom: ${form.lastName}`,
      `Email: ${form.email}`,
      `Organisation: ${form.organisation || "Non precisee"}`,
      `Role: ${form.role}`,
      "",
      "Message:",
      form.message,
    ].join("\n");

    window.localStorage.removeItem(contactDraftKey);
    window.location.href = `mailto:contact@naissancechain.gn?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    setStatus("success");
    setFeedback(
      "Le message est pret dans votre application email. Le brouillon local a ete nettoye."
    );
  };

  const renderError = (field) =>
    errors[field] ? <p className="mt-2 text-sm font-medium text-[#ea7b59]">{errors[field]}</p> : null;

  return (
    <RevealOnScroll delay={120}>
      <form
        className="rounded-[32px] border border-[#edf1f6] bg-white p-8 shadow-[0_24px_60px_rgba(15,53,99,0.08)] md:p-9"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-semibold text-[#153f6f]">
            Prenom *
            <input
              value={form.firstName}
              onChange={handleChange("firstName")}
              className="mt-2 w-full rounded-2xl border border-[#eef2f6] px-4 py-4 text-base text-slate-600 outline-none placeholder:text-slate-300 focus:border-accent-400"
              placeholder="Mamadou"
            />
            {renderError("firstName")}
          </label>
          <label className="text-sm font-semibold text-[#153f6f]">
            Nom *
            <input
              value={form.lastName}
              onChange={handleChange("lastName")}
              className="mt-2 w-full rounded-2xl border border-[#eef2f6] px-4 py-4 text-base text-slate-600 outline-none placeholder:text-slate-300 focus:border-accent-400"
              placeholder="Diallo"
            />
            {renderError("lastName")}
          </label>
        </div>

        <div className="mt-5 space-y-5">
          <label className="block text-sm font-semibold text-[#153f6f]">
            Email *
            <input
              value={form.email}
              onChange={handleChange("email")}
              className="mt-2 w-full rounded-2xl border border-[#eef2f6] px-4 py-4 text-base text-slate-600 outline-none placeholder:text-slate-300 focus:border-accent-400"
              placeholder="vous@organisation.gn"
            />
            {renderError("email")}
          </label>
          <label className="block text-sm font-semibold text-[#153f6f]">
            Organisation
            <input
              value={form.organisation}
              onChange={handleChange("organisation")}
              className="mt-2 w-full rounded-2xl border border-[#eef2f6] px-4 py-4 text-base text-slate-600 outline-none placeholder:text-slate-300 focus:border-accent-400"
              placeholder="Ministere, ONG, Entreprise..."
            />
          </label>
          <label className="block text-sm font-semibold text-[#153f6f]">
            Role *
            <select
              value={form.role}
              onChange={handleChange("role")}
              className="mt-2 w-full rounded-2xl border border-[#eef2f6] px-4 py-4 text-base text-slate-600 outline-none focus:border-accent-400"
            >
              <option value="">Selectionner votre role</option>
              <option>Institution publique</option>
              <option>ONG</option>
              <option>Partenaire technique</option>
              <option>Bailleur</option>
            </select>
            {renderError("role")}
          </label>
          <label className="block text-sm font-semibold text-[#153f6f]">
            <span className="flex items-center justify-between">
              <span>Message *</span>
              <span className="text-xs font-medium text-slate-400">{form.message.length}/500</span>
            </span>
            <textarea
              value={form.message}
              onChange={handleChange("message")}
              rows="5"
              className="mt-2 w-full rounded-2xl border border-[#eef2f6] px-4 py-4 text-base text-slate-600 outline-none placeholder:text-slate-300 focus:border-accent-400"
              placeholder="Decrivez votre interet pour NaissanceChain..."
            />
            {renderError("message")}
          </label>
        </div>

        {feedback ? (
          <div
            className={`mt-5 rounded-2xl px-4 py-4 text-sm font-medium ${
              status === "success"
                ? "bg-[#eef8f4] text-accent-700"
                : "bg-[#fff3ef] text-[#ea7b59]"
            }`}
          >
            {feedback}
          </div>
        ) : null}

        <button
          type="submit"
          className="mt-6 w-full rounded-2xl bg-accent-500 px-5 py-4 text-base font-bold text-white shadow-[0_16px_34px_rgba(23,169,127,0.30)] transition hover:bg-accent-400"
        >
          {status === "submitting" ? "Preparation du message..." : "Envoyer le message"}
        </button>
      </form>
    </RevealOnScroll>
  );
}

export default HomeContactForm;
