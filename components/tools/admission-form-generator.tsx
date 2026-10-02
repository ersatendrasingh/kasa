"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Copy, Download, Printer, RotateCcw } from "lucide-react";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(Number.isFinite(value) ? value : min, min), max);

type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "AED" | "SGD" | "AUD" | "CAD";

const currencyOptions: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: "INR", label: "India INR", symbol: "₹" },
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "GBP", label: "British Pound", symbol: "£" },
  { code: "AED", label: "UAE Dirham", symbol: "د.إ" },
  { code: "SGD", label: "Singapore Dollar", symbol: "S$" },
  { code: "AUD", label: "Australian Dollar", symbol: "A$" },
  { code: "CAD", label: "Canadian Dollar", symbol: "C$" },
];

const formatCurrency = (value: number, currency: CurrencyCode) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Math.round(value));

const courses = ["Class 10", "Class 12", "JEE Foundation", "NEET Foundation", "Spoken English", "Computer Course"] as const;
const batchTypes = ["Offline batch", "Online batch", "Hybrid batch", "Weekend batch", "Crash course"] as const;
const enquirySources = ["Walk-in", "Website", "WhatsApp", "Referral", "Social media", "School campaign"] as const;

const fieldOptions = [
  { key: "dob", label: "Date of birth" },
  { key: "gender", label: "Gender" },
  { key: "school", label: "School / college" },
  { key: "address", label: "Address" },
  { key: "emergency", label: "Emergency contact" },
  { key: "previousMarks", label: "Previous marks" },
] as const;

