const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

function loadAnalytics(capturedVisitors) {
  const filename = path.resolve(__dirname, "..", "lib/ats/analytics.ts");
  const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const loadedModule = { exports: {} };
  const tx = {
    atsResumeVisitor: {
      upsert: async (args) => {
        capturedVisitors.push(args);
        return { id: "visitor-id" };
      },
    },
    atsResumeDocument: { upsert: async () => ({ id: "document-id" }) },
    atsResumeCheck: { create: async () => ({ id: "check-id" }) },
  };
  const localRequire = (id) => {
    if (id === "@/lib/admin/prisma") return { prisma: { $transaction: async (callback) => callback(tx) } };
    if (id === "@/lib/admin/crypto") return { encryptPrivateValue: (value) => value || null };
    return require(id);
  };
  new Function("require", "module", "exports", source)(localRequire, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}

test("stores validated contact details returned by the PDF profile parser", async () => {
  const visitors = [];
  const { recordAtsCheck } = loadAnalytics(visitors);
  await recordAtsCheck({
    visitorKey: "visitor-key-123456789012345",
    status: "COMPLETED",
    fileData: "base64-pdf",
    fileName: "resume.pdf",
    candidateName: "Asha Sharma",
    candidateEmail: "ASHA@EXAMPLE.COM",
    candidatePhone: "+91 98765 43210",
  });

  assert.equal(visitors[0].create.candidateNameEncrypted, "Asha Sharma");
  assert.equal(visitors[0].create.emailEncrypted, "asha@example.com");
  assert.equal(visitors[0].create.phoneEncrypted, "+91 98765 43210");
});

test("falls back to resume text when profile contact fields are absent", async () => {
  const visitors = [];
  const { recordAtsCheck } = loadAnalytics(visitors);
  await recordAtsCheck({
    visitorKey: "visitor-key-123456789012345",
    status: "COMPLETED",
    resumeText: "Asha Sharma\nasha.sharma@example.com | +91 98765 43210\nSoftware Engineer",
  });

  assert.equal(visitors[0].create.emailEncrypted, "asha.sharma@example.com");
  assert.equal(visitors[0].create.phoneEncrypted, "+91 98765 43210");
});
