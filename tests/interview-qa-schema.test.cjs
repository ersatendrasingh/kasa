const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const filename = path.resolve(__dirname, "../lib/seo/interview-qa-schema.ts");
const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const loadedModule = { exports: {} };
new Function("require", "module", "exports", source)(require, loadedModule, loadedModule.exports);
const { buildInterviewQaSchema } = loadedModule.exports;

const canonicalUrl = "https://www.getkasa.in/students/interview-questions/example-question";

test("adds stable URLs to every Q&A answer and author", () => {
  const schema = buildInterviewQaSchema({
    canonicalUrl,
    question: {
      name: "Example question?",
      text: "Example question?",
      answerCount: 2,
      commentCount: 0,
      upvoteCount: 4,
      dateCreated: "2026-10-01T00:00:00.000Z",
      dateModified: "2026-10-02T00:00:00.000Z",
      author: { type: "Person", name: "Community member" },
    },
    acceptedAnswer: {
      anchor: "answer-accepted",
      text: "Accepted answer",
      upvoteCount: 3,
      dateCreated: "2026-10-01T00:00:00.000Z",
      dateModified: "2026-10-01T00:00:00.000Z",
      author: { type: "Person", name: "Answer author" },
    },
    suggestedAnswers: [{
      anchor: "official-answer",
      text: "Official answer",
      upvoteCount: 1,
      dateCreated: "2026-10-01T00:00:00.000Z",
      dateModified: "2026-10-01T00:00:00.000Z",
      author: { type: "Organization", name: "KASA" },
    }],
  });

  assert.equal(schema.mainEntity.author.url, `${canonicalUrl}#question-author`);
  assert.equal(schema.mainEntity.acceptedAnswer.url, `${canonicalUrl}#answer-accepted`);
  assert.equal(schema.mainEntity.acceptedAnswer.author.url, `${canonicalUrl}#answer-accepted-author`);
  assert.equal(schema.mainEntity.suggestedAnswer[0].url, `${canonicalUrl}#official-answer`);
  assert.equal(schema.mainEntity.suggestedAnswer[0].author.url, "https://www.getkasa.in");
});

test("omits answer properties cleanly when a question has no approved answer", () => {
  const schema = buildInterviewQaSchema({
    canonicalUrl,
    question: {
      name: "Unanswered question?",
      text: "Unanswered question?",
      answerCount: 0,
      commentCount: 0,
      upvoteCount: 0,
      dateCreated: "2026-10-01T00:00:00.000Z",
      dateModified: "2026-10-01T00:00:00.000Z",
      author: { type: "Organization", name: "KASA" },
    },
    suggestedAnswers: [],
  });

  assert.equal(schema.mainEntity.author.url, "https://www.getkasa.in");
  assert.equal(schema.mainEntity.acceptedAnswer, undefined);
  assert.equal(schema.mainEntity.suggestedAnswer, undefined);
});
