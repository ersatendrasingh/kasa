import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenText, CalendarDays, Clock3 } from "lucide-react";
import { siteButtonClasses } from "@/components/site/site-button";
import { siteContainerClasses } from "@/components/site/site-container";
import {
  articleDescription,
  articleHref,
  formatArticleDate,
  type BlogArticle,
} from "@/lib/blog";

export function LatestArticlesSection({ articles }: { articles: BlogArticle[] }) {
  if (!articles.length) return null;

  return (
    <section className="bg-surface-strong py-16 sm:py-20">
      <div className={siteContainerClasses()}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Latest from KASA
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight text-slate-950 sm:text-5xl dark:text-white">
              Latest practical guides from KASA.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">
              Explore original how-to articles, comparisons and workflows for
              learners, educators and growing education businesses.
            </p>
          </div>
          <Link href="/blog" className={siteButtonClasses({ variant: "outline", size: "sm" })}>
            View all articles <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {articles.slice(0, 4).map((article) => (
            <article
              key={article.id}
              className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-blue-950/10 bg-white shadow-xl shadow-blue-950/6 transition duration-300 hover:-translate-y-1 hover:border-primary/35 dark:border-white/10 dark:bg-surface"
            >
              <Link href={articleHref(article)} className="relative block aspect-[16/10] overflow-hidden bg-gradient-to-br from-sky-100 via-emerald-50 to-amber-50 dark:from-sky-950 dark:via-emerald-950 dark:to-slate-950">
                {article.coverImage ? (
                  <Image
                    src={article.coverImage}
                    alt={article.coverImageAlt || article.title}
                    fill
                    unoptimized
                    sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <span className="absolute inset-0 grid place-items-center text-primary">
                    <BookOpenText className="size-10" aria-hidden="true" />
                  </span>
                )}
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {article.category?.title || "KASA guide"}
                </p>
                <Link href={articleHref(article)} className="mt-3 block">
                  <h3 className="line-clamp-2 font-heading text-lg font-semibold leading-snug text-slate-950 transition group-hover:text-primary dark:text-white">
                    {article.title}
                  </h3>
                </Link>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {articleDescription(article)}
                </p>
                <div className="mt-auto flex flex-wrap gap-3 pt-5 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-3.5 text-primary" />
                    {formatArticleDate(article.publishedAt || article.updatedAt)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="size-3.5 text-primary" />
                    {article.readingTimeMinutes || 1} min
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
