"use client";

import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import JSZip from "jszip";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  ChevronDown,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  LoaderCircle,
  PenLine,
  Plus,
  Printer,
  RefreshCw,
  RotateCcw,
  Search,
  Share2,
  Sparkles,
  UploadCloud,
  Undo2,
  X,
} from "lucide-react";
import { createResumeAtsPdf, needsUnicodePrint } from "@/lib/resume/report-pdf";
import { reportSections, type ResumeAnalysis } from "@/lib/resume/analysis";
import { recoverResumeStructure } from "@/lib/resume/text-structure";
import { ToolToast, type ToolToastState } from "@/components/tools/tool-toast";

const roleFamilies = [
  "Software Engineering",
  "Data & AI",
  "Product & Design",
  "Cloud & DevOps",
  "Cybersecurity",
  "Business & Marketing",
  "Finance & Operations",
] as const;

const roleOptions = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "React Developer",
  "Next.js Developer",
  "Angular Developer",
  "Vue.js Developer",
  "HTML CSS Developer",
  "WordPress Developer",
  "PHP Developer",
  "Laravel Developer",
  "Java Developer",
  "Python Developer",
  "C++ Developer",
  ".NET Developer",
  "Golang Developer",
  "Node.js Developer",
  "MERN Stack Developer",
  "Android Developer",
  "iOS Developer",
  "Flutter Developer",
  "React Native Developer",
  "Software Engineer",
  "Software Architect",
  "Engineering Manager",
  "Data Analyst",
  "Business Analyst",
  "Data Scientist",
  "Data Engineer",
  "Analytics Engineer",
  "Machine Learning Engineer",
  "AI Engineer",
  "Generative AI Engineer",
  "MLOps Engineer",
  "Prompt Engineer",
  "Computer Vision Engineer",
  "NLP Engineer",
  "Cloud Engineer",
  "DevOps Engineer",
  "Site Reliability Engineer",
  "AWS Cloud Engineer",
  "Azure Cloud Engineer",
  "GCP Cloud Engineer",
  "QA Engineer",
  "SDET",
  "Automation Test Engineer",
  "Cybersecurity Analyst",
  "Security Engineer",
  "SOC Analyst",
  "Network Engineer",
  "Database Administrator",
  "UI/UX Designer",
  "Product Designer",
  "Graphic Designer",
  "Product Manager",
  "Project Manager",
  "Scrum Master",
  "Digital Marketing Executive",
  "SEO Executive",
  "Performance Marketing Manager",
  "Content Writer",
  "Social Media Manager",
  "Finance Analyst",
  "Accountant",
  "CA Articleship",
  "HR Executive",
  "Recruiter",
  "Operations Executive",
  "Sales Development Representative",
  "Customer Support Executive",
  "Teacher",
  "Academic Counselor",
] as const;

const languageOptions = ["English", "Hindi", "Hinglish"] as const;
const popularSkills = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Java",
  "Spring Boot",
  "Python",
  "Django",
  "SQL",
  "MongoDB",
  "Git",
  "AWS",
  "Docker",
  "Kubernetes",
  "Power BI",
  "Excel",
  "Machine Learning",
  "Deep Learning",
  "NLP",
  "LLMs",
  "LangChain",
  "Prompt Engineering",
  "Figma",
] as const;

const storageKey = "kasa-ai-resume-ats:v3:last";
const resumeBuilderDraftKey = "kasa-ai-resume-builder:draft";
const resumeBuilderAtsHandoffKey = "kasa-resume-builder:ats-handoff";
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(Number.isFinite(value) ? value : min, min), max);

type UploadedResume = {
  name: string;
  mimeType: string;
  data: string;
  size: number;
  text?: string;
};

type ResumeProfile = {
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  detectedRole: string;
  roleFamily: string;
  yearsExperience: number;
  experienceLevel: string;
  skills: string[];
  summary: string;
};

type SavedResumeAnalysis = {
  jobDescription: string;
  resumeText: string;
  uploadedResume: UploadedResume | null;
  targetRole: string;
  roleFamily: string;
  candidateName: string;
  yearsExperience: number;
  experienceLevel?: string;
  selectedSkills: string[];
  customSkill: string;
  targetPackage: number;
  dailyHours: number;
  language: string;
  analysis: ResumeAnalysis;
};

type InputPanel = "resume-text" | "job-match" | "preferences" | null;