const documentOptions = [
  "Student photo",
  "ID proof",
  "Previous marksheet",
  "Address proof",
  "Parent ID",
  "Transfer certificate",
] as const;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function AdmissionFormGenerator() {
  const [academyName, setAcademyName] = useState("KASA Academy");
  const [formTitle, setFormTitle] = useState("Student Admission Form");
  const [studentName, setStudentName] = useState("Shivaan Gangwar");
  const [parentName, setParentName] = useState("Rohit Sharma");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [email, setEmail] = useState("parent@example.com");
  const [course, setCourse] = useState<(typeof courses)[number]>("Class 10");
  const [batchType, setBatchType] = useState<(typeof batchTypes)[number]>("Offline batch");
  const [source, setSource] = useState<(typeof enquirySources)[number]>("Website");
  const [currency, setCurrency] = useState<CurrencyCode>("INR");
  const [admissionFee, setAdmissionFee] = useState(1000);
  const [monthlyFee, setMonthlyFee] = useState(2500);
  const [selectedFields, setSelectedFields] = useState<string[]>(["dob", "school", "address", "emergency"]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>(["Student photo", "ID proof", "Previous marksheet"]);
  const [actionMessage, setActionMessage] = useState("Ready to copy, download, or print this admission form.");

  const currencySymbol = currencyOptions.find((item) => item.code === currency)?.symbol || currency;

  const result = useMemo(() => {
    const fee = clamp(admissionFee, 0, 1000000);
    const monthly = clamp(monthlyFee, 0, 1000000);
    const totalFirstPayment = fee + monthly;
    const fieldCount = 6 + selectedFields.length;
    const documentCount = selectedDocs.length;

    return {
      fee,
      monthly,
      totalFirstPayment,
      fieldCount,
      documentCount,
      status: documentCount >= 3 ? "Complete form" : "Light form",
      note:
        documentCount >= 3
          ? "This form captures student details, parent contact, course preference, fees, and document checklist."
          : "Add more document requirements if your academy needs stronger admission records.",
    };
  }, [admissionFee, monthlyFee, selectedDocs.length, selectedFields.length]);

  const toggleField = (key: string) => {
    setSelectedFields((items) => (items.includes(key) ? items.filter((item) => item !== key) : [...items, key]));
  };

  const toggleDoc = (document: string) => {
    setSelectedDocs((items) => (items.includes(document) ? items.filter((item) => item !== document) : [...items, document]));
  };

  const reset = () => {
    setAcademyName("KASA Academy");
    setFormTitle("Student Admission Form");
    setStudentName("Shivaan Gangwar");
    setParentName("Rohit Sharma");
    setPhone("+91 98765 43210");
    setEmail("parent@example.com");
    setCourse("Class 10");
    setBatchType("Offline batch");
    setSource("Website");
    setCurrency("INR");
    setAdmissionFee(1000);
    setMonthlyFee(2500);
    setSelectedFields(["dob", "school", "address", "emergency"]);
    setSelectedDocs(["Student photo", "ID proof", "Previous marksheet"]);
    setActionMessage("Ready to copy, download, or print this admission form.");
  };

  const formText = [
    `${academyName} - ${formTitle}`,
    `Student name: ${studentName}`,
    `Parent/guardian: ${parentName}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Course: ${course}`,
    `Batch type: ${batchType}`,
    `Enquiry source: ${source}`,
    `Admission fee: ${formatCurrency(result.fee, currency)}`,
    `Monthly fee: ${formatCurrency(result.monthly, currency)}`,
    `First payment estimate: ${formatCurrency(result.totalFirstPayment, currency)}`,
    "",
    "Additional fields:",
    ...selectedFields.map((field) => `- ${fieldOptions.find((item) => item.key === field)?.label || field}`),
    "",
    "Required documents:",
    ...selectedDocs.map((document) => `- ${document}`),
    "",
    "Generated with KASA Admission Form Generator",
  ].join("\n");

  const printableHtml = () => {
    const extraFields = selectedFields
      .map((field) => `<div class="box"><div class="label">${escapeHtml(fieldOptions.find((item) => item.key === field)?.label || field)}</div><div class="line"></div></div>`)
      .join("");
    const docs = selectedDocs
      .map((document) => `<div class="doc"><span></span>${escapeHtml(document)}</div>`)
      .join("");

    return `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${escapeHtml(formTitle)} - ${escapeHtml(academyName)}</title>
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 28px; font-family: Arial, sans-serif; color: #0f172a; background: #f8fbff; }
            .form { max-width: 820px; margin: 0 auto; overflow: hidden; border: 1px solid #dbe5f0; border-radius: 18px; background: #fff; }
            .header { padding: 28px; background: linear-gradient(135deg,#163d8f,#2ba8ff); color: white; }
            .eyebrow { font-size: 12px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; opacity: .8; }
            h1 { margin: 10px 0 0; font-size: 30px; }
            .academy { margin-top: 6px; opacity: .9; }
            .body { padding: 24px 28px; }
            .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
            .box { border: 1px solid #e4edf7; border-radius: 14px; padding: 14px; background: #f8fbff; min-height: 74px; }
            .label { font-size: 11px; font-weight: 800; letter-spacing: .12em; color: #64748b; text-transform: uppercase; }
            .value { margin-top: 8px; font-size: 17px; font-weight: 800; }
            .line { margin-top: 24px; border-bottom: 1px solid #94a3b8; }
            .section { margin-top: 22px; }
            h2 { margin: 0 0 12px; font-size: 18px; }
            .docs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
            .doc { display: flex; align-items: center; gap: 10px; border: 1px solid #e4edf7; border-radius: 12px; padding: 12px; background: #fff; font-size: 14px; font-weight: 700; }
            .doc span { width: 16px; height: 16px; border: 1px solid #64748b; border-radius: 4px; }
            .signatures { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; margin-top: 40px; }
            .sign { border-top: 1px solid #94a3b8; padding-top: 8px; text-align: center; color: #475569; font-size: 13px; }
            @media print { body { padding: 0; background: white; } .form { max-width: none; border: 0; border-radius: 0; } }
          </style>
        </head>
        <body>
          <main class="form">
            <section class="header">
              <div class="eyebrow">Admission form</div>
              <h1>${escapeHtml(formTitle)}</h1>
              <div class="academy">${escapeHtml(academyName)}</div>
            </section>
            <section class="body">
              <div class="grid">
                <div class="box"><div class="label">Student name</div><div class="value">${escapeHtml(studentName)}</div></div>
                <div class="box"><div class="label">Parent / guardian</div><div class="value">${escapeHtml(parentName)}</div></div>
                <div class="box"><div class="label">Phone</div><div class="value">${escapeHtml(phone)}</div></div>
                <div class="box"><div class="label">Email</div><div class="value">${escapeHtml(email)}</div></div>
                <div class="box"><div class="label">Course</div><div class="value">${escapeHtml(course)}</div></div>
                <div class="box"><div class="label">Batch type</div><div class="value">${escapeHtml(batchType)}</div></div>
                <div class="box"><div class="label">Admission fee</div><div class="value">${formatCurrency(result.fee, currency)}</div></div>
                <div class="box"><div class="label">Monthly fee</div><div class="value">${formatCurrency(result.monthly, currency)}</div></div>
                ${extraFields}
              </div>
              <div class="section">
                <h2>Required documents</h2>
                <div class="docs">${docs}</div>
              </div>
              <div class="signatures">
                <div class="sign">Student / parent signature</div>
                <div class="sign">Authorised sign</div>
              </div>
            </section>
          </main>
        </body>
      </html>
    `;
  };

  const copyForm = async () => {
    try {
      await navigator.clipboard.writeText(formText);
      setActionMessage("Admission form details copied.");
    } catch {
      setActionMessage("Copy was blocked. Use download instead.");
    }
  };

  const downloadForm = () => {
    const blob = new Blob([printableHtml()], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "kasa-admission-form.html";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setActionMessage("Printable admission form downloaded.");
  };

  const printForm = () => {
    const frame = document.createElement("iframe");
    frame.style.position = "fixed";
    frame.style.right = "0";
    frame.style.bottom = "0";
    frame.style.width = "0";
    frame.style.height = "0";
    frame.style.border = "0";
    document.body.appendChild(frame);
    const doc = frame.contentWindow?.document;
    if (!doc) {
      frame.remove();
      setActionMessage("Print could not start. Use download instead.");
      return;
    }
    doc.open();
    doc.write(printableHtml());
    doc.close();
    window.setTimeout(() => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
      frame.remove();
    }, 300);
    setActionMessage("Print opened for admission form only.");
  };

  return (
    <section className="relative px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-[108rem] gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.25rem] border border-blue-950/10 bg-white/92 p-5 shadow-xl shadow-blue-950/8 backdrop-blur dark:border-white/10 dark:bg-surface/90 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary dark:text-emerald-200">
                Admission form setup
              </p>
              <h2 className="mt-2 font-heading text-3xl font-semibold text-slate-950 dark:text-white">
                Build your form
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Choose admission fields, required documents, course details, and fees. The printable form updates instantly.
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="grid size-10 cursor-pointer place-items-center rounded-full border border-blue-950/10 bg-white text-slate-700 shadow-sm transition hover:border-primary/35 hover:text-primary dark:border-white/10 dark:bg-white/7 dark:text-white"
              aria-label="Reset form"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Academy name" value={academyName} onChange={setAcademyName} />
              <TextField label="Form title" value={formTitle} onChange={setFormTitle} />
              <TextField label="Student name" value={studentName} onChange={setStudentName} />
              <TextField label="Parent name" value={parentName} onChange={setParentName} />
              <TextField label="Phone" value={phone} onChange={setPhone} />
              <TextField label="Email" value={email} onChange={setEmail} />
            </div>
            <ChoiceGrid label="Course" value={course} options={courses} onChange={setCourse} />
            <ChoiceGrid label="Batch type" value={batchType} options={batchTypes} onChange={setBatchType} />
            <ChoiceGrid label="Enquiry source" value={source} options={enquirySources} onChange={setSource} />

            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField label="Admission fee" value={admissionFee} onChange={setAdmissionFee} min={0} max={100000} step={100} prefix={currencySymbol} presets={[0, 500, 1000, 2500, 5000]} />
              <NumberField label="Monthly fee" value={monthlyFee} onChange={setMonthlyFee} min={0} max={100000} step={100} prefix={currencySymbol} presets={[500, 1000, 2500, 5000, 10000]} />
            </div>

            <div className="rounded-[1.1rem] border border-blue-950/10 bg-white/82 p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]">
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">Currency</div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {currencyOptions.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setCurrency(item.code)}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left text-sm font-semibold transition ${currency === item.code ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-300 dark:bg-emerald-300 dark:text-slate-950" : "border-blue-950/10 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/7 dark:text-slate-200"}`}
                  >
                    <span>{item.label}</span>
                    <span>{item.symbol}</span>
                  </button>
                ))}
              </div>
            </div>

            <ToggleGroup title="Extra fields" items={fieldOptions.map((item) => ({ key: item.key, label: item.label }))} selected={selectedFields} onToggle={toggleField} />
            <ToggleGroup title="Required documents" items={documentOptions.map((item) => ({ key: item, label: item }))} selected={selectedDocs} onToggle={toggleDoc} />
          </div>
        </div>

        <div className="rounded-[1.25rem] border border-blue-950/10 bg-white/94 p-5 shadow-2xl shadow-blue-950/12 backdrop-blur dark:border-white/10 dark:bg-surface/92 sm:p-7">
          <div className="overflow-hidden rounded-[1.15rem] border border-blue-950/10 bg-white shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]">
            <div className="relative overflow-hidden bg-[image:var(--button-solid)] p-5 !text-white">
              <div className="pointer-events-none absolute -right-14 -top-16 size-48 rounded-full bg-white/14" />
              <div className="relative flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 [&_*]:!text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Admission form</p>
                  <h3 className="mt-2 break-words font-heading text-3xl font-semibold text-white">{academyName || "Academy Name"}</h3>
                  <p className="mt-2 text-sm font-medium text-white/82">{formTitle}</p>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 text-primary shadow-sm">
                  <div className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] opacity-70">First payment</div>
                  <div className="mt-1 font-heading text-2xl font-semibold">{formatCurrency(result.totalFirstPayment, currency)}</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50/65 px-5 py-3 dark:bg-slate-950/25">
              <div className="grid gap-3 sm:grid-cols-3">
                <MiniStatus label="Fields" value={`${result.fieldCount} fields`} />
                <MiniStatus label="Documents" value={`${result.documentCount} required`} />
                <MiniStatus label="Status" value={result.status} tone={result.documentCount >= 3 ? "good" : "warn"} />
              </div>
            </div>

            <div className="p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <PreviewBox label="Student" value={studentName || "Student name"} />
                <PreviewBox label="Parent / guardian" value={parentName || "Parent name"} />
                <PreviewBox label="Phone" value={phone || "Phone number"} />
                <PreviewBox label="Email" value={email || "Email address"} />
                <PreviewBox label="Course" value={course} />
                <PreviewBox label="Batch type" value={batchType} />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <Metric label="Admission fee" value={formatCurrency(result.fee, currency)} />
                <Metric label="Monthly fee" value={formatCurrency(result.monthly, currency)} />
                <Metric label="First payment" value={formatCurrency(result.totalFirstPayment, currency)} />
              </div>

              <div className="mt-5 rounded-[1rem] border border-blue-950/10 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]">
                <div className="text-sm font-semibold text-slate-950 dark:text-white">Selected extra fields</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedFields.map((field) => (
                    <span key={field} className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-white/[0.06] dark:text-slate-200">
                      {fieldOptions.find((item) => item.key === field)?.label || field}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-[1rem] border border-blue-950/10 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]">
                <div className="text-sm font-semibold text-slate-950 dark:text-white">Document checklist</div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {selectedDocs.map((document) => (
                    <div key={document} className="flex gap-2 rounded-xl bg-blue-50/70 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-white/[0.06] dark:text-slate-200">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary dark:text-emerald-300" aria-hidden="true" />
                      <span>{document}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-[1.1rem] border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-300/25 dark:bg-emerald-400/10">
                <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{result.note}</p>
              </div>

              <div className="mt-6 rounded-[1.1rem] border border-blue-950/10 bg-blue-50/70 p-4 dark:border-white/10 dark:bg-white/[0.05]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-5 text-slate-600 dark:text-slate-300">{actionMessage}</p>
                  <div className="flex flex-wrap gap-2">
                    <ActionButton label="Copy" icon={Copy} onClick={copyForm} />
                    <ActionButton label="Print" icon={Printer} onClick={printForm} />
                    <ActionButton label="Download" icon={Download} onClick={downloadForm} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="rounded-[1.1rem] border border-blue-950/10 bg-white/82 p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]">
      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 h-12 w-full rounded-xl border border-blue-950/10 bg-blue-50/60 px-4 text-sm font-semibold text-slate-950 outline-none transition focus:border-primary/50 dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
      />
    </label>
  );
}

function ChoiceGrid<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly T[]; onChange: (value: T) => void }) {
  return (
    <div className="rounded-[1.1rem] border border-blue-950/10 bg-white/82 p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button key={option} type="button" onClick={() => onChange(option)} className={`cursor-pointer rounded-full border px-3 py-2 text-sm font-semibold transition ${value === option ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-300 dark:bg-emerald-300 dark:text-slate-950" : "border-blue-950/10 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/7 dark:text-slate-200"}`}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function NumberField({ label, value, onChange, min, max, step, prefix, presets }: { label: string; value: number; onChange: (value: number) => void; min: number; max: number; step: number; prefix: string; presets: readonly number[] }) {
  const percent = ((value - min) / Math.max(1, max - min)) * 100;
  return (
    <div className="rounded-[1.1rem] border border-blue-950/10 bg-white/82 p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">{prefix}{value.toLocaleString("en-US")}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={clamp(value, min, max)}
        onChange={(event) => onChange(clamp(Number(event.target.value), min, max))}
        className="mt-4 h-2 w-full cursor-pointer accent-[#22b573] dark:accent-[#58c98a]"
        style={{ background: `linear-gradient(90deg,#22b573 ${percent}%,#d8e4ef ${percent}%)` }}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button key={preset} type="button" onClick={() => onChange(clamp(preset, min, max))} className={`cursor-pointer rounded-full border px-3 py-2 text-sm font-semibold transition ${value === preset ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-300 dark:bg-emerald-300 dark:text-slate-950" : "border-blue-950/10 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/7 dark:text-slate-200"}`}>
            {prefix}{preset.toLocaleString("en-US")}
          </button>
        ))}
      </div>
    </div>
  );
}

