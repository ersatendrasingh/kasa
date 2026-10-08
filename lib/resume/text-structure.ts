const sectionHeadings = [
  "PROFESSIONAL SUMMARY", "SUMMARY", "PROFILE", "CAREER OBJECTIVE", "OBJECTIVE",
  "TECHNICAL SKILLS", "CORE SKILLS", "CORE COMPETENCIES", "SKILLS", "TECHNOLOGIES",
  "PROFESSIONAL EXPERIENCE", "WORK EXPERIENCE", "EMPLOYMENT HISTORY", "EMPLOYMENT", "EXPERIENCE",
  "SELECTED PROJECTS", "KEY PROJECTS", "PROJECTS", "PROJECT EXPERIENCE",
  "EDUCATION", "ACADEMIC BACKGROUND", "QUALIFICATIONS",
  "CERTIFICATIONS", "CERTIFICATION", "ACHIEVEMENTS", "AWARDS", "ADDITIONAL STRENGTHS", "CONTACT",
] as const;

const headingExpression = new RegExp(`(^|\\s)(${sectionHeadings.map(escapeRegExp).join("|")})(?=\\s|:|$)`, "gi");

export function recoverResumeStructure(value: string) {
  const normalized = value
    .replace(/\r\n?/g, "\n")
    .replace(/[\uF0B7\u25AA\u25CF\u2023]/g, "•")
    .replace(/[ \t]+/g, " ")
    .replace(/\s+([•▪●])\s*/g, "\n• ");

  const withHeadings = normalized.replace(headingExpression, (match, prefix: string, heading: string) => {
    const sourceHeading = match.slice(prefix.length).replace(/:$/, "").trim();
    const looksLikeHeading = sourceHeading === sourceHeading.toUpperCase() || prefix.includes("\n") || match.trim().endsWith(":");
    if (!looksLikeHeading) return match;
    const cleanHeading = heading.replace(/:$/, "").trim();
    if (prefix.includes("\n")) return `\n${cleanHeading}`;
    if (!prefix) return `${cleanHeading}\n`;
    return `\n${cleanHeading}\n`;
  });

  return withHeadings
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