export function ResumeAtsChecker() {
  const resultPanelRef = useRef<HTMLDivElement>(null);
  const uploadVersion = useRef(0);
  const [jobDescription, setJobDescription] = useState("");
  const [saveReport, setSaveReport] = useState(false);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [uploadedResume, setUploadedResume] = useState<UploadedResume | null>(null);
  const [roleFamily, setRoleFamily] = useState<(typeof roleFamilies)[number]>("Software Engineering");
  const [candidateName, setCandidateName] = useState("Candidate");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePhone, setCandidatePhone] = useState("");
  const [targetRole, setTargetRole] = useState("General resume review");
  const [yearsExperience, setYearsExperience] = useState(0);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [targetPackage, setTargetPackage] = useState(8);
  const [dailyHours, setDailyHours] = useState(2);
  const [language, setLanguage] = useState<(typeof languageOptions)[number]>("English");
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDetectingProfile, setIsDetectingProfile] = useState(false);
  const [detectedSummary, setDetectedSummary] = useState("");
  const [actionMessage, setActionMessage] = useState("Upload a PDF, DOCX or TXT resume, or paste resume text to begin.");
  const [savedAvailable, setSavedAvailable] = useState(false);
  const [toast, setToast] = useState<ToolToastState>(null);
  const [activeInputPanel, setActiveInputPanel] = useState<InputPanel>(null);

  const notify = useCallback((type: NonNullable<ToolToastState>["type"], title: string, message: string) => {
    setToast({ id: Date.now(), type, title, message });
  }, []);

  const restoreSavedReport = useCallback((saved: Partial<SavedResumeAnalysis>, message = "Last resume report restored.") => {
    if (!saved.analysis) return;
    setResumeText(saved.resumeText || "");
    setJobDescription(saved.jobDescription || "");
    setSaveReport(true);
    setUploadedResume(saved.uploadedResume || null);
    setCandidateName(saved.candidateName || deriveNameFromResume(saved.uploadedResume?.name) || "Candidate");
    setCandidateEmail("");
    setCandidatePhone("");
    setTargetRole(saved.targetRole || "Frontend Developer");
    setRoleFamily((saved.roleFamily as (typeof roleFamilies)[number]) || "Software Engineering");
    setYearsExperience(clamp(Number(saved.yearsExperience ?? legacyExperienceToYears(saved.experienceLevel)), 0, 20));
    setSelectedSkills(Array.isArray(saved.selectedSkills) ? saved.selectedSkills : []);
    setCustomSkill(saved.customSkill || "");
    setTargetPackage(clamp(Number(saved.targetPackage), 0, 100));
    setDailyHours(clamp(Number(saved.dailyHours), 1, 10));
    setLanguage((saved.language as (typeof languageOptions)[number]) || "English");
    setAnalysis(saved.analysis);
    setSavedAvailable(true);
    setActionMessage(message);
    notify("success", "Last report restored", message);
  }, [notify]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const handoffRaw = window.localStorage.getItem(resumeBuilderAtsHandoffKey);
      if (handoffRaw) {
        try {
          const handoff = JSON.parse(handoffRaw) as Partial<{
            resumeText: string;
            candidateName: string;
            targetRole: string;
            roleFamily: string;
            selectedSkills: string[];
            source: string;
          }>;
          if (handoff.resumeText && handoff.resumeText.trim().length >= 120) {
            setResumeText(handoff.resumeText);
            setUploadedResume(null);
            setCandidateName(handoff.candidateName || "Candidate");
            setCandidateEmail("");
            setCandidatePhone("");
            setTargetRole(handoff.targetRole || "Frontend Developer");
            setRoleFamily((handoff.roleFamily as (typeof roleFamilies)[number]) || "Software Engineering");
            setSelectedSkills(Array.isArray(handoff.selectedSkills) ? handoff.selectedSkills.slice(0, 12) : []);
            setAnalysis(null);
            setActionMessage("Resume imported from builder. Add target role if needed, then generate the ATS report.");
            notify("success", "Resume ready for ATS", "Your built resume is already loaded here. No re-upload needed.");
            window.localStorage.removeItem(resumeBuilderAtsHandoffKey);
            setSavedAvailable(Boolean(window.localStorage.getItem(storageKey)));
            return;
          }
        } catch {
          window.localStorage.removeItem(resumeBuilderAtsHandoffKey);
        }
      }
      const raw = window.localStorage.getItem(storageKey);
      setSavedAvailable(Boolean(raw));
      if (!raw) return;
      const saved = parseSavedReport(raw);
      if (!saved?.analysis) return;
      restoreSavedReport(saved, "Last resume report restored.");
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [notify, restoreSavedReport]);

  useEffect(() => {
    if (!isGenerating) return;
    const intervalId = window.setInterval(() => {
      setProgress((value) => {
        if (value < 35) return Math.min(value + 7, 35);
        if (value < 78) return Math.min(value + 4, 78);
        return Math.min(value + 2, 94);
      });
    }, 420);
    return () => window.clearInterval(intervalId);
  }, [isGenerating]);

  const readiness = analysis ? getReadiness(analysis.atsScore) : { label: "Ready to analyze", tone: "blue" };
  const resumeWords = useMemo(() => resumeText.trim().split(/\s+/).filter(Boolean).length, [resumeText]);
  const skillText = [...selectedSkills, customSkill].filter(Boolean).join(", ");
  const experienceLabel = formatExperienceLabel(yearsExperience);

  const resultText = useMemo(() => {
    if (!analysis) return "";
    return ["KASA Resume Review", `Candidate: ${candidateName}`, `Target role: ${targetRole}`, `ATS readiness: ${analysis.atsScore}/100`, ...reportSections(analysis).flatMap(([title, items]) => ["", title, ...items.map((item) => `- ${item}`)])].join("\n");
  }, [analysis, candidateName, targetRole]);

  const clearGenerated = () => {
    if (analysis) setActionMessage("Inputs changed. Generate a fresh ATS report for the updated resume.");
    setAnalysis(null);
  };

  const handleFileUpload = async (file: File | undefined) => {
    if (!file || isGenerating) return;
    const mimeType = getSupportedMimeType(file);
    if (!mimeType || mimeType === "application/msword") {
      notify("error", "Unsupported file", "Use PDF, DOCX or TXT. Convert older DOC files to PDF first.");
      return;
    }
    if (!file.size || file.size > 4_000_000) {
      notify("error", "Check file size", "Upload a non-empty resume under 4 MB.");
      return;
    }
    const version = ++uploadVersion.current;
    setIsReadingFile(true);
    setUploadProgress(15);
    clearGenerated();
    trackAts("upload_started", { file_type: mimeType === "application/pdf" ? "pdf" : mimeType === "text/plain" ? "txt" : "docx" });
    try {
      const extractedText = await extractReadableTextFromUpload(file, mimeType);
      if (extractedText.trim().length < 300) throw new Error("Not enough readable resume text. Try a text-based PDF or paste at least 300 characters.");
      if (extractedText.length > 30000) throw new Error("This resume is too long. Use up to 30,000 characters.");
      if (version !== uploadVersion.current) return;
      const nextResume = { name: file.name, mimeType, data: "", size: file.size, text: extractedText || undefined };
      setUploadedResume(nextResume);
      setResumeText(extractedText);
      setCandidateName(deriveNameFromResume(file.name) || "Candidate");
      setCandidateEmail("");
      setCandidatePhone("");
      setDetectedSummary("");
      setActionMessage("Resume uploaded. Detecting your role, experience, and skills…");
      trackAts("upload_completed");
      void detectResumeProfile(nextResume, extractedText);
    } catch (error) {
      if (version !== uploadVersion.current) return;
      setUploadedResume(null);
      setResumeText("");
      setCandidateEmail("");
      setCandidatePhone("");
      notify("error", "Could not read resume", error instanceof Error ? error.message : "Try a PDF or paste resume text.");
      trackAts("upload_failed");
    } finally {
      if (version === uploadVersion.current) { setIsReadingFile(false); setUploadProgress(0); }
    }
  };

  const detectResumeProfile = async (resumeFile = uploadedResume, pastedText = resumeText) => {
    if (!resumeFile && pastedText.trim().length < 300) {
      setActionMessage("Upload a resume file or paste enough resume text before auto-detecting profile.");
      notify("error", "Resume needed", "Upload a resume file or paste enough resume text before auto-detecting profile.");
      return;
    }
    setIsDetectingProfile(true);
    setDetectedSummary("");
    try {
      const response = await fetch("/api/tools/resume-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: pastedText || resumeFile?.text || "",
          fileName: resumeFile?.name,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data?.error === "string" ? data.error : "Resume profile detection failed.");
      const profile = data.profile as Partial<ResumeProfile> | undefined;
      if (!profile) throw new Error("Could not detect a usable profile from this resume.");

      if (profile.candidateName && profile.candidateName !== "Candidate") setCandidateName(profile.candidateName);
      setCandidateEmail(profile.candidateEmail || "");
      setCandidatePhone(profile.candidatePhone || "");
      if (profile.detectedRole) setTargetRole(profile.detectedRole);
      if (profile.roleFamily && roleFamilies.includes(profile.roleFamily as (typeof roleFamilies)[number])) {
        setRoleFamily(profile.roleFamily as (typeof roleFamilies)[number]);
      }
      const nextYears = clamp(Number(profile.yearsExperience), 0, 20);
      setYearsExperience(nextYears);
      if (Array.isArray(profile.skills) && profile.skills.length) {
        setSelectedSkills(uniqueList(profile.skills, 16));
      }
      clearGenerated();
      setDetectedSummary(profile.summary || `Detected ${formatExperienceLabel(nextYears)} profile from your resume.`);
      setActionMessage("Profile detected locally. Review the role and generate your free ATS report.");
      notify("success", "Profile detected", "Role, experience, and skills were detected without a paid AI call.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Resume profile detection failed. You can still generate the ATS report.";
      setActionMessage(message);
      notify("error", "Profile detection failed", message);
    } finally {
      setIsDetectingProfile(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((items) => {
      const active = items.some((item) => skillsMatch(item, skill));
      if (active) return items.filter((item) => !skillsMatch(item, skill));
      return uniqueList([...items, skill], 24);
    });
    clearGenerated();
  };

  const restoreLast = () => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      const saved = parseSavedReport(raw);
      if (!saved?.analysis) return;
      restoreSavedReport(saved);
      window.setTimeout(() => resultPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch {
      setActionMessage("Could not restore the last report.");
      notify("error", "Restore failed", "Could not restore the last saved ATS report.");
    }
  };

  const reset = () => {
    uploadVersion.current += 1;
    setIsReadingFile(false);
    setJobDescription("");
    setSavedAvailable(false);
    setSaveReport(false);
    try { window.localStorage.removeItem(storageKey); window.localStorage.removeItem("kasa-ai-resume-ats:last"); } catch { /* Storage may be disabled. */ }
    setResumeText("");
    setUploadedResume(null);
    setRoleFamily("Software Engineering");
    setCandidateName("Candidate");
    setCandidateEmail("");
    setCandidatePhone("");
    setTargetRole("General resume review");
    setYearsExperience(0);
    setSelectedSkills([]);
    setCustomSkill("");
    setTargetPackage(8);
    setDailyHours(2);
    setLanguage("English");
    setAnalysis(null);
    setProgress(0);
    setUploadProgress(0);
    setDetectedSummary("");
    setActionMessage("Upload a PDF, DOCX or TXT resume, or paste resume text to begin.");
  };

  const generateAnalysis = async (editedResumeText?: string) => {
    if (isGenerating || isReadingFile || isDetectingProfile) return;
    const isWorkspaceRecheck = typeof editedResumeText === "string";
    const effectiveResumeText = isWorkspaceRecheck
      ? editedResumeText.trim()
      : resumeText.trim() || uploadedResume?.text || "";
    if (!uploadedResume && effectiveResumeText.length < 300) {
      setActionMessage("Upload a resume file or paste at least 300 characters from your resume.");
      notify("error", "Resume needed", "Upload a resume file or paste at least 300 characters from your resume.");
      return;
    }
    setIsGenerating(true);
    setProgress(8);
    setActionMessage("Reviewing your resume and prioritizing useful fixes...");
    trackAts("analysis_started", { has_job_description: Boolean(jobDescription.trim()) });
    try {
      if (isWorkspaceRecheck) {
        setResumeText(effectiveResumeText);
        setUploadedResume(null);
      }
      const response = await fetch("/api/tools/resume-ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: effectiveResumeText,
          jobDescription,
          fileName: uploadedResume?.name,
          candidateName,
          candidateEmail,
          candidatePhone,
          targetRole,
          roleFamily,
          yearsExperience,
          experienceLevel: experienceLabel,
          currentSkills: skillText || "Not specified",
          targetPackage,
          dailyHours,
          language,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data?.error === "string" ? data.error : "Resume analysis failed.");
      if (!data.analysis) throw new Error("The checker did not return a usable resume report.");
      setProgress(96);
      setAnalysis(data.analysis);
      if (saveReport) {
        try {
          window.localStorage.setItem(storageKey, JSON.stringify({ resumeText: effectiveResumeText, jobDescription, uploadedResume: null, targetRole, roleFamily, candidateName, yearsExperience, selectedSkills, customSkill, targetPackage, dailyHours, language, analysis: data.analysis } satisfies SavedResumeAnalysis));
          setSavedAvailable(true);
        } catch { notify("error", "Report not saved on device", "Your analysis is ready. Download it before leaving this page."); }
      }
      trackAts("analysis_completed", { has_job_description: Boolean(jobDescription.trim()) });
      const successMessage = "ATS report generated.";
      setActionMessage(successMessage);
      notify("success", "ATS report generated", successMessage);
      window.setTimeout(() => resultPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Resume analysis failed. Please try again.";
      setActionMessage(message);
      notify("error", "ATS analysis failed", message);
      trackAts("analysis_failed");
    } finally {
      setProgress(100);
      window.setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 450);
    }
  };

  const copyReport = async () => {
    if (!resultText) return;
    try {
      await navigator.clipboard.writeText(resultText);
      setActionMessage("Resume ATS report copied.");
      notify("success", "Copied", "Resume ATS report copied to clipboard.");
    } catch {
      setActionMessage("Copy was blocked. Use download instead.");
      notify("error", "Copy blocked", "Your browser blocked clipboard access. Use download instead.");
    }
  };

  const downloadReport = () => {
    if (!analysis) return;
    if (needsUnicodePrint(resultText)) { printReport(); return; }
    trackAts("report_downloaded");
    const blob = createResumeAtsPdf({
      analysis,
      candidateName,
      targetRole,
      roleFamily,
      yearsExperience,
      targetPackage,
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugify(candidateName || targetRole)}-ats-score-report.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setActionMessage("Your complete resume report has been downloaded.");
    notify("success", "PDF downloaded", "Your complete resume report has been downloaded.");
  };

  const printReport = () => {
    if (!analysis) return;
    const frame = document.createElement("iframe");
    frame.style.position = "fixed";
    frame.style.right = "0";
    frame.style.bottom = "0";
    frame.style.width = "0";
    frame.style.height = "0";
    frame.style.border = "0";
    document.body.appendChild(frame);
    const frameWindow = frame.contentWindow;
    const frameDocument = frame.contentDocument;
    if (!frameWindow || !frameDocument) {
      frame.remove();
      setActionMessage("Print was blocked. Please try again.");
      notify("error", "Print blocked", "Print was blocked. Please try again.");
      return;
    }
    frameDocument.open();
    frameDocument.write(createPrintableAtsReport({ analysis, candidateName, targetRole, roleFamily, yearsExperience, targetPackage }));
    frameDocument.close();
    frameWindow.focus();
    frameWindow.onafterprint = () => frame.remove();
    window.setTimeout(() => { frameWindow.print(); }, 300);
    window.setTimeout(() => frame.remove(), 120_000);
    setActionMessage("Print view opened with only the ATS report.");
    notify("success", "Print view opened", "Choose Save as PDF in the print dialog. This preserves all languages in your full report.");
  };

  const shareReport = async () => {
    if (!analysis) return;
    const shareUrl = `${window.location.origin}/tools/resume-ats-checker`;
    const shareTitle = `${candidateName}'s ATS score is ${analysis.atsScore}/100`;
    const shareText = `${candidateName}'s ATS score is ${analysis.atsScore}/100 for ${targetRole}. Check your resume score free on KASA: ${shareUrl}`;
    if (needsUnicodePrint(resultText)) { printReport(); return; }
    const pdfFile = new File(
      [createResumeAtsPdf({ analysis, candidateName, targetRole, roleFamily, yearsExperience, targetPackage })],
      `${slugify(candidateName || targetRole)}-ats-score-report.pdf`,
      { type: "application/pdf" },
    );

    try {
      if (navigator.canShare?.({ files: [pdfFile] }) && navigator.share) {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl, files: [pdfFile] });
        setActionMessage("ATS score PDF shared.");
        notify("success", "PDF shared", "ATS score PDF shared successfully.");
        return;
      }
      if (navigator.share) {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
        setActionMessage("ATS score link shared. PDF sharing is not supported on this browser.");
        notify("success", "Link shared", "PDF sharing is not supported on this browser, so the link was shared.");
        return;
      }
      await navigator.clipboard.writeText(shareText);
      setActionMessage("Share text copied. This browser does not support direct sharing.");
      notify("success", "Share text copied", "This browser does not support direct sharing, so the text was copied.");
    } catch {
      setActionMessage("Share was cancelled or blocked.");
      notify("error", "Share blocked", "Sharing was cancelled or blocked by the browser.");
    }
  };

  const buildResumeFromReport = (editedResumeText = resumeText) => {
    if (!analysis) return;
    window.localStorage.setItem(
      resumeBuilderDraftKey,
      JSON.stringify({
        resumeText: editedResumeText,
        uploadedResume,
        targetRole,
        roleFamily,
        candidateName,
        yearsExperience,
        selectedSkills,
        customSkill,
        analysis: {
          atsScore: analysis.atsScore,
          missingKeywords: analysis.missingKeywords,
          missingSkills: analysis.missingSkills,
          improvedBullets: analysis.improvedBullets,
          weakAreas: analysis.weakAreas,
          quickWins: analysis.quickWins,
        },
      }),
    );
    window.location.href = "/tools/ai-resume-builder";
  };

  return (
    <section id="resume-checker" aria-label="Resume checker" className="relative scroll-mt-24 px-4 pb-10 pt-3 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[108rem] space-y-6">
        <div className="overflow-hidden rounded-[1.35rem] border border-blue-950/10 bg-white/95 shadow-[0_20px_60px_-28px_rgba(15,53,104,0.38)] backdrop-blur dark:border-white/10 dark:bg-surface/92">
          <div className="flex items-center justify-between gap-4 border-b border-blue-950/10 bg-[linear-gradient(120deg,rgba(43,168,255,0.09),rgba(34,181,115,0.07),transparent)] px-4 py-3.5 dark:border-white/10 sm:px-6">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h2 className="font-heading text-lg font-semibold text-slate-950 dark:text-white sm:text-xl">Check your resume</h2>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200">Free · no signup</span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">PDF, DOCX or TXT · up to 4 MB · report in about a minute</p>
            </div>
            <button type="button" onClick={reset} className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border border-blue-950/10 bg-white text-slate-600 shadow-sm transition hover:border-primary/35 hover:text-primary dark:border-white/10 dark:bg-white/7 dark:text-white" aria-label="Reset resume checker">
              <RotateCcw className="size-4" aria-hidden="true" />
            </button>
          </div>

          <fieldset disabled={isGenerating || isReadingFile || isDetectingProfile} className="grid min-w-0 gap-3 p-4 disabled:opacity-70 sm:p-5">
            <div
              onDragOver={(event) => { event.preventDefault(); if (!isGenerating) setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => { event.preventDefault(); setIsDragging(false); void handleFileUpload(event.dataTransfer.files[0]); }}
              data-dragging={isDragging}
              className="grid items-center gap-4 rounded-2xl border border-dashed border-primary/30 bg-[linear-gradient(135deg,rgba(43,168,255,0.08),rgba(34,181,115,0.07))] p-4 transition duration-200 data-[dragging=true]:border-primary data-[dragging=true]:ring-4 data-[dragging=true]:ring-primary/10 dark:border-emerald-300/25 dark:bg-white/[0.04] sm:grid-cols-[minmax(0,1fr)_auto] sm:p-5"
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-primary shadow-sm dark:bg-white/10 dark:text-emerald-200">
                  {uploadedResume ? <FileText className="size-5" aria-hidden="true" /> : <UploadCloud className="size-5" aria-hidden="true" />}
                </div>
                <div className="min-w-0 text-left">
                  <h3 className="truncate text-sm font-semibold text-slate-950 dark:text-white sm:text-base">{uploadedResume ? uploadedResume.name : "Drop your resume here"}</h3>
                  <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{uploadedResume ? `${formatFileSize(uploadedResume.size)} · ${isDetectingProfile ? "detecting profile…" : "ready to review"}` : "Drag a file here or choose it from your device"}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                {isDetectingProfile ? <span className="inline-flex h-10 items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 text-xs font-semibold text-emerald-800 dark:border-emerald-300/20 dark:bg-white/8 dark:text-emerald-200"><LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />Reading profile…</span> : null}
                <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-[image:var(--button-solid)] px-5 text-sm font-semibold !text-white shadow-lg shadow-primary/15 transition hover:-translate-y-0.5">
                  <UploadCloud className="size-4" aria-hidden="true" />
                  {uploadedResume ? "Replace" : "Choose resume"}
                  <input type="file" accept=".pdf,.docx,.txt" onChange={(event) => { handleFileUpload(event.target.files?.[0]); event.currentTarget.value = ""; }} className="sr-only" />
                </label>
                {uploadedResume ? <button type="button" onClick={() => { setUploadedResume(null); setResumeText(""); setCandidateEmail(""); setCandidatePhone(""); clearGenerated(); }} className="grid size-10 cursor-pointer place-items-center rounded-full border border-blue-950/10 bg-white text-slate-500 transition hover:border-rose-300 hover:text-rose-600 dark:border-white/10 dark:bg-white/7" aria-label="Remove uploaded resume"><X className="size-4" aria-hidden="true" /></button> : null}
                {savedAvailable ? <ActionButton label="Restore last" icon={Sparkles} onClick={restoreLast} /> : null}
              </div>
              {uploadProgress > 0 ? <div className="sm:col-span-2"><div className="h-1.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-[image:var(--button-solid)] transition-[width]" style={{ width: `${uploadProgress}%` }} /></div></div> : null}
            </div>

            {detectedSummary ? <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-xs leading-5 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-100"><CheckCircle2 className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" /><span>{detectedSummary}</span></div> : null}

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3" role="tablist" aria-label="Additional resume inputs">
              {([
                ["resume-text", "Paste resume text", !uploadedResume && resumeWords ? `${resumeWords} words` : "Use text instead"],
                ["job-match", "Match a job", jobDescription ? "Job added" : "Optional"],
                ["preferences", "Fine-tune", selectedSkills.length ? `${selectedSkills.length} skills` : "Optional"],
              ] as const).map(([panel, label, meta]) => {
                const isActive = activeInputPanel === panel;
                return (
                  <button key={panel} type="button" role="tab" aria-selected={isActive} aria-expanded={isActive} aria-controls={`resume-input-${panel}`} onClick={() => setActiveInputPanel(isActive ? null : panel)} className={`group flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition duration-200 ${isActive ? "border-primary/35 bg-blue-50 text-primary shadow-sm dark:border-emerald-300/30 dark:bg-emerald-400/10 dark:text-emerald-200" : "border-blue-950/10 bg-white text-slate-800 hover:border-primary/25 hover:bg-blue-50/60 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-100"}`}>
                    <span className="text-sm font-semibold">{label}</span>
                    <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">{meta}<ChevronDown className={`size-3.5 transition-transform duration-300 ${isActive ? "rotate-180" : ""}`} aria-hidden="true" /></span>
                  </button>
                );
              })}
            </div>

            <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${activeInputPanel ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
              <div className="min-h-0 overflow-hidden">
                <div key={activeInputPanel} id={activeInputPanel ? `resume-input-${activeInputPanel}` : undefined} className="animate-in fade-in-0 slide-in-from-top-2 rounded-2xl border border-blue-950/10 bg-slate-50/80 p-3 duration-300 dark:border-white/10 dark:bg-white/[0.035] sm:p-4">
                  {activeInputPanel === "resume-text" ? (
                    <textarea value={resumeText} maxLength={30000} onChange={(event) => { setResumeText(event.target.value); setUploadedResume(null); setCandidateEmail(""); setCandidatePhone(""); clearGenerated(); }} rows={5} autoFocus placeholder="Paste your complete resume here…" className="w-full resize-y rounded-xl border border-blue-950/10 bg-white px-4 py-3 text-sm font-medium leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-white/[0.06] dark:text-white" />
                  ) : null}

                  {activeInputPanel === "job-match" ? (
                    <div className="grid items-start gap-3 lg:grid-cols-[minmax(0,1.7fr)_minmax(16rem,0.8fr)]">
                      <label className="grid gap-1.5">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Job description</span>
                        <textarea value={jobDescription} maxLength={12000} onChange={(event) => { setJobDescription(event.target.value); clearGenerated(); }} rows={5} autoFocus placeholder="Paste responsibilities and requirements…" className="w-full resize-y rounded-xl border border-blue-950/10 bg-white p-3 text-sm leading-6 outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-white/[0.06]" />
                        <span className="text-right text-[11px] text-slate-500">{jobDescription.length.toLocaleString()} / 12,000</span>
                      </label>
                      <SearchSelect key={targetRole} label="Target role" value={targetRole} onChange={(value) => { setTargetRole(value); clearGenerated(); }} options={roleOptions} />
                    </div>
                  ) : null}

                  {activeInputPanel === "preferences" ? (
                    <div className="grid items-start gap-3 xl:grid-cols-2">
                      <div className="grid gap-3">
                        <NumberField label="Experience" value={yearsExperience} onChange={(value) => { setYearsExperience(value); clearGenerated(); }} min={0} max={20} suffix={yearsExperience === 1 ? " year" : " years"} presets={[0, 1, 3, 5, 8, 11, 15]} note={experienceLabel} />
                        <ChoiceGrid label="Role family" value={roleFamily} options={roleFamilies} onChange={(value) => { setRoleFamily(value); clearGenerated(); }} />
                        <ChoiceGrid label="Output language" value={language} options={languageOptions} onChange={(value) => { setLanguage(value); clearGenerated(); }} />
                      </div>
                      <div className="grid gap-3">
                        <div className="rounded-[1.1rem] border border-blue-950/10 bg-white/82 p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100"><BarChart3 className="size-4 text-primary dark:text-emerald-200" aria-hidden="true" />Skills you already know</div>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {popularSkills.map((skill) => { const active = selectedSkills.some((item) => skillsMatch(item, skill)); return <button key={skill} type="button" onClick={() => toggleSkill(skill)} className={`cursor-pointer rounded-full border px-2.5 py-1.5 text-xs font-semibold transition ${active ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-300 dark:bg-emerald-300 dark:text-slate-950" : "border-blue-950/10 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/7 dark:text-slate-200"}`}>{skill}</button>; })}
                          </div>
                          <input value={customSkill} onChange={(event) => { setCustomSkill(event.target.value); clearGenerated(); }} placeholder="Other skills: Tableau, SAP, Unreal Engine…" className="mt-3 h-10 w-full rounded-xl border border-blue-950/10 bg-blue-50/60 px-3 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary/50 dark:border-white/10 dark:bg-white/[0.06] dark:text-white" />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <NumberField label="Target package" value={targetPackage} onChange={(value) => { setTargetPackage(value); clearGenerated(); }} min={0} max={100} suffix=" LPA" presets={[3, 6, 12, 25, 50]} />
                          <NumberField label="Daily prep time" value={dailyHours} onChange={(value) => { setDailyHours(value); clearGenerated(); }} min={1} max={10} suffix="h" presets={[1, 2, 3, 4, 6]} />
                        </div>
                        <label className="flex items-start gap-2.5 px-1 text-xs leading-5 text-slate-600 dark:text-slate-300"><input type="checkbox" checked={saveReport} onChange={(event) => { setSaveReport(event.target.checked); if (!event.target.checked) { try { window.localStorage.removeItem(storageKey); } catch {} setSavedAvailable(false); } }} className="mt-1" />Save my resume text and report on this device.</label>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-blue-950/8 pt-3 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p role="status" className="truncate text-xs font-medium text-slate-600 dark:text-slate-300">{actionMessage}</p>
              </div>
              <button type="button" disabled={isGenerating || isReadingFile || isDetectingProfile} onClick={() => void generateAnalysis()} className="inline-flex h-11 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-[image:var(--button-solid)] px-7 text-sm font-semibold !text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed sm:w-auto sm:min-w-56">
                <Sparkles className="size-4 animate-pulse" aria-hidden="true" />
                {isGenerating ? "Reviewing…" : isReadingFile ? "Reading resume…" : "Check my resume"}
              </button>
            </div>
          </fieldset>
        </div>

        {analysis ? <ResultPanel
          key={`${analysis.atsScore}-${analysis.editableResumeText.slice(0, 80)}`}
          ref={resultPanelRef}
          analysis={analysis}
          readiness={readiness}
          actionMessage={actionMessage}
          onCopy={copyReport}
          onDownload={downloadReport}
          onPrint={printReport}
          onShare={shareReport}
          onBuildResume={buildResumeFromReport}
          onRecheck={(nextResumeText) => void generateAnalysis(nextResumeText)}
          sourceResumeText={resumeText}
          uploadedResume={uploadedResume}
        /> : null}
      </div>

      {isGenerating ? <GenerationOverlay progress={progress} /> : null}
      <ToolToast toast={toast} onClose={() => setToast(null)} />
    </section>
  );
}

type ResultPanelProps = {
  analysis: ResumeAnalysis | null;
  sourceResumeText: string;
  uploadedResume: UploadedResume | null;
  readiness: { label: string; tone: string };
  actionMessage: string;
  onCopy: () => void;
  onDownload: () => void;
  onPrint: () => void;
  onShare: () => void;
  onBuildResume: (resumeText?: string) => void;
  onRecheck: (resumeText: string) => void;
};

type ResultTab = "overview" | "improve" | "keywords" | "writing" | "plan";

type ImprovementAction = {
  id: string;
  kind: "replace" | "skill" | "keyword";
  title: string;
  original?: string;
  replacement: string;
  reason: string;
  component: "Keywords" | "Skills" | "Impact" | "Clarity";
  impact: number;
  requiresTruth: boolean;
};

const ResultPanel = forwardRef<HTMLDivElement, ResultPanelProps>(function ResultPanel({
  analysis,
  sourceResumeText,
  uploadedResume,
  readiness,
  actionMessage,
  onCopy,
  onDownload,
  onPrint,
  onShare,
  onBuildResume,
  onRecheck,
}, ref) {
  const [activeResultTab, setActiveResultTab] = useState<ResultTab>("overview");
  const [workspaceText, setWorkspaceText] = useState(() => {
    const extractedText = analysis?.editableResumeText?.trim();
    return normalizeResumeBulletText(extractedText && !extractedText.startsWith("Resume text could not be extracted") ? extractedText : sourceResumeText);
  });
  const [appliedFixes, setAppliedFixes] = useState<string[]>([]);
  const [alreadyPresentFixes, setAlreadyPresentFixes] = useState<string[]>([]);
  const [undoStack, setUndoStack] = useState<Array<{ text: string; appliedFixes: string[] }>>([]);
  const [workspaceMessage, setWorkspaceMessage] = useState("");
  const [previewMode, setPreviewMode] = useState<"improved" | "original" | "edit">("improved");
  const [resumeDownloadOpen, setResumeDownloadOpen] = useState(false);

  if (!analysis) return null;

  const improvementActions = buildImprovementActions(analysis);
  const appliedActions = improvementActions.filter((item) => appliedFixes.includes(item.id));
  const projectedGain = appliedActions.reduce((total, item) => total + item.impact, 0);
  const projectedScore = clamp(analysis.atsScore + projectedGain, 0, 100);
  const findAction = (kind: ImprovementAction["kind"], term: string) => improvementActions.find((item) => item.kind === kind && item.replacement.toLowerCase() === term.toLowerCase());
  const writingActions = improvementActions.filter((item) => item.kind === "replace");
  const skillActions = improvementActions.filter((item) => item.kind === "skill");
  const keywordActions = improvementActions.filter((item) => item.kind === "keyword");

  const resultTabs = [
    { id: "overview" as const, label: "Overview", hint: "Main findings", icon: BarChart3 },
    { id: "improve" as const, label: "Improve resume", hint: "Apply fixes and recheck", count: improvementActions.length - appliedFixes.length, icon: PenLine },
    { id: "keywords" as const, label: "Keywords & skills", hint: "Matched and missing", count: analysis.missingKeywords.length + analysis.missingSkills.length, icon: Search },
    { id: "writing" as const, label: "Writing & format", hint: "Fixes and rewrites", count: analysis.grammarIssues.length + analysis.formattingIssues.length + analysis.bulletSuggestions.length, icon: FileText },
    { id: "plan" as const, label: "Recruiter plan", hint: "Prepare and improve", count: analysis.recruiterChecklist.length, icon: BriefcaseBusiness },
  ];

  const applyFix = (action: ImprovementAction) => {
    if (appliedFixes.includes(action.id)) return;
    if (action.kind !== "replace" && workspaceText.toLowerCase().includes(action.replacement.toLowerCase())) {
      setAlreadyPresentFixes((items) => items.includes(action.id) ? items : [...items, action.id]);
      setWorkspaceMessage(`${action.replacement} is already in your resume, so no duplicate was added.`);
      return;
    }
    const nextText = applyImprovementToResume(workspaceText, action);
    if (nextText === workspaceText) {
      setWorkspaceMessage("This sentence could not be matched safely. Open Edit text to make the change yourself, then recheck.");
      return;
    }
    setUndoStack((items) => [...items, { text: workspaceText, appliedFixes }].slice(-20));
    setWorkspaceText(nextText);
    setAppliedFixes((items) => [...items, action.id]);
    setWorkspaceMessage(`${action.title} applied. Recheck to confirm the actual score.`);
    trackAts("improvement_applied", { category: action.component.toLowerCase() });
  };

  const removeFix = (action: ImprovementAction) => {
    if (!appliedFixes.includes(action.id)) return;
    const nextText = removeImprovementFromResume(workspaceText, action);
    if (nextText === workspaceText) {
      setWorkspaceMessage("This change was edited after it was applied. Use Edit text to remove it safely.");
      return;
    }
    setUndoStack((items) => [...items, { text: workspaceText, appliedFixes }].slice(-20));
    setWorkspaceText(nextText);
    setAppliedFixes((items) => items.filter((item) => item !== action.id));
    setWorkspaceMessage(`${action.title} removed from the improved draft.`);
  };

  const applySafeFixes = () => {
    const safeActions = improvementActions.filter((item) => item.kind === "replace" && !appliedFixes.includes(item.id));
    if (!safeActions.length) {
      setWorkspaceMessage("All one-click writing fixes are already applied.");
      return;
    }
    let nextText = workspaceText;
    const appliedIds: string[] = [];
    safeActions.forEach((action) => {
      const candidate = applyImprovementToResume(nextText, action);
      if (candidate !== nextText) {
        nextText = candidate;
        appliedIds.push(action.id);
      }
    });
    if (!appliedIds.length) {
      setWorkspaceMessage("The suggested original lines were not found. Use the editor for manual changes.");
      return;
    }
    setUndoStack((items) => [...items, { text: workspaceText, appliedFixes }].slice(-20));
    setWorkspaceText(nextText);
    setAppliedFixes((items) => [...items, ...appliedIds]);
    setWorkspaceMessage(`${appliedIds.length} safe writing fixes applied. Review the text, then recheck.`);
    trackAts("safe_fixes_applied");
  };

  const undoLastFix = () => {
    const previous = undoStack.at(-1);
    if (!previous) return;
    setWorkspaceText(previous.text);
    setAppliedFixes(previous.appliedFixes);
    setUndoStack((items) => items.slice(0, -1));
    setWorkspaceMessage("Last suggested change undone.");
  };

  const downloadImprovedResume = async (format: "pdf" | "doc" | "txt") => {
    const candidateName = splitResumeSections(workspaceText)[0]?.heading || "improved-resume";
    const blob = format === "pdf"
      ? createImprovedResumePdfBlob(workspaceText)
      : format === "doc"
        ? await createImprovedResumeDocxBlob(workspaceText)
        : new Blob([workspaceText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugify(candidateName)}-improved-resume.${format === "doc" ? "docx" : format}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setResumeDownloadOpen(false);
    setWorkspaceMessage(`${format === "pdf" ? "PDF" : format === "doc" ? "Word" : "Text"} resume downloaded.`);
  };

  return (
    <div ref={ref} className="scroll-mt-24 overflow-hidden rounded-[1.35rem] border border-blue-950/10 bg-white/95 shadow-[0_24px_70px_-34px_rgba(15,53,104,0.42)] backdrop-blur dark:border-white/10 dark:bg-surface/92">
      <div className="grid gap-4 border-b border-blue-950/10 bg-[linear-gradient(120deg,rgba(43,168,255,0.10),rgba(34,181,115,0.07),transparent)] p-4 dark:border-white/10 sm:p-5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
        <div className="flex items-center gap-3">
          <ScoreRing score={analysis.atsScore} />
          <div className="lg:hidden">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary dark:text-emerald-200">ATS readiness</p>
            <p className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${getToneClasses(readiness.tone)}`}>{analysis.atsScore < 55 ? <AlertCircle className="size-3.5" aria-hidden="true" /> : <CheckCircle2 className="size-3.5" aria-hidden="true" />}{readiness.label}</p>
          </div>
        </div>
        <div className="min-w-0">
          <div className="hidden items-center gap-2 lg:flex"><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary dark:text-emerald-200">ATS readiness</span><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${getToneClasses(readiness.tone)}`}>{readiness.label}</span></div>
          <h3 className="mt-1 font-heading text-xl font-semibold leading-tight text-slate-950 dark:text-white sm:text-2xl">{analysis.roleFit}</h3>
          <p className="mt-1.5 max-w-4xl text-sm leading-5 text-slate-600 dark:text-slate-300">{analysis.summary}</p>
          <p className="mt-2 line-clamp-2 text-xs font-medium leading-5 text-emerald-900 dark:text-emerald-100">{analysis.verdict}</p>
        </div>
        <button type="button" onClick={() => onBuildResume(workspaceText)} className="inline-flex h-10 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-[image:var(--button-solid)] px-5 text-sm font-semibold !text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 lg:w-auto">
          <FileText className="size-4" aria-hidden="true" />Build improved resume
        </button>
      </div>

      <div className="grid gap-4 p-4 sm:p-5">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {analysis.componentScores.map((item) => <MetricBar key={item.label} label={item.label} score={item.score} />)}
        </div>

        <div className="rounded-2xl border border-blue-950/10 bg-slate-50/90 p-2.5 dark:border-white/10 dark:bg-white/[0.035]">
          <div className="mb-2 flex items-end justify-between gap-3 px-1">
            <div><h4 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-700 dark:text-slate-200">Explore your report</h4><p className="mt-0.5 text-[11px] text-slate-500">Choose a section to see its details</p></div>
            <span className="hidden text-[10px] font-semibold text-slate-400 sm:inline">5 report sections</span>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5" role="tablist" aria-label="ATS report sections">
            {resultTabs.map((tab) => {
              const active = activeResultTab === tab.id;
              const Icon = tab.icon;
              return <button key={tab.id} id={`result-tab-${tab.id}`} type="button" role="tab" aria-selected={active} aria-controls={`result-panel-${tab.id}`} onClick={() => setActiveResultTab(tab.id)} className={`group flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition duration-200 ${active ? "border-transparent bg-[image:var(--button-solid)] !text-white shadow-lg shadow-primary/20" : "border-blue-950/10 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-blue-50 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200"}`}>
                <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${active ? "bg-white/16" : "bg-blue-50 text-primary group-hover:bg-white dark:bg-white/8 dark:text-emerald-200"}`}><Icon className="size-4" aria-hidden="true" /></span>
                <span className="min-w-0 flex-1"><span className="block text-xs font-bold">{tab.label}</span><span className={`mt-0.5 block truncate text-[10px] ${active ? "text-white/75" : "text-slate-400"}`}>{tab.hint}</span></span>
                {typeof tab.count === "number" ? <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${active ? "bg-white/18 text-white" : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300"}`}>{tab.count}</span> : null}
                {active ? <span className="size-2 rounded-full bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.15)]" aria-hidden="true" /> : null}
              </button>;
            })}
          </div>
        </div>

        <div key={activeResultTab} id={`result-panel-${activeResultTab}`} role="tabpanel" aria-labelledby={`result-tab-${activeResultTab}`} className="animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
          {activeResultTab === "overview" ? (
            <div className="grid items-stretch gap-3 lg:grid-cols-3">
              <CompactList title="Top fixes" items={analysis.quickWins.slice(0, 3)} tone="priority" numbered />
              <CompactList title="Strengths" items={analysis.strengths} tone="positive" />
              <CompactList title="Weak areas" items={analysis.weakAreas} tone="warning" />
              <details className="rounded-xl border border-blue-950/10 px-3.5 py-3 text-xs leading-5 dark:border-white/10 lg:col-span-3"><summary className="cursor-pointer font-semibold text-slate-800 dark:text-slate-100">How this score was calculated</summary><p className="mt-2 text-slate-500 dark:text-slate-400">Free rule-based readiness estimate: Keywords 20%, Skills 20%, Projects 15%, Impact 20%, Structure 10%, Clarity 15%.</p><div className="mt-2 grid gap-x-5 gap-y-1 sm:grid-cols-2">{analysis.componentScores.map((item) => <p key={item.label}><strong>{item.label}:</strong> {item.reason}</p>)}</div></details>
            </div>
          ) : null}

          {activeResultTab === "improve" ? (
            <div className="grid gap-3">
              <div className="grid gap-3 rounded-2xl border border-emerald-200 bg-[linear-gradient(135deg,rgba(236,253,244,.96),rgba(239,248,255,.92))] p-4 dark:border-emerald-300/15 dark:bg-white/[0.05] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">Live improvement workspace</span><span className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">{appliedFixes.length} change{appliedFixes.length === 1 ? "" : "s"} applied</span></div>
                  <h4 className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">Improve the resume here, then confirm the new score.</h4>
                  <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">The projected score is a guide based on selected improvements. Run a fresh free check to confirm the result.</p>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 text-center shadow-sm dark:bg-slate-950"><div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Projected ATS score</div><div className="mt-1 font-heading text-3xl font-semibold text-emerald-700 dark:text-emerald-300">{projectedScore}<span className="ml-1 text-sm text-slate-400">/100</span></div><div className="mt-1 text-xs font-semibold text-emerald-700 dark:text-emerald-200">{projectedGain ? `+${projectedGain} potential` : "Choose a fix below"}</div></div>
              </div>

              <div className="grid gap-3 xl:grid-cols-[0.95fr_1.05fr]">
                <section className="rounded-xl border border-blue-950/10 p-4 dark:border-white/10">
                  <div className="flex flex-wrap items-center justify-between gap-2"><div><h4 className="text-sm font-semibold text-slate-950 dark:text-white">Suggested improvements</h4><p className="mt-1 text-xs text-slate-500">Use writing fixes or add only skills you can support.</p></div><button type="button" onClick={applySafeFixes} className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-primary/20 bg-blue-50 px-3 text-xs font-semibold text-primary transition hover:border-primary/45 dark:bg-white/8 dark:text-emerald-200"><Sparkles className="size-3.5" aria-hidden="true" />Apply writing fixes</button></div>
                  <div className="mt-3 grid gap-2">
                    {writingActions.length ? writingActions.map((item) => {
                      const isApplied = appliedFixes.includes(item.id);
                      return <article key={item.id} className={`rounded-xl border p-3 transition ${isApplied ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-300/20 dark:bg-emerald-400/10" : "border-blue-950/10 bg-slate-50/70 dark:border-white/10 dark:bg-white/[0.035]"}`}>
                        <div className="flex gap-3"><span className={`grid size-8 shrink-0 place-items-center rounded-lg ${isApplied ? "bg-emerald-600 text-white" : "bg-blue-100 text-primary dark:bg-white/10 dark:text-emerald-200"}`}>{isApplied ? <CheckCircle2 className="size-4" aria-hidden="true" /> : item.kind === "replace" ? <PenLine className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h5 className="text-xs font-semibold text-slate-950 dark:text-white">{item.title}</h5><span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-emerald-700 shadow-sm dark:bg-slate-950 dark:text-emerald-200">+{item.impact} {item.component}</span></div><p className="mt-1 text-[11px] leading-4 text-slate-500 dark:text-slate-400">{item.reason}</p>{item.original ? <p className="mt-2 rounded-lg bg-white/80 px-2 py-1.5 text-[11px] leading-4 text-slate-500 line-through dark:bg-white/[0.05]">{normalizeResumeBulletText(item.original)}</p> : null}<p className="mt-1.5 text-xs leading-5 text-slate-700 dark:text-slate-200">{item.replacement}</p>{item.requiresTruth ? <p className="mt-1.5 text-[10px] font-semibold text-amber-700 dark:text-amber-200">Add this only if you genuinely have it.</p> : null}</div></div>
                        <div className="mt-3 flex justify-end">{isApplied ? <button type="button" onClick={() => removeFix(item)} className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-emerald-300 bg-white px-3 text-[11px] font-semibold text-emerald-800 transition hover:border-rose-300 hover:text-rose-700 dark:border-emerald-300/30 dark:bg-slate-950 dark:text-emerald-200"><RotateCcw className="size-3" aria-hidden="true" />Remove</button> : <button type="button" onClick={() => applyFix(item)} className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-[image:var(--button-solid)] px-3 text-[11px] font-semibold text-white transition hover:-translate-y-0.5">{alreadyPresentFixes.includes(item.id) ? "Already included" : item.requiresTruth ? "I have this skill" : "Apply to resume"}<ArrowRight className="size-3" aria-hidden="true" /></button>}</div>
                      </article>;
                    }) : null}
                    {skillActions.length ? <ImprovementShelf title="Skills to verify" description={`${skillActions.length} skill gaps found in this review. Add only skills you have actually used.`} items={skillActions} appliedFixes={appliedFixes} onApply={applyFix} onRemove={removeFix} /> : null}
                    {keywordActions.length ? <ImprovementShelf title="Keywords to verify" description={`${keywordActions.length} keyword gaps found in this review. Add only terms that truthfully match your work.`} items={keywordActions} appliedFixes={appliedFixes} onApply={applyFix} onRemove={removeFix} /> : null}
                    {!improvementActions.length ? <p className="rounded-xl bg-slate-50 px-3 py-4 text-xs text-slate-500 dark:bg-white/[0.05]">No direct edits were generated. Use the editor to strengthen factual outcomes, then recheck.</p> : null}
                  </div>
                </section>

                <section className="rounded-xl border border-blue-950/10 p-4 dark:border-white/10">
                  <div className="flex flex-wrap items-center justify-between gap-2"><div><h4 className="text-sm font-semibold text-slate-950 dark:text-white">Resume preview</h4><p className="mt-1 text-xs text-slate-500">Applied changes appear here immediately.</p>{appliedActions.length ? <div className="mt-1.5 flex flex-wrap gap-2 text-[10px] font-semibold text-slate-500"><span className="inline-flex items-center gap-1"><span className="size-2 rounded-sm bg-blue-200 ring-1 ring-blue-300" />Rewritten</span><span className="inline-flex items-center gap-1"><span className="size-2 rounded-sm bg-emerald-200 ring-1 ring-emerald-300" />Added</span></div> : null}</div><div className="flex flex-wrap gap-1.5"><button type="button" onClick={() => setPreviewMode("improved")} className={`h-8 rounded-full px-3 text-[11px] font-semibold ${previewMode === "improved" ? "bg-primary text-white" : "border border-blue-950/10 bg-white text-slate-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200"}`}>Improved draft</button>{uploadedResume?.mimeType === "application/pdf" ? <button type="button" onClick={() => setPreviewMode("original")} className={`h-8 rounded-full px-3 text-[11px] font-semibold ${previewMode === "original" ? "bg-primary text-white" : "border border-blue-950/10 bg-white text-slate-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200"}`}>Original PDF</button> : null}<button type="button" onClick={() => setPreviewMode("edit")} className={`h-8 rounded-full px-3 text-[11px] font-semibold ${previewMode === "edit" ? "bg-primary text-white" : "border border-blue-950/10 bg-white text-slate-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200"}`}>Edit text</button><button type="button" onClick={() => setResumeDownloadOpen(true)} className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-blue-950/10 bg-white px-3 text-[11px] font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200"><Download className="size-3.5" aria-hidden="true" />Download</button><button type="button" disabled={!undoStack.length} onClick={undoLastFix} className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-blue-950/10 bg-white px-3 text-[11px] font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200"><Undo2 className="size-3.5" aria-hidden="true" />Undo</button></div></div>
                  <div className="mt-3 min-h-[31rem] overflow-hidden rounded-xl border border-blue-950/10 bg-slate-100 dark:border-white/10 dark:bg-slate-950">
                    {previewMode === "original" && uploadedResume?.mimeType === "application/pdf" ? <iframe title="Original uploaded resume" src={`data:application/pdf;base64,${uploadedResume.data}`} className="h-[31rem] w-full bg-white" /> : null}
                    {previewMode === "improved" ? <VisualResumePreview resumeText={workspaceText} appliedActions={appliedActions} /> : null}
                    {previewMode === "edit" ? <textarea value={workspaceText} onChange={(event) => { setWorkspaceText(event.target.value); setWorkspaceMessage("Manual edit added. Switch to Improved draft to see it formatted."); }} className="h-[31rem] w-full resize-none bg-white p-4 font-mono text-xs leading-5 text-slate-800 outline-none dark:bg-slate-950 dark:text-slate-100" aria-label="Editable resume text" /> : null}
                  </div>
                  <p role="status" className="mt-2 min-h-5 text-xs text-slate-500 dark:text-slate-400">{workspaceMessage || "Use the one-click fixes or type changes directly here."}</p>
                  <div className="mt-3 flex flex-col gap-2 border-t border-blue-950/10 pt-3 dark:border-white/10 sm:flex-row"><button type="button" onClick={() => onRecheck(workspaceText)} disabled={workspaceText.trim().length < 300} className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-[image:var(--button-solid)] px-4 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"><RefreshCw className="size-4" aria-hidden="true" />Recheck improved resume</button><button type="button" onClick={() => onBuildResume(workspaceText)} className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-blue-950/15 bg-white px-4 text-sm font-semibold text-primary transition hover:border-primary/40 dark:border-white/15 dark:bg-white/[0.06] dark:text-emerald-200"><FileText className="size-4" aria-hidden="true" />Open visual resume builder</button></div>
                </section>
              </div>
            </div>
          ) : null}

          {activeResultTab === "keywords" ? (
            <div className="grid items-start gap-3 lg:grid-cols-3">
              <TagCard title="Skills found" items={analysis.matchedSkills} tone="positive" />
              <ActionTagCard title="Missing keywords" items={analysis.missingKeywords} tone="warning" onApply={(term) => { const action = findAction("keyword", term); if (action) applyFix(action); }} onRemove={(term) => { const action = findAction("keyword", term); if (action) removeFix(action); }} appliedTerms={appliedActions.map((item) => item.replacement)} />
              <ActionTagCard title="Missing skills" items={analysis.missingSkills} tone="danger" onApply={(term) => { const action = findAction("skill", term); if (action) applyFix(action); }} onRemove={(term) => { const action = findAction("skill", term); if (action) removeFix(action); }} appliedTerms={appliedActions.map((item) => item.replacement)} />
              <div className="rounded-xl border border-blue-950/10 p-4 dark:border-white/10 lg:col-span-3">
                <div className="flex flex-wrap items-center justify-between gap-2"><h4 className="text-sm font-semibold text-slate-950 dark:text-white">{analysis.jobMatchScore == null ? "Job-specific match" : `Job description match · ${analysis.jobMatchScore}/100`}</h4>{analysis.jobMatchScore == null ? <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-primary dark:bg-white/8">Add a job description to enable</span> : null}</div>
                {analysis.jobRequirements.length ? <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">{analysis.jobRequirements.map((item, index) => <div key={index} className="rounded-lg bg-slate-50 p-3 dark:bg-white/[0.05]"><div className="flex items-start justify-between gap-2"><strong className="text-xs">{item.keyword}</strong><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${item.status === "matched" ? "bg-emerald-100 text-emerald-800" : item.status === "partial" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"}`}>{item.status}</span></div><p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-500 dark:text-slate-400">{item.evidence}</p></div>)}</div> : <p className="mt-2 text-xs leading-5 text-slate-500">Add the target job description above and run the check again to compare exact requirements.</p>}
              </div>
            </div>
          ) : null}

          {activeResultTab === "writing" ? (
            <div className="grid items-start gap-3 lg:grid-cols-2">
              <SuggestionCard title="Grammar & writing" items={analysis.grammarIssues} onApply={(item) => { const action = improvementActions.find((candidate) => candidate.original === item.original && candidate.replacement === item.suggestion); if (action) applyFix(action); }} onRemove={(item) => { const action = improvementActions.find((candidate) => candidate.original === item.original && candidate.replacement === item.suggestion); if (action) removeFix(action); }} appliedItems={appliedActions} />
              <SuggestionCard title="Bullet improvements" items={analysis.bulletSuggestions} onApply={(item) => { const action = improvementActions.find((candidate) => candidate.original === item.original && candidate.replacement === item.suggestion); if (action) applyFix(action); }} onRemove={(item) => { const action = improvementActions.find((candidate) => candidate.original === item.original && candidate.replacement === item.suggestion); if (action) removeFix(action); }} appliedItems={appliedActions} />
              <div className="rounded-xl border border-blue-950/10 p-4 dark:border-white/10 lg:col-span-2"><h4 className="text-sm font-semibold text-slate-950 dark:text-white">Formatting review</h4><p className="mt-1 text-xs leading-5 text-slate-500">{analysis.formattingNote}</p>{analysis.formattingIssues.length ? <div className="mt-3 grid gap-2 sm:grid-cols-2">{analysis.formattingIssues.map((item, index) => <div key={index} className="rounded-lg bg-slate-50 p-3 dark:bg-white/[0.05]"><p className="text-xs font-semibold">{item.issue}</p><p className="mt-1 text-[11px] leading-4 text-slate-500">{item.evidence}</p><p className="mt-1.5 text-xs leading-5">{item.suggestion}</p></div>)}</div> : <p className="mt-2 text-xs text-slate-500">No specific formatting issues were flagged.</p>}</div>
            </div>
          ) : null}

          {activeResultTab === "plan" ? (
            <div className="grid items-start gap-3 lg:grid-cols-2">
              <CompactList title="Recruiter checklist" items={analysis.recruiterChecklist} tone="positive" />
              <CompactList title="Interview questions" items={analysis.interviewQuestions} />
              <CompactList title="Projects worth adding" items={analysis.projectsToAdd} tone="priority" />
              <RoadmapCard roadmap={analysis.roadmap} />
              <div className="rounded-xl border border-blue-950/10 bg-blue-50/60 p-3 text-xs leading-5 text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300 lg:col-span-2"><strong className="text-slate-950 dark:text-white">Salary context:</strong> {analysis.salaryRange}</div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 border-t border-blue-950/10 pt-3 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">{actionMessage}</p>
          <div className="flex flex-wrap gap-2">
            <ActionButton label="Copy" icon={Copy} onClick={onCopy} />
            <ActionButton label="Share" icon={Share2} onClick={onShare} />
            <ActionButton label="Print" icon={Printer} onClick={onPrint} />
            <ActionButton label="Download PDF" icon={Download} onClick={onDownload} />
          </div>
        </div>
      </div>
      {resumeDownloadOpen ? <ImprovedResumeDownloadModal onClose={() => setResumeDownloadOpen(false)} onDownload={downloadImprovedResume} /> : null}
    </div>
  );
});

function buildImprovementActions(analysis: ResumeAnalysis): ImprovementAction[] {
  const actions: ImprovementAction[] = [];
  const getImpact = (component: ImprovementAction["component"]) => {
    const score = analysis.componentScores.find((item) => item.label.toLowerCase() === component.toLowerCase())?.score ?? 70;
    if (score < 55) return 4;
    if (score < 70) return 3;
    if (score < 85) return 2;
    return 1;
  };
  const addReplaceAction = (item: { original: string; suggestion: string; reason: string }, component: ImprovementAction["component"], impact: number, label: string) => {
    const original = item.original.trim();
    const replacement = item.suggestion.trim();
    if (!original || !replacement || original.toLowerCase() === replacement.toLowerCase()) return;
    actions.push({
      id: `${component}-${original.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 48)}`,
      kind: "replace",
      title: label,
      original,
      replacement,
      reason: item.reason,
      component,
      impact,
      requiresTruth: false,
    });
  };
  analysis.grammarIssues.slice(0, 3).forEach((item) => addReplaceAction(item, "Clarity", getImpact("Clarity"), "Improve writing"));
  analysis.bulletSuggestions.slice(0, 4).forEach((item) => addReplaceAction(item, "Impact", getImpact("Impact"), "Strengthen a bullet"));

  const knownTerms = new Set([...analysis.missingSkills, ...analysis.missingKeywords].map((item) => item.toLowerCase()));
  // The analysis decides which gaps belong to this resume. Do not cap the
  // list here: hiding later items made the workspace look like a fixed demo.
  analysis.missingSkills.forEach((skill) => {
    const cleanSkill = skill.trim();
    if (!cleanSkill) return;
    actions.push({
      id: `skill-${cleanSkill.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 48)}`,
      kind: "skill",
      title: `Add ${cleanSkill}`,
      replacement: cleanSkill,
      reason: "Add it to the Skills section only if you have used it and can discuss it in an interview.",
      component: "Skills",
      impact: getImpact("Skills"),
      requiresTruth: true,
    });
  });
  analysis.missingKeywords.filter((keyword) => !knownTerms.has(keyword.toLowerCase()) || !analysis.missingSkills.some((skill) => skill.toLowerCase() === keyword.toLowerCase())).forEach((keyword) => {
    const cleanKeyword = keyword.trim();
    if (!cleanKeyword) return;
    actions.push({
      id: `keyword-${cleanKeyword.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 48)}`,
      kind: "keyword",
      title: `Add keyword: ${cleanKeyword}`,
      replacement: cleanKeyword,
      reason: "Use this only where it accurately describes your actual work, project, coursework, or certification.",
      component: "Keywords",
      impact: getImpact("Keywords"),
      requiresTruth: true,
    });
  });
  // Every term shown in the report must have a matching action. Keeping only a
  // small subset here made later "Add" buttons appear interactive while doing
  // nothing, which is especially confusing in a resume editor.
  return actions.filter((item, index, all) => all.findIndex((candidate) => candidate.id === item.id) === index);
}

function applyImprovementToResume(resumeText: string, action: ImprovementAction) {
  if (action.kind === "replace" && action.original) {
    const exactPosition = resumeText.toLowerCase().indexOf(action.original.toLowerCase());
    if (exactPosition >= 0) return `${resumeText.slice(0, exactPosition)}${action.replacement}${resumeText.slice(exactPosition + action.original.length)}`;
    const flexibleMatch = findFlexiblePhraseMatch(resumeText, action.original);
    if (!flexibleMatch) return resumeText;
    const beforeMatch = resumeText.slice(0, flexibleMatch.index);
    const leadingBullet = beforeMatch.match(/([•])\s*$/);
    const remainder = resumeText.slice(flexibleMatch.index + flexibleMatch[0].length);
    // The flexible matcher deliberately excludes punctuation to survive PDF line
    // breaks. Do not leave the source period behind when the suggested sentence
    // already supplies its own ending.
    const cleanRemainder = /[.!?]$/.test(action.replacement) && /^[.!?]/.test(remainder) ? remainder.replace(/^[.!?]+/, "") : remainder;
    if (leadingBullet) {
      const bulletStart = beforeMatch.length - leadingBullet[0].length;
      return `${resumeText.slice(0, bulletStart)}${leadingBullet[1]} ${action.replacement}${cleanRemainder}`;
    }
    return `${beforeMatch}${action.replacement}${cleanRemainder}`;
  }
  const normalizedText = resumeText.toLowerCase();
  if (normalizedText.includes(action.replacement.toLowerCase())) return resumeText;
  const skillsHeading = /(^|\n)[ \t]*((?:core[ \t]+)?(?:technical[ \t]+)?skills?)[ \t]*:?[ \t]*/i.exec(resumeText);
  if (skillsHeading) {
    const insertAt = skillsHeading.index + skillsHeading[0].length;
    const rest = resumeText.slice(insertAt);
    const lineOffset = rest.startsWith("\n") ? 1 : 0;
    const firstLineEnd = rest.indexOf("\n", lineOffset);
    if (firstLineEnd >= 0) {
      const existingSkills = rest.slice(lineOffset, firstLineEnd).trim();
      const separator = existingSkills && !/[,:;]$/.test(existingSkills) ? ", " : " ";
      const start = rest.startsWith("\n") ? "\n" : "";
      return `${resumeText.slice(0, insertAt)}${start}${existingSkills}${separator}${action.replacement}${rest.slice(firstLineEnd)}`;
    }
  }
  return `${resumeText.trim()}\n\nSkills\n${action.replacement}\n`;
}

function removeImprovementFromResume(resumeText: string, action: ImprovementAction) {
  if (action.kind === "replace" && action.original) {
    const position = resumeText.toLowerCase().indexOf(action.replacement.toLowerCase());
    if (position < 0) return resumeText;
    const beforeReplacement = resumeText.slice(0, position);
    const originalWithoutRepeatedBullet = /^[•]/.test(action.original) && /[•]\s*$/.test(beforeReplacement) ? action.original.replace(/^[•]\s*/, "") : action.original;
    return `${beforeReplacement}${originalWithoutRepeatedBullet}${resumeText.slice(position + action.replacement.length)}`;
  }
  const position = resumeText.toLowerCase().indexOf(action.replacement.toLowerCase());
  if (position < 0) return resumeText;
  let start = position;
  let end = position + action.replacement.length;
  const before = resumeText.slice(0, start);
  const after = resumeText.slice(end);
  if (/,[ \t]*$/.test(before)) start = before.lastIndexOf(",");
  else if (/^[ \t]*,/.test(after)) end += after.match(/^[ \t]*,/)![0].length;
  return `${resumeText.slice(0, start)}${resumeText.slice(end)}`.replace(/[ \t]+\n/g, "\n").replace(/,\s*,/g, ",");
}

function findFlexiblePhraseMatch(resumeText: string, phrase: string) {
  const words = phrase.match(/[a-z0-9]+/gi) || [];
  if (words.length < 3) return null;
  const expression = new RegExp(words.map(escapeRegExp).join("[^a-z0-9]+"), "i");
  return expression.exec(resumeText);
}

function VisualResumePreview({ resumeText, appliedActions }: { resumeText: string; appliedActions: ImprovementAction[] }) {
  const appliedTerms = appliedActions.filter((action) => action.kind !== "replace").map((action) => action.replacement);
  const rewrittenPhrases = appliedActions.filter((action) => action.kind === "replace").map((action) => action.replacement);
  const sections = mergeSkillSections(splitResumeSections(resumeText));
  return <article className="h-[31rem] overflow-y-auto bg-white p-5 text-slate-800 shadow-inner sm:p-7 dark:bg-slate-950 dark:text-slate-100">
    {sections.map((section, index) => <section key={`${section.heading}-${index}`} className={index ? "mt-6 border-t border-slate-200 pt-5 dark:border-white/10" : ""}>
      {index === 0 ? <div className="border-b-2 border-primary pb-4"><h5 className="font-heading text-2xl font-semibold text-slate-950 dark:text-white">{section.heading || "Resume draft"}</h5><div className="mt-2 whitespace-pre-line text-xs leading-5 text-slate-600 dark:text-slate-300"><HighlightedResumeText text={section.content} terms={appliedTerms} rewrittenPhrases={rewrittenPhrases} /></div></div> : <><h6 className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary dark:text-emerald-200">{section.heading}</h6><ResumeSectionContent heading={section.heading} content={section.content} appliedTerms={appliedTerms} rewrittenPhrases={rewrittenPhrases} /></>}
    </section>)}
  </article>;
}

function mergeSkillSections(sections: Array<{ heading: string; content: string }>) {
  const skillIndexes = sections.flatMap((section, index) => /skills?/i.test(section.heading) ? [index] : []);
  if (skillIndexes.length < 2) return sections;
  const [primaryIndex, ...extraIndexes] = skillIndexes;
  const extraContent = extraIndexes.map((index) => sections[index].content).filter(Boolean).join(", ");
  return sections.flatMap((section, index) => {
    if (extraIndexes.includes(index)) return [];
    if (index !== primaryIndex) return [section];
    return [{ ...section, content: [section.content, extraContent].filter(Boolean).join(", ") }];
  });
}

function ResumeSectionContent({ heading, content, appliedTerms, rewrittenPhrases }: { heading: string; content: string; appliedTerms: string[]; rewrittenPhrases: string[] }) {
  const isSkillsSection = /skills?/i.test(heading);
  if (isSkillsSection) {
    const skills = content.split(/[\n,|•]+/).map((item) => item.trim()).filter(Boolean);
    return <div className="mt-3 flex flex-wrap gap-2">{skills.map((skill, index) => {
      const isNew = appliedTerms.some((term) => term.toLowerCase() === skill.toLowerCase());
      return <span key={`${skill}-${index}`} className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${isNew ? "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-sm dark:border-emerald-300/30 dark:bg-emerald-400/15 dark:text-emerald-100" : "border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200"}`}>{skill}{isNew ? <span className="ml-1 text-[10px]">New</span> : null}</span>;
    })}</div>;
  }
  const lines = getResumeLines(content);
  if (isSummaryHeading(heading)) return <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200"><HighlightedResumeText text={joinResumeLines(lines)} terms={appliedTerms} rewrittenPhrases={rewrittenPhrases} /></p>;
  if (isExperienceHeading(heading)) {
    const entries = parseExperienceEntries(lines);
    return <div className="mt-3 grid gap-5 text-sm leading-6 text-slate-700 dark:text-slate-200">
      {entries.map((entry, entryIndex) => <div key={`${entry.title}-${entry.period}-${entryIndex}`}>
        <div className="mb-3 rounded-lg border-l-2 border-primary/70 bg-slate-50 px-3 py-2.5 dark:border-emerald-300 dark:bg-white/[0.04]">
          <p className="font-semibold text-slate-900 dark:text-white"><HighlightedResumeText text={entry.title} terms={appliedTerms} rewrittenPhrases={rewrittenPhrases} /></p>
          {entry.period ? <p className="text-xs font-medium text-slate-500 dark:text-slate-400"><HighlightedResumeText text={entry.period} terms={appliedTerms} rewrittenPhrases={rewrittenPhrases} /></p> : null}
        </div>
        {entry.achievements.length ? <ul className="grid gap-2">{entry.achievements.map((line, index) => <li key={`${line}-${index}`} className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary dark:bg-emerald-300" /><span><HighlightedResumeText text={line} terms={appliedTerms} rewrittenPhrases={rewrittenPhrases} /></span></li>)}</ul> : null}
      </div>)}
    </div>;
  }
  if (/projects?/i.test(heading)) {
    const projects = parseProjectEntries(lines);
    return <div className="mt-3 grid gap-5 text-sm leading-6 text-slate-700 dark:text-slate-200">{projects.map((project, projectIndex) => <div key={`${project.title}-${projectIndex}`}>
      <p className="mb-2 font-semibold text-slate-900 dark:text-white"><HighlightedResumeText text={project.title} terms={appliedTerms} rewrittenPhrases={rewrittenPhrases} /></p>
      {project.achievements.length ? <ul className="grid gap-2">{project.achievements.map((line, index) => <li key={`${line}-${index}`} className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary dark:bg-emerald-300" /><span><HighlightedResumeText text={line} terms={appliedTerms} rewrittenPhrases={rewrittenPhrases} /></span></li>)}</ul> : null}
    </div>)}</div>;
  }
  const hasBullets = lines.some((line) => hasResumeBullet(line));
  if (hasBullets) return <ul className="mt-2.5 grid gap-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{groupResumeBulletLines(lines).map((line, index) => <li key={`${line}-${index}`} className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary dark:bg-emerald-300" /><span><HighlightedResumeText text={line} terms={appliedTerms} rewrittenPhrases={rewrittenPhrases} /></span></li>)}</ul>;
  return <div className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{lines.map((line, index) => <p key={`${line}-${index}`} className={index ? "mt-1" : ""}><HighlightedResumeText text={line} terms={appliedTerms} rewrittenPhrases={rewrittenPhrases} /></p>)}</div>;
}

function getResumeLines(content: string) {
  return content.split("\n").map((line) => line.trim()).filter(Boolean);
}

function hasResumeBullet(line: string) {
  return /^(?:[-•–]|\d+[.)])\s+/.test(line);
}

function removeResumeBullet(line: string) {
  return line.replace(/^(?:[-•–]|\d+[.)])\s+/, "").trim();
}

function joinResumeLines(lines: string[]) {
  return lines.map(removeResumeBullet).join(" ").replace(/\s{2,}/g, " ").trim();
}

function isSummaryHeading(heading: string) {
  return /^(?:professional )?(?:summary|profile)$/i.test(heading.trim());
}

function isExperienceHeading(heading: string) {
  return /(?:professional |work )?experience|employment/i.test(heading);
}

function isDateOrPeriodLine(line: string) {
  return /\b(?:19|20)\d{2}\b|\bpresent\b|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\b/i.test(line);
}

function startsExperienceAchievement(line: string) {
  return /^(?:achieved|architected|built|collaborated|created|delivered|designed|developed|drove|enhanced|handled|implemented|improved|integrated|led|managed|mentored|optimized|owned|played|reduced|spearheaded|streamlined|supported|worked)\b/i.test(line);
}

function isPositionHeading(line: string) {
  return line.includes("|") && /\b(?:developer|engineer|architect|manager|designer|analyst|consultant|intern|specialist|lead|director|officer|associate|founder)\b/i.test(line) && !startsExperienceAchievement(line);
}

function parseExperienceEntries(lines: string[]) {
  const cleanLines = lines.map(removeResumeBullet);
  const positionIndexes = cleanLines.flatMap((line, index) => isPositionHeading(line) ? [index] : []);
  if (!positionIndexes.length) {
    const firstAchievementIndex = cleanLines.findIndex(startsExperienceAchievement);
    const splitAt = firstAchievementIndex >= 0 ? firstAchievementIndex : 0;
    return [{ title: joinResumeLines(cleanLines.slice(0, splitAt)), period: "", achievements: groupExperienceAchievementLines(cleanLines.slice(splitAt)) }];
  }
  return positionIndexes.map((positionIndex, entryIndex) => {
    const entryLines = cleanLines.slice(positionIndex, positionIndexes[entryIndex + 1] ?? cleanLines.length);
    const dateIndex = entryLines.findIndex(isDateOrPeriodLine);
    const firstAchievementIndex = entryLines.findIndex(startsExperienceAchievement);
    const detailsEnd = dateIndex >= 0 ? dateIndex : firstAchievementIndex >= 0 ? firstAchievementIndex : entryLines.length;
    const achievementStart = dateIndex >= 0 ? dateIndex + 1 : detailsEnd;
    return {
      title: joinResumeLines(entryLines.slice(0, detailsEnd)),
      period: dateIndex >= 0 ? entryLines[dateIndex] : "",
      achievements: groupExperienceAchievementLines(entryLines.slice(achievementStart)),
    };
  });
}

function groupExperienceAchievementLines(lines: string[]) {
  const grouped: string[] = [];
  lines.forEach((line) => {
    if (!line) return;
    if (startsExperienceAchievement(line) || !grouped.length) grouped.push(line);
    else grouped[grouped.length - 1] = `${grouped[grouped.length - 1]} ${line}`.replace(/\s{2,}/g, " ");
  });
  return grouped;
}

function groupResumeBulletLines(lines: string[]) {
  const grouped: string[] = [];
  lines.forEach((line) => {
    const text = removeResumeBullet(line);
    if (!text) return;
    if (hasResumeBullet(line) || !grouped.length) grouped.push(text);
    else grouped[grouped.length - 1] = `${grouped[grouped.length - 1]} ${text}`.replace(/\s{2,}/g, " ");
  });
  return grouped;
}

function parseProjectEntries(lines: string[]) {
  const cleanLines = lines.map(removeResumeBullet);
  const headingIndexes = cleanLines.flatMap((line, index) => line.includes("|") && !startsExperienceAchievement(line) ? [index] : []);
  if (!headingIndexes.length) return [{ title: "", achievements: groupExperienceAchievementLines(cleanLines) }];
  return headingIndexes.map((headingIndex, index) => {
    const projectLines = cleanLines.slice(headingIndex, headingIndexes[index + 1] ?? cleanLines.length);
    const firstAchievementIndex = projectLines.findIndex(startsExperienceAchievement);
    const detailsEnd = firstAchievementIndex >= 0 ? firstAchievementIndex : projectLines.length;
    return { title: joinResumeLines(projectLines.slice(0, detailsEnd)), achievements: groupExperienceAchievementLines(projectLines.slice(detailsEnd)) };
  });
}

function HighlightedResumeText({ text, terms, rewrittenPhrases = [] }: { text: string; terms: string[]; rewrittenPhrases?: string[] }) {
  const highlights = [...rewrittenPhrases.map((value) => ({ value, kind: "rewrite" as const })), ...terms.map((value) => ({ value, kind: "add" as const }))].filter((item) => item.value).sort((left, right) => right.value.length - left.value.length);
  if (!highlights.length) return <>{text}</>;
  const expression = new RegExp(`(${highlights.map((item) => escapeRegExp(item.value)).join("|")})`, "gi");
  return <>{text.split(expression).map((part, index) => {
    const highlight = highlights.find((item) => item.value.toLowerCase() === part.toLowerCase());
    if (!highlight) return part;
    return <mark key={`${part}-${index}`} title={highlight.kind === "rewrite" ? "Suggested rewrite" : "Added to resume"} className={`rounded px-1 font-semibold ${highlight.kind === "rewrite" ? "bg-blue-100 text-blue-900 ring-1 ring-blue-200 dark:bg-blue-400/25 dark:text-blue-100" : "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200 dark:bg-emerald-400/25 dark:text-emerald-100"}`}>{part}</mark>;
  })}</>;
}

function splitResumeSections(value: string) {
  const lines = recoverResumeStructure(normalizeResumeBulletText(value)).split("\n").map((line) => line.trim()).filter(Boolean);
  const headingPattern = /^(professional summary|summary|profile|experience|professional experience|work experience|employment|projects?|selected projects|technical skills|core technical skills|skills|education|certifications?|achievements?|additional strengths|contact)$/i;
  const sections: Array<{ heading: string; content: string }> = [];
  const header = splitResumeHeader(lines.shift() || "Resume draft");
  let current = { heading: header.heading, content: header.content };
  lines.forEach((line) => {
    if (headingPattern.test(line.replace(/:$/, ""))) {
      sections.push(current);
      current = { heading: line.replace(/:$/, ""), content: "" };
      return;
    }
    current.content = current.content ? `${current.content}\n${line}` : line;
  });
  sections.push(current);
  return sections.filter((section) => section.heading || section.content);
}

function splitResumeHeader(line: string) {
  const match = line.match(/^([A-Z][A-Za-zÀ-ÿ.'-]+(?:\s+[A-Z][A-Za-zÀ-ÿ.'-]+){1,2}?)(?=\s+(?:Senior|Junior|Lead|Principal|Staff|Full Stack|Frontend|Backend|Software|Web|Data|Cloud|DevOps|Product|Project|Engineering|UI\/UX|Graphic|Digital|Finance|HR|Operations|Sales|Customer|Teacher|Academic)\b)/);
  if (!match) return { heading: line, content: "" };
  return { heading: match[1], content: line.slice(match[1].length).trim() };
}

function normalizeResumeBulletText(value: string) {
  return value.replace(/[\uF0B7\u25AA\u25CF\u2023]/g, "•").replace(/^•\s*/gm, "• ");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getSupportedMimeType(file: File) {
  const name = file.name.toLowerCase();
  if (file.type === "application/pdf" || name.endsWith(".pdf")) return "application/pdf";
  if (file.type === "application/msword" || name.endsWith(".doc")) return "application/msword";
  if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || name.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (file.type.startsWith("text/") || name.endsWith(".txt")) return "text/plain";
  return "";
}

async function extractReadableTextFromUpload(file: File, mimeType: string) {
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return result.value.trim();
  }
  if (mimeType === "text/plain") return (await file.text()).trim();
  if (mimeType === "application/pdf") {
    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
    const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
    const document = await task.promise;
    const pages: string[] = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      const textItems = content.items.flatMap((item) => "str" in item && item.str.trim()
        ? [{ text: item.str.trim(), x: item.transform[4], y: item.transform[5], width: item.width, hasEol: item.hasEOL }]
        : []);
      const rows: Array<{ y: number; items: typeof textItems }> = [];
      textItems.sort((left, right) => Math.abs(right.y - left.y) > 2 ? right.y - left.y : left.x - right.x).forEach((item) => {
        const row = rows.find((candidate) => Math.abs(candidate.y - item.y) <= 2);
        if (row) row.items.push(item);
        else rows.push({ y: item.y, items: [item] });
      });
      const pageText = rows
        .sort((left, right) => right.y - left.y)
        .map((row) => row.items.sort((left, right) => left.x - right.x).map((item) => item.text).join(" "))
        .join("\n");
      pages.push(pageText);
    }
    await task.destroy();
    return recoverResumeStructure(pages.join("\n\n"));
  }
  return "";
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function parseSavedReport(raw: string) {
  try {
    return JSON.parse(raw) as Partial<SavedResumeAnalysis>;
  } catch {
    return null;
  }
}

function deriveNameFromResume(fileName?: string) {
  if (!fileName) return "";
  const clean = fileName
    .replace(/\.(pdf|docx?|txt)$/i, "")
    .replace(/resume|cv|ats|latest|final|updated/gi, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return clean
    .split(" ")
    .filter(Boolean)
    .slice(0, 4)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function slugify(value: string) {
  return (value || "resume")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "resume";
}

function normalizeSkill(value: string) {
  return value
    .toLowerCase()
    .replace(/\b(html|css)\s*\d+\b/g, "$1")
    .replace(/\bjavascript\s*es\d+\+?\b/g, "javascript")
    .replace(/\bjs\b/g, "javascript")
    .replace(/\breact\.?js\b/g, "react")
    .replace(/\bnode\.?js\b/g, "node")
    .replace(/\bnext\.?js\b/g, "next")
    .replace(/\bnest\.?js\b/g, "nest")
    .replace(/[^a-z0-9+#.]+/g, " ")
    .trim();
}

function skillsMatch(left: string, right: string) {
  const leftSkill = normalizeSkill(left);
  const rightSkill = normalizeSkill(right);
  return leftSkill === rightSkill || leftSkill.startsWith(`${rightSkill} `) || rightSkill.startsWith(`${leftSkill} `);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[char] || char);
}

function escapeXml(value: string) {
  return escapeHtml(value).replace(/\r?\n/g, " ");
}

function resumeExportData(resumeText: string) {
  const sections = splitResumeSections(resumeText);
  return { header: sections[0] || { heading: "Your name", content: "" }, sections: sections.slice(1) };
}

function createImprovedResumeDocxBlob(resumeText: string) {
  const { header, sections } = resumeExportData(resumeText);
  const paragraph = (text: string, options: { bold?: boolean; size?: number; color?: string; center?: boolean; before?: number; after?: number; bullet?: boolean } = {}) => {
    const properties = `<w:pPr>${options.center ? "<w:jc w:val=\"center\"/>" : ""}${options.before ? `<w:spacing w:before=\"${options.before}\"/>` : ""}${options.after ? `<w:spacing w:after=\"${options.after}\"/>` : ""}</w:pPr>`;
    const run = `<w:r><w:rPr>${options.bold ? "<w:b/>" : ""}${options.size ? `<w:sz w:val=\"${options.size}\"/>` : ""}${options.color ? `<w:color w:val=\"${options.color}\"/>` : ""}</w:rPr><w:t xml:space=\"preserve\">${escapeXml(options.bullet ? `• ${text}` : text)}</w:t></w:r>`;
    return `<w:p>${properties}${run}</w:p>`;
  };
  const renderSection = (section: { heading: string; content: string }) => {
    const lines = getResumeLines(section.content);
    const heading = paragraph(section.heading.toUpperCase(), { bold: true, size: 22, color: "164AA8", before: 180, after: 90 });
    if (isSkillsSectionName(section.heading)) return `${heading}${paragraph(joinResumeLines(lines), { size: 20, after: 80 })}`;
    if (isSummaryHeading(section.heading)) return `${heading}${paragraph(joinResumeLines(lines), { size: 20, after: 80 })}`;
    if (isExperienceHeading(section.heading)) return `${heading}${parseExperienceEntries(lines).map((entry) => `${paragraph(entry.title, { bold: true, size: 20, after: 30 })}${entry.period ? paragraph(entry.period, { size: 18, color: "64748B", after: 30 }) : ""}${entry.achievements.map((item) => paragraph(item, { size: 20, bullet: true, after: 25 })).join("")}`).join("")}`;
    if (/projects?/i.test(section.heading)) return `${heading}${parseProjectEntries(lines).map((project) => `${project.title ? paragraph(project.title, { bold: true, size: 20, after: 30 }) : ""}${project.achievements.map((item) => paragraph(item, { size: 20, bullet: true, after: 25 })).join("")}`).join("")}`;
    const hasBullets = lines.some(hasResumeBullet);
    return `${heading}${hasBullets ? groupResumeBulletLines(lines).map((item) => paragraph(item, { size: 20, bullet: true, after: 25 })).join("") : lines.map((item) => paragraph(item, { size: 20, after: 35 })).join("")}`;
  };
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paragraph(header.heading, { bold: true, size: 36, color: "0B1830", after: 70 })}${paragraph(joinResumeLines(getResumeLines(header.content)), { size: 19, color: "475569", after: 120 })}${sections.map(renderSection).join("")}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="720" w:right="760" w:bottom="720" w:left="760"/></w:sectPr></w:body></w:document>`;
  const zip = new JSZip();
  zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>`);
  zip.folder("_rels")?.file(".rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
  zip.folder("word")?.file("document.xml", documentXml);
  zip.folder("word")?.file("styles.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Aptos" w:hAnsi="Aptos"/></w:rPr></w:rPrDefault></w:docDefaults></w:styles>`);
  zip.folder("word")?.folder("_rels")?.file("document.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>`);
  return zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
}

function isSkillsSectionName(heading: string) {
  return /skills?/i.test(heading);
}

function pdfSafeText(value: string) {
  return value.replace(/[–—]/g, "-").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[^\x20-\x7E]/g, "").replace(/[\\()]/g, (char) => `\\${char}`);
}

function wrapPdfText(value: string, size: number, width = 516) {
  const maxCharacters = Math.max(24, Math.floor(width / (size * 0.52)));
  const words = pdfSafeText(value).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxCharacters && line) { lines.push(line); line = word; } else line = next;
  });
  if (line) lines.push(line);
  return lines;
}

