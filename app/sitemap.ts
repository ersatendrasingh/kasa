import type { MetadataRoute } from "next";
import { allSeoPages } from "@/lib/site-content";
import { prisma } from "@/lib/admin/prisma";

const SITE_URL = "https://www.getkasa.in";

function absoluteSitemapUrl(value: string | null) {
  if (!value) return undefined;
  try {
    return new URL(value, SITE_URL).toString();
  } catch {
    return undefined;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();
  const db = prisma;
  const [blogArticles, interviewQuestions] = await Promise.all([
    db.article.findMany({
      where: {
        status: "PUBLISHED",
        allowIndexing: true,
        AND: [
          {
            OR: [{ publishedAt: null }, { publishedAt: { lte: currentDate } }],
          },
        ],
      },
      select: {
        slug: true,
        updatedAt: true,
        featured: true,
        canonicalUrl: true,
        ogImage: true,
        coverImage: true,
      },
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
      take: 500,
    }).catch(() => []),
    db.interviewQuestion.findMany({
      where: { status: "PUBLISHED" },
      select: {
        slug: true,
        question: true,
        isCommunity: true,
        publishedAt: true,
        updatedAt: true,
        answers: {
          where: { status: "PUBLISHED" },
          orderBy: { updatedAt: "desc" },
          take: 1,
          select: { updatedAt: true },
        },
        comments: {
          where: { status: "PUBLISHED" },
          orderBy: { updatedAt: "desc" },
          take: 1,
          select: { updatedAt: true },
        },
      },
      orderBy: [{ isCommunity: "asc" }, { publishedAt: "desc" }, { updatedAt: "desc" }],
      take: 5000,
    }).catch(() => []),
  ]);
  const seenQuestions = new Set<string>();
  const canonicalInterviewQuestions = interviewQuestions.filter((question) => {
    const key = question.question.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (seenQuestions.has(key)) return false;
    seenQuestions.add(key);
    return true;
  });

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/features`,
      changeFrequency: "weekly",
      priority: 0.92,
    },
    {
      url: `${SITE_URL}/solutions`,
      changeFrequency: "weekly",
      priority: 0.92,
    },
    {
      url: `${SITE_URL}/compare`,
      changeFrequency: "monthly",
      priority: 0.78,
    },
    {
      url: `${SITE_URL}/resources`,
      changeFrequency: "weekly",
      priority: 0.86,
    },
    {
      url: `${SITE_URL}/blog`,
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: `${SITE_URL}/tools`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/students`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/students/interview-questions`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/attendance-calculator`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/resume-ats-checker`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/ai-resume-builder`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/ai-career-roadmap`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/resume-builder-studio`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/final-year-project-kit-generator`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/marks-percentage-calculator`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/gpa-calculator`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/grade-calculator`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/final-exam-calculator`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/study-timetable-generator`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/scholarship-eligibility-calculator`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/study-hours-calculator`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/assignment-deadline-planner`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/exam-score-goal-planner`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/cgpa-percentage-converter`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/board-percentage-calculator`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/question-paper-generator`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/quiz-generator`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/lesson-plan-generator`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/worksheet-generator`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/report-card-generator`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/assignment-generator`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/course-pricing-calculator`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/profit-calculator`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/fee-receipt-generator`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/admission-form-generator`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/batch-capacity-calculator`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/certificate-generator`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/pricing`,
      changeFrequency: "monthly",
      priority: 0.82,
    },
    {
      url: `${SITE_URL}/why-kasa`,
      changeFrequency: "monthly",
      priority: 0.82,
    },
    {
      url: `${SITE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.72,
    },
    {
      url: `${SITE_URL}/contact`,
      changeFrequency: "monthly",
      priority: 0.82,
    },
    {
      url: `${SITE_URL}/testimonials`,
      changeFrequency: "monthly",
      priority: 0.78,
    },
    {
      url: `${SITE_URL}/faq`,
      changeFrequency: "monthly",
      priority: 0.78,
    },
    {
      url: `${SITE_URL}/terms`,
      changeFrequency: "yearly",
      priority: 0.35,
    },
    {
      url: `${SITE_URL}/privacy`,
      changeFrequency: "yearly",
      priority: 0.35,
    },
    {
      url: `${SITE_URL}/cookies`,
      changeFrequency: "yearly",
      priority: 0.35,
    },
  ];

  return [
    ...staticPages,
    ...allSeoPages.map((page) => ({
      url: `${SITE_URL}${page.href}`,
      changeFrequency: page.group === "Resources" ? "monthly" : "weekly",
      priority: page.group === "Features" || page.group === "Solutions" ? 0.88 : 0.78,
    }) satisfies MetadataRoute.Sitemap[number]),
    ...blogArticles
      .filter((article) => {
        if (!article.canonicalUrl) return true;
        try {
          const canonical = new URL(article.canonicalUrl, SITE_URL).toString().replace(/\/$/, "");
          return canonical === `${SITE_URL}/blog/${article.slug}`;
        } catch {
          return false;
        }
      })
      .map((article) => {
        const image = absoluteSitemapUrl(article.ogImage || article.coverImage);
        return {
          url: `${SITE_URL}/blog/${article.slug}`,
          lastModified: article.updatedAt,
          changeFrequency: "weekly",
          priority: article.featured ? 0.8 : 0.74,
          images: image ? [image] : undefined,
        } satisfies MetadataRoute.Sitemap[number];
      }),
    ...canonicalInterviewQuestions.map((question) => {
      const updateDates = [
        question.updatedAt,
        question.publishedAt,
        question.answers[0]?.updatedAt,
        question.comments[0]?.updatedAt,
      ].filter((date): date is Date => Boolean(date));

      return {
        url: `${SITE_URL}/students/interview-questions/${question.slug}`,
        lastModified: new Date(Math.max(...updateDates.map((date) => date.getTime()))),
        changeFrequency: "weekly",
        priority: 0.72,
      } satisfies MetadataRoute.Sitemap[number];
    }),
  ];
}
