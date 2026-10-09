import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InterviewStatus } from "@prisma/client";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Send,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import {
  answerInterviewQuestionAction,
  commentInterviewAction,
  voteInterviewAction,
} from "@/actions/interviews";
import { auth } from "@/auth";
import { BreadcrumbStructuredData, JsonLd } from "@/components/site/structured-data";
import { InterviewQuestionSidebar } from "@/components/site/interview-question-sidebar";
import { InterviewQuestionViewCounter } from "@/components/site/interview-question-view-counter";
import { siteButtonClasses } from "@/components/site/site-button";
import { siteContainerClasses } from "@/components/site/site-container";
import { prisma } from "@/lib/admin/prisma";
import { buildInterviewQaSchema, type QaAnswerInput } from "@/lib/seo/interview-qa-schema";

export const dynamic = "force-dynamic";

const db = prisma;

type QuestionPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ submitted?: string }>;
};

const pageBaseUrl = "https://www.getkasa.in/students/interview-questions";
const placeholderAnswer = "Community question awaiting approved answers.";
const controlClassName =
  "border-border bg-background text-foreground placeholder:text-muted-foreground outline-none shadow-sm focus:border-primary/50 focus:ring-4 focus:ring-primary/10";
const actionButtonClassName =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-[image:var(--button-solid)] px-5 text-sm font-semibold text-primary-foreground shadow-xl transition hover:-translate-y-0.5 hover:opacity-95";

