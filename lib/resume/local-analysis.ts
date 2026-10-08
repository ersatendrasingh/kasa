import { validateAnalysis, type ResumeAnalysis } from "@/lib/resume/analysis";
import { recoverResumeStructure } from "@/lib/resume/text-structure";

export type LocalResumeInput = {
  resumeText: string;
  jobDescription?: string;
  targetRole?: string;
  roleFamily?: string;
  yearsExperience?: number;
  currentSkills?: string;
  targetPackage?: number;
  dailyHours?: number;
  language?: string;
};

export type LocalResumeProfile = {
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

const sectionAliases = {
  summary: ["summary", "profile", "objective", "about"],
  skills: ["skills", "technical skills", "core competencies", "technologies"],
  experience: ["experience", "work experience", "professional experience", "employment"],
  projects: ["project", "projects", "selected projects"],
  education: ["education", "academic background", "qualification"],
  certifications: ["certification", "certifications", "courses"],
} as const;

const knownSkills = [
  "HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Angular", "Vue.js", "Node.js", "NestJS", "Express",
  "Java", "Spring Boot", "Python", "Django", "Flask", "C++", "C#", ".NET", "PHP", "Laravel", "Golang",
  "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Git", "GitHub", "AWS", "Azure", "GCP", "Docker", "RabbitMQ", "Kafka",
  "Kubernetes", "Terraform", "Jenkins", "Linux", "REST API", "GraphQL", "Microservices", "Power BI", "Tableau",
  "Excel", "Machine Learning", "Deep Learning", "NLP", "LLM", "LangChain", "TensorFlow", "PyTorch", "Pandas",
  "NumPy", "Figma", "UI/UX", "SEO", "Google Analytics", "Digital Marketing", "Salesforce", "Agile", "Scrum",
] as const;

const roleSkills: Record<string, string[]> = {
  "frontend developer": ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Git", "REST API"],
  "react developer": ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Git", "REST API"],
  "next.js developer": ["Next.js", "React", "TypeScript", "JavaScript", "HTML", "CSS", "Git"],
  "backend developer": ["Node.js", "Python", "Java", "SQL", "REST API", "Git", "Docker"],
  "full stack developer": ["JavaScript", "React", "Node.js", "SQL", "REST API", "Git", "Docker"],
  "software engineer": ["Git", "SQL", "REST API", "Agile", "Docker", "JavaScript", "Python"],
  "data analyst": ["SQL", "Excel", "Power BI", "Tableau", "Python", "Pandas", "Google Analytics"],
  "data scientist": ["Python", "SQL", "Machine Learning", "Pandas", "NumPy", "TensorFlow", "PyTorch"],
  "machine learning engineer": ["Python", "Machine Learning", "TensorFlow", "PyTorch", "Docker", "AWS", "SQL"],
  "devops engineer": ["Linux", "AWS", "Docker", "Kubernetes", "Terraform", "Jenkins", "Git"],
  "cloud engineer": ["AWS", "Azure", "GCP", "Linux", "Docker", "Terraform", "Kubernetes"],
  "ui/ux designer": ["Figma", "UI/UX", "HTML", "CSS", "Agile"],
  "digital marketing executive": ["Digital Marketing", "SEO", "Google Analytics", "Excel"],
};

const stopWords = new Set("a an and are as at be been being by can for from has have in into is it its of on or our that the their this to using was were will with you your required preferred good strong knowledge experience skills ability role work working candidate including must should years year".split(" "));
const actionVerbs = ["achieved", "built", "created", "delivered", "designed", "developed", "drove", "implemented", "improved", "increased", "launched", "led", "managed", "optimized", "reduced", "resolved", "saved", "scaled", "streamlined"];

function normalize(value: string) {
  return value.toLowerCase().replace(/[.+/#-]/g, " ").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
}

function unique(values: string[], max = 20) {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = normalize(value);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, max);
}

function contains(text: string, term: string) {
  const haystack = ` ${normalize(text)} `;
  const needle = normalize(term);
  return Boolean(needle && haystack.includes(` ${needle} `));
}

function detectedSections(text: string) {
  const lines = text.split(/\r?\n/).map((line) => normalize(line.replace(/:$/, ""))).filter(Boolean);
  return Object.fromEntries(Object.entries(sectionAliases).map(([key, aliases]) => [key, lines.some((line) => aliases.some((alias) => line === alias || line.startsWith(`${alias} `))) ])) as Record<keyof typeof sectionAliases, boolean>;
}

function extractSkills(text: string) {
  return knownSkills.filter((skill) => contains(text, skill));
}

function roleExpectations(role: string) {
  const key = normalize(role);
  const direct = Object.entries(roleSkills).find(([name]) => normalize(name) === key)?.[1];
  if (direct) return direct;
  const partial = Object.entries(roleSkills).find(([name]) => key.includes(normalize(name)) || normalize(name).includes(key));
  return partial?.[1] || ["Communication", "Problem Solving", "Teamwork", "Git", "Excel"];
}

function extractRequirements(jobDescription: string, targetRole: string) {
  if (!jobDescription.trim()) return roleExpectations(targetRole);
  const explicitSkills = knownSkills.filter((skill) => contains(jobDescription, skill));
  const phrases = jobDescription
    .split(/\n|[.;•]/)
    .map((part) => part.trim())
    .filter((part) => part.length >= 4 && part.length <= 80)
    .flatMap((part) => {
      const cleaned = part.replace(/^(requirements?|responsibilities|preferred|must have|nice to have)\s*:?-?\s*/i, "").trim();
      const words = cleaned.split(/\s+/).filter((word) => !stopWords.has(normalize(word)));
      return words.length >= 1 && words.length <= 5 ? [cleaned] : [];
    });
  const frequentWords = [...normalize(jobDescription).split(" ").reduce((map, word) => {
    if (word.length >= 4 && !stopWords.has(word)) map.set(word, (map.get(word) || 0) + 1);
    return map;
  }, new Map<string, number>())]
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);
  return unique([...explicitSkills, ...phrases, ...frequentWords], 24);
}

function score(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function experienceLabel(years: number) {
  if (years <= 0) return "Fresher / entry level";
  if (years <= 1) return "0-1 year experience";
  if (years <= 3) return "1-3 years experience";
  if (years <= 6) return "3-6 years experience";
  if (years <= 10) return "6-10 years experience";
  return "10+ years senior experience";
}

function inferYears(text: string) {
  const explicit = [...text.matchAll(/(\d{1,2})(?:\+)?\s*(?:years?|yrs?)/gi)].map((match) => Number(match[1])).filter((year) => year <= 40);
  if (explicit.length) return Math.min(20, Math.max(...explicit));
  const currentYear = new Date().getUTCFullYear();
  const years = [...text.matchAll(/\b(?:19|20)\d{2}\b/g)].map((match) => Number(match[0])).filter((year) => year <= currentYear + 1);
  return years.length >= 2 ? Math.min(20, Math.max(0, currentYear - Math.min(...years))) : 0;
}

function inferName(text: string) {
  const ignored = /^(resume|curriculum vitae|summary|profile|experience|education|skills|projects|contact)$/i;
  for (const raw of text.split(/\r?\n/).slice(0, 10)) {
    const line = raw.replace(/\s+/g, " ").trim();
    const headerMatch = line.match(/^([A-Z][A-Za-zÀ-ÿ.'-]+(?:\s+[A-Z][A-Za-zÀ-ÿ.'-]+){1,2}?)(?=\s+(?:Senior|Junior|Lead|Principal|Staff|Full Stack|Frontend|Backend|Software|Web|Data|Cloud|DevOps|Product|Project|Engineering|UI\/UX|Graphic|Digital|Finance|HR|Operations|Sales|Customer|Teacher|Academic)\b)/);
    if (headerMatch) return headerMatch[1];
    if (!ignored.test(line) && /^[A-Za-zÀ-ÿ.'-]+(?:\s+[A-Za-zÀ-ÿ.'-]+){1,3}$/.test(line) && line.length <= 70) return line;
  }
  return "Candidate";
}

