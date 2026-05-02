import React, { useEffect, useState } from "react";
import RevealOnScroll from "./ui/RevealOnScroll";

const contactDraftKey = "naissancechain_contact_draft";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  organisation: string;
  role: string;
  message: string;
}

const initialForm: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  organisation: "",
  role: "",
  message: "",
};

function HomeContactForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
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

  const handleChange = (field: keyof FormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = field === "message" ? event.target.value.slice(0, 500) : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setFeedback("");
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.firstName.trim()) nextErrors.firstName = "Le prénom est requis.";
    if (!form.lastName.trim()) nextErrors.lastName = "Le nom est requis.";
    if (!form.email.trim()) {
      nextErrors.email = "L'email est requis.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Entrez un email valide.";
    }
    if (!form.role.trim()) nextErrors.role = "Sélectionnez votre rôle.";
    if (!form.message.trim()) {
      nextErrors.message = "Le message est requis.";
    } else if (form.message.trim().length < 20) {
      nextErrors.message = "Ajoutez un peu plus de contexte dans le message.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validate()) {
      setStatus("error");
      setFeedback("Le formulaire contient encore quelques champs à corriger.");
      return;
    }

    setStatus("submitting");

    const subject = `NaissanceChain - ${form.role} - ${form.firstName} ${form.lastName}`;
    const body = [
      `Prénom: ${form.firstName}`,
      `Nom: ${form.lastName}`,
      `Email: ${form.email}`,
      `Organisation: ${form.organisation || "Non précisée"}`,
      `Rôle: ${form.role}`,
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
      "Le message est prêt dans votre application email. Le brouillon local a été nettoyé."
    );
  };

  const renderError = (field: keyof FormState) =>
    errors[field] ? <p className="mt-2 text-sm font-medium text-[#ea7b59]">{errors[field]}</p> : null;

  return (
    <RevealOnScroll delay={120}>
      <form
        className="rounded-[32px] border border-[#edf1f6] bg-white p-8 shadow-[0_24px_60px_rgba(15,53,99,0.08)] md:p-9"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-semibold text-[#153f6f]">
            Prénom *
            <input
              value={form.firstName}
              onChange={handleChange("firstName")}
              className="mt-2 w-full rounded-2xl border border-[#eef2f6] px-4 py-4 text-base text-slate-600 outline-none placeholder:text-slate-300 focus:border-emerald-500"
              placeholder="Mamadou"
            />
            {renderError("firstName")}
          </label>
          <label className="text-sm font-semibold text-[#153f6f]">
            Nom *
            <input
              value={form.lastName}
              onChange={handleChange("lastName")}
              className="mt-2 w-full rounded-2xl border border-[#eef2f6] px-4 py-4 text-base text-slate-600 outline-none placeholder:text-slate-300 focus:border-emerald-500"
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
              className="mt-2 w-full rounded-2xl border border-[#eef2f6] px-4 py-4 text-base text-slate-600 outline-none placeholder:text-slate-300 focus:border-emerald-500"
              placeholder="vous@organisation.gn"
            />
            {renderError("email")}
          </label>
          <label className="block text-sm font-semibold text-[#153f6f]">
            Organisation
            <input
              value={form.organisation}
              onChange={handleChange("organisation")}
              className="mt-2 w-full rounded-2xl border border-[#eef2f6] px-4 py-4 text-base text-slate-600 outline-none placeholder:text-slate-300 focus:border-emerald-500"
              placeholder="Ministère, ONG, Entreprise..."
            />
          </label>
          <label className="block text-sm font-semibold text-[#153f6f]">
            Rôle *
            <select
              value={form.role}
              onChange={handleChange("role")}
              className="mt-2 w-full rounded-2xl border border-[#eef2f6] px-4 py-4 text-base text-slate-600 outline-none focus:border-emerald-500"
            >
              <option value="">Sélectionner votre rôle</option>
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
              rows={5}
              className="mt-2 w-full rounded-2xl border border-[#eef2f6] px-4 py-4 text-base text-slate-600 outline-none placeholder:text-slate-300 focus:border-emerald-500"
              placeholder="Décrivez votre intérêt pour NaissanceChain..."
            />
            {renderError("message")}
          </label>
        </div>

        {feedback ? (
          <div
            className={`mt-5 rounded-2xl px-4 py-4 text-sm font-medium ${
              status === "success"
                ? "bg-[#eef8f4] text-emerald-700"
                : "bg-[#fff3ef] text-[#ea7b59]"
            }`}
          >
            {feedback}
          </div>
        ) : null}

        <button
          type="submit"
          className="mt-6 w-full rounded-2xl bg-[#0D7A5F] px-5 py-4 text-base font-bold text-white shadow-[0_16px_34px_rgba(13,122,95,0.30)] transition hover:bg-[#0A5C47]"
        >
          {status === "submitting" ? "Préparation du message..." : "Envoyer le message"}
        </button>
      </form>
    </RevealOnScroll>
  );
}

export default HomeContactForm;