function ToggleGroup({ title, items, selected, onToggle }: { title: string; items: { key: string; label: string }[]; selected: string[]; onToggle: (key: string) => void }) {
  return (
    <div className="rounded-[1.1rem] border border-blue-950/10 bg-white/82 p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => {
          const active = selected.includes(item.key);
          return (
            <button key={item.key} type="button" onClick={() => onToggle(item.key)} className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${active ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-300 dark:bg-emerald-300 dark:text-slate-950" : "border-blue-950/10 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/7 dark:text-slate-200"}`}>
              <CheckCircle2 className={`size-3.5 ${active ? "" : "opacity-35"}`} aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PreviewBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-blue-950/10 bg-white p-4 shadow-sm shadow-blue-950/4 dark:border-white/10 dark:bg-white/[0.05]">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-2 break-words text-base font-semibold text-slate-950 dark:text-white">{value}</div>
    </div>
  );
}

function MiniStatus({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "good" | "warn" }) {
  const toneClass =
    tone === "good"
      ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200"
      : tone === "warn"
        ? "bg-amber-50 text-amber-800 dark:bg-amber-400/10 dark:text-amber-200"
        : "bg-white text-slate-950 dark:bg-white/[0.06] dark:text-white";

  return (
    <div className={`rounded-xl px-4 py-3 shadow-sm shadow-blue-950/4 ${toneClass}`}>
      <div className="text-[0.65rem] font-semibold uppercase tracking-[0.13em] opacity-65">{label}</div>
      <div className="mt-1 break-words text-sm font-semibold">{value}</div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1rem] bg-emerald-50 p-4 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] opacity-75">{label}</div>
      <div className="mt-2 break-words font-heading text-xl font-semibold">{value}</div>
    </div>
  );
}

function ActionButton({ label, icon: Icon, onClick }: { label: string; icon: typeof Copy; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-blue-950/10 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm shadow-blue-950/5 transition hover:border-primary/35 hover:text-primary dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:text-white"
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </button>
  );
}