function displayName(name: string | null, fallback = "KASA community") {
  return name?.trim() || fallback;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function cleanSeoText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function questionDescription(question: {
  seoDescription: string | null;
  shortAnswer: string | null;
  answer: string;
  context: string | null;
  question: string;
}) {
  const answer = question.answer === placeholderAnswer ? "" : question.answer;
  const description =
    question.seoDescription ||
    question.shortAnswer ||
    answer ||
    question.context ||
    `Read interview-ready answers, expected points, mistakes and follow-up discussion for: ${question.question}`;
  return cleanSeoText(description).slice(0, 165);
}

async function preferredQuestionSlug(question: { question: string; slug: string }) {
  const preferred = await db.interviewQuestion.findFirst({
    where: {
      status: InterviewStatus.PUBLISHED,
      question: { equals: question.question, mode: "insensitive" },
    },
    orderBy: [{ isCommunity: "asc" }, { publishedAt: "desc" }, { updatedAt: "desc" }],
    select: { slug: true },
  });

  return preferred?.slug || question.slug;
}

function VoteControls({
  target,
  targetId,
  slug,
  score,
  isLoggedIn,
}: {
  target: "QUESTION" | "ANSWER" | "COMMENT";
  targetId: string;
  slug: string;
  score: number;
  isLoggedIn: boolean;
}) {
  if (!isLoggedIn) {
    return (
      <div className="inline-flex items-center overflow-hidden rounded-full border border-border bg-card text-sm font-semibold text-muted-foreground">
        <Link href={`/login?callbackUrl=${encodeURIComponent(`/students/interview-questions/${slug}`)}`} className="grid size-9 place-items-center transition hover:bg-accent hover:text-primary" aria-label="Login to upvote">
          <ThumbsUp className="size-4" />
        </Link>
        <span className="min-w-10 text-center">{score}</span>
        <Link href={`/login?callbackUrl=${encodeURIComponent(`/students/interview-questions/${slug}`)}`} className="grid size-9 place-items-center transition hover:bg-destructive/10 hover:text-destructive" aria-label="Login to downvote">
          <ThumbsDown className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center overflow-hidden rounded-full border border-border bg-card text-sm font-semibold text-muted-foreground">
      <form action={voteInterviewAction}>
        <input type="hidden" name="target" value={target} />
        <input type="hidden" name="targetId" value={targetId} />
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="value" value="1" />
        <button type="submit" className="grid size-9 cursor-pointer place-items-center transition hover:bg-accent hover:text-primary" aria-label="Upvote">
          <ThumbsUp className="size-4" />
        </button>
      </form>
      <span className="min-w-10 text-center">{score}</span>
      <form action={voteInterviewAction}>
        <input type="hidden" name="target" value={target} />
        <input type="hidden" name="targetId" value={targetId} />
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="value" value="-1" />
        <button type="submit" className="grid size-9 cursor-pointer place-items-center transition hover:bg-destructive/10 hover:text-destructive" aria-label="Downvote">
          <ThumbsDown className="size-4" />
        </button>
      </form>
    </div>
  );
}

export async function generateMetadata({ params }: QuestionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const question = await db.interviewQuestion.findFirst({
    where: { slug, status: InterviewStatus.PUBLISHED },
    include: { role: true, topic: true },
  });

  if (!question) {
    return {
      title: "Interview Question Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = question.seoTitle || question.question;
  const description = questionDescription(question);
  const canonical = `${pageBaseUrl}/${await preferredQuestionSlug(question)}`;
  const keywords = Array.from(
    new Set(
      [question.role?.title, question.topic?.title, ...question.tags]
        .map((item) => item?.trim())
        .filter((item): item is string => Boolean(item)),
    ),
  );

  return {
    title,
    description,
    keywords,
    authors: [{ name: question.authorName || "KASA Team" }],
    alternates: { canonical },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "KASA",
      locale: "en_IN",
      type: "article",
      publishedTime: (question.publishedAt || question.createdAt).toISOString(),
      modifiedTime: question.updatedAt.toISOString(),
      authors: [question.authorName || "KASA Team"],
      tags: keywords,
      images: [
        {
          url: "/kasa-hero.png",
          width: 1200,
          height: 630,
          alt: question.question,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/kasa-hero.png"],
    },
  };
}

export default async function InterviewQuestionDetailPage({
  params,
  searchParams,
}: QuestionPageProps) {
  const [{ slug }, submittedParams] = await Promise.all([params, searchParams]);

  const [session, question] = await Promise.all([
    auth(),
    db.interviewQuestion.findFirst({
    where: { slug, status: InterviewStatus.PUBLISHED },
    include: {
      role: true,
      topic: true,
      answers: {
        where: { status: InterviewStatus.PUBLISHED },
        orderBy: [{ isAccepted: "desc" }, { voteScore: "desc" }, { createdAt: "asc" }],
        include: {
          comments: {
            where: { status: InterviewStatus.PUBLISHED },
            orderBy: { createdAt: "asc" },
          },
        },
      },
      comments: {
        where: { status: InterviewStatus.PUBLISHED },
        orderBy: { createdAt: "asc" },
      },
    },
  }),
  ]);

  if (!question) notFound();
  const isLoggedIn = Boolean(session?.user?.id);

  const relatedFilters = [
    question.roleId ? { roleId: question.roleId } : null,
    question.topicId ? { topicId: question.topicId } : null,
  ].filter(Boolean) as Array<{ roleId: string } | { topicId: string }>;

  const [relatedQuestions, roles, topics, preferredSlug] = await Promise.all([
    db.interviewQuestion.findMany({
      where: {
        id: { not: question.id },
        status: InterviewStatus.PUBLISHED,
        question: { not: question.question, mode: "insensitive" },
        ...(relatedFilters.length ? { OR: relatedFilters } : {}),
      },
      orderBy: [{ voteScore: "desc" }, { publishedAt: "desc" }],
      take: 6,
      include: { role: true, topic: true },
    }),
    db.interviewRole.findMany({
      where: { questions: { some: { status: InterviewStatus.PUBLISHED } } },
      orderBy: { title: "asc" },
      take: 50,
      select: { id: true, title: true },
    }),
    db.interviewTopic.findMany({
      where: { questions: { some: { status: InterviewStatus.PUBLISHED } } },
      orderBy: { title: "asc" },
      take: 60,
      select: { id: true, title: true },
    }),
    preferredQuestionSlug(question),
  ]);

  const officialAnswer = question.answer && question.answer !== placeholderAnswer ? question.answer : "";
  const acceptedCommunityAnswer = question.answers.find((answer) => answer.isAccepted);
  const acceptedAnswer: QaAnswerInput | undefined = acceptedCommunityAnswer
    ? {
        anchor: `answer-${acceptedCommunityAnswer.id}`,
        text: acceptedCommunityAnswer.body,
        upvoteCount: acceptedCommunityAnswer.voteScore,
        dateCreated: acceptedCommunityAnswer.createdAt.toISOString(),
        dateModified: acceptedCommunityAnswer.updatedAt.toISOString(),
        author: { type: "Person", name: displayName(acceptedCommunityAnswer.authorName) },
      }
    : officialAnswer
      ? {
          anchor: "official-answer",
          text: officialAnswer,
          upvoteCount: question.voteScore,
          dateCreated: question.createdAt.toISOString(),
          dateModified: question.updatedAt.toISOString(),
          author: { type: "Organization", name: "KASA" },
        }
      : undefined;
  const suggestedAnswers: QaAnswerInput[] = [
    ...(officialAnswer && acceptedCommunityAnswer
      ? [
          {
            anchor: "official-answer",
            text: officialAnswer,
            upvoteCount: question.voteScore,
            dateCreated: question.createdAt.toISOString(),
            dateModified: question.updatedAt.toISOString(),
            author: { type: "Organization" as const, name: "KASA" },
          },
        ]
      : []),
    ...question.answers
      .filter((answer) => answer.id !== acceptedCommunityAnswer?.id)
      .map((answer) => ({
        anchor: `answer-${answer.id}`,
        text: answer.body,
        upvoteCount: answer.voteScore,
        dateCreated: answer.createdAt.toISOString(),
        dateModified: answer.updatedAt.toISOString(),
        author: { type: "Person" as const, name: displayName(answer.authorName) },
      })),
  ];
  const canonicalUrl = `${pageBaseUrl}/${preferredSlug}`;
  const jsonLd = buildInterviewQaSchema({
    canonicalUrl,
    question: {
      name: question.question,
      text: question.context || question.question,
      answerCount: question.answers.length + (officialAnswer ? 1 : 0),
      commentCount:
        question.comments.length +
        question.answers.reduce((total, answer) => total + answer.comments.length, 0),
      upvoteCount: question.voteScore,
      dateCreated: question.createdAt.toISOString(),
      dateModified: question.updatedAt.toISOString(),
      author: {
        type: question.authorName ? "Person" : "Organization",
        name: displayName(question.authorName),
      },
    },
    acceptedAnswer,
    suggestedAnswers,
  });

  return (
    <div className="bg-background text-foreground">
      <BreadcrumbStructuredData
        items={[
          { name: "Home", href: "/" },
          { name: "Students", href: "/students" },
          { name: "Interview Questions", href: "/students/interview-questions" },
          { name: question.question, href: `/students/interview-questions/${preferredSlug}` },
        ]}
      />
      <JsonLd data={jsonLd} />

      <section className="px-4 pb-12 pt-[9.25rem] sm:px-6 sm:pt-[10.25rem] lg:px-8 lg:pt-[10.75rem]">
        <div className={siteContainerClasses()}>
          <Link href="/students/interview-questions" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to interview Q&A
          </Link>

          {submittedParams.submitted ? (
            <div className="mb-5 rounded-[1rem] border border-primary/25 bg-primary/10 p-4 text-sm font-medium text-primary">
              Thanks. Your {submittedParams.submitted} has been sent for moderation.
            </div>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-[1fr_25rem]">
            <main className="grid gap-5">
              <article id="question" className="rounded-[1.4rem] border border-border bg-card p-6 text-card-foreground shadow-xl">
                <div className="flex flex-wrap gap-2">
                  {question.role ? <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{question.role.title}</span> : null}
                  {question.topic ? <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">{question.topic.title}</span> : null}
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{question.difficulty.replaceAll("_", " ").toLowerCase()}</span>
                </div>

                <h1 className="mt-5 font-heading text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
                  {question.question}
                </h1>
                {question.context ? (
                  <p className="mt-4 rounded-[1rem] bg-surface-muted p-4 text-base leading-8 text-muted-foreground">
                    {question.context}
                  </p>
                ) : null}

                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <VoteControls target="QUESTION" targetId={question.id} slug={question.slug} score={question.voteScore} isLoggedIn={isLoggedIn} />
                  <span id="question-author">Asked by {displayName(question.authorName)}</span>
                  <span>{formatDate(question.createdAt)}</span>
                  <InterviewQuestionViewCounter
                    questionId={question.id}
                    initialCount={question.viewCount}
                  />
                </div>
              </article>

              {officialAnswer ? (
                <article id="official-answer" className="scroll-mt-28 rounded-[1.2rem] border border-border bg-card p-6 text-card-foreground shadow-sm">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    <CheckCircle2 className="size-4" aria-hidden="true" />
                    KASA answer
                  </div>
                  <div className="mt-4 whitespace-pre-line text-base leading-8 text-muted-foreground">
                    {officialAnswer}
                  </div>

                  {question.expectedPoints.length ? (
                    <div className="mt-5 rounded-xl bg-surface-muted p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Cover these points</div>
                      <ul className="mt-3 grid gap-2 text-sm leading-6 text-foreground sm:grid-cols-2">
                        {question.expectedPoints.map((point: string) => (
                          <li key={point} className="flex gap-2">
                            <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </article>
              ) : null}

              <section className="rounded-[1.2rem] border border-border bg-card p-6 text-card-foreground shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-heading text-3xl font-semibold text-foreground">Community answers</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{question.answers.length} approved answers</p>
                  </div>
                  <a href="#answer" className={siteButtonClasses({ size: "sm" })}>
                    Add answer
                    <Send className="size-4" aria-hidden="true" />
                  </a>
                </div>

                <div className="mt-6 grid gap-4">
                  {question.answers.map((answer) => (
                    <article id={`answer-${answer.id}`} key={answer.id} className="scroll-mt-28 rounded-[1rem] border border-border bg-surface-muted p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="text-sm text-muted-foreground">
                          Answered by <span id={`answer-${answer.id}-author`} className="font-semibold text-foreground">{displayName(answer.authorName)}</span> on {formatDate(answer.createdAt)}
                        </div>
                        <VoteControls target="ANSWER" targetId={answer.id} slug={question.slug} score={answer.voteScore} isLoggedIn={isLoggedIn} />
                      </div>
                      <div className="mt-4 whitespace-pre-line text-base leading-8 text-muted-foreground">{answer.body}</div>

                      <div className="mt-5 grid gap-3">
                        {answer.comments.map((comment) => (
                          <div key={comment.id} className="rounded-xl border border-border bg-card p-3">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <p className="text-sm leading-6 text-muted-foreground">
                                <span className="font-semibold text-foreground">{displayName(comment.authorName)}</span>: {comment.body}
                              </p>
                              <VoteControls target="COMMENT" targetId={comment.id} slug={question.slug} score={comment.voteScore} isLoggedIn={isLoggedIn} />
                            </div>
                          </div>
                        ))}
                        {isLoggedIn ? (
                          <form action={commentInterviewAction} className="grid gap-2">
                            <input type="hidden" name="answerId" value={answer.id} />
                            <input type="hidden" name="slug" value={question.slug} />
                            <textarea name="body" required rows={2} placeholder="Add a comment or follow-up..." className={`rounded-xl px-3 py-2 text-sm ${controlClassName}`} />
                            <button type="submit" className={`h-10 ${actionButtonClassName}`}>Submit comment</button>
                          </form>
                        ) : (
                          <Link href={`/login?callbackUrl=${encodeURIComponent(`/students/interview-questions/${question.slug}`)}`} className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-semibold text-primary shadow-sm transition hover:border-primary/35 hover:bg-accent">
                            Login to comment
                          </Link>
                        )}
                      </div>
                    </article>
                  ))}

                  {!question.answers.length ? (
                    <div className="rounded-[1rem] border border-dashed border-border bg-surface-muted p-6 text-center">
                      <h3 className="font-heading text-2xl font-semibold text-foreground">No approved community answers yet</h3>
                      <p className="mt-2 text-sm text-muted-foreground">Add a clear answer with examples. It will appear after moderation.</p>
                    </div>
                  ) : null}
                </div>
              </section>

              <section className="rounded-[1.2rem] border border-border bg-card p-6 text-card-foreground shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Question discussion
                </div>
                <h2 className="mt-3 font-heading text-2xl font-semibold text-foreground">
                  Comments and follow-ups
                </h2>
                <div className="mt-4 grid gap-3">
                  {question.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="rounded-xl border border-border bg-surface-muted p-4"
                    >
                      <p className="text-sm leading-6 text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          {displayName(comment.authorName)}
                        </span>
                        : {comment.body}
                      </p>
                    </div>
                  ))}
                  {!question.comments.length ? (
                    <p className="rounded-xl bg-surface-muted p-4 text-sm text-muted-foreground">
                      No approved comments yet. Add useful context or ask a follow-up.
                    </p>
                  ) : null}
                </div>
                {isLoggedIn ? (
                  <form action={commentInterviewAction} className="mt-4 grid gap-2">
                    <input type="hidden" name="questionId" value={question.id} />
                    <input type="hidden" name="slug" value={question.slug} />
                    <textarea
                      name="body"
                      required
                      rows={3}
                      placeholder="Ask a follow-up or add context..."
                      className={`rounded-xl px-3 py-2 text-sm ${controlClassName}`}
                    />
                    <button type="submit" className={`h-10 ${actionButtonClassName}`}>
                      Submit comment
                    </button>
                  </form>
                ) : (
                  <Link
                    href={`/login?callbackUrl=${encodeURIComponent(`/students/interview-questions/${question.slug}`)}`}
                    className="mt-4 inline-flex h-10 items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-semibold text-primary shadow-sm transition hover:border-primary/35 hover:bg-accent"
                  >
                    Login to join the discussion
                  </Link>
                )}
              </section>

              <section id="answer" className="rounded-[1.2rem] border border-border bg-card p-6 text-card-foreground shadow-sm">
                <h2 className="font-heading text-3xl font-semibold text-foreground">Write an answer</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Add a practical answer with examples, edge cases, project experience, and points a fresher can speak in an interview.
                </p>
                {isLoggedIn ? (
                  <form action={answerInterviewQuestionAction} className="mt-5 grid gap-3">
                    <input type="hidden" name="questionId" value={question.id} />
                    <input type="hidden" name="slug" value={question.slug} />
                    <textarea name="body" required rows={8} placeholder="Write your answer..." className={`rounded-xl px-3 py-3 text-sm ${controlClassName}`} />
                    <button type="submit" className={`h-12 ${actionButtonClassName}`}>
                      Submit answer for review
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </button>
                  </form>
                ) : (
                  <div className="mt-5 rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <p className="text-sm leading-6 text-muted-foreground">
                      Login required. Your answer will be connected to your account and sent for moderation.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link href={`/login?callbackUrl=${encodeURIComponent(`/students/interview-questions/${question.slug}#answer`)}`} className={`h-11 ${actionButtonClassName}`}>
                        Login to answer
                      </Link>
                      <Link href={`/signup?callbackUrl=${encodeURIComponent(`/students/interview-questions/${question.slug}#answer`)}`} className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-semibold text-primary shadow-sm transition hover:border-primary/35 hover:bg-accent">
                        Create account
                      </Link>
                    </div>
                  </div>
                )}
              </section>

              {relatedQuestions.length ? (
                <section className="rounded-[1.2rem] border border-border bg-card p-6 text-card-foreground shadow-sm">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                        Keep practising
                      </p>
                      <h2 className="mt-2 font-heading text-2xl font-semibold text-foreground">
                        Related interview questions
                      </h2>
                    </div>
                    <Link
                      href="/students/interview-questions"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
                    >
                      Browse all <ArrowRight className="size-4" />
                    </Link>
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    {relatedQuestions.slice(0, 3).map((item) => (
                      <Link
                        key={item.id}
                        href={`/students/interview-questions/${item.slug}`}
                        className="group rounded-2xl border border-border bg-surface-muted p-4 transition hover:-translate-y-0.5 hover:border-primary/35 hover:bg-accent"
                      >
                        <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-primary">
                          {item.role?.title || item.topic?.title || "Interview prep"}
                        </span>
                        <span className="mt-2 line-clamp-3 block text-sm font-semibold leading-6 text-foreground group-hover:text-primary">
                          {item.question}
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              ) : null}
            </main>

            <InterviewQuestionSidebar
              roleTitle={question.role?.title}
              topicTitle={question.topic?.title}
              roles={roles}
              topics={topics}
              isLoggedIn={isLoggedIn}
              callbackUrl={`/students/interview-questions/${question.slug}`}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