function createImprovedResumePdfBlob(resumeText: string) {
  const { header, sections } = resumeExportData(resumeText);
  const pageWidth = 595;
  const pageHeight = 842;
  const horizontalMargin = 48;
  const pages: string[] = [];
  let commands: string[] = [];
  let y = pageHeight - 48;
  const startPage = () => { commands = []; y = pageHeight - 48; };
  const finishPage = () => { pages.push(commands.join("\n")); };
  const line = (text: string, size = 10, bold = false, color = "0.12 0.17 0.25", indent = 0) => {
    const lines = wrapPdfText(text, size, pageWidth - horizontalMargin * 2 - indent);
    lines.forEach((part) => {
      if (y < 54) { finishPage(); startPage(); }
      commands.push(`${color} rg BT /F${bold ? 2 : 1} ${size} Tf 1 0 0 1 ${horizontalMargin + indent} ${y} Tm (${part}) Tj ET`);
      y -= size * 1.48;
    });
  };
  const spacer = (points = 6) => { y -= points; if (y < 54) { finishPage(); startPage(); } };
  startPage();
  line(header.heading, 22, true, "0.03 0.08 0.16");
  line(joinResumeLines(getResumeLines(header.content)), 9, false, "0.28 0.35 0.45");
  spacer(8);
  sections.forEach((section) => {
    if (y < 90) { finishPage(); startPage(); }
    line(section.heading.toUpperCase(), 10, true, "0.09 0.29 0.66");
    const lines = getResumeLines(section.content);
    if (isSkillsSectionName(section.heading) || isSummaryHeading(section.heading)) line(joinResumeLines(lines), 9.5);
    else if (isExperienceHeading(section.heading)) parseExperienceEntries(lines).forEach((entry) => { spacer(2); line(entry.title, 10, true); if (entry.period) line(entry.period, 8.5, false, "0.34 0.4 0.5"); entry.achievements.forEach((item) => line(`- ${item}`, 9, false, "0.12 0.17 0.25", 10)); });
    else if (/projects?/i.test(section.heading)) parseProjectEntries(lines).forEach((project) => { spacer(2); if (project.title) line(project.title, 10, true); project.achievements.forEach((item) => line(`- ${item}`, 9, false, "0.12 0.17 0.25", 10)); });
    else if (lines.some(hasResumeBullet)) groupResumeBulletLines(lines).forEach((item) => line(`- ${item}`, 9, false, "0.12 0.17 0.25", 10));
    else lines.forEach((item) => line(item, 9.5));
    spacer(7);
  });
  finishPage();
  return new Blob([buildPdfDocument(pages, pageWidth, pageHeight)], { type: "application/pdf" });
}

