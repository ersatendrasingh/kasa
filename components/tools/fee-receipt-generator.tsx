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

const formatDisplayDate = (value: string) => {
  if (!value) return "Select date";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
};

const paymentModes = [
  "Cash",
  "UPI",
  "Bank transfer",
  "Card",
  "Cheque",
] as const;
const feeTypes = [
  "Monthly fee",
  "Admission fee",
  "Course fee",
  "Exam fee",
  "Installment",
] as const;
const courses = [
  "Class 10",
  "Class 12",
  "JEE Foundation",
  "NEET Foundation",
  "Spoken English",
  "Computer Course",
] as const;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function FeeReceiptGenerator() {
  const [academyName, setAcademyName] = useState("KASA Academy");
  const [studentName, setStudentName] = useState("Shivaan Gangwar");
  const [course, setCourse] = useState<(typeof courses)[number]>("Class 10");
  const [feeType, setFeeType] =
    useState<(typeof feeTypes)[number]>("Monthly fee");
  const [paymentMode, setPaymentMode] =
    useState<(typeof paymentModes)[number]>("UPI");
  const [receiptNo, setReceiptNo] = useState("KASA-1001");
  const [receiptDate, setReceiptDate] = useState("");
  const [monthOrTerm, setMonthOrTerm] = useState("May 2026");
  const [feeAmount, setFeeAmount] = useState(2500);
  const [discount, setDiscount] = useState(0);
  const [previousDue, setPreviousDue] = useState(0);
  const [paidAmount, setPaidAmount] = useState(2500);
  const [currency, setCurrency] = useState<CurrencyCode>("INR");
  const [actionMessage, setActionMessage] = useState(
    "Ready to copy, download, or print this fee receipt.",
  );

  const currencySymbol = currencyOptions.find((item) => item.code === currency)?.symbol || currency;

  const result = useMemo(() => {
    const fee = clamp(feeAmount, 0, 1000000);
    const discountAmount = clamp(discount, 0, fee);
    const due = clamp(previousDue, 0, 1000000);
    const payable = Math.max(0, fee - discountAmount + due);
    const paid = clamp(paidAmount, 0, 1000000);
    const balance = Math.max(0, payable - paid);
    const extraPaid = Math.max(0, paid - payable);
    const status =
      balance === 0 ? "Paid" : paid > 0 ? "Partially paid" : "Unpaid";
    const statusTone = balance === 0 ? "good" : paid > 0 ? "warn" : "bad";

    return {
      fee,
      discountAmount,
      due,
      payable,
      paid,
      balance,
      extraPaid,
      status,
      statusTone: statusTone as "good" | "warn" | "bad",
    };
  }, [discount, feeAmount, paidAmount, previousDue]);

  const receiptText = [
    `${academyName} Fee Receipt`,
    `Receipt no: ${receiptNo}`,
    `Date: ${receiptDate || "Not selected"}`,
    `Student: ${studentName}`,
    `Course/Batch: ${course}`,
    `Fee type: ${feeType}`,
    `Month/Term: ${monthOrTerm}`,
    `Fee amount: ${formatCurrency(result.fee, currency)}`,
    `Discount: ${formatCurrency(result.discountAmount, currency)}`,
    `Previous due: ${formatCurrency(result.due, currency)}`,
    `Total payable: ${formatCurrency(result.payable, currency)}`,
    `Paid amount: ${formatCurrency(result.paid, currency)}`,
    `Balance due: ${formatCurrency(result.balance, currency)}`,
    `Payment mode: ${paymentMode}`,
    `Currency: ${currency}`,
    `Status: ${result.status}`,
    "",
    "Generated with KASA Fee Receipt Generator",
  ].join("\n");

  const receiptHtml = () => `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(receiptNo)} fee receipt</title>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; padding: 28px; font-family: Arial, sans-serif; color: #0f172a; background: #f8fbff; }
          .receipt { max-width: 760px; margin: 0 auto; border: 1px solid #dbe5f0; border-radius: 18px; overflow: hidden; background: #fff; }
          .header { padding: 26px; background: linear-gradient(135deg,#163d8f,#2ba8ff); color: white; display: flex; justify-content: space-between; gap: 20px; }
          .brand { font-size: 26px; font-weight: 800; letter-spacing: .02em; }
          .small { margin-top: 6px; font-size: 13px; opacity: .86; }
          .badge { align-self: flex-start; border-radius: 999px; background: rgba(255,255,255,.18); padding: 10px 14px; font-weight: 700; }
          .body { padding: 24px 26px; }
          .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
          .box { border: 1px solid #e4edf7; border-radius: 14px; padding: 14px; background: #f8fbff; }
          .label { font-size: 11px; font-weight: 800; letter-spacing: .12em; color: #64748b; text-transform: uppercase; }
          .value { margin-top: 7px; font-size: 17px; font-weight: 800; }
          table { width: 100%; border-collapse: collapse; margin-top: 22px; border: 1px solid #e4edf7; border-radius: 14px; overflow: hidden; }
          th, td { padding: 13px 14px; border-bottom: 1px solid #e4edf7; text-align: left; font-size: 14px; }
          th { background: #eef7ff; color: #475569; text-transform: uppercase; letter-spacing: .08em; font-size: 11px; }
          td:last-child, th:last-child { text-align: right; }
          tr:last-child td { border-bottom: 0; }
          .total { margin-top: 18px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
          .total .box { background: #ecfdf5; border-color: #bbf7d0; }
          .balance { background: ${result.balance ? "#fff7ed" : "#ecfdf5"} !important; border-color: ${result.balance ? "#fed7aa" : "#bbf7d0"} !important; }
          .footer { display: flex; justify-content: space-between; gap: 20px; padding: 0 26px 26px; color: #475569; font-size: 13px; }
          .sign { min-width: 170px; border-top: 1px solid #94a3b8; padding-top: 8px; text-align: center; }
          @media print { body { padding: 0; background: white; } .receipt { border-radius: 0; max-width: none; border: 0; } }
        </style>
      </head>
      <body>
        <main class="receipt">
          <section class="header">
            <div>
              <div class="brand">${escapeHtml(academyName)}</div>
              <div class="small">Official fee receipt for academy records and parent confirmation</div>
            </div>
            <div class="badge">${escapeHtml(result.status)}</div>
          </section>
          <section class="body">
            <div class="grid">
              <div class="box"><div class="label">Receipt no</div><div class="value">${escapeHtml(receiptNo)}</div></div>
              <div class="box"><div class="label">Date</div><div class="value">${escapeHtml(receiptDate || "Not selected")}</div></div>
              <div class="box"><div class="label">Student</div><div class="value">${escapeHtml(studentName)}</div></div>
              <div class="box"><div class="label">Course / batch</div><div class="value">${escapeHtml(course)}</div></div>
              <div class="box"><div class="label">Fee type</div><div class="value">${escapeHtml(feeType)}</div></div>
              <div class="box"><div class="label">Month / term</div><div class="value">${escapeHtml(monthOrTerm)}</div></div>
            </div>
            <table>
              <thead><tr><th>Description</th><th>Amount</th></tr></thead>
              <tbody>
                <tr><td>Fee amount</td><td>${formatCurrency(result.fee, currency)}</td></tr>
                <tr><td>Discount</td><td>- ${formatCurrency(result.discountAmount, currency)}</td></tr>
                <tr><td>Previous due</td><td>${formatCurrency(result.due, currency)}</td></tr>
                <tr><td>Paid by ${escapeHtml(paymentMode)}</td><td>${formatCurrency(result.paid, currency)}</td></tr>
              </tbody>
            </table>
            <div class="total">
              <div class="box"><div class="label">Total payable</div><div class="value">${formatCurrency(result.payable, currency)}</div></div>
              <div class="box balance"><div class="label">Balance due</div><div class="value">${formatCurrency(result.balance, currency)}</div></div>
            </div>
          </section>
          <section class="footer">
            <div>This receipt is system generated. Please verify payment details before issuing.</div>
            <div class="sign">Authorised sign</div>
          </section>
        </main>
      </body>
    </html>
  `;

  const reset = () => {
    setAcademyName("KASA Academy");
    setStudentName("Shivaan Gangwar");
    setCourse("Class 10");
    setFeeType("Monthly fee");
    setPaymentMode("UPI");
    setReceiptNo("KASA-1001");
    setMonthOrTerm("May 2026");
    setFeeAmount(2500);
    setDiscount(0);
    setPreviousDue(0);
    setPaidAmount(2500);
    setCurrency("INR");
    setActionMessage("Ready to copy, download, or print this fee receipt.");
  };

  const copyReceipt = async () => {
    try {
      await navigator.clipboard.writeText(receiptText);
      setActionMessage("Fee receipt copied.");
    } catch {
      setActionMessage("Copy was blocked. Use download instead.");
    }
  };

  const downloadReceipt = () => {
    const blob = new Blob([receiptHtml()], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${receiptNo || "fee-receipt"}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setActionMessage("Printable fee receipt downloaded.");
  };

  const printReceipt = () => {
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
    doc.write(receiptHtml());
    doc.close();
    window.setTimeout(() => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
      frame.remove();
    }, 300);
    setActionMessage("Print opened for receipt only.");
  };

  return (
    <section className="relative px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-[108rem] gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.25rem] border border-blue-950/10 bg-white/92 p-5 shadow-xl shadow-blue-950/8 backdrop-blur dark:border-white/10 dark:bg-surface/90 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary dark:text-emerald-200">
                Fee receipt setup
              </p>
              <h2 className="mt-2 font-heading text-3xl font-semibold text-slate-950 dark:text-white">
                Create a clean fee receipt
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Add student, course, fee, discount, due, and payment details.
                The receipt updates instantly.
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="grid size-10 cursor-pointer place-items-center rounded-full border border-blue-950/10 bg-white text-slate-700 shadow-sm transition hover:border-primary/35 hover:text-primary dark:border-white/10 dark:bg-white/7 dark:text-white"
              aria-label="Reset receipt"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Academy name"
                value={academyName}
                onChange={setAcademyName}
              />
              <TextField
                label="Student name"
                value={studentName}
                onChange={setStudentName}
              />
              <TextField
                label="Receipt number"
                value={receiptNo}
                onChange={setReceiptNo}
              />
              <TextField
                label="Month or term"
                value={monthOrTerm}
                onChange={setMonthOrTerm}
              />
            </div>
            <div className="rounded-[1.1rem] border border-blue-950/10 bg-white/82 p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]">
              <label
                htmlFor="receipt-date"
                className="text-sm font-semibold text-slate-800 dark:text-slate-100"
              >
                Receipt date
              </label>
              <input
                id="receipt-date"
                type="date"
                value={receiptDate}
                onChange={(event) => setReceiptDate(event.target.value)}
                className="mt-3 h-12 w-full cursor-pointer rounded-xl border border-blue-950/10 bg-blue-50/60 px-4 text-sm font-semibold text-slate-950 outline-none transition focus:border-primary/50 dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
              />
            </div>
            <ChoiceGrid
              label="Course or batch"
              value={course}
              options={courses}
              onChange={setCourse}
            />
            <ChoiceGrid
              label="Fee type"
              value={feeType}
              options={feeTypes}
              onChange={setFeeType}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label="Fee amount"
                value={feeAmount}
                onChange={setFeeAmount}
                min={0}
                max={100000}
                step={100}
                prefix={currencySymbol}
                presets={[500, 1000, 2500, 5000, 10000]}
              />
              <NumberField
                label="Discount"
                value={discount}
                onChange={setDiscount}
                min={0}
                max={Math.max(100, feeAmount)}
                step={100}
                prefix={currencySymbol}
                presets={[0, 250, 500, 1000, 2000]}
              />
              <NumberField
                label="Previous due"
                value={previousDue}
                onChange={setPreviousDue}
                min={0}
                max={100000}
                step={100}
                prefix={currencySymbol}
                presets={[0, 500, 1000, 2500, 5000]}
              />
              <NumberField
                label="Paid amount"
                value={paidAmount}
                onChange={setPaidAmount}
                min={0}
                max={Math.max(1000, result.payable + 10000)}
                step={100}
                prefix={currencySymbol}
                presets={[
                  0,
                  result.payable / 2,
                  result.payable,
                  result.payable + 1000,
                ].map(Math.round)}
              />
            </div>
            <ChoiceGrid
              label="Payment mode"
              value={paymentMode}
              options={paymentModes}
              onChange={setPaymentMode}
            />
            <div className="rounded-[1.1rem] border border-blue-950/10 bg-white/82 p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]">
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Receipt currency
              </div>
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
          </div>
        </div>

        <div className="rounded-[1.25rem] border border-blue-950/10 bg-white/94 p-5 shadow-2xl shadow-blue-950/12 backdrop-blur dark:border-white/10 dark:bg-surface/92 sm:p-7">
          <div className="overflow-hidden rounded-[1.15rem] border border-blue-950/10 bg-white shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]">
            <div className="relative overflow-hidden bg-[image:var(--button-solid)] p-5 !text-white">
              <div className="pointer-events-none absolute -right-12 -top-16 size-44 rounded-full bg-white/14" />
              <div className="pointer-events-none absolute bottom-0 right-16 h-24 w-40 rounded-t-full bg-white/8" />
              <div className="relative flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 [&_*]:!text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                    Fee receipt
                  </p>
                  <h3 className="mt-2 break-words font-heading text-3xl font-semibold text-white">
                    {academyName || "Academy Name"}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-white/82">
                    Receipt #{receiptNo || "Not set"} ·{" "}
                    {formatDisplayDate(receiptDate)}
                  </p>
                </div>
                <div className="grid gap-2 text-right">
                  <span className="justify-self-end rounded-full bg-white px-3 py-2 text-sm font-semibold text-primary shadow-sm">
                    {result.status}
                  </span>
                  <div className="rounded-2xl bg-white/14 px-4 py-3 text-white ring-1 ring-white/18">
                    <div className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/70">
                      Amount paid
                    </div>
                    <div className="mt-1 font-heading text-2xl font-semibold text-white">
                      {formatCurrency(result.paid, currency)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50/65 px-5 py-3 dark:bg-slate-950/25">
              <div className="grid gap-3 sm:grid-cols-3">
                <MiniStatus
                  label="Total payable"
                  value={formatCurrency(result.payable, currency)}
                />
                <MiniStatus
                  label="Balance due"
                  value={formatCurrency(result.balance, currency)}
                  tone={result.balance ? "warn" : "good"}
                />
                <MiniStatus label="Payment mode" value={paymentMode} />
              </div>
            </div>

            <div className="p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <PreviewBox
                  label="Student"
                  value={studentName || "Student name"}
                />
                <PreviewBox label="Course / batch" value={course} />
                <PreviewBox label="Fee type" value={feeType} />
                <PreviewBox
                  label="Month / term"
                  value={monthOrTerm || "Not set"}
                />
              </div>

              <div className="mt-5 overflow-hidden rounded-[1rem] border border-blue-950/10 bg-white dark:border-white/10 dark:bg-white/[0.04]">
                {[
                  ["Fee amount", result.fee],
                  ["Discount", -result.discountAmount],
                  ["Previous due", result.due],
                  [`Paid by ${paymentMode}`, result.paid],
                ].map(([label, value]) => (
                  <div
                    key={String(label)}
                    className="grid grid-cols-[1fr_auto] gap-3 border-b border-blue-950/10 px-4 py-3 text-sm last:border-b-0 odd:bg-blue-50/45 dark:border-white/10 dark:odd:bg-white/[0.03]"
                  >
                    <span className="text-slate-600 dark:text-slate-300">
                      {label}
                    </span>
                    <span className="font-semibold text-slate-950 dark:text-white">
                      {formatCurrency(Number(value), currency)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <Metric
                  label="Payable"
                  value={formatCurrency(result.payable, currency)}
                />
                <Metric label="Paid" value={formatCurrency(result.paid, currency)} />
                <Metric
                  label="Balance"
                  value={formatCurrency(result.balance, currency)}
                  tone={result.statusTone}
                />
              </div>

              <div
                className={`mt-5 rounded-[1.1rem] border p-4 ${result.balance ? "border-amber-200 bg-amber-50 dark:border-amber-300/25 dark:bg-amber-400/10" : "border-emerald-200 bg-emerald-50 dark:border-emerald-300/25 dark:bg-emerald-400/10"}`}
              >
                <div className="flex gap-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
                  <CheckCircle2
                    className="mt-1 size-4 shrink-0 text-primary dark:text-emerald-300"
                    aria-hidden="true"
                  />
                  <span>
                    {result.balance
                      ? `${formatCurrency(result.balance, currency)} is still due from this student.`
                      : result.extraPaid
                        ? `Payment is complete with ${formatCurrency(result.extraPaid, currency)} extra received.`
                        : "Payment is complete. This receipt is ready to issue."}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-4 rounded-[1rem] border border-dashed border-blue-950/15 bg-slate-50/75 p-4 text-sm text-slate-600 dark:border-white/15 dark:bg-white/[0.04] dark:text-slate-300 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="font-semibold text-slate-950 dark:text-white">
                    Receipt note
                  </div>
                  <p className="mt-1 leading-6">
                    Verify payment before issuing. Keep one copy for academy
                    records.
                  </p>
                </div>
                <div className="min-w-40 border-t border-slate-400 pt-2 text-center text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:border-slate-500 dark:text-slate-300">
                  Authorised sign
                </div>
              </div>

              <div className="mt-6 rounded-[1.1rem] border border-blue-950/10 bg-blue-50/70 p-4 dark:border-white/10 dark:bg-white/[0.05]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-5 text-slate-600 dark:text-slate-300">
                    {actionMessage}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <ActionButton
                      label="Copy"
                      icon={Copy}
                      onClick={copyReceipt}
                    />
                    <ActionButton
                      label="Print"
                      icon={Printer}
                      onClick={printReceipt}
                    />
                    <ActionButton
                      label="Download"
                      icon={Download}
                      onClick={downloadReceipt}
                    />
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

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="rounded-[1.1rem] border border-blue-950/10 bg-white/82 p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]">
      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 h-12 w-full rounded-xl border border-blue-950/10 bg-blue-50/60 px-4 text-sm font-semibold text-slate-950 outline-none transition focus:border-primary/50 dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
      />
    </label>
  );
}

function ChoiceGrid<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="rounded-[1.1rem] border border-blue-950/10 bg-white/82 p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
        {label}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`cursor-pointer rounded-full border px-3 py-2 text-sm font-semibold transition ${value === option ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-300 dark:bg-emerald-300 dark:text-slate-950" : "border-blue-950/10 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/7 dark:text-slate-200"}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix = "",
  presets,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  presets: readonly number[];
}) {
  const percent = ((value - min) / Math.max(1, max - min)) * 100;
  return (
    <div className="rounded-[1.1rem] border border-blue-950/10 bg-white/82 p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          {label}
        </span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
          {prefix}
          {value.toLocaleString("en-IN")}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={clamp(value, min, max)}
        onChange={(event) =>
          onChange(clamp(Number(event.target.value), min, max))
        }
        className="mt-4 h-2 w-full cursor-pointer accent-[#22b573] dark:accent-[#58c98a]"
        style={{
          background: `linear-gradient(90deg,#22b573 ${percent}%,#d8e4ef ${percent}%)`,
        }}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(clamp(preset, min, max))}
            className={`cursor-pointer rounded-full border px-3 py-2 text-sm font-semibold transition ${value === preset ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-300 dark:bg-emerald-300 dark:text-slate-950" : "border-blue-950/10 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/7 dark:text-slate-200"}`}
          >
            {prefix}
            {preset.toLocaleString("en-IN")}
          </button>
        ))}
      </div>
    </div>
  );
}

function PreviewBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-blue-950/10 bg-white p-4 shadow-sm shadow-blue-950/4 dark:border-white/10 dark:bg-white/[0.05]">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className="mt-2 break-words text-base font-semibold text-slate-950 dark:text-white">
        {value}
      </div>
    </div>
  );
}

function MiniStatus({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "good" | "warn";
}) {
  const toneClass =
    tone === "good"
      ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200"
      : tone === "warn"
        ? "bg-amber-50 text-amber-800 dark:bg-amber-400/10 dark:text-amber-200"
        : "bg-white text-slate-950 dark:bg-white/[0.06] dark:text-white";

  return (
    <div
      className={`rounded-xl px-4 py-3 shadow-sm shadow-blue-950/4 ${toneClass}`}
    >
      <div className="text-[0.65rem] font-semibold uppercase tracking-[0.13em] opacity-65">
        {label}
      </div>
      <div className="mt-1 break-words text-sm font-semibold">{value}</div>
    </div>
  );
}

function Metric({
  label,
  value,
  tone = "good",
}: {
  label: string;
  value: string;
  tone?: "good" | "warn" | "bad";
}) {
  const toneClass =
    tone === "bad"
      ? "bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-200"
      : tone === "warn"
        ? "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-200"
        : "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200";

  return (
    <div className={`rounded-[1rem] p-4 ${toneClass}`}>
      <div className="text-xs font-semibold uppercase tracking-[0.14em] opacity-75">
        {label}
      </div>
      <div className="mt-2 break-words font-heading text-2xl font-semibold">
        {value}
      </div>
    </div>
  );
}

function ActionButton({
  label,
  icon: Icon,
  onClick,
}: {
  label: string;
  icon: typeof Copy;
  onClick: () => void;
}) {
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
