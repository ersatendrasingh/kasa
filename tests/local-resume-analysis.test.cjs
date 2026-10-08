const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

function load(relative, cache = new Map()) {
  const filename = path.resolve(__dirname, "..", relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const loadedModule = { exports: {} };
  cache.set(filename, loadedModule);
  const localRequire = (id) => id.startsWith("@/") ? load(`${id.slice(2)}.ts`, cache) : require(id);
  new Function("require", "module", "exports", source)(localRequire, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}

const { analyzeResumeLocally, detectLocalResumeProfile } = load("lib/resume/local-analysis.ts");

const resume = `Asha Sharma
asha@example.com | +91 98765 43210

SUMMARY
Frontend developer building accessible web products.

SKILLS
HTML, CSS, JavaScript, TypeScript, React, Next.js, Git, REST API

EXPERIENCE
Frontend Developer | Example Labs | 2023 - Present
- Developed React dashboards used by 1,500 users.
- Improved page speed by 35% through bundle optimization.

PROJECTS
- Built a Next.js placement portal with REST API integration.

EDUCATION
B.Tech Computer Science, 2023`;

test("creates a complete zero-provider ATS analysis with weighted scores", () => {
  const analysis = analyzeResumeLocally({
    resumeText: resume,
    targetRole: "Frontend Developer",
    jobDescription: "Required: React, TypeScript, REST API, testing and accessibility.",
  });

  assert.equal(analysis.componentScores.length, 6);
  assert.equal(typeof analysis.atsScore, "number");
  assert.equal(analysis.editableResumeText, resume);
  assert.ok(analysis.matchedSkills.includes("React"));
  assert.ok(analysis.jobRequirements.length > 0);
  assert.equal(analysis.jobMatchScore >= 0, true);
});

test("detects contact details, role and skills without AI", () => {
  const profile = detectLocalResumeProfile(resume);
  assert.equal(profile.candidateName, "Asha Sharma");
  assert.equal(profile.candidateEmail, "asha@example.com");
  assert.equal(profile.candidatePhone, "+91 98765 43210");
  assert.equal(profile.detectedRole, "Frontend Developer");
  assert.ok(profile.skills.includes("React"));
});

test("reports missing job requirements instead of inventing evidence", () => {
  const analysis = analyzeResumeLocally({
    resumeText: resume,
    targetRole: "Frontend Developer",
    jobDescription: "Kubernetes and Terraform are required for this role.",
  });
  assert.ok(analysis.missingKeywords.some((item) => /kubernetes/i.test(item)));
  assert.ok(analysis.jobRequirements.some((item) => /terraform/i.test(item.keyword) && item.status === "missing"));
});

test("recovers collapsed PDF headings and does not punish senior experience", () => {
  const collapsed = "Satendra Singh Senior Full Stack Developer | React.js, Next.js, Node.js, NestJS Noida, India | 8077871707 | satendra@example.com SUMMARY Senior Full Stack Developer with 11+ years of experience delivering scalable web applications. TECHNICAL SKILLS JavaScript, TypeScript, React, Next.js, Node.js, NestJS, PostgreSQL, Redis, AWS PROFESSIONAL EXPERIENCE Senior Full Stack Developer | Example Company | 2018 - Present • Built commerce workflows used by 50000 customers. • Reduced API response time by 35%. EDUCATION B.Tech Computer Science";
  const analysis = analyzeResumeLocally({ resumeText: collapsed, targetRole: "General resume review" });
  const scores = Object.fromEntries(analysis.componentScores.map((item) => [item.label, item.score]));

  assert.equal(analysis.roleFit, "Full Stack Developer readiness");
  assert.match(analysis.editableResumeText, /\nSUMMARY\n/);
  assert.match(analysis.editableResumeText, /\nPROFESSIONAL EXPERIENCE\n/);
  assert.equal(analysis.missingKeywords.length, 0);
  assert.equal(analysis.missingSkills.length, 0);
  assert.ok(scores.Projects >= 70);
  assert.ok(scores.Structure >= 70);
  assert.ok(!analysis.weakAreas.some((item) => /no clear projects or professional experience/i.test(item)));
  assert.equal(detectLocalResumeProfile(collapsed).candidateName, "Satendra Singh");
});
