"use client";

import { useState } from "react";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  institute: string;
  stage: string;
  priority: string;
  message: string;
};

type FieldName = keyof FormState;
type Errors = Partial<Record<FieldName, string>>;

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  institute: "",
  stage: "Running institute",
  priority: "Connect our complete workflow",
  message: "",
};

function validate(form: FormState) {
  const errors: Errors = {};
  if (form.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Enter a valid work email.";
  if (form.phone.trim().length < 8) errors.phone = "Enter a valid phone or WhatsApp number.";
  if (form.institute.trim().length < 2) errors.institute = "Please enter your academy or institute name.";
  if (form.message.trim().length < 10) errors.message = "Add a little context so we can prepare the right conversation.";
  return errors;
}

export function ContactEnquiryForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function update(field: FieldName, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError("");
  }

  if (submitted) {
    return (
      <div className="grid min-h-[32rem] place-items-center px-6 py-12 text-center sm:px-10">
        <div className="max-w-md">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-200"><CheckCircle2 className="size-8" /></span>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[.2em] text-emerald-700 dark:text-emerald-300">Enquiry received</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-slate-950 dark:text-white">We have your academy context.</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">The KASA team can now review your workflow before contacting you. A useful conversation starts with what you already shared—not a generic sales script.</p>
          <button type="button" onClick={() => { setForm(initialForm); setSubmitted(false); }} className="mt-7 text-sm font-semibold text-primary dark:text-emerald-300">Send another enquiry</button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="p-5 sm:p-7"
      onSubmit={async (event) => {
        event.preventDefault();
        const nextErrors = validate(form);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) return;

        setSubmitting(true);
        setSubmitError("");
        try {
          const pageUrl = window.location.href;
          const response = await fetch("/api/leads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: form.name,
              email: form.email,
              phone: form.phone,
              institute: form.institute,
              source: "contact-page-inline-form",
              leadType: "enquiry",
              ctaLabel: "Send academy enquiry",
              pageUrl,
              message: [`Academy stage: ${form.stage}`, `Priority: ${form.priority}`, "", form.message.trim()].join("\n"),
            }),
          });
          if (!response.ok) throw new Error("Unable to submit enquiry");
          setSubmitted(true);
        } catch {
          setSubmitError("We could not send this enquiry right now. Please try again or email getkasalms@gmail.com.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <div className="flex items-start justify-between gap-4 border-b border-blue-950/10 pb-5 dark:border-white/10">
        <div><p className="text-[.65rem] font-semibold uppercase tracking-[.2em] text-primary dark:text-emerald-300">Your conversation brief</p><h2 className="mt-2 font-heading text-2xl font-semibold text-slate-950 dark:text-white">Give us one real academy scenario.</h2></div>
        <span className="hidden rounded-full bg-blue-50 px-3 py-1.5 text-[.65rem] font-semibold text-primary sm:block dark:bg-emerald-300/10 dark:text-emerald-200">Direct to our team</span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Your name" error={errors.name}><input value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Full name" className={inputClass} /></Field>
        <Field label="Work email" error={errors.email}><input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="you@academy.com" className={inputClass} /></Field>
        <Field label="Phone or WhatsApp" error={errors.phone}><input value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="+91 98765 43210" className={inputClass} /></Field>
        <Field label="Academy or institute" error={errors.institute}><input value={form.institute} onChange={(event) => update("institute", event.target.value)} placeholder="Organisation name" className={inputClass} /></Field>
        <Field label="Where are you today?"><select value={form.stage} onChange={(event) => update("stage", event.target.value)} className={inputClass}><option>Planning a new academy</option><option>Running institute</option><option>Trainer or course creator</option><option>EdTech product team</option><option>Replacing an existing LMS</option></select></Field>
        <Field label="Main priority"><select value={form.priority} onChange={(event) => update("priority", event.target.value)} className={inputClass}><option>Connect our complete workflow</option><option>Sell recorded courses</option><option>Run live batches</option><option>Manage learners and faculty</option><option>Payments, CRM, and reporting</option><option>Assessments and certificates</option></select></Field>
        <div className="sm:col-span-2"><Field label="What do you want to launch or improve?" error={errors.message}><textarea value={form.message} onChange={(event) => update("message", event.target.value)} placeholder="Share your programs, learner count, current tools, biggest operational issue, and ideal rollout..." className={`${inputClass} min-h-28 resize-y py-3`} /></Field></div>
      </div>

      {submitError ? <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700 dark:bg-rose-300/10 dark:text-rose-200">{submitError}</p> : null}
      <div className="mt-5 flex flex-col gap-3 border-t border-blue-950/10 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
        <p className="max-w-sm text-xs leading-5 text-slate-500 dark:text-slate-400">Your details are used only to understand and respond to this KASA enquiry.</p>
        <button type="submit" disabled={submitting} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[image:var(--button-solid)] px-6 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-75">
          {submitting ? <><LoaderCircle className="size-4 animate-spin" />Sending enquiry…</> : <><Send className="size-4" />Send to KASA team</>}
        </button>
      </div>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-200">{label}</span>{children}{error ? <span className="mt-1.5 block text-xs font-medium text-rose-600 dark:text-rose-300">{error}</span> : null}</label>;
}

const inputClass = "h-11 w-full rounded-xl border border-blue-950/10 bg-[#f8fafc] px-3.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary/45 focus:bg-white focus:ring-4 focus:ring-primary/5 dark:border-white/10 dark:bg-white/[.045] dark:text-white dark:placeholder:text-white/30 dark:focus:bg-white/[.07]";