function inferRole(text: string, skills: string[]) {
  const normalizedText = normalize(text.slice(0, 2500));
  const namedRole = Object.keys(roleSkills).find((role) => normalizedText.includes(role));
  if (namedRole) return namedRole.replace(/\b\w/g, (letter) => letter.toUpperCase());
  if (skills.some((item) => ["Power BI", "Tableau"].includes(item))) return "Data Analyst";
  if (skills.some((item) => ["React", "Next.js", "Angular", "Vue.js"].includes(item))) return "Frontend Developer";
  if (skills.some((item) => ["AWS", "Docker", "Kubernetes", "Terraform"].includes(item))) return "DevOps Engineer";
  return "Software Engineer";
}

function inferRoleFamily(role: string) {
  const value = normalize(role);
  if (/data|machine learning| ai |nlp/.test(` ${value} `)) return "Data & AI";
  if (/cloud|devops|reliability/.test(value)) return "Cloud & DevOps";
  if (/security|cyber|soc/.test(value)) return "Cybersecurity";
  if (/design|product/.test(value)) return "Product & Design";
  if (/finance|account|operation/.test(value)) return "Finance & Operations";
  if (/marketing|sales|seo|recruit|hr/.test(value)) return "Business & Marketing";
  return "Software Engineering";
}