function buildPdfDocument(pageStreams: string[], pageWidth: number, pageHeight: number) {
  const pageIds = pageStreams.map((_, index) => 5 + index * 2);
  const objects = ["<< /Type /Catalog /Pages 2 0 R >>", `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"];
  pageStreams.forEach((stream, index) => {
    const pageId = 5 + index * 2;
    const contentId = pageId + 1;
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`);
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });
  let output = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(output.length); output += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = output.length;
  output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return output;
}

function createPrintableAtsReport({
  analysis,
  candidateName,
  targetRole,
  roleFamily,
  yearsExperience,
  targetPackage,
}: {
  analysis: ResumeAnalysis;
  candidateName: string;
  targetRole: string;
  roleFamily: string;
  yearsExperience: number;
  targetPackage: number;
}) {
  const list = (items: string[]) => items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(candidateName)} ATS Score Report</title>
  <style>
    @page { size: A4; margin: 14mm; }
    * { box-sizing: border-box; }
    body { margin: 0; color: #07111f; font-family: Inter, Arial, sans-serif; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .report { border: 1px solid #cbdcf0; border-radius: 22px; overflow: hidden; background: #fff; }
    .hero { display: grid; grid-template-columns: 1fr auto; gap: 18px; align-items: end; padding: 30px; color: white; background: linear-gradient(135deg, #12347c 0%, #1f6fbf 54%, #22b573 100%); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .eyebrow { font-size: 11px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; opacity: .92; color: #eaf7ff; }
    h1 { margin: 10px 0 8px; font-size: 34px; line-height: 1.05; }
    .hero p { margin: 0; color: #eaf7ff; font-weight: 700; }
    .score { min-width: 124px; text-align: center; padding: 18px 16px; border-radius: 24px; background: #ffffff; color: #12347c; font-weight: 800; box-shadow: 0 18px 36px rgba(0,0,0,.16); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .score strong { display: block; font-size: 42px; line-height: 1; }
    .score span { display: block; margin-top: 6px; color: #64748b; font-size: 10px; letter-spacing: .14em; text-transform: uppercase; }
    .content { padding: 24px; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 18px; }
    .card { border: 1px solid #e0ebf6; border-radius: 14px; padding: 13px; background: #f8fbff; }
    .label { color: #65748b; font-size: 10px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
    .value { margin-top: 6px; font-size: 16px; font-weight: 800; }
    .notice { margin: 16px 0; padding: 16px; border-radius: 16px; background: #ecfdf4; border: 1px solid #bcebd1; font-weight: 700; }
    li { white-space: pre-line; overflow-wrap: anywhere; }
    h2 { break-after: avoid; margin: 22px 0 10px; font-size: 18px; }
    ul { margin: 0; padding-left: 18px; color: #334155; line-height: 1.55; }
    .columns { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .panel { border: 1px solid #e0ebf6; border-radius: 16px; padding: 16px; break-inside: avoid; }
    .bar-row { display: grid; grid-template-columns: 1fr auto; gap: 10px; align-items: center; margin: 10px 0; font-size: 13px; font-weight: 700; }
    .bar-row i { grid-column: 1 / -1; height: 8px; border-radius: 999px; background: #dbe8f5; overflow: hidden; }
    .bar-row b { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #163d8f, #22b573); }
    .footer { margin-top: 20px; padding-top: 14px; border-top: 1px solid #e0ebf6; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <main class="report">
    <section class="hero">
      <div>
        <div class="eyebrow">KASA Resume ATS Checker</div>
        <h1>${escapeHtml(candidateName)} ATS Score Report</h1>
        <p>${escapeHtml(targetRole)} · ${escapeHtml(roleFamily)} · ${yearsExperience} years experience · Target ${targetPackage} LPA</p>
      </div>
      <div class="score"><strong>${analysis.atsScore}</strong><span>ATS Score</span></div>
    </section>
    <section class="content">
      <div class="grid">
        <div class="card"><div class="label">Role fit</div><div class="value">${escapeHtml(analysis.roleFit)}</div></div>
        <div class="card"><div class="label">Readiness</div><div class="value">${escapeHtml(getReadiness(analysis.atsScore).label)}</div></div>
        <div class="card"><div class="label">Missing keywords</div><div class="value">${analysis.missingKeywords.length}</div></div>
        <div class="card"><div class="label">Skill gaps</div><div class="value">${analysis.missingSkills.length}</div></div>
      </div>
      <div class="notice">${escapeHtml(analysis.verdict)}</div>
      ${reportSections(analysis).map(([title, items]) => `<section><h2>${escapeHtml(title)}</h2><ul>${list(items.length ? items : ["No specific findings in this review."])}</ul></section>`).join("")}
      <div class="footer">Generated by KASA. Check your resume score free at /tools/resume-ats-checker.</div>
    </section>
  </main>
</body>
</html>`;
}

function uniqueList(items: unknown[], limit: number) {
  const seen = new Set<string>();
  return items
    .map((item) => String(item || "").replace(/\s+/g, " ").trim())
    .filter((item) => {
      const key = item.toLowerCase();
      if (!item || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
}

function formatExperienceLabel(years: number) {
  if (years <= 0) return "Fresher / entry level";
  if (years <= 1) return "0-1 year experience";
  if (years <= 3) return "1-3 years experience";
  if (years <= 6) return "3-6 years experience";
  if (years <= 10) return "6-10 years experience";
  return "10+ years senior experience";
}

function legacyExperienceToYears(value: unknown) {
  const text = String(value || "").toLowerCase();
  if (text.includes("10")) return 10;
  if (text.includes("6")) return 6;
  if (text.includes("3")) return 3;
  if (text.includes("1")) return 1;
  return 0;
}

function getReadiness(score: number) {
  if (score >= 80) return { label: "Strong resume", tone: "green" };
  if (score >= 65) return { label: "Good, improve keywords", tone: "blue" };
  if (score >= 50) return { label: "Needs work", tone: "amber" };
  return { label: "Needs substantial improvement", tone: "red" };
}

function getToneClasses(tone: string) {
  if (tone === "green") return "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200";
  if (tone === "amber") return "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-200";
  if (tone === "red") return "bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-200";
  return "bg-blue-50 text-primary dark:bg-primary/10 dark:text-emerald-200";
}

function ScoreRing({ score }: { score: number }) {
  const safeScore = clamp(score, 0, 100);
  return (
    <div className="relative grid size-24 shrink-0 place-items-center rounded-full sm:size-28" style={{ background: `conic-gradient(#22b573 ${safeScore * 3.6}deg,#dbe8f5 ${safeScore * 3.6}deg)` }}>
      <div className="grid size-19 place-items-center rounded-full bg-white shadow-inner dark:bg-slate-950 sm:size-22">
        <div className="text-center">
          <div className="font-heading text-3xl font-semibold text-slate-950 dark:text-white sm:text-4xl">{score ? safeScore : "--"}</div>
          <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-500">ATS score</div>
        </div>
      </div>
    </div>
  );
}

function SearchSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: readonly string[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const wrapperRef = useRef<HTMLLabelElement>(null);
  const filteredOptions = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return options.slice(0, 12);
    return options.filter((option) => option.toLowerCase().includes(search)).slice(0, 12);
  }, [options, query]);
  const canUseTyped = query.trim().length > 1 && !options.some((option) => option.toLowerCase() === query.trim().toLowerCase());

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const choose = (nextValue: string) => {
    const cleanValue = nextValue.replace(/\s+/g, " ").trim();
    if (!cleanValue) return;
    setQuery(cleanValue);
    onChange(cleanValue);
    setOpen(false);
  };

  return (
    <label ref={wrapperRef} className="relative rounded-[1.1rem] border border-blue-950/10 bg-white/82 p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]">
      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</span>
      <div className="relative mt-3">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-primary dark:text-emerald-200" aria-hidden="true" />
        <input
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              choose(filteredOptions[0] || query);
            }
            if (event.key === "Escape") setOpen(false);
          }}
          placeholder="Search any role, technology, or position..."
          className="h-12 w-full rounded-xl border border-blue-950/10 bg-blue-50/60 pl-11 pr-11 text-sm font-semibold text-slate-950 outline-none transition focus:border-primary/50 dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
        />
        <button type="button" onClick={() => setOpen((state) => !state)} className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-slate-500 transition hover:bg-white hover:text-primary dark:text-slate-300 dark:hover:bg-white/10">
          <ChevronDown className={`size-4 transition ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      </div>
      {open ? (
        <div className="absolute left-4 right-4 top-[6.8rem] z-30 overflow-hidden rounded-2xl border border-blue-950/10 bg-white shadow-2xl shadow-blue-950/15 dark:border-white/10 dark:bg-slate-950">
          <div className="max-h-72 overflow-y-auto p-2">
            {filteredOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => choose(option)}
                className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${value === option ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-400/12 dark:text-emerald-100" : "text-slate-700 hover:bg-blue-50 dark:text-slate-200 dark:hover:bg-white/8"}`}
              >
                <span>{option}</span>
                {value === option ? <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" /> : null}
              </button>
            ))}
            {canUseTyped ? (
              <button type="button" onClick={() => choose(query)} className="mt-1 flex w-full cursor-pointer items-center gap-2 rounded-xl border border-dashed border-primary/25 bg-blue-50/80 px-3 py-2.5 text-left text-sm font-semibold text-primary transition hover:border-primary/50 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-100">
                <Sparkles className="size-4" aria-hidden="true" />
                Use &quot;{query.trim()}&quot;
              </button>
            ) : null}
            {!filteredOptions.length && !canUseTyped ? <div className="px-3 py-4 text-sm text-slate-500 dark:text-slate-400">Start typing a role name.</div> : null}
          </div>
        </div>
      ) : null}
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

function NumberField({ label, value, onChange, min, max, suffix, presets, note }: { label: string; value: number; onChange: (value: number) => void; min: number; max: number; suffix: string; presets: number[]; note?: string }) {
  const percent = ((value - min) / Math.max(1, max - min)) * 100;
  return (
    <div className="rounded-[1.1rem] border border-blue-950/10 bg-white/82 p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</div>
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">{value}{suffix}</div>
      </div>
      {note ? <div className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">{note}</div> : null}
      <input type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-4 h-2 w-full cursor-pointer accent-[#22b573]" style={{ background: `linear-gradient(90deg,#22b573 ${percent}%,#d8e4ef ${percent}%)` }} />
      <div className="mt-4 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button key={preset} type="button" onClick={() => onChange(preset)} className={`cursor-pointer rounded-full border px-3 py-2 text-sm font-semibold transition ${value === preset ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-blue-950/10 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/7 dark:text-slate-200"}`}>
            {preset}{suffix}
          </button>
        ))}
      </div>
    </div>
  );
}

function MetricBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="rounded-xl border border-blue-950/10 bg-white p-3 dark:border-white/10 dark:bg-white/[0.05]">
      <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400"><span>{label}</span><span className="text-xs text-slate-800 dark:text-slate-100">{score}</span></div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/12"><div className="h-full rounded-full bg-[image:var(--button-solid)]" style={{ width: `${clamp(score, 0, 100)}%` }} /></div>
    </div>
  );
}

function CompactList({ title, items, tone = "default", numbered = false }: { title: string; items: string[]; tone?: "default" | "positive" | "warning" | "priority"; numbered?: boolean }) {
  const markerClasses = tone === "positive" ? "bg-emerald-500" : tone === "warning" ? "bg-amber-500" : tone === "priority" ? "bg-primary" : "bg-slate-400";
  return (
    <div className="rounded-xl border border-blue-950/10 bg-white p-4 dark:border-white/10 dark:bg-white/[0.05]">
      <h4 className="text-sm font-semibold text-slate-950 dark:text-white">{title}</h4>
      <ul className="mt-2.5 grid gap-1.5 text-xs leading-5 text-slate-600 dark:text-slate-300">
        {items.length ? items.map((item, index) => <li key={`${item}-${index}`} className="flex items-start gap-2 rounded-lg bg-slate-50 px-2.5 py-2 dark:bg-white/[0.05]">{numbered ? <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary dark:text-emerald-200">{index + 1}</span> : <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${markerClasses}`} />}<span>{item}</span></li>) : <li className="text-slate-500">No specific items in this review.</li>}
      </ul>
    </div>
  );
}

function TagCard({ title, items, tone }: { title: string; items: string[]; tone: "positive" | "warning" | "danger" }) {
  const styles = tone === "positive" ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-100" : tone === "warning" ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-100" : "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-300/20 dark:bg-rose-400/10 dark:text-rose-100";
  return <div className="rounded-xl border border-blue-950/10 p-4 dark:border-white/10"><div className="flex items-center justify-between gap-2"><h4 className="text-sm font-semibold text-slate-950 dark:text-white">{title}</h4><span className="text-xs font-semibold text-slate-400">{items.length}</span></div><div className="mt-3 flex flex-wrap gap-1.5">{items.length ? items.map((item) => <span key={item} className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${styles}`}>{item}</span>) : <span className="text-xs text-slate-500">Nothing flagged.</span>}</div></div>;
}

function ImprovementShelf({ title, description, items, appliedFixes, onApply, onRemove }: { title: string; description: string; items: ImprovementAction[]; appliedFixes: string[]; onApply: (action: ImprovementAction) => void; onRemove: (action: ImprovementAction) => void }) {
  const [showAll, setShowAll] = useState(false);
  const visibleItems = showAll ? items : items.slice(0, 6);
  return <section className="overflow-hidden rounded-xl border border-blue-950/10 bg-white dark:border-white/10 dark:bg-white/[0.035]">
    <div className="flex items-start gap-2.5 border-b border-blue-950/8 bg-slate-50/80 px-3 py-2.5 dark:border-white/8 dark:bg-white/[0.035]">
      <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-blue-100 text-primary dark:bg-white/10 dark:text-emerald-200"><Plus className="size-3.5" aria-hidden="true" /></span>
      <div><div className="flex items-center gap-2"><h5 className="text-xs font-semibold text-slate-950 dark:text-white">{title}</h5><span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-500 shadow-sm dark:bg-slate-950 dark:text-slate-300">{items.length}</span></div><p className="mt-0.5 text-[11px] leading-4 text-slate-500 dark:text-slate-400">{description}</p></div>
    </div>
    <div className="grid gap-px bg-blue-950/8 sm:grid-cols-2 dark:bg-white/8">{visibleItems.map((item) => {
      const applied = appliedFixes.includes(item.id);
      return <div key={item.id} className={`flex min-h-[4.5rem] items-center gap-2.5 px-3 py-2.5 ${applied ? "bg-emerald-50/70 dark:bg-emerald-400/[0.06]" : "bg-white dark:bg-slate-950"}`}>
        <span className={`grid size-7 shrink-0 place-items-center rounded-full ${applied ? "bg-emerald-600 text-white" : "bg-slate-100 text-primary dark:bg-white/10 dark:text-emerald-200"}`}>{applied ? <CheckCircle2 className="size-3.5" aria-hidden="true" /> : <Plus className="size-3.5" aria-hidden="true" />}</span>
        <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100" title={item.replacement}>{item.replacement}</p><p className="mt-0.5 text-[10px] text-slate-500">{applied ? "Added to improved draft" : item.kind === "skill" ? "Skill gap from this review" : "Keyword gap from this review"}</p></div>
        {!applied ? <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-primary dark:bg-white/10 dark:text-emerald-200">Est. +{item.impact} score</span> : null}
        {applied ? <button type="button" onClick={() => onRemove(item)} aria-label={`Remove ${item.replacement}`} className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full border border-emerald-300 bg-white text-emerald-800 transition hover:border-rose-300 hover:text-rose-700 dark:border-emerald-300/30 dark:bg-slate-950 dark:text-emerald-200"><RotateCcw className="size-3.5" aria-hidden="true" /></button> : <button type="button" onClick={() => onApply(item)} aria-label={`Add ${item.replacement}`} className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full bg-[image:var(--button-solid)] text-white shadow-sm transition hover:-translate-y-0.5"><Plus className="size-3.5" aria-hidden="true" /></button>}
      </div>;
    })}</div>
    {items.length > 6 ? <div className="border-t border-blue-950/8 px-3 py-2 text-center dark:border-white/8"><button type="button" onClick={() => setShowAll((value) => !value)} className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-primary hover:text-emerald-700 dark:text-emerald-200"><ChevronDown className={`size-3.5 transition ${showAll ? "rotate-180" : ""}`} aria-hidden="true" />{showAll ? "Show fewer" : `Show all ${items.length}`}</button></div> : null}
  </section>;
}

function ImprovedResumeDownloadModal({ onClose, onDownload }: { onClose: () => void; onDownload: (format: "pdf" | "doc" | "txt") => void }) {
  if (typeof document === "undefined") return null;
  return createPortal(<div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/55 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Download improved resume">
    <div className="w-full max-w-md rounded-[1.25rem] border border-white/20 bg-white p-5 shadow-2xl shadow-slate-950/25 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary dark:text-emerald-200">Download improved resume</p><h3 className="mt-2 font-heading text-2xl font-semibold text-slate-950 dark:text-white">Choose a format</h3><p className="mt-1 text-xs leading-5 text-slate-500">Your applied changes are included in every export.</p></div><button type="button" onClick={onClose} className="grid size-9 cursor-pointer place-items-center rounded-full border border-blue-950/10 text-slate-500 transition hover:border-rose-300 hover:text-rose-600 dark:border-white/10 dark:text-slate-300" aria-label="Close download options"><X className="size-4" aria-hidden="true" /></button></div>
      <div className="mt-5 grid gap-3"><button type="button" onClick={() => onDownload("pdf")} className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-left transition hover:border-emerald-400 dark:border-emerald-300/20 dark:bg-emerald-400/10"><span><strong className="block text-slate-950 dark:text-white">PDF</strong><span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">Direct A4 PDF download, ready to attach to applications.</span></span><Download className="size-5 text-emerald-700 dark:text-emerald-200" aria-hidden="true" /></button><button type="button" onClick={() => onDownload("doc")} className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-blue-950/10 bg-white p-4 text-left transition hover:border-primary/35 dark:border-white/10 dark:bg-white/[0.06]"><span><strong className="block text-slate-950 dark:text-white">Word</strong><span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">Editable native .docx with proper headings and bullets.</span></span><FileText className="size-5 text-primary dark:text-emerald-200" aria-hidden="true" /></button><button type="button" onClick={() => onDownload("txt")} className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-blue-950/10 bg-white p-4 text-left transition hover:border-primary/35 dark:border-white/10 dark:bg-white/[0.06]"><span><strong className="block text-slate-950 dark:text-white">Text</strong><span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">For job portals and plain-text application forms.</span></span><Copy className="size-5 text-primary dark:text-emerald-200" aria-hidden="true" /></button></div>
    </div>
  </div>, document.body);
}

function ActionTagCard({ title, items, tone, onApply, onRemove, appliedTerms }: { title: string; items: string[]; tone: "warning" | "danger"; onApply: (term: string) => void; onRemove: (term: string) => void; appliedTerms: string[] }) {
  const styles = tone === "warning" ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-100" : "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-300/20 dark:bg-rose-400/10 dark:text-rose-100";
  return <div className="rounded-xl border border-blue-950/10 p-4 dark:border-white/10"><div className="flex items-center justify-between gap-2"><h4 className="text-sm font-semibold text-slate-950 dark:text-white">{title}</h4><span className="text-xs font-semibold text-slate-400">{items.length}</span></div><div className="mt-3 grid gap-2">{items.length ? items.map((item) => { const applied = appliedTerms.some((term) => term.toLowerCase() === item.toLowerCase()); return <div key={item} className={`flex items-center justify-between gap-2 rounded-lg border px-2.5 py-2 ${styles}`}><span className="min-w-0 text-xs font-semibold">{item}</span>{applied ? <button type="button" aria-label={`Remove ${item} from improved resume`} onClick={() => onRemove(item)} className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-bold text-rose-700 shadow-sm"><RotateCcw className="size-3" aria-hidden="true" />Remove</button> : <button type="button" aria-label={`Add ${item} to improved resume`} onClick={() => onApply(item)} className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-bold text-slate-700 shadow-sm"><Plus className="size-3" aria-hidden="true" />Add</button>}</div>; }) : <span className="text-xs text-slate-500">Nothing flagged.</span>}</div><p className="mt-2 text-[10px] leading-4 text-slate-500">Add only terms you can support with real work, study, or a project.</p></div>;
}

function RoadmapCard({ roadmap }: { roadmap: ResumeAnalysis["roadmap"] }) {
  return (
    <div className="rounded-xl border border-blue-950/10 bg-white p-4 dark:border-white/10 dark:bg-white/[0.05]">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white">
        <BriefcaseBusiness className="size-4 text-primary dark:text-emerald-300" aria-hidden="true" />
        30-day roadmap
      </div>
      <div className="mt-2.5 grid gap-1.5">
        {roadmap.map((item) => (
          <details key={`${item.week}-${item.focus}`} className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-white/[0.05]"><summary className="cursor-pointer text-xs font-semibold text-slate-950 dark:text-white">{item.week}: {item.focus}</summary><ul className="mt-2 grid gap-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{item.tasks.map((task) => <li key={task}>• {task}</li>)}</ul></details>
        ))}
      </div>
    </div>
  );
}

function ActionButton({ label, icon: Icon, onClick, disabled }: { label: string; icon: typeof Copy; onClick: () => void; disabled?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-blue-950/10 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm shadow-blue-950/5 transition hover:border-primary/35 hover:text-primary disabled:pointer-events-none disabled:opacity-45 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:text-white">
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </button>
  );
}

function GenerationOverlay({ progress }: { progress: number }) {
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/58 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[1.4rem] border border-white/18 bg-white p-6 shadow-2xl shadow-slate-950/30 dark:bg-slate-950 dark:text-white">
        <div className="flex items-center gap-4">
          <div className="relative grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-200">
            <Sparkles className="size-6 animate-pulse" aria-hidden="true" />
            <span className="absolute inset-0 animate-spin rounded-full border-2 border-emerald-300/70 border-t-transparent" />
          </div>
          <div>
            <div className="font-heading text-2xl font-semibold text-slate-950 dark:text-white">Analyzing resume</div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Reviewing keywords, writing and resume structure…</p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400"><span>Free ATS analysis</span><span>{Math.round(progress)}%</span></div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200 shadow-inner dark:bg-white/12"><div className="h-full rounded-full bg-[image:var(--button-solid)] transition-[width] duration-500" style={{ width: `${clamp(progress, 0, 100)}%` }} /></div>
      </div>
    </div>
  );
}

function trackAts(event: string, properties: Record<string, string | boolean> = {}) {
  const analyticsWindow = window as Window & { dataLayer?: Record<string, unknown>[] };
  analyticsWindow.dataLayer?.push({ event: `ats_${event}`, tool: "resume_checker", ...properties });
}

function SuggestionCard({ title, items, onApply, onRemove, appliedItems }: { title: string; items: { original: string; suggestion: string; reason: string }[]; onApply?: (item: { original: string; suggestion: string; reason: string }) => void; onRemove?: (item: { original: string; suggestion: string; reason: string }) => void; appliedItems?: ImprovementAction[] }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copyError, setCopyError] = useState(false);
  return <section className="rounded-xl border border-blue-950/10 p-4 dark:border-white/10">
    <div className="flex items-center justify-between gap-2"><h4 className="text-sm font-semibold">{title}</h4><span className="text-xs font-semibold text-slate-400">{items.length}</span></div>
    {!items.length ? <p className="mt-2 text-xs text-slate-500">No specific changes suggested in this review.</p> : <div className="mt-2.5 grid gap-2">{items.map((item, index) => { const applied = appliedItems?.some((action) => action.original === item.original && action.replacement === item.suggestion); return <details key={index} className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-white/[0.05]"><summary className="cursor-pointer text-xs font-semibold leading-5 text-slate-800 dark:text-slate-100">{normalizeResumeBulletText(item.original)}</summary><div className="mt-2 border-t border-blue-950/10 pt-2 dark:border-white/10"><p className="text-xs leading-5 text-emerald-800 dark:text-emerald-200">{item.suggestion}</p><p className="mt-1 text-[11px] leading-4 text-slate-500">{item.reason}</p><div className="mt-2 flex flex-wrap gap-2">{applied && onRemove ? <button type="button" className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-rose-700 dark:border-rose-300/25 dark:bg-slate-950 dark:text-rose-200" onClick={() => onRemove(item)}><RotateCcw className="size-3" aria-hidden="true" />Remove</button> : onApply ? <button type="button" className="rounded-full bg-[image:var(--button-solid)] px-2.5 py-1 text-[10px] font-semibold text-white" onClick={() => onApply(item)}>Apply to improved draft</button> : null}<button type="button" className="rounded-full border border-blue-950/15 px-2.5 py-1 text-[10px] font-semibold dark:border-white/20" onClick={async () => { try { await navigator.clipboard.writeText(item.suggestion); setCopiedIndex(index); setCopyError(false); trackAts("suggestion_copied"); } catch { setCopyError(true); } }}>{copiedIndex === index ? "Copied" : "Copy suggestion"}</button></div></div></details>; })}</div>}
    <p role="status" className="mt-2 text-xs text-slate-500">{copyError ? "Copy was blocked. Select and copy the suggestion above." : copiedIndex !== null ? "Suggestion copied. Check that it reflects your actual experience." : ""}</p>
  </section>;
}