export function detectLocalResumeProfile(resumeText: string): LocalResumeProfile {
  const text = recoverResumeStructure(resumeText).slice(0, 30_000);
  const skills = extractSkills(text);
  const detectedRole = inferRole(text, skills);
  const yearsExperience = inferYears(text);
  const candidateEmail = text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i)?.[0]?.toLowerCase() || "";
  const candidatePhone = text.match(/(?:\+?\d[\d\s().-]{7,}\d)/)?.[0]?.replace(/\s+/g, " ").trim() || "";
  return {
    candidateName: inferName(text), candidateEmail, candidatePhone, detectedRole,
    roleFamily: inferRoleFamily(detectedRole), yearsExperience, experienceLevel: experienceLabel(yearsExperience), skills,
    summary: `Detected ${experienceLabel(yearsExperience).toLowerCase()} profile with ${skills.length} recognizable skill${skills.length === 1 ? "" : "s"}.`,
  };
}

export function analyzeResumeLocally(input: LocalResumeInput): ResumeAnalysis {
  const resumeText = recoverResumeStructure(input.resumeText).slice(0, 30_000);
  const jobDescription = String(input.jobDescription || "").slice(0, 12_000);
  const selectedRole = String(input.targetRole || "General resume review");
  const sections = detectedSections(resumeText);
  const skills = extractSkills(resumeText);
  const inferredRole = inferRole(resumeText, skills);
  const targetRole = /general resume review/i.test(selectedRole) ? inferredRole : selectedRole;
  const requirements = extractRequirements(jobDescription, targetRole);
  const matched = requirements.filter((item) => contains(resumeText, item));
  const missing = requirements.filter((item) => !contains(resumeText, item));
  const words = resumeText.split(/\s+/).filter(Boolean);
  const lines = resumeText.split(/\n/).map((line) => line.trim()).filter(Boolean);
  const bullets = lines.filter((line) => /^(?:[-*•]|\d+[.)])\s+/.test(line));
  const actionLines = lines.filter((line) => actionVerbs.some((verb) => normalize(line).startsWith(verb)));
  const evidenceLines = unique([...bullets, ...actionLines], 100);
  const quantifiedBullets = evidenceLines.filter((line) => /(?:\b\d+(?:\.\d+)?%?|₹|\$|\b(?:hours?|days?|weeks?|months?|users?|clients?|projects?|team)\b)/i.test(line));
  const actionBullets = evidenceLines.filter((line) => actionVerbs.some((verb) => normalize(line).startsWith(verb) || normalize(line).includes(` ${verb} `)));
  const sectionCount = Object.values(sections).filter(Boolean).length;
  const emailPresent = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(resumeText);
  const phonePresent = /(?:\+?\d[\d\s().-]{7,}\d)/.test(resumeText);
  const keywordScore = requirements.length ? 35 + 65 * matched.length / requirements.length : 55;
  const expectedSkills = roleExpectations(targetRole);
  const relevantSkills = expectedSkills.filter((item) => contains(resumeText, item));
  const skillsScore = score(30 + Math.min(50, skills.length * 6) + Math.min(20, relevantSkills.length * 4));
  const projectsScore = score((sections.experience ? 68 : sections.projects ? 62 : 25) + Math.min(22, evidenceLines.length * 3) + (sections.projects && sections.experience ? 10 : 0));
  const impactScore = score(25 + Math.min(45, quantifiedBullets.length * 12) + Math.min(30, actionBullets.length * 5));
  const structureScore = score(25 + sectionCount * 10 + (emailPresent ? 8 : 0) + (phonePresent ? 7 : 0));
  const longLines = lines.filter((line) => line.length > 220).length;
  const clarityScore = score(75 - Math.min(30, longLines * 6) + Math.min(15, actionBullets.length * 3) - (words.length < 180 ? 15 : 0) - (words.length > 1200 ? 10 : 0));
  const componentScores = [
    { label: "Keywords", score: score(keywordScore), reason: `${matched.length} of ${requirements.length || "the expected"} role terms were found in the resume.` },
    { label: "Skills", score: skillsScore, reason: `${skills.length} recognizable skills were found; ${relevantSkills.length} align directly with ${targetRole}.` },
    { label: "Projects", score: projectsScore, reason: sections.projects && sections.experience ? "Both professional experience and project evidence are present." : sections.experience ? "Professional experience provides delivery evidence; a separate projects section is optional for experienced candidates." : sections.projects ? "A projects section provides practical delivery evidence." : "Project or work evidence is limited." },
    { label: "Impact", score: impactScore, reason: `${quantifiedBullets.length} bullet${quantifiedBullets.length === 1 ? "" : "s"} include measurable scope or results.` },
    { label: "Structure", score: structureScore, reason: `${sectionCount} standard resume sections were detected${emailPresent && phonePresent ? " with contact details" : ""}.` },
    { label: "Clarity", score: clarityScore, reason: longLines ? `${longLines} lines are unusually long and may be harder to scan.` : "The available text is reasonably scannable." },
  ];
  const missingSkills = jobDescription
    ? unique([...missing.filter((item) => knownSkills.some((skill) => normalize(skill) === normalize(item))), ...expectedSkills.filter((item) => !contains(resumeText, item))], 12)
    : [];
  const quickWins = unique([
    ...(jobDescription && missing.length ? [`Add truthful evidence for the most relevant job terms: ${missing.slice(0, 4).join(", ")}.`] : []),
    ...(quantifiedBullets.length < 2 ? ["Add numbers to show scale, speed, quality, revenue, users, or time saved where you can prove them."] : []),
    ...(!sections.summary ? ["Add a concise 2-3 line professional summary tailored to the target role."] : []),
    ...(!sections.skills ? ["Add a clearly labelled Skills section with tools you have actually used."] : []),
  ], 3);
  const strengths = unique([
    ...(matched.length ? [`Shows evidence for ${matched.slice(0, 5).join(", ")}.`] : []),
    ...(sections.experience ? ["Includes a recognizable work-experience section."] : []),
    ...(sections.projects ? ["Includes project evidence relevant to practical delivery."] : []),
    ...(quantifiedBullets.length ? [`Uses measurable detail in ${quantifiedBullets.length} bullet${quantifiedBullets.length === 1 ? "" : "s"}.`] : []),
  ], 6);
  const weakAreas = unique([
    ...(jobDescription && missing.length ? [`Missing or unsupported job terms include ${missing.slice(0, 6).join(", ")}.`] : []),
    ...(quantifiedBullets.length < 2 ? ["Most achievements lack measurable outcomes or scope."] : []),
    ...(!sections.projects && !sections.experience ? ["No clear projects or professional experience section was detected."] : []),
    ...(words.length < 180 ? ["Resume content is quite short and may not provide enough evidence."] : []),
    ...(words.length > 1200 ? ["Resume is very long; prioritize evidence relevant to the target role."] : []),
  ], 6);
  const jobRequirements = jobDescription ? requirements.map((keyword) => ({
    keyword,
    status: contains(resumeText, keyword) ? "matched" as const : "missing" as const,
    evidence: contains(resumeText, keyword) ? `The term “${keyword}” appears in the resume.` : `No direct evidence for “${keyword}” was found. Add it only if true.`,
  })) : [];
  const formattingIssues = [
    ...(!sections.skills ? [{ issue: "Skills heading not detected", evidence: "No standard Skills heading was found in the extracted text.", suggestion: "Use a simple Skills heading followed by a concise list." }] : []),
    ...(longLines ? [{ issue: "Dense text", evidence: `${longLines} extracted lines exceed 220 characters.`, suggestion: "Break dense paragraphs into concise achievement bullets." }] : []),
    ...(!emailPresent || !phonePresent ? [{ issue: "Contact details may be incomplete", evidence: `${emailPresent ? "Email found" : "Email not found"}; ${phonePresent ? "phone found" : "phone not found"}.`, suggestion: "Place current email and phone details in the resume header." }] : []),
  ];
  const analysis = {
    atsScore: 0,
    editableResumeText: resumeText,
    matchedSkills: unique(skills, 20),
    formattingNote: "This free check reviews extracted text, headings, dates, keywords and writing patterns. It does not emulate a specific employer's ATS or verify visual rendering.",
    grammarIssues: [],
    bulletSuggestions: [],
    formattingIssues,
    jobRequirements,
    roleFit: jobDescription ? (matched.length / Math.max(1, requirements.length) >= 0.7 ? "Strong job match" : matched.length / Math.max(1, requirements.length) >= 0.4 ? "Partial job match" : "Low job match") : `${targetRole} readiness`,
    verdict: quickWins[0] || "The resume has a solid base. Keep every claim factual and tailor it for each role.",
    summary: `This ${experienceLabel(inferYears(resumeText)).toLowerCase()} resume contains ${words.length} words, ${skills.length} recognizable skills and ${evidenceLines.length} achievement-style lines. The score is a readiness estimate, not an employer decision.`,
    missingKeywords: jobDescription ? unique(missing, 15) : [], missingSkills,
    strengths: strengths.length ? strengths : ["The resume provides readable text for a structured review."],
    weakAreas: weakAreas.length ? weakAreas : ["Continue tailoring evidence to each job description."],
    improvedBullets: [],
    projectsToAdd: sections.projects || sections.experience ? [] : [`Add one truthful ${targetRole} project showing the problem, your contribution, tools used, and a measurable result.`],
    interviewQuestions: unique(matched.slice(0, 4).map((item) => `Describe a real example where you used ${item} and explain the result.`), 4),
    roadmap: [
      { week: "Step 1", focus: "Role alignment", tasks: [quickWins[0] || "Tailor the summary and strongest evidence to the role."] },
      { week: "Step 2", focus: "Evidence", tasks: ["Rewrite truthful achievements with action, context and measurable result."] },
      { week: "Step 3", focus: "Final review", tasks: ["Check spelling, dates, contact details and export a selectable-text PDF."] },
    ],
    salaryRange: `Compensation for ${targetRole} varies by location, company, verified experience and interview performance; this free checker does not estimate salary from resume text.`,
    recruiterChecklist: ["Contact details are current", "Dates and titles are consistent", "Claims are factual and interview-ready", "Important role evidence appears near the top"],
    componentScores,
    quickWins: quickWins.length ? quickWins : ["Tailor the summary and strongest achievements to the job description."],
  };
  return validateAnalysis(analysis, Boolean(jobDescription));
}
